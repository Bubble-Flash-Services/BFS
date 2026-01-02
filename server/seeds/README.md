# BFS Flowers - Seed Data

This directory contains seed data and scripts for populating the BFS Flowers database with initial product catalog.

## Files

- `flowerProducts.json` - Complete catalog of flower products, categories, and occasions
- `seedFlowers.js` - Script to populate the MongoDB database with flower products

## Seed Data Overview

### Products
- **20 unique flower products** including:
  - Classic roses bouquets (Red, Pink, Yellow, Mixed)
  - Premium roses arrangements (24, 50, 100 roses)
  - Carnations bouquets
  - Exotic orchids
  - Elegant lilies
  - Cheerful gerberas
  - Mixed flower arrangements
  - Premium combos (Flowers + Cake, Flowers + Teddy, etc.)

### Flower Categories
- Roses (50+ Options)
- Carnations (30+ Options)
- Orchids (25+ Options)
- Lilies (35+ Options)
- Gerberas (40+ Options)
- Mixed Flowers (60+ Options)

### Occasions
- Birthday
- Anniversary
- Love & Romance
- Congratulations
- Get Well Soon
- Thank You
- Sympathy & Funeral
- New Born

### Price Range
- ₹649 - ₹6,999
- Most products in ₹799 - ₹1,499 range
- Premium products (50/100 roses) up to ₹4,999

### Features
- Same-day delivery options
- 2-4 hour express delivery
- Bestseller tags
- Premium quality indicators
- Combo products
- Detailed care instructions
- Customer ratings and reviews

## Running the Seed Script

### Prerequisites
- MongoDB running locally or connection string in .env
- Node.js installed

### Steps

1. Navigate to the server directory:
```bash
cd server
```

2. Make sure your MongoDB connection is configured in `.env`:
```
MONGO_URI=mongodb://localhost:27017/bfs
```

3. Run the seed script:
```bash
node seeds/seedFlowers.js
```

The script will:
- Connect to MongoDB
- Clear existing flower products
- Insert all products from flowerProducts.json
- Display summary of inserted data
- Close the connection

### Output
```
🌱 Starting BFS Flowers Database Seeder...

✅ Connected to MongoDB
🗑️  Clearing existing flower products...
📦 Inserting flower products...
✅ Successfully inserted 20 flower products

📊 Summary:
   - Total Products: 20
   - Bestsellers: 10
   - Premium: 2
   - Combos: 3
   - Price Range: ₹649 - ₹4999

🌸 Categories in seed data:
   - Roses: 50+ Options
   - Carnations: 30+ Options
   ...

👋 Database connection closed
```

## Product Structure

Each product includes:
```json
{
  "id": 1,
  "name": "Red Roses Bouquet - Classic Love",
  "shortName": "Red Roses Classic",
  "description": "A timeless expression of love...",
  "price": 799,
  "originalPrice": 999,
  "image": "https://images.unsplash.com/...",
  "rating": 4.8,
  "reviews": 234,
  "occasions": ["love", "anniversary", "valentine"],
  "flowerTypes": ["roses"],
  "deliveryTime": "same-day",
  "inStock": true,
  "isBestseller": true,
  "details": {
    "flowers": "12 Red Roses",
    "vase": "No vase included",
    "height": "12-14 inches",
    "care": "Change water daily, trim stems every 2 days"
  }
}
```

## Notes

- Images are sourced from Unsplash (placeholder URLs)
- In production, replace with actual product images
- Prices are in Indian Rupees (₹)
- Products designed for Bangalore market
- All products have realistic ratings and review counts
- Delivery times are based on BFS service areas

## Integration

The seed data is designed to work with:
- Frontend: React flower service pages
- Backend: Express.js flower service routes
- Database: MongoDB with FlowerProduct model
- Admin Panel: For managing products

## Future Enhancements

- Add more seasonal products
- Include flower subscriptions
- Add corporate bulk order options
- Seasonal availability flags
- Regional product variations
