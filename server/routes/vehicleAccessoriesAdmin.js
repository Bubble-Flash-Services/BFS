import express from 'express';
import VehicleAccessory from '../models/VehicleAccessory.js';

const router = express.Router();

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  // For now, just check if token exists
  // In production, verify JWT properly
  next();
};

// Get all accessories (admin view - includes inactive)
router.get('/accessories', verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, status } = req.query;

    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [accessories, total] = await Promise.all([
      VehicleAccessory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      VehicleAccessory.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        accessories,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching accessories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch accessories',
      error: error.message
    });
  }
});

// Create new accessory
router.post('/accessories', verifyAdminToken, async (req, res) => {
  try {
    const accessoryData = req.body;
    
    const accessory = new VehicleAccessory(accessoryData);
    await accessory.save();

    res.status(201).json({
      success: true,
      message: 'Accessory created successfully',
      data: accessory
    });
  } catch (error) {
    console.error('Error creating accessory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create accessory',
      error: error.message
    });
  }
});

// Update accessory
router.put('/accessories/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const accessory = await VehicleAccessory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      });
    }

    res.json({
      success: true,
      message: 'Accessory updated successfully',
      data: accessory
    });
  } catch (error) {
    console.error('Error updating accessory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update accessory',
      error: error.message
    });
  }
});

// Delete accessory
router.delete('/accessories/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    const accessory = await VehicleAccessory.findByIdAndDelete(id);

    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      });
    }

    res.json({
      success: true,
      message: 'Accessory deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting accessory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete accessory',
      error: error.message
    });
  }
});

// Toggle accessory status
router.patch('/accessories/:id/toggle-status', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;

    const accessory = await VehicleAccessory.findById(id);

    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      });
    }

    accessory.isActive = !accessory.isActive;
    await accessory.save();

    res.json({
      success: true,
      message: `Accessory ${accessory.isActive ? 'activated' : 'deactivated'} successfully`,
      data: accessory
    });
  } catch (error) {
    console.error('Error toggling accessory status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle accessory status',
      error: error.message
    });
  }
});

// Update stock
router.patch('/accessories/:id/stock', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQuantity, inStock } = req.body;

    const updateData = {};
    if (typeof stockQuantity === 'number') {
      updateData.stockQuantity = stockQuantity;
      updateData.inStock = stockQuantity > 0;
    }
    if (typeof inStock === 'boolean') {
      updateData.inStock = inStock;
    }

    const accessory = await VehicleAccessory.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: accessory
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
});

// Get dashboard stats
router.get('/accessories/stats', verifyAdminToken, async (req, res) => {
  try {
    const [totalProducts, activeProducts, outOfStock, categoryStats] = await Promise.all([
      VehicleAccessory.countDocuments(),
      VehicleAccessory.countDocuments({ isActive: true }),
      VehicleAccessory.countDocuments({ inStock: false }),
      VehicleAccessory.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalSales: { $sum: '$salesCount' }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        inactiveProducts: totalProducts - activeProducts,
        outOfStock,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
});

export default router;
