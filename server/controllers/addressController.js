import Address from '../models/Address.js';
import addressService from '../services/addressService.js';
import { bangalorePincodes } from '../utils/bangalorePincodes.js';

// Get user addresses
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id })
      .sort({ isDefault: -1, createdAt: -1 });

    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Get user addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message
    });
  }
};

// Reverse geocode coordinates to address
export const reverseGeocode = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const result = await addressService.reverseGeocode(latitude, longitude);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reverse geocode',
      error: error.message
    });
  }
};

// Search addresses by query
export const searchAddresses = async (req, res) => {
  try {
    const { query, limit } = req.query;

    if (!query || query.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 3 characters long'
      });
    }

    const result = await addressService.searchAddresses(query, limit);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Search addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search addresses',
      error: error.message
    });
  }
};

// Get address suggestions for autocomplete
export const getAddressSuggestions = async (req, res) => {
  try {
    const { query, limit } = req.query;

    if (!query || query.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 3 characters long'
      });
    }

    const result = await addressService.getAddressSuggestions(query, limit);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Address suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get address suggestions',
      error: error.message
    });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  try {
    const {
      type,
      fullAddress,
      latitude,
      longitude,
      city,
      state,
      pincode,
      landmark,
      isDefault
    } = req.body;

  // Validate address
    const validation = addressService.validateAddress({
      fullAddress,
      latitude,
      longitude,
      pincode
    });
    // Enforce serviceable area (unless DEV_MODE)
    if (process.env.DEV_MODE !== 'true') {
      if (!pincode || !bangalorePincodes.includes(pincode)) {
        return res.status(400).json({
          success: false,
          message: 'We currently serve only Bangalore areas — coming soon to your area!'
        });
      }
    }

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address data',
        errors: validation.errors
      });
    }

    // If setting as default, update other addresses
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id },
        { isDefault: false }
      );
    }

    const address = new Address({
      userId: req.user.id,
      type,
      fullAddress,
      latitude,
      longitude,
      city,
      state,
      pincode,
      landmark,
      isDefault: isDefault || false
    });

    await address.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message
    });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;

    const address = await Address.findOne({
      _id: addressId,
      userId: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        address[key] = updateData[key];
      }
    });

    // Enforce serviceable area on update (unless DEV_MODE)
    if (process.env.DEV_MODE !== 'true') {
      const pin = address.pincode || updateData.pincode;
      if (!pin || !bangalorePincodes.includes(pin)) {
        return res.status(400).json({
          success: false,
          message: 'We currently serve only Bangalore areas — coming soon to your area!'
        });
      }
    }

    await address.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOneAndDelete({
      _id: addressId,
      userId: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If deleted address was default, make another address default
    if (address.isDefault) {
      const firstAddress = await Address.findOne({ userId: req.user.id });
      if (firstAddress) {
        firstAddress.isDefault = true;
        await firstAddress.save();
      }
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    });
  }
};

// Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Check if address belongs to user
    const address = await Address.findOne({
      _id: addressId,
      userId: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Remove default from all user addresses
    await Address.updateMany(
      { userId: req.user.id },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.json({
      success: true,
      message: 'Default address updated successfully',
      data: address
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error.message
    });
  }
};

// Get address by ID
export const getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOne({
      _id: addressId,
      userId: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Get address by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch address',
      error: error.message
    });
  }
};
