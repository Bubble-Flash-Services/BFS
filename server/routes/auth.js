import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import crypto from 'crypto';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { signinOtp, sendOtp, forgotPassword, resetPassword, getProfile, updateProfile } from '../controllers/authController.js';

const router = express.Router();

// Helper: generate JWT
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Signup (email/password)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    // Remove manual hash, let pre-save hook hash the password
    const user = await User.create({ name, email, password, provider: 'local' });
    const token = generateToken(user);
    res.json({ token, user: { name: user.name, email: user.email, image: null } });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Signin (email/password)
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.provider !== 'local') return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user: { name: user.name, email: user.email, image: null } });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Alias for /signin (for frontend compatibility)
router.post('/login', async (req, res) => {
  console.log('Login route hit');
  // Reuse /signin logic
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.provider !== 'local') return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { name: user.name, email: user.email, image: null } });
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Successful Google login
  const user = req.user;
  const token = generateToken(user);
  // Redirect to frontend with token and user info as query params
  res.redirect(`${process.env.BASE_URL}/google-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&image=${encodeURIComponent(user.image || '')}`);
});

// OTP-based signin (mobile)
router.post('/signin-otp', signinOtp);

// Send OTP for signup (mobile)
router.post('/send-otp', sendOtp);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

// Profile endpoints (for frontend compatibility)
router.get('/me', authenticateToken, getProfile);
router.put('/me', authenticateToken, updateProfile);

// Test route for debugging router connection
router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.send('ok');
});

export default router;
