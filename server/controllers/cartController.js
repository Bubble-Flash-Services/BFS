import Cart from '../models/Cart.js';
import Service from '../models/Service.js';
import Package from '../models/Package.js';
import AddOn from '../models/AddOn.js';
import mongoose from 'mongoose';

// Helpers
const isValidObjectIdString = (val) => typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);
const isValidObjectId = (val) => {
  try {
    return mongoose.isValidObjectId(val);
  } catch {
    return false;
  }
};
const toStr = (v) => (v === undefined || v === null) ? '' : String(v);
const normalizeVehicle = (raw) => {
  const v = toStr(raw).toLowerCase();
  const map = {
    hatchbacks: 'hatchback',
    sedans: 'sedan',
    luxuries: 'car',
    midsuv: 'suv',
    cars: 'car',
    bikes: 'bike',
  };
  const mapped = map[v] || v.replace(/s$/, '');
  const allowed = new Set(['all','car','bike','suv','hatchback','sedan','commuter','cruiser','sports','scooter','motorbike']);
  return allowed.has(mapped) ? mapped : 'all';
};

// Helper to detect special service types
const detectServiceType = (item) => {
  const type = toStr(item.type);
  const category = toStr(item.category);
  const serviceName = toStr(item.serviceName || item.name);
  
  return {
    isVehicleCheckup: /vehicle.*checkup|full.*body.*checkup/i.test(type) || /vehicle.*checkup/i.test(category) || /vehicle.*checkup|full.*body.*checkup/i.test(serviceName),
    isPUC: /puc.*certificate|puc/i.test(type) || /puc/i.test(category) || /puc/i.test(serviceName),
    isInsurance: /insurance/i.test(type) || /insurance/i.test(category) || /insurance/i.test(serviceName)
  };
};

// Helper to get service category details based on service type
const getServiceCategoryDetails = (isVehicleCheckup, isPUC, isInsurance) => {
  if (isVehicleCheckup) {
    return {
      name: 'Vehicle Checkup',
      description: 'Vehicle inspection services',
      icon: '🔧'
    };
  } else if (isPUC) {
    return {
      name: 'PUC Certificate',
      description: 'PUC certificate services',
      icon: '📜'
    };
  } else if (isInsurance) {
    return {
      name: 'Insurance Assistance',
      description: 'Insurance assistance services',
      icon: '🛡️'
    };
  }
  return null;
};

// Remove or repair legacy-bad items before populate/save to avoid cast errors
const sanitizeCartItems = async (cart) => {
  if (!cart || !Array.isArray(cart.items)) return false;
  let changed = false;

  // Filter out items with invalid serviceId, and clean invalid packageId/addOns
  const cleanedItems = [];
  for (const item of cart.items) {
    if (!isValidObjectId(item.serviceId)) {
      // Try to REPAIR by resolving a service from stored fields
      try {
        const nameHint = toStr(item.serviceName || item.name);
        let service = null;
        if (nameHint) {
          service = await Service.findOne({ name: { $regex: nameHint, $options: 'i' } });
        }
        if (!service) {
          const vt = normalizeVehicle(item.vehicleType || item.type || item.category);
          const mapped = ['bike','commuter','cruiser','sports','scooter','motorbike'].includes(vt) ? 'Basic Bike Wash' : 'Basic Car Wash';
          service = await Service.findOne({ name: { $regex: `^${mapped}$`, $options: 'i' } });
        }
        if (service) {
          item.serviceId = service._id;
          console.warn('🧹 Repaired cart item serviceId using', nameHint || item.type || item.category, '→', service.name);
          changed = true;
        } else {
          console.warn('🧹 Removing cart item; unable to resolve service for invalid serviceId:', item.serviceId);
          changed = true;
          continue; // skip push
        }
      } catch (e) {
        console.warn('🧹 Failed to repair invalid serviceId, removing item. Reason:', e.message);
        changed = true;
        continue;
      }
    }
    // Clean invalid packageId
    if (item.packageId && !isValidObjectId(item.packageId)) {
      console.warn('🧹 Clearing invalid packageId on cart item:', item.packageId);
      item.packageId = undefined;
      changed = true;
    }
    // Clean invalid addOns
    if (Array.isArray(item.addOns)) {
      const before = item.addOns.length;
      item.addOns = item.addOns.filter(ao => isValidObjectId(ao.addOnId));
      if (item.addOns.length !== before) {
        console.warn(`🧹 Removed ${before - item.addOns.length} invalid addOns from cart item`);
        changed = true;
      }
    }
    cleanedItems.push(item);
  }
  if (cleanedItems.length !== cart.items.length) {
    cart.items = cleanedItems;
    changed = true;
  }
  if (changed) {
    try { await cart.save(); } catch (e) { console.warn('Sanitize cart save failed:', e.message); }
  }
  return changed;
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    // Load without populate first to sanitize bad legacy IDs
    let cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      await sanitizeCartItems(cart);
      // Re-load to ensure latest state before populate
      cart = await Cart.findOne({ userId: req.user.id })
        .populate('items.serviceId', 'name basePrice image')
        .populate('items.packageId', 'name price features')
        .populate('items.addOns.addOnId', 'name price');
    }

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

    // Normalize image fields for consistent frontend display
    if (cart) {
      const plain = cart.toObject();
      plain.items = (plain.items || []).map(it => ({
        ...it,
        image: it.image || it.img || it.serviceId?.image || (it.serviceName && /bike/i.test(it.serviceName) ? '/bike/bike1.png' : (it.serviceName && /helmet/i.test(it.serviceName) ? '/helmet/helmethome.png' : '/car/car1.png')),
        img: undefined
      }));
      cart = plain;
    }

    // Ensure tax fields exist (for older carts before schema change)
    if (cart && (cart.taxAmount === undefined || cart.subtotalAmount === undefined)) {
      const plain = cart; // already plain object above
      const subtotal = (plain.items || []).reduce((sum, item) => {
        let itemTotal = item.price * item.quantity;
        if (item.addOns) item.addOns.forEach(a => itemTotal += a.price * a.quantity);
        if (item.laundryItems) item.laundryItems.forEach(l => itemTotal += l.pricePerItem * l.quantity);
        if (item.uiAddOns) item.uiAddOns.forEach(u => itemTotal += (u.price || 0) * (u.quantity || 1));
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

    res.json({ success: true, data: cart });
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

  console.log('🛒 addToCart payload:', { serviceId, packageId, vehicleType, serviceName, type, category, price: customPrice });

  let service = null;
  let actualServiceId = undefined;

    // Check if serviceId is a valid ObjectId or a custom ID
    if (isValidObjectIdString(toStr(serviceId))) {
      // Valid ObjectId - find by ID
      service = await Service.findById(serviceId);
      if (service) actualServiceId = service._id;
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
          // Special handling for monthly plans and helmet services (auto-create when missing)
          const isMonthlyPlan = (type && /monthly/i.test(type)) || (serviceName && /plan/i.test(serviceName));
          const isHelmet = (type && /helmet/i.test(type)) || (serviceName && /helmet/i.test(serviceName));
          if ((isMonthlyPlan || isHelmet) && process.env.ALLOW_PLAN_AUTOCREATE !== 'false') {
            try {
              const ServiceCategory = (await import('../models/ServiceCategory.js')).default;
              // Determine category name
              let catName = isHelmet ? 'Helmet Wash' : 'Car Wash Plans';
              // Create/find category
              let planCat = await ServiceCategory.findOne({ name: { $regex: `^${catName}$`, $options: 'i' } });
              if (!planCat) {
                planCat = await ServiceCategory.create({ name: catName, description: isHelmet ? 'Helmet wash services' : 'Monthly plan services', image: isHelmet ? '/helmet/helmethome.png' : '/car/car1.png', icon: isHelmet ? '🪖' : '📅' });
              }
              // Compose a unique service name for plans
              const planServiceName = isHelmet ? (serviceName || 'Helmet Wash') : (`Monthly Plan: ${serviceName || 'Custom Plan'}`);
              service = await Service.findOne({ name: planServiceName });
              if (!service) {
                service = await Service.create({
                  categoryId: planCat._id,
                  name: planServiceName,
                  description: isHelmet ? 'Helmet washing service' : 'Monthly subscription plan',
                  basePrice: customPrice || 0,
                  estimatedDuration: 0,
                  image: image || (isHelmet ? '/helmet/helmethome.png' : '/car/car1.png'),
                  features: [],
                  isActive: true
                });
              } else if (customPrice && service.basePrice !== customPrice) {
                service.basePrice = customPrice; if (image && service.image !== image) service.image = image; await service.save();
              }
              actualServiceId = service._id;
              console.log(`🧩 Using ${isHelmet ? 'helmet' : 'plan'} service ${service.name} (${service._id})`);
            } catch (planErr) {
              console.warn('Plan/helmet service handling failed:', planErr.message);
            }
          }

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

        // Special handling for vehicle checkup, PUC, and insurance services
        const serviceTypes = detectServiceType({ type, category, serviceName });
        const { isVehicleCheckup, isPUC, isInsurance } = serviceTypes;

        if ((isVehicleCheckup || isPUC || isInsurance) && process.env.ALLOW_SERVICE_AUTOCREATE !== 'false') {
          try {
            const ServiceCategory = (await import('../models/ServiceCategory.js')).default;
            const categoryDetails = getServiceCategoryDetails(isVehicleCheckup, isPUC, isInsurance);
            
            let planCat = await ServiceCategory.findOne({ name: { $regex: `^${categoryDetails.name}$`, $options: 'i' } });
            if (!planCat) {
              planCat = await ServiceCategory.create({ 
                name: categoryDetails.name, 
                description: categoryDetails.description, 
                image: '/car/car1.png', 
                icon: categoryDetails.icon 
              });
            }
            
            // Use serviceName as-is for these special services
            const serviceItemName = serviceName || categoryDetails.name;
            service = await Service.findOne({ name: serviceItemName });
            if (!service) {
              service = await Service.create({
                categoryId: planCat._id,
                name: serviceItemName,
                description: `${categoryDetails.name} service`,
                basePrice: customPrice || 0,
                estimatedDuration: 0,
                image: image || '/car/car1.png',
                features: [],
                isActive: true
              });
            } else if (customPrice && service.basePrice !== customPrice) {
              service.basePrice = customPrice; 
              if (image && service.image !== image) service.image = image; 
              await service.save();
            }
            actualServiceId = service._id;
            console.log(`🧩 Using ${categoryDetails.name} service ${service.name} (${service._id})`);
          } catch (serviceErr) {
            console.warn('Special service handling failed:', serviceErr.message);
          }
        }

        // Fallback: find a default service based on category keywords
        if (!service) {
          const categoryMap = {
            bikewash: 'Basic Bike Wash',
            carwash: 'Basic Car Wash',
            helmet: 'Basic Helmet Wash',
            laundry: 'Basic Laundry'
          };
          const idStr = toStr(serviceId).toLowerCase();
          const key = Object.keys(categoryMap).find(cat => idStr.includes(cat));
          // Try derive from type/vehicleType if no key match
          let fallbackServiceName = key ? categoryMap[key] : null;
          const vt = normalizeVehicle(vehicleType);
          if (!fallbackServiceName) {
            if (/(bike|motorbike|commuter|cruiser|sports)/i.test(toStr(type)) || ['bike','commuter','cruiser','sports','scooter','motorbike'].includes(vt)) {
              fallbackServiceName = 'Basic Bike Wash';
            } else if (/(car|hatchback|sedan|suv)/i.test(toStr(type)) || ['car','hatchback','sedan','suv'].includes(vt)) {
              fallbackServiceName = 'Basic Car Wash';
            } else if (/(helmet)/i.test(toStr(type))) {
              fallbackServiceName = 'Basic Helmet Wash';
            } else if (/(laundry|wash & fold|dry)/i.test(toStr(type))) {
              fallbackServiceName = 'Basic Laundry';
            } else {
              fallbackServiceName = 'Basic Car Wash';
            }
          }
          service = await Service.findOne({ name: fallbackServiceName });
          if (service) {
            actualServiceId = service._id;
            console.log(`ℹ️ Using fallback service: ${fallbackServiceName} (${service._id})`);
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
    if (packageId && isValidObjectIdString(toStr(packageId))) {
      packageData = await Package.findById(packageId);
      if (!packageData) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }
      price = packageData.price;
    }

    // Validate and process DB add-ons
    const processedAddOns = [];
    if (addOns && addOns.length > 0) {
      for (const addOn of addOns) {
        // Guard invalid addOn IDs
        if (!isValidObjectIdString(toStr(addOn.addOnId))) {
          console.warn('Skipping invalid addOnId:', addOn.addOnId);
          continue;
        }
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

    // Capture UI-only add-ons if provided (no DB lookup required)
    const uiAddOns = Array.isArray(req.body.uiAddOns)
      ? req.body.uiAddOns.map(u => ({
          name: toStr(u.name),
          price: Number(u.price) || 0,
          quantity: u.quantity ? Number(u.quantity) : 1
        }))
      : [];

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Sanitize existing bad items to avoid populate/save cast errors
    await sanitizeCartItems(cart);

    // Always add as a separate line item (no merging), per requirement
    const existingItemIndex = -1;

    // Use custom price if provided, otherwise use calculated price
    const finalPrice = customPrice || price;

    // Normalize vehicleType to allowed values
  const normalizedVehicleType = normalizeVehicle(vehicleType);

    const cartItem = {
      serviceId: actualServiceId, // Use the actual MongoDB ObjectId
  packageId: packageData ? packageData._id : null,
      quantity,
      price: finalPrice,
      addOns: processedAddOns,
      uiAddOns,
      laundryItems,
      vehicleType: normalizedVehicleType,
      specialInstructions,
      // Carry UI display fields
      serviceName: serviceName || service?.name,
      name: serviceName || service?.name,
      image: image || service?.image,
      packageName: packageData?.name || req.body.packageName,
      packageDetails: req.body.packageDetails,
      includedFeatures: Array.isArray(req.body.includedFeatures) ? req.body.includedFeatures : [],
      type: type || (/(helmet)/i.test(serviceName) ? 'helmet-wash' : /(bike)/i.test(serviceName) ? 'bike-wash' : 'car-wash'),
      category: category || (normalizedVehicleType ? normalizedVehicleType[0]?.toUpperCase() + normalizedVehicleType.slice(1) : undefined)
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

    // Sanitize existing items before making updates
    await sanitizeCartItems(cart);

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

    // Sanitize existing items before removal
    await sanitizeCartItems(cart);

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

  // Load or create cart to MERGE items (do not delete existing)
  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    // Sanitize any legacy bad items before merging
    await sanitizeCartItems(cart);

    if (items.length === 0) {
      return res.json({
        success: true,
        message: 'Cart synced successfully (empty cart)',
        data: { items: [], totalAmount: 0, totalItems: 0 }
      });
    }

  // Add incoming items to existing cart as separate line items

    for (const item of items) {
      // Resolve matching service
      let service = null;
      const candidateId = item.serviceId || item.id;
      if (candidateId && isValidObjectIdString(toStr(candidateId))) {
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

      // Handle vehicle checkup, PUC, and insurance services
      if (!service && process.env.ALLOW_SERVICE_AUTOCREATE !== 'false') {
        const serviceTypes = detectServiceType(item);
        const { isVehicleCheckup, isPUC, isInsurance } = serviceTypes;

        if (isVehicleCheckup || isPUC || isInsurance) {
          try {
            const ServiceCategory = (await import('../models/ServiceCategory.js')).default;
            const categoryDetails = getServiceCategoryDetails(isVehicleCheckup, isPUC, isInsurance);
            
            let planCat = await ServiceCategory.findOne({ name: { $regex: `^${categoryDetails.name}$`, $options: 'i' } });
            if (!planCat) {
              planCat = await ServiceCategory.create({ 
                name: categoryDetails.name, 
                description: categoryDetails.description, 
                image: '/car/car1.png', 
                icon: categoryDetails.icon 
              });
            }
            
            const serviceItemName = item.serviceName || item.name || categoryDetails.name;
            service = await Service.findOne({ name: serviceItemName });
            if (!service) {
              service = await Service.create({
                categoryId: planCat._id,
                name: serviceItemName,
                description: `${categoryDetails.name} service`,
                basePrice: item.price || 0,
                estimatedDuration: 0,
                image: item.image || item.img || '/car/car1.png',
                features: [],
                isActive: true
              });
            }
            console.log(`🧩 Sync: Using ${categoryDetails.name} service ${service.name} (${service._id})`);
          } catch (err) {
            console.warn('Special service resolution failed during sync:', err.message);
          }
        }
      }

      // Ultimate fallback to any existing default service
      if (!service) {
        // Choose fallback based on type/vehicle
        const vt = normalizeVehicle(item.vehicleType || item.type);
        const byType = ['bike','commuter','cruiser','sports','scooter','motorbike'].includes(vt) ? 'Basic Bike Wash' : ['car','hatchback','sedan','suv'].includes(vt) ? 'Basic Car Wash' : null;
        const fallbacks = byType ? [byType] : ['Basic Car Wash', 'Basic Bike Wash', 'Wash & Fold', 'Dry Cleaning'];
        service = await Service.findOne({ name: { $in: fallbacks } });
      }
      if (!service) {
        console.warn('No resolvable service for item, skipping:', item);
        continue;
      }

  const normalizedVehicleType = normalizeVehicle(item.vehicleType || item.type);

      const processedItem = {
        serviceId: service._id,
        packageId: (item.packageId && isValidObjectIdString(toStr(item.packageId))) ? item.packageId : null,
        quantity: item.quantity || 1,
        price: item.packageDetails?.basePrice || item.basePrice || item.price || service.basePrice,
        addOns: (item.addOns || item.packageDetails?.addons || [])
          .filter(addon => isValidObjectIdString(toStr(addon.addOnId)))
          .map(addon => ({
            ...addon,
            quantity: addon.quantity || 1
          })),
        uiAddOns: (item.uiAddOns || [])
          .map(u => ({ name: toStr(u.name), price: Number(u.price) || 0, quantity: u.quantity ? Number(u.quantity) : 1 })),
        laundryItems: item.laundryItems || [],
        vehicleType: normalizedVehicleType,
        specialInstructions: item.specialInstructions || '',
        // Carry UI display fields
        serviceName: item.serviceName || item.name || service.name,
        name: item.serviceName || item.name || service.name,
        image: item.image || item.img || service.image,
        packageName: item.packageName,
        packageDetails: item.packageDetails,
        includedFeatures: Array.isArray(item.includedFeatures) ? item.includedFeatures : [],
        type: item.type,
        category: item.category
      };

      // Do not merge; always add as separate line
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
