import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Protect admin routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get admin from token
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized as admin'
        });
      }

      req.admin = admin;
      next();
    } catch (error) {
      console.error('Admin auth error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized as admin'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

export default {
  protect
};
