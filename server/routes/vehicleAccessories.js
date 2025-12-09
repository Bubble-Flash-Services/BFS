import express from 'express';
import VehicleAccessory from '../models/VehicleAccessory.js';

const router = express.Router();

// Get all accessories with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      search,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (inStock === 'true') {
      query.inStock = true;
    } else if (inStock === 'false') {
      query.inStock = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort
    let sortOption = { sortOrder: 1 };
    if (sort === 'price_low') {
      sortOption = { basePrice: 1 };
    } else if (sort === 'price_high') {
      sortOption = { basePrice: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'popularity') {
      sortOption = { salesCount: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [accessories, total] = await Promise.all([
      VehicleAccessory.find(query)
        .sort(sortOption)
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

// Get single accessory by ID
router.get('/:id', async (req, res) => {
  try {
    const accessory = await VehicleAccessory.findById(req.params.id);
    
    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      });
    }

    res.json({
      success: true,
      data: accessory
    });
  } catch (error) {
    console.error('Error fetching accessory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch accessory',
      error: error.message
    });
  }
});

// Get categories with counts
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await VehicleAccessory.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const subcategories = await VehicleAccessory.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: { category: '$category', subcategory: '$subcategory' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories,
        subcategories
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get featured accessories
router.get('/featured/list', async (req, res) => {
  try {
    const accessories = await VehicleAccessory.find({
      isActive: true,
      isFeatured: true
    })
      .sort({ sortOrder: 1 })
      .limit(8);

    res.json({
      success: true,
      data: accessories
    });
  } catch (error) {
    console.error('Error fetching featured accessories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured accessories',
      error: error.message
    });
  }
});

// Get related accessories
router.get('/:id/related', async (req, res) => {
  try {
    const accessory = await VehicleAccessory.findById(req.params.id);
    
    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      });
    }

    const related = await VehicleAccessory.find({
      _id: { $ne: accessory._id },
      isActive: true,
      $or: [
        { category: accessory.category },
        { subcategory: accessory.subcategory }
      ]
    })
      .limit(4)
      .sort({ rating: -1 });

    res.json({
      success: true,
      data: related
    });
  } catch (error) {
    console.error('Error fetching related accessories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch related accessories',
      error: error.message
    });
  }
});

export default router;
