import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   POST /api/auth/admin/login
// @desc    Login admin user
// @access  Public
router.post('/admin/login', authController.adminLogin);

export default router;
