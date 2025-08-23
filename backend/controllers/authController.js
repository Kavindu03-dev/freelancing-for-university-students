const User = require('../models/User');
const Admin = require('../models/Admin');
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
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      userType, 
      agreeToTerms, 
      phoneNumber, 
      dateOfBirth, 
      address,
      agreeToMarketing,
      
      // Student fields
      degreeProgram,
      university,
      gpa,
      technicalSkills,
      graduationYear,
      
      // Job Seeker fields
      organization,
      jobTitle,
      contactPhone,
      projectCategories,
      companySize,
      industry,
      website,
      companyDescription,
      
      // University Staff fields
      staffRole,
      department,
      employeeId,
      experience,
      qualification,
      professionalSummary
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !userType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields' 
      });
    }

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

    // Validate user type
    if (!['student', 'jobSeeker', 'universityStaff'].includes(userType)) {
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

    // Prepare user data based on user type
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      phoneNumber: phoneNumber || '',
      dateOfBirth: dateOfBirth || '',
      address: address || '',
      agreeToTerms,
      agreeToMarketing: agreeToMarketing || false,
      isVerified: false
    };

    // Add student-specific fields
    if (userType === 'student') {
      // These fields are now optional and can be completed later in the profile
      userData.degreeProgram = degreeProgram || '';
      userData.university = university || '';
      userData.gpa = gpa || '';
      userData.technicalSkills = Array.isArray(technicalSkills) ? technicalSkills : [];
      userData.graduationYear = graduationYear || '';
    }

    // Add job seeker-specific fields
    if (userType === 'jobSeeker') {
      if (!organization) {
        return res.status(400).json({
          success: false,
          message: 'Organization is required for job seekers'
        });
      }
      userData.organization = organization;
      userData.jobTitle = jobTitle || '';
      userData.contactPhone = contactPhone || '';
      userData.projectCategories = Array.isArray(projectCategories) ? projectCategories : [];
      userData.companySize = companySize || '';
      userData.industry = industry || '';
      userData.website = website || '';
      userData.companyDescription = companyDescription || '';
    }

    // Add university staff-specific fields
    if (userType === 'universityStaff') {
      if (!staffRole || !department) {
        return res.status(400).json({
          success: false,
          message: 'Staff role and department are required for university staff'
        });
      }
      userData.staffRole = staffRole;
      userData.department = department;
      userData.employeeId = employeeId || '';
      userData.experience = experience || '';
      userData.qualification = qualification || '';
      userData.professionalSummary = professionalSummary || '';
    }

    // Create user
    const user = await User.create(userData);

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
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          address: user.address,
          // Include student fields for profile completion
          degreeProgram: user.degreeProgram,
          university: user.university,
          gpa: user.gpa,
          technicalSkills: user.technicalSkills,
          graduationYear: user.graduationYear,
          isVerified: user.isVerified,
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

    // Prepare response data based on user type
    const responseData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      isVerified: user.isVerified,
      agreeToTerms: user.agreeToTerms,
      agreeToMarketing: user.agreeToMarketing,
      token: generateToken(user._id)
    };

    // Add user type specific fields
    if (user.userType === 'student') {
      responseData.degreeProgram = user.degreeProgram;
      responseData.university = user.university;
      responseData.gpa = user.gpa;
      responseData.technicalSkills = user.technicalSkills;
      responseData.graduationYear = user.graduationYear;
    } else if (user.userType === 'jobSeeker') {
      responseData.organization = user.organization;
      responseData.jobTitle = user.jobTitle;
      responseData.contactPhone = user.contactPhone;
      responseData.projectCategories = user.projectCategories;
      responseData.companySize = user.companySize;
      responseData.industry = user.industry;
      responseData.website = user.website;
      responseData.companyDescription = user.companyDescription;
    } else if (user.userType === 'universityStaff') {
      responseData.staffRole = user.staffRole;
      responseData.department = user.department;
      responseData.employeeId = user.employeeId;
      responseData.experience = user.experience;
      responseData.qualification = user.qualification;
      responseData.professionalSummary = user.professionalSummary;
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: responseData
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

// @desc    Login admin user
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        _id: admin._id,
        email: admin.email,
        userType: 'admin',
        token: generateToken(admin._id)
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  signup,
  login,
  adminLogin
};
