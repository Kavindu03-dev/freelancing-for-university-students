const Service = require('../models/Service');
const User = require('../models/User');

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
      freelancer: req.user.id
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

// @desc    Get all services (with filters)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { category, search, status, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    if (status) {
      filter.status = status;
    } else {
      // By default, only show approved services to public
      filter.status = 'approved';
    }

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { skills: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Combine filters
    const finalFilter = { ...filter, ...searchQuery };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get services with pagination
    const services = await Service.find(finalFilter)
      .populate('freelancer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Service.countDocuments(finalFilter);

    res.json({
      success: true,
      data: services,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
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
      isActive: true,
      status: 'approved'
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

    // Check if user owns the service
    if (service.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

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

    // Check if user owns the service or is admin
    if (service.freelancer.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Service.findByIdAndDelete(req.params.id);

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
      review => review.client.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }

    // Add review
    service.reviews.push({
      client: req.user.id,
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

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateServiceStatus,
  getServicesByFreelancer,
  getPendingServices,
  updateService,
  deleteService,
  addReview
};
