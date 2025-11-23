import mongoose from 'mongoose';
import MoversPackers from './models/MoversPackers.js';
import dotenv from 'dotenv';

dotenv.config();

const seedMoversPackers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing movers & packers data
    await MoversPackers.deleteMany({});
    console.log('Cleared existing movers & packers data');

    // Distance charges applicable to all items
    const standardDistanceCharges = [
      { rangeStart: 5, rangeEnd: 10, charge: 150 },
      { rangeStart: 10, rangeEnd: 20, charge: 250 },
      { rangeStart: 20, rangeEnd: 30, charge: 350 }
      // For 30+ km, calculate at ₹10/km in the controller
    ];

    // Create Movers & Packers Services
    const services = await MoversPackers.insertMany([
      {
        itemType: 'bike',
        name: 'Bike Shifting',
        icon: '🏍️',
        description: 'Professional bike shifting service with complete protection and safe transport',
        basePrice: 1299,
        baseDistance: 5,
        includes: [
          'Foam sheet packing',
          'Bubble wrap',
          'Tank & handle protection',
          'Rope lock inside vehicle',
          'Loading + transport + unloading'
        ],
        notIncludes: [
          'Bike repair',
          'Fuel refill',
          'Mechanical issues'
        ],
        howItsDone: 'Wrap → Load → Tie → Transport → Unload → Handover',
        distanceCharges: standardDistanceCharges,
        active: true,
        sortOrder: 1
      },
      {
        itemType: 'scooty',
        name: 'Scooty Shifting',
        icon: '🛵',
        description: 'Safe and secure scooty transportation with proper packing',
        basePrice: 1199,
        baseDistance: 5,
        includes: [
          'Full wrap packing',
          'Side panel protection',
          'Loading + unloading',
          'Mini-truck transport'
        ],
        notIncludes: [
          'Dent removal',
          'Electrical issues'
        ],
        howItsDone: 'Scooty is padded, loaded, tied using straps, and delivered safely.',
        distanceCharges: standardDistanceCharges,
        active: true,
        sortOrder: 2
      },
      {
        itemType: 'fridge',
        name: 'Fridge Shifting',
        icon: '🧊',
        description: 'Single/Double Door fridge shifting with upright transport',
        basePrice: 1899,
        baseDistance: 5,
        includes: [
          'Bubble + stretch wrap',
          'Upright transport only',
          '2–3 helpers',
          'Placement in kitchen'
        ],
        notIncludes: [
          'Gas refill',
          'Cooling repair'
        ],
        howItsDone: 'Wrap → Carry with 2 helpers → Load upright → Transport → Place properly.',
        distanceCharges: standardDistanceCharges,
        active: true,
        sortOrder: 3
      },
      {
        itemType: 'washing-machine',
        name: 'Washing Machine Shifting',
        icon: '🧼',
        description: 'Safe washing machine transportation with proper packaging',
        basePrice: 1299,
        baseDistance: 5,
        includes: [
          'Foam wrap',
          'Drum lock',
          'Transport',
          'Loading + unloading'
        ],
        notIncludes: [
          'Pipe installation',
          'Machine repair'
        ],
        howItsDone: 'Secure → Wrap → Load → Transport → Unload.',
        distanceCharges: standardDistanceCharges,
        active: true,
        sortOrder: 4
      },
      {
        itemType: 'sofa',
        name: 'Sofa Shifting',
        icon: '🛋️',
        description: '3–5 Seater sofa shifting with complete protection',
        basePrice: 2299,
        baseDistance: 5,
        includes: [
          'Bubble wrap + foam',
          'Corner protection',
          'Manual lifting',
          'Door-to-door transport'
        ],
        notIncludes: [
          'Sofa repair',
          'Dismantling (extra)'
        ],
        howItsDone: 'Wrap → Protect corners → Lift carefully → Load → Deliver.',
        distanceCharges: standardDistanceCharges,
        active: true,
        sortOrder: 5
      },
      {
        itemType: 'tv',
        name: 'TV Shifting',
        icon: '📺',
        description: 'LED/Smart TV shifting with screen protection',
        basePrice: 899,
        baseDistance: 5,
        includes: [
          'Bubble wrap',
          'Screen protection sheet',
          'Cardboard frame',
          'Transport'
        ],
        notIncludes: [
          'Wall mounting',
          'Screen replacement'
        ],
        howItsDone: 'TV wrapped like a sandwich panel → Cardboard edges → Load → Deliver.',
        distanceCharges: standardDistanceCharges,
        active: true,
        sortOrder: 6
      },
      {
        itemType: 'mattress',
        name: 'Mattress Shifting',
        icon: '🛏',
        description: 'Single/Double/Queen/King mattress shifting',
        basePrice: 699,
        baseDistance: 5,
        includes: [
          'Mattress cover / plastic wrap',
          'Transport',
          'Loading + unloading'
        ],
        notIncludes: [
          'Mattress cleaning',
          'Mold treatment'
        ],
        howItsDone: 'Cover → Roll/flat carry → Transport → Deliver.',
        distanceCharges: standardDistanceCharges,
        active: true,
        sortOrder: 7
      },
      {
        itemType: 'cupboard',
        name: 'Cupboard Shifting',
        icon: '🚪',
        description: 'Steel/Wooden cupboard shifting service',
        basePrice: 1499,
        baseDistance: 5,
        includes: [
          'Full wrap',
          'Shelf taping',
          'Lifting & loading',
          'Transport',
          'Unloading'
        ],
        notIncludes: [
          'Inside item packing',
          'Door repair'
        ],
        howItsDone: 'Empty → Wrap → Tie → Load → Deliver safely.',
        distanceCharges: standardDistanceCharges,
        active: true,
        sortOrder: 8
      },
      {
        itemType: 'table',
        name: 'Table Shifting',
        icon: '🪑',
        description: 'Office / Dining / Study table shifting',
        basePrice: 799,
        baseDistance: 5,
        includes: [
          'Table wrap',
          'Edge protection',
          'Transport',
          'Loading + unloading'
        ],
        notIncludes: [
          'Table repair',
          'Disassembling (extra)'
        ],
        howItsDone: 'Wrap → Lift → Load → Transport → Unload carefully.',
        distanceCharges: standardDistanceCharges,
        active: true,
        sortOrder: 9
      }
    ]);

    console.log('Created movers & packers services');
    console.log('✅ Movers & Packers database seeded successfully!');
    console.log(`\n📊 Created: ${services.length} shifting services`);
    console.log('\n🚚 Services:');
    services.forEach(service => {
      console.log(`   - ${service.icon} ${service.name}: ₹${service.basePrice} (0-${service.baseDistance} km)`);
    });
    console.log('\n📏 Distance Charges:');
    console.log('   - 5-10 km: +₹150');
    console.log('   - 10-20 km: +₹250');
    console.log('   - 20-30 km: +₹350');
    console.log('   - 30+ km: ₹10/km');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding movers & packers database:', error);
    process.exit(1);
  }
};

seedMoversPackers();
