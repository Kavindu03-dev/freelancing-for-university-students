const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getStudentProfile,
  updateStudentProfile,
  addSkill,
  removeSkill,
  updateSkills,
  getAllFreelancers,
  getFreelancerProfile
} = require('../controllers/studentController');

const {
  addPortfolioItem,
  updatePortfolioItem,
  removePortfolioItem,
  getPortfolioItems
} = require('../controllers/portfolioController');

// Protected routes (require authentication)
router.use(protect);

// Student profile management
router.route('/profile')
  .get(getStudentProfile)
  .put(updateStudentProfile);

// Skills management
router.route('/skills')
  .post(addSkill)
  .put(updateSkills);

router.delete('/skills/:skill', removeSkill);

// Portfolio management
router.route('/portfolio')
  .get(getPortfolioItems)
  .post(addPortfolioItem);

router.route('/portfolio/:itemId')
  .put(updatePortfolioItem)
  .delete(removePortfolioItem);

// Public routes (no authentication required)
router.get('/freelancers', getAllFreelancers);
router.get('/freelancers/:id', getFreelancerProfile);

module.exports = router;
