import Address from '../models/Address.js';

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

    // Validate required fields
    if (!fullAddress) {
      return res.status(400).json({
        success: false,
        message: 'Full address is required'
      });
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
