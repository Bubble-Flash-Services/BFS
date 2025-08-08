import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (user, type) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      type: type, // 'admin' or 'employee'
      role: user.role || 'employee'
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts'
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      await admin.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();

    // Generate JWT token
    const token = generateToken(admin, 'admin');

    // Set cookie (optional, you can also just return token)
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        profileImage: admin.profileImage,
        lastLogin: admin.lastLogin
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Employee Login
router.post('/employee/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find employee by email
    const employee = await Employee.findOne({ email: email.toLowerCase() });
    
    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (employee.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts'
      });
    }

    // Check if account is active
    if (!employee.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await employee.comparePassword(password);
    
    if (!isPasswordValid) {
      await employee.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    await employee.resetLoginAttempts();

    // Generate JWT token
    const token = generateToken(employee, 'employee');

    // Set cookie
    res.cookie('employeeToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        specialization: employee.specialization,
        profileImage: employee.profileImage,
        stats: employee.stats,
        lastLogin: employee.lastLogin
      }
    });

  } catch (error) {
    console.error('Employee login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Admin Logout
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Employee Logout
router.post('/employee/logout', (req, res) => {
  res.clearCookie('employeeToken');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Verify Admin Token
router.get('/admin/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.adminToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or inactive account'
      });
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        profileImage: admin.profileImage
      }
    });

  } catch (error) {
    console.error('Admin verify error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Verify Employee Token
router.get('/employee/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.employeeToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    const employee = await Employee.findById(decoded.id).select('-password');
    
    if (!employee || !employee.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or inactive account'
      });
    }

    res.json({
      success: true,
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        specialization: employee.specialization,
        profileImage: employee.profileImage,
        stats: employee.stats
      }
    });

  } catch (error) {
    console.error('Employee verify error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

export default router;
