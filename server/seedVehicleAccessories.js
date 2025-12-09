import mongoose from 'mongoose';
import dotenv from 'dotenv';
import VehicleAccessory from './models/VehicleAccessory.js';

dotenv.config();

const vehicleAccessoriesData = [
  // CAR ACCESSORIES
  {
    category: 'car',
    subcategory: 'Interior',
    name: 'Premium Leather Seat Covers',
    description: 'High-quality leather seat covers with diamond stitching pattern. Universal fit for most car models. Water-resistant and easy to clean. Provides excellent protection for your original seats.',
    shortDescription: 'Premium leather covers with diamond stitching',
    basePrice: 2499,
    discountPrice: 1999,
    inStock: true,
    stockQuantity: 50,
    rating: 4.5,
    reviewCount: 234,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500'
    ],
    features: [
      'Premium PU leather material',
      'Diamond stitching pattern',
      'Universal fit for most cars',
      'Water and stain resistant',
      'Easy installation',
      'Available in multiple colors'
    ],
    specifications: new Map([
      ['Material', 'Premium PU Leather'],
      ['Pattern', 'Diamond Stitching'],
      ['Fit Type', 'Universal'],
      ['Colors Available', 'Black, Beige, Brown, Grey'],
      ['Warranty', '1 Year']
    ]),
    variants: [
      { name: 'Standard (₹799)', priceModifier: -1700, inStock: true },
      { name: 'Premium (₹1,499)', priceModifier: -1000, inStock: true },
      { name: 'Luxury (₹2,499)', priceModifier: 0, inStock: true }
    ],
    tags: ['seat covers', 'interior', 'leather', 'protection'],
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    sortOrder: 1
  },
  {
    category: 'car',
    subcategory: 'Interior',
    name: '3D Car Floor Mats',
    description: 'Custom fit 3D floor mats with raised edges to trap dirt, water, and debris. Made from durable TPE material that is odorless and eco-friendly.',
    shortDescription: 'Custom fit 3D mats with raised edges',
    basePrice: 1999,
    discountPrice: 1599,
    inStock: true,
    stockQuantity: 75,
    rating: 4.7,
    reviewCount: 456,
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=500'
    ],
    features: [
      'Custom fit design',
      '3D raised edges',
      'TPE eco-friendly material',
      'Odorless and non-toxic',
      'Easy to clean',
      'Anti-slip backing'
    ],
    specifications: new Map([
      ['Material', 'TPE (Thermoplastic Elastomer)'],
      ['Edge Height', '15mm'],
      ['Fit Type', 'Vehicle Specific'],
      ['Warranty', '2 Years']
    ]),
    variants: [
      { name: 'Basic (₹599)', priceModifier: -1400, inStock: true },
      { name: 'Premium (₹1,299)', priceModifier: -700, inStock: true },
      { name: 'Luxury 3D (₹1,999)', priceModifier: 0, inStock: true }
    ],
    tags: ['floor mats', 'interior', '3D', 'protection'],
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    sortOrder: 2
  },
  {
    category: 'car',
    subcategory: 'Cleaning',
    name: 'Dashboard Cleaner & Protectant',
    description: 'All-in-one dashboard cleaner and protectant spray. Removes dust, grime, and fingerprints while leaving a protective shine. UV protection formula prevents cracking.',
    shortDescription: 'Cleans and protects dashboard',
    basePrice: 199,
    discountPrice: null,
    inStock: true,
    stockQuantity: 200,
    rating: 4.3,
    reviewCount: 189,
    images: [
      'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500'
    ],
    features: [
      'Cleans and shines',
      'UV protection',
      'Anti-static formula',
      'Pleasant fragrance',
      'Safe for all surfaces',
      '500ml bottle'
    ],
    specifications: new Map([
      ['Volume', '500ml'],
      ['Scent', 'Fresh Lemon'],
      ['Safe For', 'Dashboard, Console, Door Panels']
    ]),
    tags: ['cleaner', 'dashboard', 'interior', 'detailing'],
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    sortOrder: 3
  },
  {
    category: 'car',
    subcategory: 'Fragrance',
    name: 'Premium Car Perfume - Ocean Breeze',
    description: 'Long-lasting car air freshener with premium fragrance oils. Elegant design that complements your car interior. Lasts up to 60 days.',
    shortDescription: 'Long-lasting premium car fragrance',
    basePrice: 399,
    discountPrice: 299,
    inStock: true,
    stockQuantity: 150,
    rating: 4.4,
    reviewCount: 312,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500'
    ],
    features: [
      'Long-lasting up to 60 days',
      'Premium fragrance oils',
      'Elegant design',
      'Adjustable intensity',
      'Multiple scents available'
    ],
    specifications: new Map([
      ['Duration', '60 days'],
      ['Scent', 'Ocean Breeze'],
      ['Volume', '8ml']
    ]),
    variants: [
      { name: 'Ocean Breeze (₹149)', priceModifier: -250, inStock: true },
      { name: 'Fresh Lemon (₹199)', priceModifier: -200, inStock: true },
      { name: 'Premium Collection (₹399)', priceModifier: 0, inStock: true }
    ],
    tags: ['perfume', 'fragrance', 'air freshener', 'interior'],
    isNew: true,
    isFeatured: false,
    isOnSale: true,
    sortOrder: 4
  },
  {
    category: 'car',
    subcategory: 'Cleaning',
    name: 'Foam Wash Upgrade Kit',
    description: 'Professional grade foam wash concentrate for a thick, clinging foam that lifts dirt away. Includes applicator bottle and microfiber cloth.',
    shortDescription: 'Professional foam wash kit',
    basePrice: 299,
    discountPrice: null,
    inStock: true,
    stockQuantity: 100,
    rating: 4.6,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    features: [
      'Thick clinging foam',
      'pH balanced formula',
      'Safe for all paints',
      'Includes applicator',
      'Microfiber cloth included',
      'Makes 20 washes'
    ],
    specifications: new Map([
      ['Volume', '500ml concentrate'],
      ['Dilution Ratio', '1:20'],
      ['pH Level', 'Neutral'],
      ['Washes', '20+']
    ]),
    tags: ['foam wash', 'cleaning', 'exterior', 'detailing'],
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    sortOrder: 5
  },
  {
    category: 'car',
    subcategory: 'Cleaning',
    name: 'Microfiber Cloths 3-Pack',
    description: 'Ultra-soft microfiber cleaning cloths for scratch-free cleaning. Perfect for interior and exterior detailing. Highly absorbent and reusable.',
    shortDescription: '3-pack ultra-soft microfiber cloths',
    basePrice: 299,
    discountPrice: null,
    inStock: true,
    stockQuantity: 300,
    rating: 4.8,
    reviewCount: 567,
    images: [
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500'
    ],
    features: [
      'Ultra-soft 400 GSM',
      'Scratch-free cleaning',
      'Highly absorbent',
      'Lint-free finish',
      'Machine washable',
      '3 cloths per pack'
    ],
    specifications: new Map([
      ['GSM', '400'],
      ['Size', '40x40 cm'],
      ['Quantity', '3 pieces'],
      ['Material', 'Microfiber 80/20 blend']
    ]),
    tags: ['microfiber', 'cloth', 'cleaning', 'detailing'],
    isNew: false,
    isFeatured: true,
    isOnSale: false,
    sortOrder: 6
  },
  {
    category: 'car',
    subcategory: 'Exterior',
    name: 'Tyre Shine Spray',
    description: 'Premium tyre shine spray that restores deep black color to tyres. Water-based formula that protects against cracking and fading. Non-greasy finish.',
    shortDescription: 'Restores deep black tyre shine',
    basePrice: 249,
    discountPrice: null,
    inStock: true,
    stockQuantity: 180,
    rating: 4.2,
    reviewCount: 234,
    images: [
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500'
    ],
    features: [
      'Deep black shine',
      'Water-based formula',
      'UV protection',
      'Non-greasy finish',
      'Long-lasting shine',
      'Easy spray application'
    ],
    specifications: new Map([
      ['Volume', '400ml'],
      ['Finish', 'Matte/Gloss adjustable'],
      ['Duration', '2-4 weeks']
    ]),
    tags: ['tyre', 'shine', 'exterior', 'detailing'],
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    sortOrder: 7
  },
  {
    category: 'car',
    subcategory: 'Cleaning',
    name: 'Windshield Washer Fluid',
    description: 'Premium windshield washer fluid with bug remover formula. Clears dirt, bugs, and grime for crystal clear visibility. Safe for all washer systems.',
    shortDescription: 'Premium washer fluid with bug remover',
    basePrice: 149,
    discountPrice: null,
    inStock: true,
    stockQuantity: 250,
    rating: 4.1,
    reviewCount: 178,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    features: [
      'Bug remover formula',
      'Streak-free cleaning',
      'Safe for all systems',
      'Pleasant fragrance',
      'Ready to use',
      '1 liter bottle'
    ],
    specifications: new Map([
      ['Volume', '1 Liter'],
      ['Type', 'Ready to use'],
      ['Safe For', 'All washer systems']
    ]),
    tags: ['windshield', 'washer', 'fluid', 'cleaning'],
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    sortOrder: 8
  },

  // BIKE ACCESSORIES
  {
    category: 'bike',
    subcategory: 'Maintenance',
    name: 'Premium Chain Lube',
    description: 'High-performance chain lubricant for motorcycles. Penetrates deep into chain links for smooth operation. Water-resistant formula for all weather riding.',
    shortDescription: 'High-performance chain lubricant',
    basePrice: 249,
    discountPrice: null,
    inStock: true,
    stockQuantity: 120,
    rating: 4.6,
    reviewCount: 289,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    features: [
      'Deep penetrating formula',
      'Water resistant',
      'Reduces friction',
      'Extends chain life',
      'Easy spray application',
      '150ml can'
    ],
    specifications: new Map([
      ['Volume', '150ml'],
      ['Type', 'Spray'],
      ['Weather', 'All weather']
    ]),
    tags: ['chain', 'lube', 'maintenance', 'bike'],
    isNew: false,
    isFeatured: true,
    isOnSale: false,
    sortOrder: 9
  },
  {
    category: 'bike',
    subcategory: 'Safety',
    name: 'Helmet Visor Replacement',
    description: 'Universal fit replacement visor for most helmet brands. Anti-scratch and anti-fog coating. Crystal clear visibility in all conditions.',
    shortDescription: 'Universal replacement visor',
    basePrice: 899,
    discountPrice: 699,
    inStock: true,
    stockQuantity: 80,
    rating: 4.3,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    features: [
      'Anti-scratch coating',
      'Anti-fog treated',
      'UV protection',
      'Crystal clear visibility',
      'Easy installation',
      'Universal fit'
    ],
    specifications: new Map([
      ['Material', 'Polycarbonate'],
      ['Coating', 'Anti-scratch, Anti-fog'],
      ['Fit', 'Universal']
    ]),
    variants: [
      { name: 'Clear (₹399)', priceModifier: -500, inStock: true },
      { name: 'Tinted (₹599)', priceModifier: -300, inStock: true },
      { name: 'Iridium (₹899)', priceModifier: 0, inStock: true }
    ],
    tags: ['visor', 'helmet', 'safety', 'replacement'],
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    sortOrder: 10
  },
  {
    category: 'bike',
    subcategory: 'Protection',
    name: 'Premium Bike Cover',
    description: 'Heavy-duty bike cover with waterproof coating. Protects against sun, rain, and dust. Features reflective strips for night visibility.',
    shortDescription: 'Waterproof heavy-duty bike cover',
    basePrice: 1299,
    discountPrice: 999,
    inStock: true,
    stockQuantity: 90,
    rating: 4.5,
    reviewCount: 234,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    features: [
      '100% waterproof',
      'UV resistant',
      'Dust proof',
      'Reflective strips',
      'Elastic bottom hem',
      'Storage bag included'
    ],
    specifications: new Map([
      ['Material', 'Oxford 210D'],
      ['Waterproof Rating', 'IPX4'],
      ['Size', 'Universal fit up to 200cc']
    ]),
    variants: [
      { name: 'Standard (₹599)', priceModifier: -700, inStock: true },
      { name: 'Premium (₹999)', priceModifier: -300, inStock: true },
      { name: 'Heavy Duty (₹1,299)', priceModifier: 0, inStock: true }
    ],
    tags: ['cover', 'protection', 'waterproof', 'bike'],
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    sortOrder: 11
  },
  {
    category: 'bike',
    subcategory: 'Comfort',
    name: 'Ergonomic Handle Grips',
    description: 'Comfortable anti-slip handle grips with ergonomic design. Reduces hand fatigue on long rides. Universal fit for most bikes.',
    shortDescription: 'Anti-slip ergonomic grips',
    basePrice: 199,
    discountPrice: null,
    inStock: true,
    stockQuantity: 200,
    rating: 4.4,
    reviewCount: 345,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    features: [
      'Ergonomic design',
      'Anti-slip texture',
      'Reduces vibration',
      'Soft rubber compound',
      'Easy installation',
      'Universal fit'
    ],
    specifications: new Map([
      ['Material', 'TPR Rubber'],
      ['Length', '130mm'],
      ['Inner Diameter', '22mm']
    ]),
    tags: ['grips', 'handle', 'comfort', 'bike'],
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    sortOrder: 12
  },
  {
    category: 'bike',
    subcategory: 'Accessories',
    name: 'Universal Phone Holder',
    description: 'Secure phone holder for bikes and scooters. 360° rotation with one-hand operation. Fits phones from 4.7" to 6.8".',
    shortDescription: 'Secure 360° rotating phone mount',
    basePrice: 299,
    discountPrice: null,
    inStock: true,
    stockQuantity: 150,
    rating: 4.5,
    reviewCount: 456,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    features: [
      '360° rotation',
      'One-hand operation',
      'Anti-shake design',
      'Universal fit',
      'Fits 4.7" to 6.8" phones',
      'Quick release'
    ],
    specifications: new Map([
      ['Compatible Phones', '4.7" - 6.8"'],
      ['Rotation', '360°'],
      ['Mount Type', 'Handlebar clamp']
    ]),
    tags: ['phone holder', 'mount', 'accessories', 'bike'],
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    sortOrder: 13
  },

  // COMMON ACCESSORIES
  {
    category: 'common',
    subcategory: 'Tools',
    name: 'Digital Tyre Pressure Gauge',
    description: 'Accurate digital tyre pressure gauge with backlit LCD display. Works for cars, bikes, and bicycles. Auto shut-off to save battery.',
    shortDescription: 'Accurate digital pressure gauge',
    basePrice: 399,
    discountPrice: null,
    inStock: true,
    stockQuantity: 100,
    rating: 4.7,
    reviewCount: 567,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    features: [
      'Digital LCD display',
      'Backlit screen',
      '±1 PSI accuracy',
      'Multiple units (PSI, BAR, KPA)',
      'Auto shut-off',
      'Includes battery'
    ],
    specifications: new Map([
      ['Range', '0-150 PSI'],
      ['Accuracy', '±1 PSI'],
      ['Display', 'LCD with backlight'],
      ['Battery', 'CR2032 (included)']
    ]),
    tags: ['pressure gauge', 'tyre', 'tools', 'common'],
    isNew: false,
    isFeatured: true,
    isOnSale: false,
    sortOrder: 14
  },
  {
    category: 'common',
    subcategory: 'Cleaning',
    name: 'Cleaning Brush Set',
    description: 'Complete set of 5 detailing brushes for all cleaning needs. Different sizes and stiffness for various surfaces. Durable bristles that won\'t scratch.',
    shortDescription: '5-piece detailing brush set',
    basePrice: 349,
    discountPrice: null,
    inStock: true,
    stockQuantity: 120,
    rating: 4.4,
    reviewCount: 234,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    features: [
      '5 different brush sizes',
      'Soft and stiff options',
      'Ergonomic handles',
      'Won\'t scratch surfaces',
      'Great for tight spaces',
      'Durable construction'
    ],
    specifications: new Map([
      ['Pieces', '5'],
      ['Bristle Types', 'Soft, Medium, Stiff'],
      ['Handle', 'Rubber grip']
    ]),
    tags: ['brush', 'cleaning', 'detailing', 'common'],
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    sortOrder: 15
  },
  {
    category: 'common',
    subcategory: 'Detailing',
    name: 'Premium Polishing Wax',
    description: 'Carnauba-based polishing wax for a deep, glossy shine. Provides long-lasting protection against UV rays and environmental damage.',
    shortDescription: 'Carnauba wax for deep shine',
    basePrice: 449,
    discountPrice: null,
    inStock: true,
    stockQuantity: 80,
    rating: 4.6,
    reviewCount: 345,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    features: [
      'Pure Carnauba wax',
      'Deep glossy shine',
      'UV protection',
      'Water beading effect',
      'Easy application',
      'Lasts 3-4 months'
    ],
    specifications: new Map([
      ['Weight', '200g'],
      ['Type', 'Paste wax'],
      ['Duration', '3-4 months'],
      ['Application', 'By hand or machine']
    ]),
    tags: ['wax', 'polish', 'shine', 'detailing'],
    isNew: false,
    isFeatured: true,
    isOnSale: false,
    sortOrder: 16
  }
];

const seedVehicleAccessories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing accessories
    await VehicleAccessory.deleteMany({});
    console.log('Cleared existing vehicle accessories');

    // Convert specifications Map to object for each accessory
    const processedData = vehicleAccessoriesData.map(acc => ({
      ...acc,
      specifications: Object.fromEntries(acc.specifications)
    }));

    // Insert new accessories
    const accessories = await VehicleAccessory.insertMany(processedData);
    
    console.log('✅ Vehicle accessories seeded successfully!');
    console.log(`   - Total accessories: ${accessories.length}`);
    console.log(`   - Car accessories: ${accessories.filter(a => a.category === 'car').length}`);
    console.log(`   - Bike accessories: ${accessories.filter(a => a.category === 'bike').length}`);
    console.log(`   - Common accessories: ${accessories.filter(a => a.category === 'common').length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding vehicle accessories:', error);
    process.exit(1);
  }
};

seedVehicleAccessories();
