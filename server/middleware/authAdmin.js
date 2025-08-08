import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Employee from '../models/Employee.js';

// Admin Authentication Middleware
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.adminToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Invalid token type.'
      });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token or inactive account.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    // Don't log JWT malformed errors for invalid tokens to reduce noise
    if (error.name !== 'JsonWebTokenError') {
      console.error('Admin auth middleware error:', error);
    }
    res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.'
    });
  }
};

// Employee Authentication Middleware
export const authenticateEmployee = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.employeeToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Invalid token type.'
      });
    }

    const employee = await Employee.findById(decoded.id).select('-password');
    
    if (!employee || !employee.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token or inactive account.'
      });
    }

    req.employee = employee;
    next();
  } catch (error) {
    // Don't log JWT malformed errors for invalid tokens to reduce noise
    if (error.name !== 'JsonWebTokenError') {
      console.error('Employee auth middleware error:', error);
    }
    res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.'
    });
  }
};

// Admin Permission Middleware
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required.'
      });
    }

    if (req.admin.role === 'superadmin' || req.admin.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: `Access denied. Permission '${permission}' required.`
      });
    }
  };
};

// Super Admin Only Middleware
export const requireSuperAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Admin authentication required.'
    });
  }

  if (req.admin.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Super admin privileges required.'
    });
  }
};
