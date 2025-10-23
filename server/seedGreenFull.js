// seed/seedGreenFull.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Branch from "../models/Branch.js";
import CleaningService from "../models/CleaningService.js";
import Provider from "../models/Provider.js";

dotenv.config();

const branches = [
  {
    name: "Koramangala Branch",
    lat: 12.9352,
    lng: 77.6245,
    address: "123 Inner Ring Road, Koramangala, Bengaluru",
    city: "Bengaluru",
    phone: "+919591572775",
  },
  {
    name: "Indiranagar Branch",
    lat: 12.9784,
    lng: 77.6408,
    address: "456 100 Feet Road, Indiranagar, Bengaluru",
    city: "Bengaluru",
    phone: "+919591572776",
  },
  {
    name: "Whitefield Branch",
    lat: 12.9698,
    lng: 77.7499,
    address: "789 ITPL Main Road, Whitefield, Bengaluru",
    city: "Bengaluru",
    phone: "+919591572777",
  },
  {
    name: "Jayanagar Branch",
    lat: 12.925,
    lng: 77.5838,
    address: "321 9th Block, Jayanagar, Bengaluru",
    city: "Bengaluru",
    phone: "+919591572778",
  },
  {
    name: "HSR Layout Branch",
    lat: 12.9116,
    lng: 77.6473,
    address: "654 27th Main, HSR Layout, Bengaluru",
    city: "Bengaluru",
    phone: "+919591572779",
  },
];

// =================== CLEANING SERVICES ===================
const services = [
  // 🏠 Home Cleaning
  {
    title: "1BHK Basic Clean",
    shortDescription: "Complete cleaning for your 1 bedroom apartment",
    longDescription:
      "Thorough cleaning of all rooms using eco-friendly materials including sweeping, dusting, bathroom sanitization, and kitchen counter cleaning. Ideal for regular monthly maintenance.",
    category: "home-cleaning",
    images: ["https://images.unsplash.com/photo-1581579184681-3e4f52d0a9a5"],
    features: [
      "Living room & bedroom dusting",
      "Kitchen counters cleaning",
      "Bathroom sanitization",
      "Floor mopping",
    ],
    durationMinutes: 120,
    basePrice: 599,
    priceRange: { min: 599, max: 899 },
    addons: [{ name: "Inside Fridge Clean", price: 199 }],
    tags: ["home", "basic", "1bhk"],
    sortOrder: 1,
    active: true,
  },
  {
    title: "2BHK Deep Clean",
    shortDescription: "Thorough deep cleaning for 2 bedroom home",
    longDescription:
      "A professional deep clean covering every inch of your 2BHK, including kitchens, bathrooms, balconies, and furniture. Recommended every 2-3 months.",
    category: "home-cleaning",
    images: ["https://images.unsplash.com/photo-1616627453931-d295d44d4973"],
    features: [
      "All rooms deep cleaned",
      "Kitchen appliances cleaning",
      "Balcony cleaning",
      "Window cleaning",
    ],
    durationMinutes: 180,
    basePrice: 999,
    priceRange: { min: 999, max: 1499 },
    addons: [{ name: "Balcony Glass Clean", price: 299 }],
    tags: ["home", "deep", "2bhk"],
    sortOrder: 2,
    active: true,
  },
  {
    title: "3BHK Premium Clean",
    shortDescription: "Complete premium cleaning for your large home",
    longDescription:
      "Top-tier service covering every surface, corner, and fixture with eco-friendly disinfectants and steam equipment. Includes full kitchen degreasing and bathroom anti-fungal treatment.",
    category: "home-cleaning",
    images: ["https://images.unsplash.com/photo-1616627562344-511111efb4c2"],
    features: [
      "Complete home deep clean",
      "Eco-friendly products",
      "Kitchen degreasing",
      "Bathroom anti-fungal treatment",
    ],
    durationMinutes: 240,
    basePrice: 1499,
    priceRange: { min: 1499, max: 2199 },
    addons: [{ name: "Curtain Wash", price: 499 }],
    tags: ["premium", "3bhk", "deep"],
    sortOrder: 3,
    active: true,
  },

  // 🛋️ Sofa & Carpet
  {
    title: "3-Seater Sofa Clean",
    shortDescription: "Professional sofa cleaning and stain removal",
    longDescription:
      "Deep vacuum and shampoo cleaning for sofas using fabric-safe and quick-dry solutions.",
    category: "sofa-carpet",
    images: ["https://images.unsplash.com/photo-1616627896780-4d2d759e3ef1"],
    features: [
      "Deep vacuum cleaning",
      "Stain removal",
      "Fabric protection",
      "Odor treatment",
    ],
    durationMinutes: 60,
    basePrice: 499,
    priceRange: { min: 499, max: 699 },
    addons: [{ name: "Fabric Protector Spray", price: 199 }],
    tags: ["sofa", "carpet", "upholstery"],
    sortOrder: 1,
    active: true,
  },
  {
    title: "Carpet Cleaning (Small)",
    shortDescription: "Professional carpet deep cleaning",
    longDescription:
      "Steam-based carpet cleaning removing dirt, bacteria, and odor using industrial-grade machines.",
    category: "sofa-carpet",
    images: ["https://images.unsplash.com/photo-1556228578-5e5e3a50bdb5"],
    features: [
      "Deep vacuum",
      "Stain removal",
      "Quick dry technology",
      "Anti-bacterial treatment",
    ],
    durationMinutes: 90,
    basePrice: 699,
    priceRange: { min: 699, max: 999 },
    addons: [{ name: "Deodorizer Spray", price: 99 }],
    tags: ["carpet", "floor", "vacuum"],
    sortOrder: 2,
    active: true,
  },
  {
    title: "Sofa + Carpet Combo",
    shortDescription: "Complete upholstery cleaning package",
    longDescription:
      "Save more with this combo pack for 3-seater sofa and medium carpet cleaning.",
    category: "sofa-carpet",
    images: ["https://images.unsplash.com/photo-1581579184681-3e4f52d0a9a5"],
    features: [
      "3-seater sofa cleaning",
      "Medium carpet cleaning",
      "Anti-bacterial treatment",
      "Free vacuum service",
    ],
    durationMinutes: 120,
    basePrice: 999,
    priceRange: { min: 999, max: 1399 },
    addons: [{ name: "Odor Control Treatment", price: 199 }],
    tags: ["combo", "upholstery", "cleaning"],
    sortOrder: 3,
    active: true,
  },

  // 🚿 Bathroom & Kitchen
  {
    title: "Bathroom Deep Clean",
    shortDescription: "Complete bathroom sanitization",
    longDescription:
      "Full bathroom cleaning with descaling, fungus removal, and drain cleaning using safe chemicals.",
    category: "bathroom-kitchen",
    images: ["https://images.unsplash.com/photo-1617098900591-3d30f4a8b8b7"],
    features: [
      "Tiles & grout cleaning",
      "Sink & fixtures polish",
      "Anti-fungal treatment",
      "Drain cleaning",
    ],
    durationMinutes: 60,
    basePrice: 399,
    priceRange: { min: 399, max: 599 },
    addons: [{ name: "Mirror Polish", price: 99 }],
    tags: ["bathroom", "sanitization"],
    sortOrder: 1,
    active: true,
  },
  {
    title: "Kitchen Deep Clean",
    shortDescription: "Professional kitchen cleaning service",
    longDescription:
      "Thorough cleaning of all kitchen surfaces, cabinets, chimneys, and appliances to remove grease and bacteria.",
    category: "bathroom-kitchen",
    images: ["https://images.unsplash.com/photo-1616627453931-d295d44d4973"],
    features: [
      "Chimney & stove cleaning",
      "Counter & cabinets",
      "Floor degreasing",
      "Sink sanitization",
    ],
    durationMinutes: 90,
    basePrice: 599,
    priceRange: { min: 599, max: 899 },
    addons: [{ name: "Fridge Interior Clean", price: 199 }],
    tags: ["kitchen", "cleaning", "degrease"],
    sortOrder: 2,
    active: true,
  },
  {
    title: "Kitchen + Bathroom Combo",
    shortDescription: "Full cleaning package for kitchen and bathroom",
    longDescription:
      "Perfect combo to keep the two most used spaces in your home sparkling clean.",
    category: "bathroom-kitchen",
    images: ["https://images.unsplash.com/photo-1623740066333-dc758c50e44c"],
    features: [
      "Both rooms deep cleaned",
      "Drain cleaning included",
      "Sanitization treatment",
      "Free descaling service",
    ],
    durationMinutes: 150,
    basePrice: 899,
    priceRange: { min: 899, max: 1199 },
    addons: [{ name: "Tile Sealant Application", price: 299 }],
    tags: ["combo", "bathroom", "kitchen"],
    sortOrder: 3,
    active: true,
  },

  // 🏢 Office Cleaning
  {
    title: "Small Office (500 sq ft)",
    shortDescription: "Professional workspace cleaning",
    longDescription:
      "Includes desks, floors, windows, pantry, and restroom cleaning for compact offices.",
    category: "office-cleaning",
    images: ["https://images.unsplash.com/photo-1600172454520-134b4e2fd7d5"],
    features: [
      "Desks & cabinets dusting",
      "Floor mopping",
      "Washroom cleaning",
      "Pantry cleaning",
    ],
    durationMinutes: 120,
    basePrice: 799,
    priceRange: { min: 799, max: 999 },
    addons: [{ name: "Carpet Vacuum", price: 249 }],
    tags: ["office", "workspace"],
    sortOrder: 1,
    active: true,
  },
  {
    title: "Medium Office (1000 sq ft)",
    shortDescription: "Complete office cleaning service",
    longDescription:
      "Comprehensive service for medium-sized offices with conference rooms and pantry.",
    category: "office-cleaning",
    images: ["https://images.unsplash.com/photo-1624325206770-d442c62b4c57"],
    features: [
      "Complete workspace",
      "Conference room cleaning",
      "Pantry & washrooms",
      "Window cleaning",
    ],
    durationMinutes: 180,
    basePrice: 1299,
    priceRange: { min: 1299, max: 1699 },
    addons: [{ name: "Glass Cleaning", price: 399 }],
    tags: ["office", "corporate"],
    sortOrder: 2,
    active: true,
  },
  {
    title: "Large Office (2000+ sq ft)",
    shortDescription: "Comprehensive office cleaning",
    longDescription:
      "All-inclusive cleaning package for large offices, including carpets, glass, and deep sanitization.",
    category: "office-cleaning",
    images: ["https://images.unsplash.com/photo-1616627562344-511111efb4c2"],
    features: [
      "All areas covered",
      "Carpet vacuuming",
      "Glass & window cleaning",
      "Deep sanitization",
    ],
    durationMinutes: 300,
    basePrice: 2499,
    priceRange: { min: 2499, max: 3199 },
    addons: [{ name: "Conference Room Polish", price: 499 }],
    tags: ["office", "enterprise"],
    sortOrder: 3,
    active: true,
  },
];

// =================== SEED SCRIPT ===================
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Branch.deleteMany({});
    await CleaningService.deleteMany({});
    console.log("🧹 Cleared Branch and CleaningService collections");

    const createdBranches = await Branch.insertMany(branches);
    console.log(`🏢 Inserted ${createdBranches.length} branches`);

    const createdServices = await CleaningService.insertMany(services);
    console.log(`🧽 Inserted ${createdServices.length} cleaning services`);

    console.log("\n🎉 Green & Clean full seed complete!");
    console.log(
      "👉 Sample Endpoints:\n   GET  /api/green/services\n   GET  /api/green/services/:id\n   POST /api/green/bookings"
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
