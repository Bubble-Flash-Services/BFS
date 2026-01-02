import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define FlowerProduct schema (should match your actual model)
const flowerProductSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  shortName: String,
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  occasions: [{
    type: String
  }],
  flowerTypes: [{
    type: String
  }],
  deliveryTime: {
    type: String,
    enum: ['2-hours', '4-hours', 'same-day', '6-hours', 'next-day'],
    default: 'same-day'
  },
  inStock: {
    type: Boolean,
    default: true
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isCombo: {
    type: Boolean,
    default: false
  },
  details: {
    flowers: String,
    vase: String,
    extra: String,
    height: String,
    care: String
  }
}, {
  timestamps: true
});

const FlowerProduct = mongoose.model('FlowerProduct', flowerProductSchema);

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bfs';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Seed the database
async function seedDatabase() {
  try {
    await connectDB();

    // Read the JSON file
    const dataPath = path.join(__dirname, 'flowerProducts.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Clear existing products
    console.log('🗑️  Clearing existing flower products...');
    await FlowerProduct.deleteMany({});

    // Insert new products
    console.log('📦 Inserting flower products...');
    const productsToInsert = data.products.map(product => ({
      productId: product.id,
      name: product.name,
      shortName: product.shortName,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      occasions: product.occasions,
      flowerTypes: product.flowerTypes,
      deliveryTime: product.deliveryTime,
      inStock: product.inStock,
      isBestseller: product.isBestseller || false,
      isPremium: product.premium || false,
      isCombo: product.combo || false,
      details: product.details
    }));

    await FlowerProduct.insertMany(productsToInsert);
    
    console.log(`✅ Successfully inserted ${productsToInsert.length} flower products`);
    console.log('\n📊 Summary:');
    console.log(`   - Total Products: ${productsToInsert.length}`);
    console.log(`   - Bestsellers: ${productsToInsert.filter(p => p.isBestseller).length}`);
    console.log(`   - Premium: ${productsToInsert.filter(p => p.isPremium).length}`);
    console.log(`   - Combos: ${productsToInsert.filter(p => p.isCombo).length}`);
    console.log(`   - Price Range: ₹${Math.min(...productsToInsert.map(p => p.price))} - ₹${Math.max(...productsToInsert.map(p => p.price))}`);

    // Display categories info
    console.log('\n🌸 Categories in seed data:');
    data.categories.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat.count}`);
    });

    console.log('\n🎉 Occasions in seed data:');
    data.occasions.forEach(occ => {
      console.log(`   - ${occ.name}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

// Run the seeder
console.log('🌱 Starting BFS Flowers Database Seeder...\n');
seedDatabase();
