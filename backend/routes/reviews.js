import express from 'express';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect as auth } from '../middleware/auth.js';

const router = express.Router();

// Create a new review
router.post('/', auth, async (req, res) => {
  try {
    const { freelancerId, orderId, rating, comment } = req.body;
    const clientId = req.user.id;

    // Validate required fields
    if (!freelancerId || !orderId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if order exists and belongs to the client
    const order = await Order.findById(orderId).populate('freelancerId clientId');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.clientId._id.toString() !== clientId) {
      return res.status(403).json({
        success: false,
        message: 'You can only review orders you placed'
      });
    }

    // Check if order is delivered
    if (order.clientStatus !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'You can only review delivered orders'
      });
    }

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this order'
      });
    }

    // Create the review
    const review = new Review({
      freelancerId,
      clientId,
      orderId,
      rating,
      comment
    });

    await review.save();

    // Update freelancer's review statistics
    await updateFreelancerReviewStats(freelancerId);

    // Mark order as reviewed
    await Order.findByIdAndUpdate(orderId, { hasReview: true });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get reviews for a freelancer
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const { freelancerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ freelancerId })
      .populate('clientId', 'firstName lastName profileImage')
      .populate('orderId', 'serviceId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ freelancerId });

    res.json({
      success: true,
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get reviews by a client
router.get('/client/:clientId', auth, async (req, res) => {
  try {
    const { clientId } = req.params;
    const userId = req.user.id;

    // Check if user is requesting their own reviews or is admin
    if (clientId !== userId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const reviews = await Review.find({ clientId })
      .populate('freelancerId', 'firstName lastName profileImage')
      .populate('orderId', 'serviceId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error('Error fetching client reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to update freelancer review statistics
async function updateFreelancerReviewStats(freelancerId) {
  try {
    const reviews = await Review.find({ freelancerId });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      const reviewCount = reviews.length;

      await User.findByIdAndUpdate(freelancerId, {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount
      });
    }
  } catch (error) {
    console.error('Error updating freelancer review stats:', error);
  }
}

export default router;
