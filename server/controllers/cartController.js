import Cart from '../models/Cart.js';
import Service from '../models/Service.js';
import Package from '../models/Package.js';
import AddOn from '../models/AddOn.js';

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
      specialInstructions
    } = req.body;

    // Validate service exists
    const service = await Service.findById(serviceId);
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
      item.serviceId.toString() === serviceId &&
      (packageId ? item.packageId?.toString() === packageId : !item.packageId)
    );

    const cartItem = {
      serviceId,
      packageId: packageId || null,
      quantity,
      price,
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
