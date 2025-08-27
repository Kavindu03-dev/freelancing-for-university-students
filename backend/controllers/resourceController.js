import Resource from '../models/Resource.js';

// Get all active resources (public)
export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find({ isActive: true })
      .sort({ featured: -1, createdAt: -1 })
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: resources,
      count: resources.length
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message
    });
  }
};

// Get resources by category (public)
export const getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const resources = await Resource.find({ 
      category, 
      isActive: true 
    })
      .sort({ featured: -1, createdAt: -1 })
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: resources,
      count: resources.length
    });
  } catch (error) {
    console.error('Error fetching resources by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources by category',
      error: error.message
    });
  }
};

// Get featured resources (public)
export const getFeaturedResources = async (req, res) => {
  try {
    const resources = await Resource.find({ 
      featured: true, 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: resources,
      count: resources.length
    });
  } catch (error) {
    console.error('Error fetching featured resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured resources',
      error: error.message
    });
  }
};

// Get resource statistics (public)
export const getResourceStats = async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments({ isActive: true });
    const featuredResources = await Resource.countDocuments({ featured: true, isActive: true });
    
    const categoryStats = await Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const difficultyStats = await Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalResources,
        featuredResources,
        categoryStats,
        difficultyStats
      }
    });
  } catch (error) {
    console.error('Error fetching resource stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource statistics',
      error: error.message
    });
  }
};

// Get all resources for admin (including inactive)
export const getAllResourcesForAdmin = async (req, res) => {
  try {
    const resources = await Resource.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name userType firstName lastName');

    res.json({
      success: true,
      data: resources,
      count: resources.length
    });
  } catch (error) {
    console.error('Error fetching resources for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources for admin',
      error: error.message
    });
  }
};

// Create new resource (admin only)
export const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      readTime,
      difficulty,
      tags,
      featured,
      link
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !type || !readTime || !difficulty || !link) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Process tags - convert string to array if needed
    let processedTags = tags;
    if (typeof tags === 'string') {
      processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    // Determine the creator ID (admin or staff)
    const creatorId = req.admin ? req.admin._id : req.staff._id;

    const newResource = new Resource({
      title,
      description,
      category,
      type,
      readTime,
      difficulty,
      tags: processedTags,
      featured: featured || false,
      link,
      createdBy: creatorId
    });

    const savedResource = await newResource.save();
    await savedResource.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: savedResource
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message
    });
  }
};

// Update resource (admin only)
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find the resource first to check ownership
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if staff member is trying to edit someone else's resource
    if (req.staff && resource.createdBy.toString() !== req.staff._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own resources'
      });
    }

    // Process tags if provided
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: updatedResource
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource',
      error: error.message
    });
  }
};

// Delete resource (soft delete - admin only)
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the resource first to check ownership
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if staff member is trying to delete someone else's resource
    if (req.staff && resource.createdBy.toString() !== req.staff._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own resources'
      });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource',
      error: error.message
    });
  }
};

// Restore resource (admin only)
export const restoreResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).populate('createdBy', 'name');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.json({
      success: true,
      message: 'Resource restored successfully',
      data: resource
    });
  } catch (error) {
    console.error('Error restoring resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore resource',
      error: error.message
    });
  }
};

// Permanently delete resource (admin only)
export const permanentlyDeleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the resource first to check ownership
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if staff member is trying to delete someone else's resource
    if (req.staff && resource.createdBy.toString() !== req.staff._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own resources'
      });
    }

    const deletedResource = await Resource.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Resource permanently deleted successfully'
    });
  } catch (error) {
    console.error('Error permanently deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to permanently delete resource',
      error: error.message
    });
  }
};

// Search resources (public)
export const searchResources = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const resources = await Resource.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    })
      .sort({ featured: -1, createdAt: -1 })
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: resources,
      count: resources.length
    });
  } catch (error) {
    console.error('Error searching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search resources',
      error: error.message
    });
  }
};

// Get resource by ID (public)
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id)
      .populate('createdBy', 'name');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if resource is active (for public access)
    if (!resource.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Error fetching resource by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource',
      error: error.message
    });
  }
};
