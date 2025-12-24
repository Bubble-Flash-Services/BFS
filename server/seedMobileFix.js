import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PhoneBrand from './models/PhoneBrand.js';
import PhoneModel from './models/PhoneModel.js';
import MobileFixPricing from './models/MobileFixPricing.js';

dotenv.config();

const brandsData = [
  { name: 'Samsung', displayOrder: 1 },
  { name: 'Apple', displayOrder: 2 },
  { name: 'Redmi', displayOrder: 3 },
  { name: 'Vivo', displayOrder: 4 },
  { name: 'Oppo', displayOrder: 5 },
  { name: 'OnePlus', displayOrder: 6 },
  { name: 'Realme', displayOrder: 7 },
  { name: 'Motorola', displayOrder: 8 },
  { name: 'Others', displayOrder: 9 },
];

const modelsData = {
  'Samsung': ['Galaxy S21', 'Galaxy S22', 'Galaxy S23', 'Galaxy A52', 'Galaxy A72', 'Galaxy M32'],
  'Apple': ['iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15', 'iPhone SE'],
  'Redmi': ['Note 10', 'Note 11', 'Note 12', '12C', '13C'],
  'Vivo': ['Y21', 'Y33', 'V25', 'V27', 'T2'],
  'Oppo': ['A77', 'A78', 'Reno 8', 'Reno 10'],
  'OnePlus': ['Nord CE 2', 'Nord 3', '11R', '12'],
  'Realme': ['Narzo 50', 'Narzo 60', '10', '11'],
  'Motorola': ['G62', 'G73', 'Edge 40'],
  'Others': ['Generic Model'],
};

const serviceTypes = [
  'screen-replacement',
  'battery-replacement',
  'charging-port-replacement',
  'speaker-microphone-replacement',
  'camera-glass-replacement',
  'phone-cleaning-diagnostics',
];

const pricingRanges = {
  'screen-replacement': { min: 1500, max: 8000, time: '30-45 minutes' },
  'battery-replacement': { min: 800, max: 2500, time: '20-30 minutes' },
  'charging-port-replacement': { min: 500, max: 1500, time: '20-30 minutes' },
  'speaker-microphone-replacement': { min: 600, max: 1800, time: '20-30 minutes' },
  'camera-glass-replacement': { min: 400, max: 1200, time: '15-25 minutes' },
  'phone-cleaning-diagnostics': { min: 299, max: 499, time: '30-40 minutes' },
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

    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await PhoneBrand.deleteMany({});
    await PhoneModel.deleteMany({});
    await MobileFixPricing.deleteMany({});

    console.log('Seeding phone brands...');
    const brands = await PhoneBrand.insertMany(brandsData);
    console.log(`Created ${brands.length} brands`);

    console.log('Seeding phone models...');
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

    console.log('Seeding pricing data...');
    const pricingData = [];
    
    for (const brand of brands) {
      const models = modelMap.get(brand.name) || [];
      
      for (const model of models) {
        for (const serviceType of serviceTypes) {
          const range = pricingRanges[serviceType];
          
          let price = getRandomPrice(range.min, range.max);
          
          if (brand.name === 'Apple') {
            price = Math.round(price * 1.5);
          } else if (brand.name === 'Samsung' || brand.name === 'OnePlus') {
            price = Math.round(price * 1.2);
          }

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

    console.log('\n✅ MobileFix Pro data seeded successfully!');
    console.log('\nSummary:');
    console.log(`- Brands: ${brands.length}`);
    console.log(`- Models: ${totalModels}`);
    console.log(`- Pricing entries: ${pricingData.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding MobileFix data:', error);
    process.exit(1);
  }
};

seedMobileFixData();
