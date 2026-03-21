import express from "express";
import MoversPackers from "../models/MoversPackers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Price calculation helper
function calculatePrice(moveType, homeSize, vehicleShifting, extraServices) {
  // Base prices for different home sizes and move types
  const basePrices = {
    "within-city": {
      "1BHK": 3500,
      "2BHK": 5500,
      "3BHK": 7500,
      "4BHK": 10000,
      Villa: 15000,
    },
    intercity: {
      "1BHK": 8000,
      "2BHK": 12000,
      "3BHK": 16000,
      "4BHK": 22000,
      Villa: 35000,
    },
  };

  let basePrice = basePrices[moveType]?.[homeSize] || 5000;
  let vehicleShiftingCost = 0;
  let paintingCost = 0;

  // Calculate vehicle shifting cost
  if (vehicleShifting?.required && vehicleShifting?.vehicles?.length > 0) {
    const vehiclePrices = {
      Car: moveType === "within-city" ? 1500 : 4000,
      Bike: moveType === "within-city" ? 800 : 2000,
      Scooter: moveType === "within-city" ? 700 : 1800,
      Others: moveType === "within-city" ? 1000 : 2500,
    };

    vehicleShifting.vehicles.forEach((vehicle) => {
      const count = vehicle.count || 1;
      const pricePerVehicle = vehiclePrices[vehicle.type] || 1000;
      vehicleShiftingCost += pricePerVehicle * count;
    });
  }

  // Calculate painting cost
  if (extraServices?.painting?.required) {
    const painting = extraServices.painting;
    let basePaintingCost = 0;
    
    // Package-based pricing
    if (painting.packageType) {
      const packagePrices = {
        "basic-touch-up": {
          "1BHK": 3000,
          "2BHK": 4500,
          "3BHK": 6000,
          "4BHK": 8000,
          Villa: 12000,
        },
        "standard-room": {
          "1BHK": 8000,
          "2BHK": 12000,
          "3BHK": 16000,
          "4BHK": 20000,
          Villa: 30000,
        },
        "premium-full": {
          "1BHK": 15000,
          "2BHK": 22000,
          "3BHK": 30000,
          "4BHK": 40000,
          Villa: 60000,
        },
        "rental-vacate": {
          "1BHK": 10000,
          "2BHK": 15000,
          "3BHK": 20000,
          "4BHK": 26000,
          Villa: 40000,
        },
      };
      basePaintingCost = packagePrices[painting.packageType]?.[homeSize] || 10000;
      
      // Add move type multiplier
      if (painting.paintingType === 'both') {
        basePaintingCost *= 1.8; // Discount for both move-out and move-in
      } else if (painting.paintingType === 'move-out') {
        basePaintingCost *= 0.9; // Slight discount for move-out only
      }
    }
    
    // Room-based pricing (alternative to package pricing - uses higher value)
    if (painting.rooms && painting.rooms.length > 0) {
      const DEFAULT_ROOM_RATE = 15; // Default rate per sq.ft for room-based pricing
      let roomBasedCost = 0;
      painting.rooms.forEach(room => {
        if (room.squareFeet) {
          const scopeMultiplier = room.paintingScope === 'touch-up' ? 0.4 : 1;
          roomBasedCost += room.squareFeet * DEFAULT_ROOM_RATE * scopeMultiplier;
        }
      });
      // Use the higher of package or room-based pricing
      if (roomBasedCost > basePaintingCost) {
        basePaintingCost = roomBasedCost;
      }
    }
    
    // Per square feet pricing override (only if explicitly provided with custom rate)
    // This allows for custom per-sq-ft pricing that overrides package pricing
    if (painting.totalSquareFeet && painting.perSqFtRate) {
      const customSqFtCost = painting.totalSquareFeet * painting.perSqFtRate;
      // Use custom sq.ft pricing if higher than package/room pricing
      if (customSqFtCost > basePaintingCost) {
        basePaintingCost = customSqFtCost;
      }
    }
    
    // Set the painting cost
    paintingCost = basePaintingCost;
    
    // Add legacy service costs if specified (these are always additive)
    const paintingServices = painting.services;
    if (paintingServices) {
      if (paintingServices.interiorPainting) {
        const interiorPrices = {
          "1BHK": 8000,
          "2BHK": 12000,
          "3BHK": 16000,
          "4BHK": 20000,
          Villa: 30000,
        };
        paintingCost += interiorPrices[homeSize] || 10000;
      }
      if (paintingServices.exteriorPainting) {
        const exteriorPrices = {
          "1BHK": 5000,
          "2BHK": 7000,
          "3BHK": 9000,
          "4BHK": 12000,
          Villa: 18000,
        };
        paintingCost += exteriorPrices[homeSize] || 7000;
      }
      if (paintingServices.woodPolishing) {
        paintingCost += 3000; // Flat rate for wood polishing
      }
    }
  }

  // Calculate cleaning cost
  let cleaningCost = 0;
  if (extraServices?.cleaning?.required) {
    const cleaning = extraServices.cleaning;
    const cleaningPrices = {
      "basic-cleaning": {
        "1BHK": 2000,
        "2BHK": 3000,
        "3BHK": 4000,
        "4BHK": 5000,
        Villa: 8000,
      },
      "deep-cleaning": {
        "1BHK": 5000,
        "2BHK": 7000,
        "3BHK": 9000,
        "4BHK": 12000,
        Villa: 18000,
      },
      "move-in-cleaning": {
        "1BHK": 3000,
        "2BHK": 4500,
        "3BHK": 6000,
        "4BHK": 8000,
        Villa: 12000,
      },
      "move-out-cleaning": {
        "1BHK": 3000,
        "2BHK": 4500,
        "3BHK": 6000,
        "4BHK": 8000,
        Villa: 12000,
      },
    };
    cleaningCost = cleaningPrices[cleaning.cleaningType]?.[homeSize] || 3000;
  }

  const totalPrice = basePrice + vehicleShiftingCost + paintingCost + cleaningCost;

  return {
    basePrice,
    vehicleShiftingCost,
    paintingCost,
    cleaningCost,
    totalPrice,
  };
}

// Create a new booking
router.post("/booking", authenticateToken, async (req, res) => {
  try {
    const {
      moveType,
      homeSize,
      sourceCity,
      destinationCity,
      movingDate,
      vehicleShifting,
      extraServices,
      contactPhone,
      contactEmail,
      customerNotes,
      user,
    } = req.body;

    // Validate required fields
    if (
      !moveType ||
      !homeSize ||
      !sourceCity ||
      !destinationCity ||
      !movingDate ||
      !contactPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate moveType
    const validMoveTypes = ["within-city", "intercity"];
    if (!validMoveTypes.includes(moveType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid move type. Must be either within-city or intercity",
      });
    }

    // Validate homeSize
    const validHomeSizes = ["1BHK", "2BHK", "3BHK", "4BHK", "Villa"];
    if (!validHomeSizes.includes(homeSize)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid home size. Must be one of: 1BHK, 2BHK, 3BHK, 4BHK, Villa",
      });
    }

    // Validate moving date (should be in future)
    const selectedDate = new Date(movingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Moving date must be in the future",
      });
    }

    // Calculate pricing
    const estimatedPrice = calculatePrice(
      moveType,
      homeSize,
      vehicleShifting,
      extraServices
    );

    // Create booking
    const booking = new MoversPackers({
      userId: user._id,
      moveType,
      homeSize,
      sourceCity,
      destinationCity,
      movingDate: selectedDate,
      vehicleShifting,
      extraServices,
      contactPhone,
      contactEmail,
      customerNotes,
      estimatedPrice,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        bookingId: booking._id,
        estimatedPrice: booking.estimatedPrice,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
});

// Get price quote without creating booking
router.post("/quote", async (req, res) => {
  try {
    const { moveType, homeSize, vehicleShifting, extraServices } = req.body;

    if (!moveType || !homeSize) {
      return res.status(400).json({
        success: false,
        message: "Move type and home size are required",
      });
    }

    // Validate moveType
    const validMoveTypes = ["within-city", "intercity"];
    if (!validMoveTypes.includes(moveType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid move type. Must be either within-city or intercity",
      });
    }

    // Validate homeSize
    const validHomeSizes = ["1BHK", "2BHK", "3BHK", "4BHK", "Villa"];
    if (!validHomeSizes.includes(homeSize)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid home size. Must be one of: 1BHK, 2BHK, 3BHK, 4BHK, Villa",
      });
    }

    const estimatedPrice = calculatePrice(
      moveType,
      homeSize,
      vehicleShifting,
      extraServices
    );

    res.json({
      success: true,
      data: estimatedPrice,
    });
  } catch (error) {
    console.error("Error calculating quote:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate quote",
      error: error.message,
    });
  }
});

// Get user's bookings
router.get("/my-bookings", authenticateToken, async (req, res) => {
  try {
    const bookings = await MoversPackers.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("-__v");
    console.log(req);
    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
});

// Get specific booking details
router.get("/booking/:id", authenticateToken, async (req, res) => {
  try {
    const booking = await MoversPackers.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
});

// Cancel booking
// router.patch("/booking/:id/cancel", authenticateToken, async (req, res) => {
router.patch("/booking/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const booking = await MoversPackers.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed booking",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
});

export default router;
