import User from '../models/User.js';

// @desc    Add portfolio item
// @route   POST /api/freelancer/portfolio
// @access  Private
const addPortfolioItem = async (req, res) => {
  try {
    const { title, description, link, image } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Portfolio item title is required'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Create portfolio item
    const portfolioItem = {
      title: title.trim(),
      description: description ? description.trim() : '',
      link: link ? link.trim() : '',
      image: image ? image.trim() : ''
    };

    // Add to portfolio array
    user.portfolio.push(portfolioItem);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Portfolio item added successfully',
      data: {
        portfolio: user.portfolio
      }
    });
  } catch (error) {
    console.error('Add portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/freelancer/portfolio/:itemId
// @access  Private
const updatePortfolioItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, description, link, image } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Portfolio item title is required'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Find portfolio item
    const portfolioItem = user.portfolio.id(itemId);
    
    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    // Update portfolio item
    portfolioItem.title = title.trim();
    if (description !== undefined) portfolioItem.description = description.trim();
    if (link !== undefined) portfolioItem.link = link.trim();
    if (image !== undefined) portfolioItem.image = image.trim();

    await user.save();

    res.json({
      success: true,
      message: 'Portfolio item updated successfully',
      data: {
        portfolio: user.portfolio
      }
    });
  } catch (error) {
    console.error('Update portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove portfolio item
// @route   DELETE /api/freelancer/portfolio/:itemId
// @access  Private
const removePortfolioItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    // Remove portfolio item
    user.portfolio = user.portfolio.filter(item => item._id.toString() !== itemId);
    await user.save();

    res.json({
      success: true,
      message: 'Portfolio item removed successfully',
      data: {
        portfolio: user.portfolio
      }
    });
  } catch (error) {
    console.error('Remove portfolio item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get portfolio items
// @route   GET /api/freelancer/portfolio
// @access  Private
const getPortfolioItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('portfolio');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only freelancers can access this endpoint.'
      });
    }

    res.json({
      success: true,
      data: {
        portfolio: user.portfolio
      }
    });
  } catch (error) {
    console.error('Get portfolio items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export default {
  addPortfolioItem,
  updatePortfolioItem,
  removePortfolioItem,
  getPortfolioItems
};

