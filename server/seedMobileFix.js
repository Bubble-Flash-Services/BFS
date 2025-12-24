import mongoose from "mongoose";
import dotenv from "dotenv";
import PhoneBrand from "./models/PhoneBrand.js";
import PhoneModel from "./models/PhoneModel.js";
import MobileFixPricing from "./models/MobileFixPricing.js";

dotenv.config();

const brandsData = [
  { name: "Samsung", displayOrder: 1 },
  { name: "Apple", displayOrder: 2 },
  { name: "Redmi", displayOrder: 3 },
  { name: "Vivo", displayOrder: 4 },
  { name: "Oppo", displayOrder: 5 },
  { name: "OnePlus", displayOrder: 6 },
  { name: "Realme", displayOrder: 7 },
  { name: "Motorola", displayOrder: 8 },
  { name: "Others", displayOrder: 9 },
];

const modelsData = {
  Samsung: [
    // Galaxy S Series (Flagship)
    "Galaxy S24 Ultra",
    "Galaxy S24+",
    "Galaxy S24",
    "Galaxy S23 Ultra",
    "Galaxy S23+",
    "Galaxy S23",
    "Galaxy S23 FE",
    "Galaxy S22 Ultra",
    "Galaxy S22+",
    "Galaxy S22",
    "Galaxy S21 Ultra",
    "Galaxy S21+",
    "Galaxy S21",
    "Galaxy S21 FE",
    "Galaxy S20 Ultra",
    "Galaxy S20+",
    "Galaxy S20",
    "Galaxy S20 FE",
    // Galaxy Z Series (Foldable)
    "Galaxy Z Fold 5",
    "Galaxy Z Fold 4",
    "Galaxy Z Fold 3",
    "Galaxy Z Flip 5",
    "Galaxy Z Flip 4",
    "Galaxy Z Flip 3",
    // Galaxy A Series (Mid-range)
    "Galaxy A54 5G",
    "Galaxy A53 5G",
    "Galaxy A52",
    "Galaxy A52s 5G",
    "Galaxy A51",
    "Galaxy A34 5G",
    "Galaxy A33 5G",
    "Galaxy A32",
    "Galaxy A31",
    "Galaxy A24",
    "Galaxy A23",
    "Galaxy A22",
    "Galaxy A21s",
    "Galaxy A14",
    "Galaxy A13",
    "Galaxy A12",
    "Galaxy A11",
    "Galaxy A04",
    "Galaxy A04s",
    "Galaxy A03",
    "Galaxy A03s",
    // Galaxy M Series (Online)
    "Galaxy M54 5G",
    "Galaxy M53 5G",
    "Galaxy M52 5G",
    "Galaxy M51",
    "Galaxy M34 5G",
    "Galaxy M33 5G",
    "Galaxy M32",
    "Galaxy M31",
    "Galaxy M14 5G",
    "Galaxy M13",
    "Galaxy M12",
    "Galaxy M11",
    "Galaxy M04",
    "Galaxy M03",
    // Galaxy F Series
    "Galaxy F54 5G",
    "Galaxy F53 5G",
    "Galaxy F52 5G",
    "Galaxy F34 5G",
    "Galaxy F33 5G",
    "Galaxy F32",
    "Galaxy F31",
    "Galaxy F14 5G",
    "Galaxy F13",
    "Galaxy F12",
    "Galaxy F04",
  ],
  Apple: [
    // iPhone 15 Series
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    // iPhone 14 Series
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    // iPhone 13 Series
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 mini",
    // iPhone 12 Series
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 12 mini",
    // iPhone 11 Series
    "iPhone 11 Pro Max",
    "iPhone 11 Pro",
    "iPhone 11",
    // iPhone XS/XR Series
    "iPhone XS Max",
    "iPhone XS",
    "iPhone XR",
    "iPhone X",
    // iPhone SE Series
    "iPhone SE (2022)",
    "iPhone SE (2020)",
    // Older Models
    "iPhone 8 Plus",
    "iPhone 8",
    "iPhone 7 Plus",
    "iPhone 7",
    "iPhone 6s Plus",
    "iPhone 6s",
    "iPhone 6 Plus",
    "iPhone 6",
  ],
  Redmi: [
    // Redmi Note Series
    "Redmi Note 13 Pro+",
    "Redmi Note 13 Pro",
    "Redmi Note 13",
    "Redmi Note 12 Pro+",
    "Redmi Note 12 Pro",
    "Redmi Note 12",
    "Redmi Note 12S",
    "Redmi Note 11 Pro+",
    "Redmi Note 11 Pro",
    "Redmi Note 11",
    "Redmi Note 11S",
    "Redmi Note 10 Pro Max",
    "Redmi Note 10 Pro",
    "Redmi Note 10",
    "Redmi Note 10S",
    "Redmi Note 9 Pro Max",
    "Redmi Note 9 Pro",
    "Redmi Note 9",
    "Redmi Note 9S",
    "Redmi Note 8 Pro",
    "Redmi Note 8",
    "Redmi Note 7 Pro",
    "Redmi Note 7",
    // Redmi K Series
    "Redmi K70 Pro",
    "Redmi K70",
    "Redmi K60 Pro",
    "Redmi K60",
    "Redmi K50i",
    "Redmi K40",
    "Redmi K30 Pro",
    "Redmi K20 Pro",
    // Redmi Number Series
    "Redmi 13C",
    "Redmi 12C",
    "Redmi 12",
    "Redmi 12 5G",
    "Redmi 11 Prime",
    "Redmi 10",
    "Redmi 10 Prime",
    "Redmi 10A",
    "Redmi 9",
    "Redmi 9 Prime",
    "Redmi 9A",
    "Redmi 9i",
    "Redmi 8",
    "Redmi 8A",
    "Redmi 7",
    "Redmi 7A",
    "Redmi A3",
    "Redmi A2",
    "Redmi A1",
  ],
  Vivo: [
    // Vivo V Series
    "Vivo V30 Pro",
    "Vivo V30",
    "Vivo V29 Pro",
    "Vivo V29",
    "Vivo V27 Pro",
    "Vivo V27",
    "Vivo V25 Pro",
    "Vivo V25",
    "Vivo V23 Pro",
    "Vivo V23",
    "Vivo V21",
    "Vivo V20",
    // Vivo X Series (Flagship)
    "Vivo X100 Pro",
    "Vivo X100",
    "Vivo X90 Pro",
    "Vivo X90",
    "Vivo X80 Pro",
    "Vivo X80",
    "Vivo X70 Pro+",
    "Vivo X70 Pro",
    "Vivo X70",
    "Vivo X60 Pro+",
    "Vivo X60 Pro",
    "Vivo X60",
    // Vivo Y Series
    "Vivo Y100",
    "Vivo Y56 5G",
    "Vivo Y55 5G",
    "Vivo Y36",
    "Vivo Y35",
    "Vivo Y33T",
    "Vivo Y33s",
    "Vivo Y27",
    "Vivo Y22",
    "Vivo Y21",
    "Vivo Y20",
    "Vivo Y19",
    "Vivo Y17",
    "Vivo Y16",
    "Vivo Y15",
    "Vivo Y12",
    "Vivo Y02",
    "Vivo Y01",
    // Vivo T Series
    "Vivo T3 5G",
    "Vivo T2 Pro 5G",
    "Vivo T2 5G",
    "Vivo T2x 5G",
    "Vivo T1 Pro 5G",
    "Vivo T1 5G",
    "Vivo T1x",
    // Vivo S Series
    "Vivo S1 Pro",
    "Vivo S1",
  ],
  Oppo: [
    // Oppo Find Series (Flagship)
    "Oppo Find X7 Ultra",
    "Oppo Find X7",
    "Oppo Find X6 Pro",
    "Oppo Find X6",
    "Oppo Find X5 Pro",
    "Oppo Find X5",
    "Oppo Find X3 Pro",
    "Oppo Find X3",
    "Oppo Find N3",
    "Oppo Find N2",
    "Oppo Find N",
    // Oppo Reno Series
    "Oppo Reno 11 Pro",
    "Oppo Reno 11",
    "Oppo Reno 10 Pro+",
    "Oppo Reno 10 Pro",
    "Oppo Reno 10",
    "Oppo Reno 9 Pro",
    "Oppo Reno 9",
    "Oppo Reno 8 Pro",
    "Oppo Reno 8",
    "Oppo Reno 8T",
    "Oppo Reno 7 Pro",
    "Oppo Reno 7",
    "Oppo Reno 6 Pro",
    "Oppo Reno 6",
    "Oppo Reno 6Z",
    "Oppo Reno 5 Pro",
    "Oppo Reno 5",
    "Oppo Reno 4 Pro",
    "Oppo Reno 4",
    "Oppo Reno 3 Pro",
    "Oppo Reno 3",
    "Oppo Reno 2",
    "Oppo Reno",
    // Oppo F Series
    "Oppo F23 5G",
    "Oppo F21 Pro",
    "Oppo F21s Pro",
    "Oppo F19 Pro+",
    "Oppo F19 Pro",
    "Oppo F19",
    "Oppo F17 Pro",
    "Oppo F17",
    "Oppo F15",
    "Oppo F11 Pro",
    "Oppo F11",
    // Oppo A Series
    "Oppo A3 Pro",
    "Oppo A79 5G",
    "Oppo A78 5G",
    "Oppo A77 5G",
    "Oppo A77",
    "Oppo A59 5G",
    "Oppo A58",
    "Oppo A57",
    "Oppo A56",
    "Oppo A55",
    "Oppo A54",
    "Oppo A53",
    "Oppo A52",
    "Oppo A51",
    "Oppo A39",
    "Oppo A38",
    "Oppo A37",
    "Oppo A17",
    "Oppo A16",
    "Oppo A15",
  ],
  OnePlus: [
    // OnePlus Flagship Series
    "OnePlus 12",
    "OnePlus 12R",
    "OnePlus 11",
    "OnePlus 11R",
    "OnePlus 10 Pro",
    "OnePlus 10T",
    "OnePlus 10R",
    "OnePlus 9 Pro",
    "OnePlus 9",
    "OnePlus 9R",
    "OnePlus 9RT",
    "OnePlus 8 Pro",
    "OnePlus 8T",
    "OnePlus 8",
    "OnePlus 7 Pro",
    "OnePlus 7T Pro",
    "OnePlus 7T",
    "OnePlus 7",
    "OnePlus 6T",
    "OnePlus 6",
    "OnePlus 5T",
    "OnePlus 5",
    // OnePlus Nord Series
    "OnePlus Nord 3",
    "OnePlus Nord 2T",
    "OnePlus Nord 2",
    "OnePlus Nord",
    "OnePlus Nord CE 4",
    "OnePlus Nord CE 3",
    "OnePlus Nord CE 2",
    "OnePlus Nord CE",
    "OnePlus Nord CE 3 Lite",
    "OnePlus Nord CE 2 Lite",
    "OnePlus Nord N30",
    "OnePlus Nord N20",
    "OnePlus Nord N10",
    // OnePlus Ace Series
    "OnePlus Ace 3",
    "OnePlus Ace 2 Pro",
    "OnePlus Ace 2",
    "OnePlus Ace",
  ],
  Realme: [
    // Realme Number Series
    "Realme 12 Pro+",
    "Realme 12 Pro",
    "Realme 12",
    "Realme 12+",
    "Realme 11 Pro+",
    "Realme 11 Pro",
    "Realme 11",
    "Realme 11x",
    "Realme 10 Pro+",
    "Realme 10 Pro",
    "Realme 10",
    "Realme 10s",
    "Realme 9 Pro+",
    "Realme 9 Pro",
    "Realme 9",
    "Realme 9i",
    "Realme 9 5G",
    "Realme 8 Pro",
    "Realme 8",
    "Realme 8 5G",
    "Realme 8i",
    "Realme 8s",
    "Realme 7 Pro",
    "Realme 7",
    "Realme 7i",
    "Realme 6 Pro",
    "Realme 6",
    "Realme 6i",
    // Realme GT Series (Flagship)
    "Realme GT 5 Pro",
    "Realme GT 5",
    "Realme GT 3",
    "Realme GT 2 Pro",
    "Realme GT 2",
    "Realme GT Neo 5",
    "Realme GT Neo 3T",
    "Realme GT Neo 3",
    "Realme GT Neo 2",
    "Realme GT Master Edition",
    "Realme GT",
    // Realme Narzo Series
    "Realme Narzo 70 Pro",
    "Realme Narzo 70",
    "Realme Narzo 70x",
    "Realme Narzo 60 Pro",
    "Realme Narzo 60",
    "Realme Narzo 60x",
    "Realme Narzo 50 Pro",
    "Realme Narzo 50",
    "Realme Narzo 50i",
    "Realme Narzo 50A",
    "Realme Narzo 30 Pro",
    "Realme Narzo 30",
    "Realme Narzo 30A",
    "Realme Narzo 20 Pro",
    "Realme Narzo 20",
    "Realme Narzo 20A",
    // Realme C Series
    "Realme C67",
    "Realme C65",
    "Realme C55",
    "Realme C53",
    "Realme C51",
    "Realme C35",
    "Realme C33",
    "Realme C31",
    "Realme C30",
    "Realme C25",
    "Realme C21",
    "Realme C20",
    "Realme C15",
    "Realme C12",
    "Realme C11",
  ],
  Motorola: [
    // Motorola Edge Series (Flagship)
    "Motorola Edge 40 Pro",
    "Motorola Edge 40",
    "Motorola Edge 40 Neo",
    "Motorola Edge 30 Ultra",
    "Motorola Edge 30 Pro",
    "Motorola Edge 30",
    "Motorola Edge 30 Fusion",
    "Motorola Edge 20 Pro",
    "Motorola Edge 20",
    "Motorola Edge 20 Fusion",
    "Motorola Edge+",
    "Motorola Edge",
    // Motorola Razr Series (Foldable)
    "Motorola Razr 40 Ultra",
    "Motorola Razr 40",
    "Motorola Razr 2022",
    "Motorola Razr 5G",
    // Motorola G Series
    "Motorola Moto G84 5G",
    "Motorola Moto G73 5G",
    "Motorola Moto G72",
    "Motorola Moto G71",
    "Motorola Moto G62 5G",
    "Motorola Moto G61",
    "Motorola Moto G60",
    "Motorola Moto G52",
    "Motorola Moto G51 5G",
    "Motorola Moto G50",
    "Motorola Moto G42",
    "Motorola Moto G41",
    "Motorola Moto G40 Fusion",
    "Motorola Moto G32",
    "Motorola Moto G31",
    "Motorola Moto G30",
    "Motorola Moto G24",
    "Motorola Moto G23",
    "Motorola Moto G22",
    "Motorola Moto G14",
    "Motorola Moto G13",
    "Motorola Moto G12",
    "Motorola Moto G04",
    // Motorola E Series
    "Motorola Moto E13",
    "Motorola Moto E32",
    "Motorola Moto E22",
    "Motorola Moto E20",
    // Motorola One Series
    "Motorola One Fusion+",
    "Motorola One Fusion",
    "Motorola One Vision",
  ],
  Others: [
    "Generic Model",
    "Xiaomi Mi 11",
    "Xiaomi Mi 10",
    "Poco X6 Pro",
    "Poco X5 Pro",
    "Poco F5",
    "Poco M6 Pro",
    "Poco C65",
    "Google Pixel 8 Pro",
    "Google Pixel 7a",
    "Google Pixel 6",
    "Nothing Phone 2",
    "Nothing Phone 1",
    "Asus ROG Phone 7",
    "Asus Zenfone 10",
    "Sony Xperia 1 V",
    "Sony Xperia 5 IV",
    "Tecno Phantom X2",
    "Tecno Camon 20",
    "Infinix Note 30",
    "Infinix Hot 30",
    "Lava Blaze 5G",
    "Micromax In Note 2",
    "Nokia G42",
    "Nokia G21",
    "HTC U23 Pro",
    "LG Wing",
    "Huawei P60 Pro",
    "Honor 90",
  ],
};

const serviceTypes = [
  "screen-replacement",
  "battery-replacement",
  "charging-port-replacement",
  "speaker-microphone-replacement",
  "camera-glass-replacement",
  "phone-cleaning-diagnostics",
];

const pricingRanges = {
  "screen-replacement": { min: 1500, max: 8000, time: "30-45 minutes" },
  "battery-replacement": { min: 800, max: 2500, time: "20-30 minutes" },
  "charging-port-replacement": { min: 500, max: 1500, time: "20-30 minutes" },
  "speaker-microphone-replacement": {
    min: 600,
    max: 1800,
    time: "20-30 minutes",
  },
  "camera-glass-replacement": { min: 400, max: 1200, time: "15-25 minutes" },
  "phone-cleaning-diagnostics": { min: 299, max: 499, time: "30-40 minutes" },
};

// Brand-specific pricing multipliers
const BRAND_PRICE_MULTIPLIERS = {
  Apple: 1.5, // Premium pricing for Apple devices
  Samsung: 1.2, // Higher pricing for Samsung flagship devices
  OnePlus: 1.2, // Higher pricing for OnePlus devices
};

const getRandomPrice = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) / 100) * 100;
};

const seedMobileFixData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 20000,
    });

    console.log("Connected to MongoDB");

    console.log("Clearing existing data...");
    await PhoneBrand.deleteMany({});
    await PhoneModel.deleteMany({});
    await MobileFixPricing.deleteMany({});

    console.log("Seeding phone brands...");
    const brands = await PhoneBrand.insertMany(brandsData);
    console.log(`Created ${brands.length} brands`);

    console.log("Seeding phone models...");
    let totalModels = 0;
    const modelMap = new Map();

    for (const brand of brands) {
      const brandModels = modelsData[brand.name] || [];
      const models = brandModels.map((modelName, index) => ({
        brandId: brand._id,
        name: modelName,
        displayOrder: index,
      }));

      if (models.length > 0) {
        const createdModels = await PhoneModel.insertMany(models);
        totalModels += createdModels.length;
        modelMap.set(brand.name, createdModels);
      }
    }
    console.log(`Created ${totalModels} models`);

    console.log("Seeding pricing data...");
    const pricingData = [];

    for (const brand of brands) {
      const models = modelMap.get(brand.name) || [];

      for (const model of models) {
        for (const serviceType of serviceTypes) {
          const range = pricingRanges[serviceType];

          let price = getRandomPrice(range.min, range.max);

          // Apply brand-specific pricing multiplier
          const multiplier = BRAND_PRICE_MULTIPLIERS[brand.name] || 1.0;
          price = Math.round(price * multiplier);

          pricingData.push({
            modelId: model._id,
            serviceType,
            price,
            estimatedTime: range.time,
          });
        }
      }
    }

    if (pricingData.length > 0) {
      await MobileFixPricing.insertMany(pricingData);
      console.log(`Created ${pricingData.length} pricing entries`);
    }

    console.log("\n✅ MobileFix Pro data seeded successfully!");
    console.log("\nSummary:");
    console.log(`- Brands: ${brands.length}`);
    console.log(`- Models: ${totalModels}`);
    console.log(`- Pricing entries: ${pricingData.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding MobileFix data:", error);
    process.exit(1);
  }
};

seedMobileFixData();
