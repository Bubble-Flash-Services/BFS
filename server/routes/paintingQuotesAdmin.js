import express from 'express';
import PaintingQuote from '../models/PaintingQuote.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const router = express.Router();

// Get all painting quotes with filters
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [quotes, total] = await Promise.all([
      PaintingQuote.find(filter)
        .populate('userId', 'name email phone')
        .populate('assignedEmployee', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      PaintingQuote.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: quotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching painting quotes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch painting quotes'
    });
  }
});

// Get painting quote by ID
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const quote = await PaintingQuote.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('assignedEmployee', 'name email phone');

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Painting quote not found'
      });
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Error fetching painting quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch painting quote'
    });
  }
});

// Update painting quote status
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const quote = await PaintingQuote.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Painting quote not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: quote
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
});

// Update painting quote details (quote amount, notes, etc.)
router.patch('/:id', authenticateAdmin, async (req, res) => {
  try {
    const updates = req.body;
    
    const quote = await PaintingQuote.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Painting quote not found'
      });
    }

    res.json({
      success: true,
      message: 'Quote updated successfully',
      data: quote
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quote'
    });
  }
});

// Get painting quotes stats
router.get('/stats/summary', authenticateAdmin, async (req, res) => {
  try {
    const [total, pending, contacted, quoted, confirmed, inProgress, completed, cancelled] = await Promise.all([
      PaintingQuote.countDocuments(),
      PaintingQuote.countDocuments({ status: 'pending' }),
      PaintingQuote.countDocuments({ status: 'contacted' }),
      PaintingQuote.countDocuments({ status: 'quoted' }),
      PaintingQuote.countDocuments({ status: 'confirmed' }),
      PaintingQuote.countDocuments({ status: 'in-progress' }),
      PaintingQuote.countDocuments({ status: 'completed' }),
      PaintingQuote.countDocuments({ status: 'cancelled' })
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        contacted,
        quoted,
        confirmed,
        inProgress,
        completed,
        cancelled
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
});

export default router;
