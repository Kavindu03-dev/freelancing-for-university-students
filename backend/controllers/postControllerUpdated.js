import Post from '../models/Post.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      budget,
      deadline,
      location,
      requiredSkills,
      degreeField,
      description,
      attachments
    } = req.body;

    // Get client information from authenticated user
    const clientId = req.user.id;
    const client = await User.findById(clientId);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Parse requiredSkills if it's a string
    const skillsArray = typeof requiredSkills === 'string' 
      ? requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill)
      : requiredSkills;

    const newPost = new Post({
      title,
      type,
      category,
      budget: Number(budget),
      deadline: new Date(deadline),
      location,
      requiredSkills: skillsArray,
      degreeField,
      description,
      attachments: attachments || [],
      clientId,
      clientName: `${client.firstName} ${client.lastName}`,
      clientOrganization: client.organization || '',
      approvalStatus: 'Pending' // New posts start as pending
    });

    const savedPost = await newPost.save();
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully and pending approval',
      post: savedPost
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// Get all posts (with optional filters) - only approved posts
export const getAllPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      type,
      location,
      minBudget,
      maxBudget,
      status,
      search
    } = req.query;

    const filter = { isActive: true, approvalStatus: 'Approved' };

    // Apply filters
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (location) filter.location = location;
    if (status) filter.status = status;
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const posts = await Post.find(filter)
      .populate('clientId', 'firstName lastName email organization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Post.countDocuments(filter);

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// Get posts by specific client
export const getPostsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const posts = await Post.find({ 
      clientId, 
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error('Error fetching client posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching client posts',
      error: error.message
    });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id)
      .populate('clientId', 'firstName lastName email organization');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns this post
    if (post.clientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    // If post was approved and is being updated, reset approval status
    if (post.approvalStatus === 'Approved') {
      updateData.approvalStatus = 'Pending';
      updateData.approvedBy = undefined;
      updateData.approvedAt = undefined;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// Delete a post (soft delete)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns this post
    if (post.clientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    // Soft delete - set isActive to false
    post.isActive = false;
    post.status = 'Cancelled';
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

// Get post statistics
export const getPostStats = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const stats = await Post.aggregate([
      { $match: { clientId: new mongoose.Types.ObjectId(clientId), isActive: true } },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          activePosts: { $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] } },
          inProgressPosts: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          completedPosts: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          totalBudget: { $sum: '$budget' },
          avgBudget: { $avg: '$budget' }
        }
      }
    ]);

    const categoryStats = await Post.aggregate([
      { $match: { clientId: new mongoose.Types.ObjectId(clientId), isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalBudget: { $sum: '$budget' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalPosts: 0,
        activePosts: 0,
        inProgressPosts: 0,
        completedPosts: 0,
        totalBudget: 0,
        avgBudget: 0
      },
      categoryStats
    });
  } catch (error) {
    console.error('Error fetching post stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post stats',
      error: error.message
    });
  }
};

// Get posts pending approval (admin only)
export const getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ 
      approvalStatus: 'Pending',
      isActive: true 
    }).populate('clientId', 'firstName lastName email organization')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending posts',
      error: error.message
    });
  }
};

// Approve a post (admin only)
export const approvePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { adminId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.approvalStatus = 'Approved';
    post.approvedBy = adminId;
    post.approvedAt = new Date();
    post.status = 'Active';

    const updatedPost = await post.save();

    res.json({
      success: true,
      message: 'Post approved successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error approving post:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving post',
      error: error.message
    });
  }
};

// Reject a post (admin only)
export const rejectPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { adminId, rejectionReason } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.approvalStatus = 'Rejected';
    post.rejectionReason = rejectionReason;
    post.status = 'Cancelled';

    const updatedPost = await post.save();

    res.json({
      success: true,
      message: 'Post rejected successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error rejecting post:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting post',
      error: error.message
    });
  }
};
