const express = require('express');
const router = express.Router();
const { signup, login, adminLogin } = require('../controllers/authController');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/admin/login
// @desc    Login admin user
// @access  Public
router.post('/admin/login', adminLogin);

module.exports = router;
