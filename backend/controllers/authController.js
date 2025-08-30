import User from '../models/User.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
      
      // Freelancer fields
      degreeProgram,
      university,
      gpa,
      technicalSkills,
      graduationYear,
      
      // Client fields
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
    if (!['freelancer', 'client', 'universityStaff'].includes(userType)) {
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

    // Add freelancer-specific fields
    if (userType === 'freelancer') {
      // These fields are now optional and can be completed later in the profile
      userData.degreeProgram = degreeProgram || '';
      userData.university = university || '';
      userData.gpa = gpa || '';
      userData.technicalSkills = Array.isArray(technicalSkills) ? technicalSkills : [];
      userData.graduationYear = graduationYear || '';
    }

    // Add client-specific fields
    if (userType === 'client') {
      if (!organization) {
        return res.status(400).json({
          success: false,
          message: 'Organization is required for clients'
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
          // Include freelancer fields for profile completion
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
      profileImage: user.profileImage,
      bio: user.bio,
      token: generateToken(user._id)
    };

    // Add user type specific fields
    if (user.userType === 'freelancer') {
      responseData.degreeProgram = user.degreeProgram;
      responseData.university = user.university;
      responseData.gpa = user.gpa;
      responseData.technicalSkills = user.technicalSkills;
      responseData.graduationYear = user.graduationYear;
    } else if (user.userType === 'client') {
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

    // Check if admin user exists in User model
    const adminUser = await User.findOne({ email, userType: 'admin' });
    if (!adminUser) {
      // If no admin user exists and credentials match default admin, create one
      if (email === 'admin@gmail.com' && password === 'admin123') {
        console.log('🔧 Creating default admin user...');
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin user
        const newAdminUser = await User.create({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@gmail.com',
          password: hashedPassword,
          userType: 'admin',
          agreeToTerms: true,
          isVerified: true,
          status: 'active'
        });

        console.log('✅ Default admin user created successfully!');

        return res.json({
          success: true,
          message: 'Admin login successful (default admin created)',
          data: {
            _id: newAdminUser._id,
            email: newAdminUser.email,
            userType: 'admin',
            token: generateToken(newAdminUser._id)
          }
        });
      }

      return res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, adminUser.password);
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
        _id: adminUser._id,
        email: adminUser.email,
        userType: 'admin',
        token: generateToken(adminUser._id)
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

export default {
  signup,
  login,
  adminLogin
};
