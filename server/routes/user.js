import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user profile  
router.put('/me', auth, async (req, res) => {
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
});

export default router;
