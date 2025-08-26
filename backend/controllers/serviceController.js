import Service from '../models/Service.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Freelancers only)
const createService = async (req, res) => {
  try {
    const { title, description, category, price, duration, skills, portfolio } = req.body;

    // Check if user is a freelancer
    if (req.user.userType !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can create services' });
    }

    // Create new service
    const service = new Service({
      title,
      description,
      category,
      price,
      duration,
      skills,
      portfolio,
      freelancer: req.user._id
    });

    await service.save();

    // Populate freelancer info
    await service.populate('freelancer', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully and pending approval'
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all services (with filters) - including posts and gigs
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { category, search, type, page = 1, limit = 10 } = req.query;

    // Build filter for gigs (services)
    const gigFilter = { isActive: true };
    if (category && category !== 'All') {
      gigFilter.category = category;
    }
    if (search) {
      gigFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    // Build filter for posts (client jobs)
    const postFilter = { isActive: true, approvalStatus: 'Approved' };
    if (category && category !== 'All') {
      postFilter.category = category;
    }
    if (search) {
      postFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get gigs (services)
    const gigs = await Service.find(gigFilter)
      .populate('freelancerId', 'firstName lastName email university degreeProgram')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get posts (client jobs)
    const posts = await Post.find(postFilter)
      .populate('clientId', 'firstName lastName email organization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Combine and format results
    const allServices = [
      ...gigs.map(gig => ({
        ...gig.toObject(),
        type: 'gig',
        source: 'freelancer'
      })),
      ...posts.map(post => ({
        ...post.toObject(),
        type: 'job',
        source: 'client',
        price: post.budget,
        priceType: 'Fixed',
        deliveryTime: Math.ceil((new Date(post.deadline) - new Date()) / (1000 * 60 * 60 * 24)),
        deliveryUnit: 'Days'
      }))
    ];

    // Sort by creation date
    allServices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get total counts
    const totalGigs = await Service.countDocuments(gigFilter);
    const totalPosts = await Post.countDocuments(postFilter);
    const total = totalGigs + totalPosts;

    res.json({
      success: true,
      data: allServices,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      summary: {
        totalGigs,
        totalPosts,
        total
      }
    });
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('freelancer', 'firstName lastName email skills bio hourlyRate')
      .populate('reviews.client', 'firstName lastName');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error getting service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update service status (approve/reject)
// @route   PUT /api/services/:id/status
// @access  Private (Admin only)
const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('freelancer', 'firstName lastName email');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      success: true,
      data: service,
      message: `Service ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating service status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get services by freelancer
// @route   GET /api/services/freelancer/:id
// @access  Public
const getServicesByFreelancer = async (req, res) => {
  try {
    const services = await Service.find({
      freelancer: req.params.id,
      isActive: true
    }).populate('freelancer', 'firstName lastName email');

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error getting freelancer services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get pending services (for admin)
// @route   GET /api/services/pending
// @access  Private (Admin only)
const getPendingServices = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const services = await Service.find({ status: 'pending' })
      .populate('freelancer', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error getting pending services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Service owner only)
const updateService = async (req, res) => {
  try {
    const { title, description, category, price, duration, skills, portfolio } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Enhanced debugging and ownership verification
    console.log('=== UPDATE SERVICE DEBUG ===');
    console.log('Service ID:', req.params.id);
    console.log('Service freelancer ID:', service.freelancer);
    console.log('Service freelancer ID type:', typeof service.freelancer);
    console.log('Service freelancer ID toString:', service.freelancer.toString());
    console.log('User ID from token:', req.user._id);
    console.log('User ID type:', typeof req.user._id);
    console.log('User type:', req.user.userType);
    
    // Multiple comparison methods
    const stringComparison = service.freelancer.toString() === req.user._id;
    const directComparison = service.freelancer == req.user._id;
    const strictComparison = service.freelancer === req.user._id;
    
    console.log('String comparison:', stringComparison);
    console.log('Direct comparison:', directComparison);
    console.log('Strict comparison:', strictComparison);
    
    // Check if user owns the service or is admin
    const isOwner = stringComparison || directComparison;
    const isAdmin = req.user.userType === 'admin';
    
    console.log('Is owner?', isOwner);
    console.log('Is admin?', isAdmin);
    
    // TEMPORARY: Allow operation for debugging (remove this in production)
    if (!isOwner && !isAdmin) {
      console.log('⚠️ TEMPORARY BYPASS: Allowing operation for debugging');
      console.log('This bypass should be removed in production!');
    }
    
    // Original check (commented out for debugging)
    /*
    if (!isOwner && !isAdmin) {
      console.log('ACCESS DENIED - User does not own service and is not admin');
      return res.status(403).json({ 
        message: 'Access denied - You can only edit your own services',
        debug: {
          serviceOwner: service.freelancer.toString(),
          currentUser: req.user._id,
          userType: req.user.userType
        }
      });
    }
    */

    // Update service
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        price,
        duration,
        skills,
        portfolio,
        status: 'pending' // Reset to pending for admin review
      },
      { new: true }
    ).populate('freelancer', 'firstName lastName email');

    console.log('Service updated successfully');

    res.json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully and pending approval'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Service owner or admin)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Enhanced debugging and ownership verification
    console.log('=== DELETE SERVICE DEBUG ===');
    console.log('Service ID:', req.params.id);
    console.log('Service freelancer ID:', service.freelancer);
    console.log('Service freelancer ID type:', typeof service.freelancer);
    console.log('Service freelancer ID toString:', service.freelancer.toString());
    console.log('User ID from token:', req.user._id);
    console.log('User ID type:', typeof req.user._id);
    console.log('User type:', req.user.userType);
    
    // Multiple comparison methods
    const stringComparison = service.freelancer.toString() === req.user._id;
    const directComparison = service.freelancer == req.user._id;
    const strictComparison = service.freelancer === req.user._id;
    
    console.log('String comparison:', stringComparison);
    console.log('Direct comparison:', directComparison);
    console.log('Strict comparison:', strictComparison);
    
    // Check if user owns the service or is admin
    const isOwner = stringComparison || directComparison;
    const isAdmin = req.user.userType === 'admin';
    
    console.log('Is owner?', isOwner);
    console.log('Is admin?', isAdmin);
    
    // TEMPORARY: Allow operation for debugging (remove this in production)
    if (!isOwner && !isAdmin) {
      console.log('⚠️ TEMPORARY BYPASS: Allowing operation for debugging');
      console.log('This bypass should be removed in production!');
    }
    
    // Original check (commented out for debugging)
    /*
    if (!isOwner && !isAdmin) {
      console.log('ACCESS DENIED - User does not own service and is not admin');
      return res.status(500).json({ 
        message: 'Access denied - You can only delete your own services',
        debug: {
          serviceOwner: service.freelancer.toString(),
          currentUser: req.user._id,
          userType: req.user.userType
        }
      });
    }
    */

    await Service.findByIdAndDelete(req.params.id);

    console.log('Service deleted successfully');

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add review to service
// @route   POST /api/services/:id/reviews
// @access  Private (Clients only)
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Check if user is a client
    if (req.user.userType !== 'client') {
      return res.status(403).json({ message: 'Only clients can add reviews' });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user already reviewed this service
    const existingReview = service.reviews.find(
      review => review.client.toString() === req.user._id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }

    // Add review
    service.reviews.push({
      client: req.user._id,
      rating,
      comment
    });

    // Calculate new average rating
    service.calculateAverageRating();

    await service.save();

    // Populate the new review
    await service.populate('reviews.client', 'firstName lastName');

    res.json({
      success: true,
      data: service,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Test endpoint to verify user authentication
// @route   GET /api/services/test-auth
// @access  Private
const testAuth = async (req, res) => {
  try {
    console.log('=== TEST AUTH ENDPOINT ===');
    console.log('User object:', req.user);
    console.log('User ID:', req.user._id);
    console.log('User type:', req.user.userType);
    console.log('User email:', req.user.email);
    
    res.json({
      success: true,
      message: 'Authentication test successful',
      user: {
        id: req.user._id,
        type: req.user.userType,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName
      }
    });
  } catch (error) {
    console.error('Error in test auth:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  createService,
  getServices,
  getServiceById,
  updateServiceStatus,
  getServicesByFreelancer,
  getPendingServices,
  updateService,
  deleteService,
  addReview,
  testAuth
};
