import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

// Standard authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.id);
    if (!user || user.status !== 'active') {
      return res.status(401).json({ 
        success: false,
        message: 'User not found or inactive' 
      });
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      provider: user.provider
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

// Admin authentication middleware
export const requireAdmin = async (req, res, next) => {
  try {
    // Check if user is an employee with admin role
    const employee = await Employee.findOne({ 
      email: req.user.email,
      isActive: true 
    });

    if (!employee || !['admin', 'manager'].includes(employee.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Admin access required' 
      });
    }

    req.employee = employee;
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(403).json({ 
      success: false,
      message: 'Admin access verification failed' 
    });
  }
};

// Employee authentication middleware
export const authenticateEmployee = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if employee exists and is active
    const employee = await Employee.findById(decoded.id);
    if (!employee || !employee.isActive) {
      return res.status(401).json({ 
        success: false,
        message: 'Employee not found or inactive' 
      });
    }

    req.employee = employee;
    next();
  } catch (error) {
    console.error('Employee authentication error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user && user.status === 'active') {
        req.user = {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          provider: user.provider
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Default export for backward compatibility
export default authenticateToken;
