import mongoose from "mongoose";
import Coupon from "./models/Coupon.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample coupons data
const sampleCoupons = [
  // Welcome Coupons
  {
    code: "BFSWELCOME10",
    name: "Welcome to BFS - 10% Off",
    description:
      "10% off on your first wash service. Welcome to Bubble Flash Services!",
    discountType: "percentage",
    discountValue: 10,
    minimumOrderAmount: 0,
    maximumDiscountAmount: 100,
    couponType: "welcome",
    targetAudience: "new_customers",
    autoApply: false,
    showOnHomepage: true,
    priority: 8,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    usageLimit: null,
    userUsageLimit: 1,
    isActive: true,
  },
  {
    code: "NEWFIRST50",
    name: "First Time Special",
    description:
      "Get ₹50 off on your first service with BFS. Start your journey with us!",
    discountType: "fixed",
    discountValue: 50,
    minimumOrderAmount: 200,
    couponType: "welcome",
    targetAudience: "new_customers",
    autoApply: false,
    showOnHomepage: true,
    priority: 7,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    usageLimit: 1000,
    userUsageLimit: 1,
    isActive: true,
  },

  // Festival & Seasonal Coupons
  {
    code: "DIWALI50",
    name: "Diwali Special Offer",
    description: "₹50 off during Diwali week. Celebrate with clean rides!",
    discountType: "fixed",
    discountValue: 50,
    minimumOrderAmount: 300,
    couponType: "festival_seasonal",
    targetAudience: "all_customers",
    autoApply: false,
    showOnHomepage: true,
    priority: 9,
    validFrom: new Date("2025-10-20"),
    validUntil: new Date("2025-11-05"),
    usageLimit: 500,
    userUsageLimit: 2,
    isActive: true,
  },
  {
    code: "SUMMERWASH20",
    name: "Summer Special - 20% Off",
    description:
      "20% off on car washes during summer. Beat the heat with clean cars!",
    discountType: "percentage",
    discountValue: 20,
    minimumOrderAmount: 400,
    maximumDiscountAmount: 200,
    couponType: "festival_seasonal",
    targetAudience: "all_customers",
    autoApply: false,
    showOnHomepage: true,
    priority: 8,
    validFrom: new Date("2025-03-01"),
    validUntil: new Date("2025-06-30"),
    usageLimit: null,
    userUsageLimit: 3,
    isActive: true,
  },

  // Referral Coupons
  {
    code: "REFER100",
    name: "Refer & Earn - ₹100 Off",
    description:
      "₹100 off for both you and your friend when they make their first booking!",
    discountType: "fixed",
    discountValue: 100,
    minimumOrderAmount: 250,
    couponType: "referral",
    targetAudience: "all_customers",
    autoApply: false,
    showOnHomepage: false,
    priority: 6,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    usageLimit: null,
    userUsageLimit: 5,
    isActive: true,
  },

  // Loyalty Coupons
  {
    code: "LOYAL20",
    name: "Loyalty Reward - 20% Off",
    description: "Thank you for being loyal! 20% off on your next wash.",
    discountType: "percentage",
    discountValue: 20,
    minimumOrderAmount: 200,
    maximumDiscountAmount: 150,
    couponType: "loyalty",
    targetAudience: "existing_customers",
    autoApply: true,
    showOnHomepage: false,
    priority: 7,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    usageLimit: null,
    userUsageLimit: 1,
    isActive: true,
  },
  {
    code: "VIP15",
    name: "VIP Customer - 15% Off",
    description:
      "Exclusive offer for our VIP customers. 15% off on all services.",
    discountType: "percentage",
    discountValue: 15,
    minimumOrderAmount: 500,
    maximumDiscountAmount: 300,
    couponType: "loyalty",
    targetAudience: "existing_customers",
    autoApply: false,
    showOnHomepage: false,
    priority: 6,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    usageLimit: null,
    userUsageLimit: 2,
    isActive: true,
  },

  // Minimum Order Value Coupons
  {
    code: "SAVE75",
    name: "Save Big - ₹75 Off",
    description:
      "₹75 off on orders above ₹500. Add more services and save more!",
    discountType: "fixed",
    discountValue: 75,
    minimumOrderAmount: 500,
    couponType: "minimum_order",
    targetAudience: "all_customers",
    autoApply: false,
    showOnHomepage: true,
    priority: 5,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    usageLimit: null,
    userUsageLimit: 3,
    isActive: true,
  },
  {
    code: "BUNDLE200",
    name: "Bundle Discount - ₹200 Off",
    description:
      "₹200 off on orders above ₹1000. Perfect for multiple services!",
    discountType: "fixed",
    discountValue: 200,
    minimumOrderAmount: 1000,
    couponType: "minimum_order",
    targetAudience: "all_customers",
    autoApply: false,
    showOnHomepage: true,
    priority: 6,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    usageLimit: null,
    userUsageLimit: 2,
    isActive: true,
  },

  // Limited Time Coupons
  {
    code: "FLASH30",
    name: "Flash Sale - 30% Off",
    description: "30% off for the next 24 hours only! Limited time offer.",
    discountType: "percentage",
    discountValue: 30,
    minimumOrderAmount: 300,
    maximumDiscountAmount: 250,
    couponType: "limited_time",
    targetAudience: "all_customers",
    autoApply: false,
    showOnHomepage: true,
    priority: 10,
    validFrom: new Date(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 1)),
    usageLimit: 100,
    userUsageLimit: 1,
    isActive: true,
  },
  {
    code: "WEEKEND25",
    name: "Weekend Special - 25% Off",
    description: "25% off this weekend only. Book now before it expires!",
    discountType: "percentage",
    discountValue: 25,
    minimumOrderAmount: 400,
    maximumDiscountAmount: 300,
    couponType: "limited_time",
    targetAudience: "all_customers",
    autoApply: false,
    showOnHomepage: true,
    priority: 9,
    validFrom: new Date(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 7)),
    usageLimit: 200,
    userUsageLimit: 1,
    isActive: true,
  },

  // Service-Specific Coupons
  {
    code: "BIKE20",
    name: "Bike Wash Special - 20% Off",
    description:
      "20% off on bike wash services only. Keep your bike sparkling!",
    discountType: "percentage",
    discountValue: 20,
    minimumOrderAmount: 150,
    maximumDiscountAmount: 100,
    couponType: "service_specific",
    targetAudience: "all_customers",
    autoApply: false,
    showOnHomepage: false,
    priority: 5,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    usageLimit: null,
    userUsageLimit: 3,
    isActive: true,
  },
  {
    code: "LAUNDRY50",
    name: "Laundry Special - ₹50 Off",
    description: "₹50 off on laundry services. Fresh clothes, great savings!",
    discountType: "fixed",
    discountValue: 50,
    minimumOrderAmount: 200,
    couponType: "service_specific",
    targetAudience: "all_customers",
    autoApply: false,
    showOnHomepage: false,
    priority: 5,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    usageLimit: null,
    userUsageLimit: 4,
    isActive: true,
  },
  {
    code: "CARWASH15",
    name: "Car Wash Special - 15% Off",
    description: "15% off on all car wash packages. Drive with pride!",
    discountType: "percentage",
    discountValue: 15,
    minimumOrderAmount: 300,
    maximumDiscountAmount: 200,
    couponType: "service_specific",
    targetAudience: "all_customers",
    autoApply: false,
    showOnHomepage: false,
    priority: 5,
    validFrom: new Date(),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    usageLimit: null,
    userUsageLimit: 3,
    isActive: true,
  },
];

// Seed function
const seedCoupons = async () => {
  try {
    await connectDB(); // ✅ Must await
    console.log("Connected to MongoDB, proceeding to clear coupons");

    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log("Cleared existing coupons");

    // Insert new coupons
    sampleCoupons.forEach((c) => {
      if (!c.couponType) console.log("Missing couponType:", c);
    });

    const createdCoupons = await Coupon.insertMany(sampleCoupons);
    console.log(`✅ Successfully created ${createdCoupons.length} coupons`);

    // Display created coupons
    console.log("\n📋 Created Coupons:");
    createdCoupons.forEach((coupon) => {
      console.log(`- ${coupon.code}: ${coupon.name} (${coupon.couponType})`);
    });

    console.log("\n🎉 Coupon seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding coupons:", error);
    process.exit(1);
  }
};

// Run the seed function
seedCoupons();
