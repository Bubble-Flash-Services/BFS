import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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

    // Add better token validation
    if (!token || token === 'undefined' || token === 'null' || token.length < 10) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format' 
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
    // Don't log JWT malformed errors for invalid tokens to reduce noise
    if (error.name !== 'JsonWebTokenError') {
      console.error('Authentication error:', error);
    }
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
