const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType, agreeToTerms } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !userType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields' 
      });
    }

    // Note: Frontend handles password confirmation, so we don't need to validate it here
    // The frontend removes confirmPassword before sending data to backend

    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }

    if (!agreeToTerms) {
      return res.status(400).json({ 
        success: false, 
        message: 'You must agree to the terms of service' 
      });
    }

    // Validate skills array
    if (!req.body.skills || !Array.isArray(req.body.skills) || req.body.skills.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please add at least one skill' 
      });
    }

    if (!['client', 'freelancer'].includes(userType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user type' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      skills: req.body.skills || [],
      bio: req.body.bio || '',
      agreeToTerms,
      agreeToMarketing: req.body.agreeToMarketing || false
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
          skills: user.skills,
          bio: user.bio,
          agreeToTerms: user.agreeToTerms,
          agreeToMarketing: user.agreeToMarketing,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        skills: user.skills,
        bio: user.bio,
        agreeToTerms: user.agreeToTerms,
        agreeToMarketing: user.agreeToMarketing,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  signup,
  login
};
