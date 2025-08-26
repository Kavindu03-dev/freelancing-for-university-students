import express from 'express';
import { protect } from '../middleware/auth.js';
import freelancerController from '../controllers/studentController.js';
import portfolioController from '../controllers/portfolioController.js';
import upload from '../middleware/upload.js';
import imgbbUpload from '../middleware/imgbbUpload.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/freelancers', freelancerController.getAllFreelancers);
router.get('/freelancers/:id', freelancerController.getFreelancerProfile);

// Protected routes (require authentication)
router.use(protect);

// Freelancer profile management
router.route('/profile')
  .get(freelancerController.getFreelancerProfile)
  .put(freelancerController.updateFreelancerProfile);

// Skills management
router.route('/skills')
  .post(freelancerController.addSkill)
  .put(freelancerController.updateSkills);

router.delete('/skills/:skill', freelancerController.removeSkill);

// Portfolio management
router.route('/portfolio')
  .get(portfolioController.getPortfolioItems)
  .post(portfolioController.addPortfolioItem);

router.route('/portfolio/:itemId')
  .put(portfolioController.updatePortfolioItem)
  .delete(portfolioController.removePortfolioItem);

// CV/Resume management
router.route('/cv')
  .post(upload.single('cvFile'), freelancerController.uploadCV)
  .delete(freelancerController.deleteCV);

// Profile image management
router.route('/profile-image')
  .post(imgbbUpload.single('profileImage'), freelancerController.uploadProfileImage)
  .delete(freelancerController.removeProfileImage);

// Account management
router.delete('/account', freelancerController.deleteAccount);

export default router;
