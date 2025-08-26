import express from 'express';
import { 
  getAllSkills, 
  getSkillsByCategory, 
  getSkillStats, 
  createSkill, 
  updateSkill, 
  deleteSkill,
  getAllSkillsForAdmin,
  restoreSkill,
  permanentlyDeleteSkill
} from '../controllers/skillController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllSkills);
router.get('/category/:category', getSkillsByCategory);
router.get('/stats', getSkillStats);

// Admin routes
router.get('/admin/all', authenticateAdmin, getAllSkillsForAdmin);
router.post('/', authenticateAdmin, createSkill);
router.put('/:id', authenticateAdmin, updateSkill);
router.delete('/:id', authenticateAdmin, deleteSkill);
router.put('/:id/restore', authenticateAdmin, restoreSkill);
router.delete('/:id/permanent', authenticateAdmin, permanentlyDeleteSkill);

export default router;
