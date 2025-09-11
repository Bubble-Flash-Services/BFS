import Cart from '../models/Cart.js';
import Service from '../models/Service.js';
import Package from '../models/Package.js';
import AddOn from '../models/AddOn.js';
import mongoose from 'mongoose';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate('items.serviceId', 'name basePrice image')
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

    // Ensure tax fields exist (for older carts before schema change)
    if (cart && (cart.taxAmount === undefined || cart.subtotalAmount === undefined)) {
      const plain = cart.toObject();
      const subtotal = plain.items.reduce((sum, item) => {
        let itemTotal = item.price * item.quantity;
        if (item.addOns) item.addOns.forEach(a => itemTotal += a.price * a.quantity);
        if (item.laundryItems) item.laundryItems.forEach(l => itemTotal += l.pricePerItem * l.quantity);
        return sum + itemTotal;
      }, 0);
      const taxRate = 0.18;
      const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
      plain.subtotalAmount = subtotal;
      plain.taxRate = taxRate;
      plain.taxAmount = taxAmount;
      plain.totalAmount = parseFloat((subtotal + taxAmount).toFixed(2));
      return res.json({ success: true, data: plain });
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
  price: customPrice,
  type,
  category,
  image
    } = req.body;

    let service = null;
    let actualServiceId = serviceId;

    // Check if serviceId is a valid ObjectId or a custom ID
    if (serviceId && mongoose.Types.ObjectId.isValid(serviceId)) {
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
        // Special handling for accessories
        const isAccessory = (type && /accessor/i.test(type)) || (category && /accessor/i.test(category)) || (serviceName && /accessor/i.test(serviceName));
  if (isAccessory && process.env.ALLOW_ACCESSORY_AUTOCREATE !== 'false') {
          try {
            // Ensure an Accessories category exists
            const ServiceCategory = (await import('../models/ServiceCategory.js')).default;
            let accessoriesCat = await ServiceCategory.findOne({ name: { $regex: '^Car Accessories$', $options: 'i' } });
            if (!accessoriesCat) {
              accessoriesCat = await ServiceCategory.create({ name: 'Car Accessories', description: 'Car care accessories', image: '/car accessories/towels.jpg', icon: '🧼' });
            }

            // Create or find a specific accessory service
            let accessoryName = serviceName || 'Accessory Item';
            if (!/^Accessory\s*:/i.test(accessoryName)) {
              accessoryName = `Accessory: ${accessoryName}`;
            }
            service = await Service.findOne({ name: accessoryName });
            if (!service) {
              service = await Service.create({
                categoryId: accessoriesCat._id,
                name: accessoryName,
                description: 'Accessory item',
                basePrice: customPrice || 0,
                estimatedDuration: 0,
                image: image || '/car accessories/towels.jpg',
                features: [],
                isActive: true
              });
            } else if (customPrice && service.basePrice !== customPrice) {
              // Keep service basePrice roughly aligned so future cart loads make sense (best-effort)
              service.basePrice = customPrice;
              if (image && service.image !== image) service.image = image;
              await service.save();
            }
            actualServiceId = service._id;
            console.log(`🧩 Using accessory service ${service.name} (${service._id})`);
          } catch (accErr) {
            console.error('Accessory service handling failed:', accErr.message);
          }
        }

        // Fallback: find a default service based on category keywords
        if (!service) {
          const categoryMap = {
            'bikewash': 'Basic Bike Wash',
            'carwash': 'Basic Car Wash',
            'helmet': 'Basic Helmet Wash',
            'laundry': 'Basic Laundry'
          };
          const key = serviceId ? Object.keys(categoryMap).find(cat => serviceId.includes(cat)) : null;
          const fallbackServiceName = key ? categoryMap[key] : 'Basic Car Wash';
          service = await Service.findOne({ name: fallbackServiceName });
          if (service) {
            actualServiceId = service._id;
            console.log(`⚠️ Using fallback service: ${fallbackServiceName} (${service._id})`);
          }
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

    // Normalize vehicleType to allowed values
    const allowedVehicleTypes = new Set(['all','car','bike','suv','hatchback','sedan','commuter','cruiser','sports','scooter','motorbike']);
    const normalizedVehicleType = allowedVehicleTypes.has((vehicleType || '').toLowerCase()) ? (vehicleType || '').toLowerCase() : 'all';

    const cartItem = {
      serviceId: actualServiceId, // Use the actual MongoDB ObjectId
      packageId: packageId || null,
      quantity,
      price: finalPrice,
      addOns: processedAddOns,
      laundryItems,
      vehicleType: normalizedVehicleType,
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
      { path: 'items.serviceId', select: 'name basePrice image' },
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
      { path: 'items.serviceId', select: 'name basePrice image' },
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
      { path: 'items.serviceId', select: 'name basePrice image' },
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
      // Resolve matching service
      let service = null;
      const candidateId = item.serviceId || item.id;
      if (candidateId && mongoose.Types.ObjectId.isValid(candidateId)) {
        service = await Service.findById(candidateId);
      }
      if (!service && (item.serviceName || item.name)) {
        service = await Service.findOne({ name: item.serviceName || item.name });
      }

      // Handle accessories: create service entry if missing
  if (!service && process.env.ALLOW_ACCESSORY_AUTOCREATE !== 'false') {
        const isAccessory = (item.type && /accessor/i.test(item.type)) || (item.category && /accessor/i.test(item.category)) || (item.serviceName && /accessor/i.test(item.serviceName));
        if (isAccessory) {
          try {
            const ServiceCategory = (await import('../models/ServiceCategory.js')).default;
            let accessoriesCat = await ServiceCategory.findOne({ name: { $regex: '^Car Accessories$', $options: 'i' } });
            if (!accessoriesCat) {
              accessoriesCat = await ServiceCategory.create({ name: 'Car Accessories', description: 'Car care accessories', image: '/car accessories/towels.jpg', icon: '🧼' });
            }
            let accessoryName = item.serviceName || item.name || 'Accessory Item';
            if (!/^Accessory\s*:/i.test(accessoryName)) {
              accessoryName = `Accessory: ${accessoryName}`;
            }
            service = await Service.findOne({ name: accessoryName });
            if (!service) {
              service = await Service.create({
                categoryId: accessoriesCat._id,
                name: accessoryName,
                description: 'Accessory item',
                basePrice: item.price || 0,
                estimatedDuration: 0,
                image: item.image || item.img || '/car accessories/towels.jpg',
                features: [],
                isActive: true
              });
            }
          } catch (err) {
            console.warn('Accessory resolution failed during sync:', err.message);
          }
        }
      }

      // Ultimate fallback to any existing default service
      if (!service) {
        const fallbacks = ['Basic Car Wash', 'Basic Bike Wash', 'Wash & Fold', 'Dry Cleaning'];
        service = await Service.findOne({ name: { $in: fallbacks } });
      }
      if (!service) {
        console.warn('No resolvable service for item, skipping:', item);
        continue;
      }

      const allowedVehicleTypes = new Set(['all','car','bike','suv','hatchback','sedan','commuter','cruiser','sports','scooter','motorbike']);
      const normalizedVehicleType = allowedVehicleTypes.has((item.vehicleType || '').toLowerCase()) ? (item.vehicleType || '').toLowerCase() : 'all';

      const processedItem = {
        serviceId: service._id,
        packageId: item.packageId || null,
        quantity: item.quantity || 1,
        price: item.packageDetails?.basePrice || item.basePrice || item.price || service.basePrice,
        addOns: (item.addOns || item.packageDetails?.addons || []).map(addon => ({
          ...addon,
          quantity: addon.quantity || 1
        })),
        laundryItems: item.laundryItems || [],
        vehicleType: normalizedVehicleType,
        specialInstructions: item.specialInstructions || ''
      };

      cart.items.push(processedItem);
    }

    // Calculate totals
    let totalAmount = 0;
    cart.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const addOnsTotal = item.addOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0);
      const laundryTotal = item.laundryItems.reduce((sum, laundry) => sum + (laundry.pricePerItem * laundry.quantity), 0);
      totalAmount += itemTotal + addOnsTotal + laundryTotal;
    });

  cart.subtotalAmount = totalAmount;
  const taxRate = 0.18;
  cart.taxRate = taxRate;
  cart.taxAmount = parseFloat((cart.subtotalAmount * taxRate).toFixed(2));
  cart.totalAmount = parseFloat((cart.subtotalAmount + cart.taxAmount).toFixed(2));

    await cart.save();

    // Populate the saved cart for response
    const populatedCart = await Cart.findOne({ userId: req.user.id })
      .populate('items.serviceId', 'name basePrice image')
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
