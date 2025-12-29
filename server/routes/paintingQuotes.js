import express from 'express';
import PaintingQuote from '../models/PaintingQuote.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create a new painting quote request
router.post('/quote', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      propertyType,
      area,
      address,
      serviceType,
      paintBrand,
      colorPreferences,
      additionalRequirements,
      inspectionDate,
      inspectionTime,
      photos,
      sizeEvaluationAssistance,
      accessories
    } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !propertyType || !area || !address || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new quote
    const paintingQuote = new PaintingQuote({
      userId: req.user.id, // Fix: use req.user.id instead of req.user.userId
      name,
      phone,
      email,
      propertyType,
      area,
      address,
      serviceType,
      paintBrand: paintBrand || 'no-preference',
      colorPreferences,
      additionalRequirements,
      inspectionDate,
      inspectionTime,
      photos: photos || [],
      sizeEvaluationAssistance: sizeEvaluationAssistance || { required: false, charge: 0 },
      accessories: accessories || [],
      status: 'pending'
    });

    await paintingQuote.save();

    res.status(201).json({
      success: true,
      message: 'Painting quote request submitted successfully',
      data: paintingQuote
    });
  } catch (error) {
    console.error('Error creating painting quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit painting quote request'
    });
  }
});

// Get user's painting quote requests
router.get('/my-quotes', authenticateToken, async (req, res) => {
  try {
    const quotes = await PaintingQuote.find({ userId: req.user.id }) // Fix: use req.user.id
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: quotes
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quotes'
    });
  }
});

// Get quote by ID
router.get('/quote/:id', authenticateToken, async (req, res) => {
  try {
    const quote = await PaintingQuote.findOne({
      _id: req.params.id,
      userId: req.user.id // Fix: use req.user.id
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quote'
    });
  }
});

export default router;
