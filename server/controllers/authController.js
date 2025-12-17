import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Configure nodemailer (replace with your SMTP credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configure Twilio (replace with your Twilio credentials)
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_FROM = process.env.TWILIO_FROM;

// Helper: generate JWT
export function genToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
}

export const signup = async (req, res) => {
  try {
    // Accept both 'name' and 'username' as aliases
    let { name, username, email, phone, password, address } = req.body;
    name = name || username;
    // Require name, email and password for local signup
    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!password) return res.status(400).json({ error: 'Password is required' });
    // Optional email; if provided ensure uniqueness
    if (email && await User.findOne({ email })) return res.status(400).json({ error: 'Email already exists' });
    if (phone && await User.findOne({ phone })) return res.status(400).json({ error: 'Phone already exists' });
    const user = await User.create({ name, email, phone, password, address });
    const token = genToken(user);
    res.json({ token, user });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const user = email ? await User.findOne({ email }) : await User.findOne({ phone });
    console.log('Login attempt:', { email, phone, password });
    console.log('User found:', user);
    if (!user) return res.status(400).json({ error: 'User not found' });
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = genToken(user);
    res.json({ token, user });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    let user = await User.findOne({ phone });
    if (!user) user = await User.create({ phone, name: 'User' });
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    // Send OTP via SMS
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: TWILIO_FROM,
      to: phone,
    });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const signinOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    let user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ error: 'User not found' });
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    // Send OTP via SMS
    await twilioClient.messages.create({
      body: `Your OTP for login is ${otp}`,
      from: TWILIO_FROM,
      to: phone,
    });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone, otp, otpExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired OTP' });
    user.otp = undefined; user.otpExpires = undefined;
    await user.save();
    const token = genToken(user);
    res.json({ token, user });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (e) { 
    res.status(500).json({ error: e.message }); 
  }
};

// Forgot Password: Request reset
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If that email is registered, a reset code has been sent.' });
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Your password reset code is: <b>${resetToken}</b><br/>This code expires in 1 hour.</p>`
    });
    res.status(200).json({ message: 'If that email is registered, a reset code has been sent.' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Password: Reset
export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, password } = req.body;
    if (!email || !resetToken || !password) return res.status(400).json({ message: 'All fields required' });
    const user = await User.findOne({ email, resetToken, resetTokenExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset code' });
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
