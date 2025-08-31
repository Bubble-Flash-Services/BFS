import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Advertisement from '../models/Advertisement.js';
import { authenticateAdmin } from '../middleware/authAdmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/advertisements');
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ad-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /api/advertisements - Get all advertisements with filters
router.get('/', async (req, res) => {
  try {
    const { serviceType, isActive } = req.query;
    
    let filter = {};
    if (serviceType) filter.serviceType = serviceType;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    // Only show currently active advertisements (within date range)
    const now = new Date();
    filter.startDate = { $lte: now };
    filter.endDate = { $gte: now };
    
    const advertisements = await Advertisement.find(filter)
      .sort({ priority: -1, createdAt: -1 });
    
    res.json(advertisements);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ error: 'Failed to fetch advertisements' });
  }
});

// GET /api/advertisements/admin - Get all advertisements for admin (no date filter)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const { serviceType, isActive } = req.query;
    
    let filter = {};
    if (serviceType) filter.serviceType = serviceType;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const advertisements = await Advertisement.find(filter)
      .sort({ priority: -1, createdAt: -1 });
    
    res.json(advertisements);
  } catch (error) {
    console.error('Error fetching advertisements for admin:', error);
    res.status(500).json({ error: 'Failed to fetch advertisements' });
  }
});

// POST /api/advertisements - Create new advertisement
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      mediaType,
      colorBackground,
      serviceTypes,
      ctaText,
      ctaLink,
      priority,
      isActive,
      startDate,
      endDate
    } = req.body;

    // Parse serviceTypes if it's a string
    let parsedServiceTypes = serviceTypes;
    if (typeof serviceTypes === 'string') {
      try {
        parsedServiceTypes = JSON.parse(serviceTypes);
      } catch (e) {
        parsedServiceTypes = [serviceTypes];
      }
    }

    const advertisementData = {
      title,
      description,
      mediaType: mediaType || 'color',
      colorBackground: colorBackground || '#3B82F6',
      serviceTypes: parsedServiceTypes || [],
      ctaText: ctaText || 'Learn More',
      ctaLink: ctaLink || '',
      priority: parseInt(priority) || 1,
      isActive: isActive !== false,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };

    // Handle image upload
    if (req.file && mediaType === 'image') {
      advertisementData.imageUrl = `/uploads/advertisements/${req.file.filename}`;
    }

    const advertisement = new Advertisement(advertisementData);
    await advertisement.save();

    res.status(201).json({
      success: true,
      data: advertisement,
      message: 'Advertisement created successfully'
    });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});
// PUT /api/advertisements/:id - Update advertisement
router.put('/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);
    if (!advertisement) {
      return res.status(404).json({ 
        success: false,
        error: 'Advertisement not found' 
      });
    }

    const {
      title,
      description,
      mediaType,
      colorBackground,
      serviceTypes,
      ctaText,
      ctaLink,
      priority,
      isActive,
      startDate,
      endDate
    } = req.body;

    // Parse serviceTypes if it's a string
    let parsedServiceTypes = serviceTypes;
    if (typeof serviceTypes === 'string') {
      try {
        parsedServiceTypes = JSON.parse(serviceTypes);
      } catch (e) {
        parsedServiceTypes = [serviceTypes];
      }
    }

    // Update basic fields
    if (title !== undefined) advertisement.title = title;
    if (description !== undefined) advertisement.description = description;
    if (mediaType !== undefined) advertisement.mediaType = mediaType;
    if (colorBackground !== undefined) advertisement.colorBackground = colorBackground;
    if (parsedServiceTypes !== undefined) advertisement.serviceTypes = parsedServiceTypes;
    if (ctaText !== undefined) advertisement.ctaText = ctaText;
    if (ctaLink !== undefined) advertisement.ctaLink = ctaLink;
    if (priority !== undefined) advertisement.priority = parseInt(priority);
    if (isActive !== undefined) advertisement.isActive = isActive;
    if (startDate !== undefined) advertisement.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) advertisement.endDate = endDate ? new Date(endDate) : null;

    // Handle image updates
    if (req.file && mediaType === 'image') {
      // Delete old image if exists
      if (advertisement.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', 'advertisements', path.basename(advertisement.imageUrl));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      advertisement.imageUrl = `/uploads/advertisements/${req.file.filename}`;
    }

    await advertisement.save();

    res.json({
      success: true,
      data: advertisement,
      message: 'Advertisement updated successfully'
    });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// DELETE /api/advertisements/:id - Delete advertisement
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);
    if (!advertisement) {
      return res.status(404).json({ 
        success: false,
        error: 'Advertisement not found' 
      });
    }

    // Delete associated image file if exists
    if (advertisement.imageUrl) {
      const imagePath = path.join(__dirname, '../uploads/advertisements', path.basename(advertisement.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Advertisement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({ error: 'Failed to delete advertisement' });
  }
});

// POST /api/advertisements/:id/view - Track advertisement view
router.post('/:id/view', async (req, res) => {
  try {
    await Advertisement.findByIdAndUpdate(
      req.params.id,
      { $inc: { 'analytics.views': 1 } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking advertisement view:', error);
    res.status(500).json({ success: false, error: 'Failed to track view' });
  }
});

// POST /api/advertisements/:id/click - Track advertisement click
router.post('/:id/click', async (req, res) => {
  try {
    await Advertisement.findByIdAndUpdate(
      req.params.id,
      { $inc: { 'analytics.clicks': 1 } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking advertisement click:', error);
    res.status(500).json({ success: false, error: 'Failed to track click' });
  }
});

// GET /api/advertisements/:id/analytics - Get advertisement analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);
    if (!advertisement) {
      return res.status(404).json({ 
        success: false,
        error: 'Advertisement not found' 
      });
    }

    res.json({
      success: true,
      data: {
        id: advertisement._id,
        title: advertisement.title,
        analytics: advertisement.analytics,
        ctr: advertisement.analytics.views > 0 ? 
          (advertisement.analytics.clicks / advertisement.analytics.views * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching advertisement analytics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch analytics' 
    });
  }
});

export default router;
