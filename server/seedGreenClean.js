import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Branch from './models/Branch.js';
import GreenService from './models/GreenService.js';
import Provider from './models/Provider.js';

dotenv.config();

// Sample branches (5 locations in Bangalore)
const branches = [
  {
    name: 'Koramangala Branch',
    lat: 12.9352,
    lng: 77.6245,
    address: '123 Inner Ring Road, Koramangala, Bengaluru',
    city: 'Bengaluru',
    phone: '+919591572775'
  },
  {
    name: 'Indiranagar Branch',
    lat: 12.9784,
    lng: 77.6408,
    address: '456 100 Feet Road, Indiranagar, Bengaluru',
    city: 'Bengaluru',
    phone: '+919591572776'
  },
  {
    name: 'Whitefield Branch',
    lat: 12.9698,
    lng: 77.7499,
    address: '789 ITPL Main Road, Whitefield, Bengaluru',
    city: 'Bengaluru',
    phone: '+919591572777'
  },
  {
    name: 'Jayanagar Branch',
    lat: 12.9250,
    lng: 77.5838,
    address: '321 9th Block, Jayanagar, Bengaluru',
    city: 'Bengaluru',
    phone: '+919591572778'
  },
  {
    name: 'HSR Layout Branch',
    lat: 12.9116,
    lng: 77.6473,
    address: '654 27th Main, HSR Layout, Bengaluru',
    city: 'Bengaluru',
    phone: '+919591572779'
  }
];

// Sample green services
const greenServices = [
  // Home Cleaning
  {
    category: 'home-cleaning',
    title: '1BHK Basic Clean',
    description: 'Complete cleaning for your 1 bedroom apartment',
    durationMinutes: 120,
    basePrice: 599,
    features: [
      'Living room & bedroom dusting',
      'Kitchen counters cleaning',
      'Bathroom sanitization',
      'Floor mopping'
    ],
    active: true,
    sortOrder: 1
  },
  {
    category: 'home-cleaning',
    title: '2BHK Deep Clean',
    description: 'Thorough deep cleaning for 2 bedroom home',
    durationMinutes: 180,
    basePrice: 999,
    features: [
      'All rooms deep cleaned',
      'Kitchen appliances cleaning',
      'Balcony cleaning',
      'Window cleaning'
    ],
    active: true,
    sortOrder: 2
  },
  {
    category: 'home-cleaning',
    title: '3BHK Premium Clean',
    description: 'Complete premium cleaning service',
    durationMinutes: 240,
    basePrice: 1499,
    features: [
      'Complete home deep clean',
      'Eco-friendly products',
      'Kitchen degreasing',
      'Bathroom anti-fungal treatment'
    ],
    active: true,
    sortOrder: 3
  },
  // Sofa & Carpet
  {
    category: 'sofa-carpet',
    title: '3-Seater Sofa Clean',
    description: 'Professional sofa cleaning and stain removal',
    durationMinutes: 60,
    basePrice: 499,
    features: [
      'Deep vacuum cleaning',
      'Stain removal',
      'Fabric protection',
      'Odor treatment'
    ],
    active: true,
    sortOrder: 1
  },
  {
    category: 'sofa-carpet',
    title: 'Carpet Cleaning (Small)',
    description: 'Professional carpet deep cleaning',
    durationMinutes: 90,
    basePrice: 699,
    features: [
      'Deep vacuum',
      'Stain removal',
      'Quick dry technology',
      'Anti-bacterial treatment'
    ],
    active: true,
    sortOrder: 2
  },
  {
    category: 'sofa-carpet',
    title: 'Sofa + Carpet Combo',
    description: 'Complete upholstery cleaning package',
    durationMinutes: 120,
    basePrice: 999,
    features: [
      '3-seater sofa cleaning',
      'Medium carpet cleaning',
      'Anti-bacterial treatment',
      'Free vacuum service'
    ],
    active: true,
    sortOrder: 3
  },
  // Bathroom & Kitchen
  {
    category: 'bathroom-kitchen',
    title: 'Bathroom Deep Clean',
    description: 'Complete bathroom sanitization',
    durationMinutes: 60,
    basePrice: 399,
    features: [
      'Tiles & grout cleaning',
      'Sink & fixtures polish',
      'Anti-fungal treatment',
      'Drain cleaning'
    ],
    active: true,
    sortOrder: 1
  },
  {
    category: 'bathroom-kitchen',
    title: 'Kitchen Deep Clean',
    description: 'Professional kitchen cleaning service',
    durationMinutes: 90,
    basePrice: 599,
    features: [
      'Chimney & stove cleaning',
      'Counter & cabinets',
      'Floor degreasing',
      'Sink sanitization'
    ],
    active: true,
    sortOrder: 2
  },
  {
    category: 'bathroom-kitchen',
    title: 'Kitchen + Bathroom Combo',
    description: 'Complete kitchen and bathroom package',
    durationMinutes: 150,
    basePrice: 899,
    features: [
      'Both rooms deep cleaned',
      'Drain cleaning included',
      'Sanitization treatment',
      'Free descaling service'
    ],
    active: true,
    sortOrder: 3
  },
  // Office Cleaning
  {
    category: 'office-cleaning',
    title: 'Small Office (500 sq ft)',
    description: 'Professional workspace cleaning',
    durationMinutes: 120,
    basePrice: 799,
    features: [
      'Desks & cabinets dusting',
      'Floor mopping',
      'Washroom cleaning',
      'Pantry cleaning'
    ],
    active: true,
    sortOrder: 1
  },
  {
    category: 'office-cleaning',
    title: 'Medium Office (1000 sq ft)',
    description: 'Complete office cleaning service',
    durationMinutes: 180,
    basePrice: 1299,
    features: [
      'Complete workspace',
      'Conference room cleaning',
      'Pantry & washrooms',
      'Window cleaning'
    ],
    active: true,
    sortOrder: 2
  },
  {
    category: 'office-cleaning',
    title: 'Large Office (2000+ sq ft)',
    description: 'Comprehensive office cleaning',
    durationMinutes: 300,
    basePrice: 2499,
    features: [
      'All areas covered',
      'Carpet vacuuming',
      'Glass & window cleaning',
      'Deep sanitization'
    ],
    active: true,
    sortOrder: 3
  }
];

async function seedGreenData() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing Green & Clean data...');
    await Branch.deleteMany({});
    await GreenService.deleteMany({});
    await Provider.deleteMany({}); // Be careful in production!
    console.log('✅ Cleared existing data');

    // Seed branches
    console.log('🏢 Seeding branches...');
    const createdBranches = await Branch.insertMany(branches);
    console.log(`✅ Created ${createdBranches.length} branches`);

    // Seed services
    console.log('🧹 Seeding green services...');
    const createdServices = await GreenService.insertMany(greenServices);
    console.log(`✅ Created ${createdServices.length} services`);

    // Create sample providers
    console.log('👷 Creating sample providers...');
    const sampleProviders = [
      {
        name: 'Rajesh Kumar',
        phone: '+919876543210',
        email: 'rajesh@example.com',
        lat: 12.9352,
        lng: 77.6245,
        verified: true,
        servicesOffered: createdServices.filter(s => s.category === 'home-cleaning').map(s => s._id),
        available: true,
        branchId: createdBranches[0]._id,
        rating: 4.8
      },
      {
        name: 'Priya Sharma',
        phone: '+919876543211',
        email: 'priya@example.com',
        lat: 12.9784,
        lng: 77.6408,
        verified: true,
        servicesOffered: createdServices.filter(s => s.category === 'sofa-carpet').map(s => s._id),
        available: true,
        branchId: createdBranches[1]._id,
        rating: 4.9
      },
      {
        name: 'Suresh Reddy',
        phone: '+919876543212',
        email: 'suresh@example.com',
        lat: 12.9698,
        lng: 77.7499,
        verified: true,
        servicesOffered: createdServices.filter(s => s.category === 'bathroom-kitchen').map(s => s._id),
        available: true,
        branchId: createdBranches[2]._id,
        rating: 4.7
      }
    ];

    const createdProviders = await Provider.insertMany(sampleProviders);
    console.log(`✅ Created ${createdProviders.length} providers`);

    console.log('\n🎉 Green & Clean data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Branches: ${createdBranches.length}`);
    console.log(`   Services: ${createdServices.length}`);
    console.log(`   Providers: ${createdProviders.length}`);
    console.log('\n🔗 API Endpoints:');
    console.log('   GET  /api/green/services');
    console.log('   POST /api/green/booking');
    console.log('   GET  /api/green/admin/bookings');
    console.log('   GET  /api/green/admin/stats');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedGreenData();
