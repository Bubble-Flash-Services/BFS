import MoversPackers from '../models/MoversPackers.js';

// Get all movers & packers services
export const getMoversPackersServices = async (req, res) => {
  try {
    const services = await MoversPackers.find({ active: true }).sort({ sortOrder: 1 });
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching movers & packers services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// Get movers & packers service by ID
export const getMoversPackersServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await MoversPackers.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching movers & packers service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
};

// Get services by item type
export const getServicesByItemType = async (req, res) => {
  try {
    const { itemType } = req.params;
    const services = await MoversPackers.find({ 
      itemType, 
      active: true 
    }).sort({ sortOrder: 1 });
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services by item type:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// Calculate price based on distance
export const calculatePrice = async (req, res) => {
  try {
    const { serviceId, distance } = req.body;
    
    if (!serviceId || distance === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Service ID and distance are required'
      });
    }

    const service = await MoversPackers.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    let totalPrice = service.basePrice;
    let distanceCharge = 0;

    // Calculate distance charge if beyond base distance
    if (distance > service.baseDistance) {
      const extraDistance = distance - service.baseDistance;
      
      // Find applicable distance charge tier
      let chargeApplied = false;
      for (const tier of service.distanceCharges) {
        if (distance > tier.rangeStart && distance <= tier.rangeEnd) {
          distanceCharge = tier.charge;
          chargeApplied = true;
          break;
        }
      }
      
      // If distance is beyond all defined ranges (30+ km), calculate at ₹10/km
      if (!chargeApplied && distance > 30) {
        distanceCharge = 350 + (distance - 30) * 10; // Base 350 for up to 30km + ₹10 per additional km
      }
      
      totalPrice += distanceCharge;
    }

    res.json({
      success: true,
      data: {
        serviceId,
        serviceName: service.name,
        basePrice: service.basePrice,
        distance,
        distanceCharge,
        totalPrice
      }
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate price',
      error: error.message
    });
  }
};
