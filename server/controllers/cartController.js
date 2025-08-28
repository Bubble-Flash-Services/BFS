import Cart from '../models/Cart.js';
import Service from '../models/Service.js';
import Package from '../models/Package.js';
import AddOn from '../models/AddOn.js';
import mongoose from 'mongoose';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.serviceId', 'name basePrice')
      .populate('items.packageId', 'name price features')
      .populate('items.addOns.addOnId', 'name price');

    if (!cart) {
      return res.json({
        success: true,
        data: {
          items: [],
          totalAmount: 0,
          totalItems: 0
        }
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const {
      serviceId,
      packageId,
      quantity = 1,
      addOns = [],
      laundryItems = [],
      vehicleType,
      specialInstructions,
      serviceName,
      price: customPrice
    } = req.body;

    let service = null;
    let actualServiceId = serviceId;

    // Check if serviceId is a valid ObjectId or a custom ID
    if (mongoose.Types.ObjectId.isValid(serviceId)) {
      // Valid ObjectId - find by ID
      service = await Service.findById(serviceId);
    } else {
      // Custom ID (like bikewash-1-timestamp) - find by name or use fallback
      console.log(`🔍 Custom service ID detected: ${serviceId}`);
      
      if (serviceName) {
        service = await Service.findOne({ name: serviceName });
        if (service) {
          actualServiceId = service._id;
          console.log(`✅ Found service by name "${serviceName}": ${service._id}`);
        }
      }
      
      if (!service) {
        // Fallback: find a default service based on category
        const categoryMap = {
          'bikewash': 'Basic Bike Wash',
          'carwash': 'Basic Car Wash',
          'helmet': 'Basic Helmet Wash',
          'laundry': 'Basic Laundry'
        };
        
        const category = Object.keys(categoryMap).find(cat => serviceId.includes(cat));
        const fallbackServiceName = category ? categoryMap[category] : 'Basic Car Wash';
        
        service = await Service.findOne({ name: fallbackServiceName });
        if (service) {
          actualServiceId = service._id;
          console.log(`⚠️ Using fallback service: ${fallbackServiceName} (${service._id})`);
        }
      }
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    let price = service.basePrice;
    let packageData = null;

    // If package is specified, get package price
    if (packageId) {
      packageData = await Package.findById(packageId);
      if (!packageData) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }
      price = packageData.price;
    }

    // Validate and process add-ons
    const processedAddOns = [];
    if (addOns && addOns.length > 0) {
      for (const addOn of addOns) {
        const addOnData = await AddOn.findById(addOn.addOnId);
        if (!addOnData) {
          return res.status(404).json({
            success: false,
            message: `Add-on not found: ${addOn.addOnId}`
          });
        }
        processedAddOns.push({
          addOnId: addOn.addOnId,
          quantity: addOn.quantity || 1,
          price: addOnData.price
        });
      }
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.serviceId.toString() === actualServiceId.toString() &&
      (packageId ? item.packageId?.toString() === packageId : !item.packageId)
    );

    // Use custom price if provided, otherwise use calculated price
    const finalPrice = customPrice || price;

    const cartItem = {
      serviceId: actualServiceId, // Use the actual MongoDB ObjectId
      packageId: packageId || null,
      quantity,
      price: finalPrice,
      addOns: processedAddOns,
      laundryItems,
      vehicleType,
      specialInstructions
    };

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      // Merge add-ons
      for (const newAddOn of processedAddOns) {
        const existingAddOnIndex = cart.items[existingItemIndex].addOns.findIndex(
          ao => ao.addOnId.toString() === newAddOn.addOnId.toString()
        );
        if (existingAddOnIndex > -1) {
          cart.items[existingItemIndex].addOns[existingAddOnIndex].quantity += newAddOn.quantity;
        } else {
          cart.items[existingItemIndex].addOns.push(newAddOn);
        }
      }
    } else {
      // Add new item
      cart.items.push(cartItem);
    }

    await cart.save();

    // Populate cart for response
    await cart.populate([
      { path: 'items.serviceId', select: 'name basePrice' },
      { path: 'items.packageId', select: 'name price features' },
      { path: 'items.addOns.addOnId', select: 'name price' }
    ]);

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, addOns, specialInstructions } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity !== undefined) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    if (addOns !== undefined) {
      cart.items[itemIndex].addOns = addOns;
    }

    if (specialInstructions !== undefined) {
      cart.items[itemIndex].specialInstructions = specialInstructions;
    }

    await cart.save();

    await cart.populate([
      { path: 'items.serviceId', select: 'name basePrice' },
      { path: 'items.packageId', select: 'name price features' },
      { path: 'items.addOns.addOnId', select: 'name price' }
    ]);

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    await cart.populate([
      { path: 'items.serviceId', select: 'name basePrice' },
      { path: 'items.packageId', select: 'name price features' },
      { path: 'items.addOns.addOnId', select: 'name price' }
    ]);

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        items: [],
        totalAmount: 0,
        totalItems: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

// Sync localStorage cart to database
export const syncCartToDatabase = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart items data'
      });
    }

    // Clear existing cart
    await Cart.findOneAndDelete({ userId: req.user.id });

    if (items.length === 0) {
      return res.json({
        success: true,
        message: 'Cart synced successfully (empty cart)',
        data: { items: [], totalAmount: 0, totalItems: 0 }
      });
    }

    // Create new cart with localStorage items
    const cart = new Cart({ userId: req.user.id, items: [] });

    for (const item of items) {
      // Validate and process each item
      const processedItem = {
        serviceId: item.serviceId || item.id,
        packageId: item.packageId || null,
        quantity: item.quantity || 1,
        price: item.packageDetails?.basePrice || item.basePrice || item.price,
        addOns: (item.addOns || item.packageDetails?.addons || []).map(addon => ({
          ...addon,
          quantity: addon.quantity || 1
        })),
        laundryItems: item.laundryItems || [],
        vehicleType: item.vehicleType || 'all',
        specialInstructions: item.specialInstructions || ''
      };

      // Validate serviceId exists
      try {
        const service = await Service.findById(processedItem.serviceId);
        if (service) {
          cart.items.push(processedItem);
        } else {
          console.warn(`Service not found for ID: ${processedItem.serviceId}, skipping item`);
        }
      } catch (error) {
        console.warn(`Invalid service ID: ${processedItem.serviceId}, skipping item`);
      }
    }

    // Calculate totals
    let totalAmount = 0;
    cart.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const addOnsTotal = item.addOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0);
      const laundryTotal = item.laundryItems.reduce((sum, laundry) => sum + (laundry.pricePerItem * laundry.quantity), 0);
      totalAmount += itemTotal + addOnsTotal + laundryTotal;
    });

    cart.totalAmount = totalAmount;

    await cart.save();

    // Populate the saved cart for response
    const populatedCart = await Cart.findOne({ userId: req.user.id })
      .populate('items.serviceId', 'name basePrice')
      .populate('items.packageId', 'name price features')
      .populate('items.addOns.addOnId', 'name price');

    res.json({
      success: true,
      message: 'Cart synced successfully',
      data: populatedCart || { items: [], totalAmount: 0, totalItems: 0 }
    });

    console.log(`✅ Cart synced for user ${req.user.id}: ${cart.items.length} items, total: ₹${totalAmount}`);

  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync cart to database',
      error: error.message
    });
  }
};
