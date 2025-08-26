import Skill from '../models/Skill.js';

// Get all skills (public - only active)
export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true }).sort({ popularity: -1 });
    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message
    });
  }
};

// Get skills by category (public - only active)
export const getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const skills = await Skill.find({ 
      category: category, 
      isActive: true 
    }).sort({ popularity: -1 });
    
    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills by category',
      error: error.message
    });
  }
};

// Get all skills for admin (including inactive ones)
export const getAllSkillsForAdmin = async (req, res) => {
  try {
    const skills = await Skill.find({}).sort({ popularity: -1 });
    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message
    });
  }
};

// Create a new skill
export const createSkill = async (req, res) => {
  try {
    const { name, description, category, icon, avgPrice, popularity } = req.body;
    
    // Check if skill already exists
    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: 'Skill with this name already exists'
      });
    }

    const skill = new Skill({
      name,
      description,
      category,
      icon: icon || '⚡',
      avgPrice: avgPrice || 0,
      popularity: popularity || 0,
      createdBy: req.admin.id // From auth middleware
    });

    await skill.save();

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating skill',
      error: error.message
    });
  }
};

// Update a skill
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const skill = await Skill.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating skill',
      error: error.message
    });
  }
};

// Delete a skill (soft delete)
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    
    const skill = await Skill.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting skill',
      error: error.message
    });
  }
};

// Restore a deleted skill
export const restoreSkill = async (req, res) => {
  try {
    const { id } = req.params;
    
    const skill = await Skill.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill restored successfully',
      data: skill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error restoring skill',
      error: error.message
    });
  }
};

// Permanently delete a skill from database
export const permanentlyDeleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    
    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill permanently deleted from database'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error permanently deleting skill',
      error: error.message
    });
  }
};

// Get skill statistics
export const getSkillStats = async (req, res) => {
  try {
    const totalSkills = await Skill.countDocuments({ isActive: true });
    const categories = await Skill.distinct('category');
    const avgPopularity = await Skill.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avgPopularity: { $avg: '$popularity' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSkills,
        totalCategories: categories.length,
        avgPopularity: avgPopularity[0]?.avgPopularity || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skill statistics',
      error: error.message
    });
  }
};
