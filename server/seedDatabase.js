import mongoose from "mongoose";
import ServiceCategory from "./models/ServiceCategory.js";
import Service from "./models/Service.js";
import Package from "./models/Package.js";
import AddOn from "./models/AddOn.js";
import Coupon from "./models/Coupon.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await ServiceCategory.deleteMany({});
    await Service.deleteMany({});
    await Package.deleteMany({});
    await AddOn.deleteMany({});
    await Coupon.deleteMany({});

    console.log("Cleared existing data");

    // Create Service Categories
    const categories = await ServiceCategory.insertMany([
      {
        name: "Car Wash",
        description: "Professional car cleaning and detailing services",
        image: "/car/home.png",
        icon: "🚗",
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Bike Wash",
        description: "Complete bike cleaning and maintenance services",
        image: "/bike/home.png",
        icon: "🏍️",
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Laundry Service",
        description: "Professional laundry and dry cleaning services",
        image: "/laundry/home.png",
        icon: "👕",
        isActive: true,
        sortOrder: 3,
      },
    ]);

    console.log("Created service categories");

    // Create Services
    const services = await Service.insertMany([
      // Car Services
      {
        categoryId: categories[0]._id,
        name: "Basic Car Wash",
        description: "Exterior wash with high-pressure water gun and soap",
        basePrice: 199,
        estimatedDuration: 30,
        image: "/car/car1.png",
        features: [
          "Exterior wash with high-pressure watergun",
          "Soft-touch mild soap",
          "Swirl-free clean",
          "Deep-cleaning of car mats",
        ],
        isActive: true,
        sortOrder: 1,
      },
      {
        categoryId: categories[0]._id,
        name: "Premium Car Wash",
        description:
          "Complete car cleaning with interior and exterior detailing",
        basePrice: 399,
        estimatedDuration: 60,
        image: "/car/car2.png",
        features: [
          "Complete exterior wash",
          "Interior vacuum cleaning",
          "Dashboard cleaning",
          "Tyre shine",
          "Glass cleaning",
        ],
        isActive: true,
        sortOrder: 2,
      },
      // Bike Services
      {
        categoryId: categories[1]._id,
        name: "Basic Bike Wash",
        description: "Complete bike cleaning service",
        basePrice: 99,
        estimatedDuration: 20,
        image: "/bike/bike1.png",
        features: [
          "Gentle exterior water wash",
          "Wheel cleaning with specialized wheel cleaner",
          "High-pressure tyre wash for spotless finish",
        ],
        isActive: true,
        sortOrder: 1,
      },
      {
        categoryId: categories[1]._id,
        name: "Premium Bike Detailing",
        description: "Complete bike detailing with engine cleaning",
        basePrice: 199,
        estimatedDuration: 45,
        image: "/bike/bike2.png",
        features: [
          "Complete exterior wash",
          "Engine cleaning",
          "Chain lubrication",
          "Polish and shine",
        ],
        isActive: true,
        sortOrder: 2,
      },
      // Laundry Services
      {
        categoryId: categories[2]._id,
        name: "laundry",
        description: "Generic laundry service",
        basePrice: 5, // per piece
        estimatedDuration: 1440, // 24 hours
        image: "/laundry/home.png",
        features: [
          "Professional washing",
          "Quality service",
          "Fresh fragrance",
        ],
        isActive: true,
        sortOrder: 0,
      },
      {
        categoryId: categories[2]._id,
        name: "Wash & Fold",
        description: "Regular laundry wash and fold service",
        basePrice: 5, // per piece
        estimatedDuration: 1440, // 24 hours
        image: "/laundry/laundry1.png",
        features: [
          "Professional washing",
          "Neat folding",
          "Fresh fragrance",
          "Quality detergents",
        ],
        isActive: true,
        sortOrder: 1,
      },
      {
        categoryId: categories[2]._id,
        name: "Dry Cleaning",
        description: "Professional dry cleaning service",
        basePrice: 15, // per piece
        estimatedDuration: 2880, // 48 hours
        image: "/laundry/laundry2.png",
        features: [
          "Professional dry cleaning",
          "Stain removal",
          "Pressing included",
          "Protective covering",
        ],
        isActive: true,
        sortOrder: 2,
      },
    ]);

    console.log("Created services");

    // Create Packages
    const packages = await Package.insertMany([
      // Car Packages
      {
        service: services[0]._id, // Basic Car Wash
        name: "Quick Shine",
        description: "Quick exterior wash for busy schedules",
        price: 199,
        originalPrice: 249,
        discountPercentage: 20,
        duration: 30,
        features: [
          "Exterior wash with high-pressure watergun",
          "Soft-touch mild soap",
          "Swirl-free clean",
          "Deep-cleaning of car mats",
        ],
        packageType: "basic",
        vehicleTypes: ["car", "hatchback", "sedan"],
        isActive: true,
        sortOrder: 1,
      },
      {
        service: services[1]._id, // Premium Car Wash
        name: "Complete Care",
        description: "Comprehensive car cleaning inside and out",
        price: 399,
        originalPrice: 499,
        discountPercentage: 20,
        duration: 60,
        features: [
          "Complete exterior wash",
          "Interior vacuum cleaning",
          "Dashboard cleaning",
          "Tyre shine",
          "Glass cleaning",
          "Air freshener",
        ],
        packageType: "premium",
        vehicleTypes: ["car", "hatchback", "sedan", "suv"],
        isActive: true,
        sortOrder: 2,
      },
      // Bike Packages
      {
        service: services[2]._id, // Basic Bike Wash
        name: "Shine Bike",
        description: "Quick and effective bike cleaning",
        price: 99,
        originalPrice: 129,
        discountPercentage: 23,
        duration: 20,
        features: [
          "Gentle exterior water wash",
          "Wheel cleaning with specialized wheel cleaner",
          "High-pressure tyre wash for spotless finish",
        ],
        packageType: "basic",
        vehicleTypes: ["bike"],
        isActive: true,
        sortOrder: 1,
      },
      {
        service: services[3]._id, // Premium Bike Detailing
        name: "Pro Detailing",
        description: "Complete bike detailing service",
        price: 199,
        originalPrice: 249,
        discountPercentage: 20,
        duration: 45,
        features: [
          "Complete exterior wash",
          "Engine cleaning",
          "Chain lubrication",
          "Polish and shine",
          "Protective coating",
        ],
        packageType: "premium",
        vehicleTypes: ["bike"],
        isActive: true,
        sortOrder: 2,
      },
    ]);

    console.log("Created packages");

    // Create Add-ons
    const addOns = await AddOn.insertMany([
      {
        name: "Car Spray",
        description: "Premium car spray for extra shine",
        price: 99,
        duration: 5,
        categoryId: categories[0]._id,
        applicableServices: [services[0]._id, services[1]._id],
        image: "/aboutus/car-spray.png",
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Interior Deep Clean",
        description: "Deep cleaning of car interior",
        price: 149,
        duration: 15,
        categoryId: categories[0]._id,
        applicableServices: [services[1]._id],
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Engine Wash",
        description: "Professional engine cleaning",
        price: 199,
        duration: 20,
        categoryId: categories[0]._id,
        applicableServices: [services[1]._id],
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "Chain Lubrication",
        description: "Professional chain cleaning and lubrication",
        price: 49,
        duration: 10,
        categoryId: categories[1]._id,
        applicableServices: [services[2]._id, services[3]._id],
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Express Service",
        description: "Same day pickup and delivery",
        price: 99,
        duration: 0,
        categoryId: categories[2]._id,
        applicableServices: [services[4]._id, services[5]._id],
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Ironing Service",
        description: "Professional ironing and pressing",
        price: 29,
        duration: 0,
        categoryId: categories[2]._id,
        applicableServices: [services[4]._id],
        isActive: true,
        sortOrder: 2,
      },
    ]);

    console.log("Created add-ons");

    // Create Coupons
    const coupons = await Coupon.insertMany([
      {
        code: "WELCOME20",
        name: "Welcome Offer",
        description: "Get 20% off on your first order",
        discountType: "percentage",
        discountValue: 20,
        minimumOrderAmount: 199,
        maximumDiscountAmount: 100,
        couponType: "welcome", // ✅ Add this
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usageLimit: 1000,
        userUsageLimit: 1,
        isActive: true,
      },
      {
        code: "SAVE50",
        name: "Save ₹50",
        description: "Flat ₹50 off on orders above ₹300",
        discountType: "fixed",
        discountValue: 50,
        minimumOrderAmount: 300,
        couponType: "minimum_order", // ✅ Add this
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        userUsageLimit: 3,
        isActive: true,
      },
      {
        code: "WEEKEND25",
        name: "Weekend Special",
        description: "25% off on weekend bookings",
        discountType: "percentage",
        discountValue: 25,
        minimumOrderAmount: 250,
        maximumDiscountAmount: 150,
        couponType: "limited_time", // ✅ Add this
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageLimit: null,
        userUsageLimit: 5,
        isActive: true,
      },
    ]);

    console.log("Created coupons");

    console.log("✅ Database seeded successfully!");
    console.log("\n📊 Created:");
    console.log(`   - ${categories.length} service categories`);
    console.log(`   - ${services.length} services`);
    console.log(`   - ${packages.length} packages`);
    console.log(`   - ${addOns.length} add-ons`);
    console.log(`   - ${coupons.length} coupons`);

    console.log("\n🎟️ Sample Coupons:");
    coupons.forEach((coupon) => {
      console.log(`   - ${coupon.code}: ${coupon.description}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
