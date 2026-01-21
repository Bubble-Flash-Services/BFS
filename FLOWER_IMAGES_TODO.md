# Flower Products Images - To Be Replaced

This document lists all flower products that need images to be replaced with actual Google Images URLs.

## Instructions
1. Search for each product name on Google Images
2. Copy the image URL
3. Replace the placeholder URL in the respective file

## FlowerProductsPage.jsx Products (20 items)

### Roses (5 items)
1. **Red Roses Bouquet - Classic Love**
   - Current: `https://via.placeholder.com/800x600?text=Red+Roses+Bouquet`
   - Price: ₹799
   - Search: "red roses bouquet classic love"

2. **Premium Red Roses - Love Special**
   - Current: `https://via.placeholder.com/800x600?text=Premium+Red+Roses`
   - Price: ₹1499
   - Search: "24 premium red roses bouquet"

3. **Pink & White Roses Bouquet**
   - Current: `https://via.placeholder.com/800x600?text=Pink+White+Roses`
   - Price: ₹899
   - Search: "pink and white roses bouquet"

4. **Yellow Roses - Sunshine Bright**
   - Current: `https://via.placeholder.com/800x600?text=Yellow+Roses`
   - Price: ₹749
   - Search: "yellow roses bouquet"

5. **Mixed Roses Bouquet - Rainbow**
   - Current: `https://via.placeholder.com/800x600?text=Mixed+Roses+Bouquet`
   - Price: ₹1099
   - Search: "mixed colorful roses bouquet"

### Carnations (2 items)
6. **Red Carnations Bouquet**
   - Current: `https://via.placeholder.com/800x600?text=Red+Carnations`
   - Price: ₹649
   - Search: "red carnations bouquet"

7. **Pink Carnations Delight**
   - Current: `https://via.placeholder.com/800x600?text=Pink+Carnations`
   - Price: ₹699
   - Search: "pink carnations bouquet"

### Orchids (2 items)
8. **White Orchids in Vase**
   - Current: `https://via.placeholder.com/800x600?text=White+Orchids`
   - Price: ₹1299
   - Search: "white orchids in ceramic vase"

9. **Purple Orchids Elegance**
   - Current: `https://via.placeholder.com/800x600?text=Purple+Orchids`
   - Price: ₹1399
   - Search: "purple orchids in pot"

### Lilies (2 items)
10. **Elegant White Lilies**
    - Current: `https://via.placeholder.com/800x600?text=White+Lilies`
    - Price: ₹899
    - Search: "white lilies bouquet"

11. **Pink Lilies Bouquet**
    - Current: `https://via.placeholder.com/800x600?text=Pink+Lilies`
    - Price: ₹999
    - Search: "pink lilies bouquet"

### Gerberas (1 item)
12. **Gerbera Happiness Bouquet**
    - Current: `https://via.placeholder.com/800x600?text=Gerbera+Flowers`
    - Price: ₹749
    - Search: "colorful gerbera flowers bouquet"

### Mixed Flowers (2 items)
13. **Mixed Flowers Celebration**
    - Current: `https://via.placeholder.com/800x600?text=Mixed+Flowers+Celebration`
    - Price: ₹1099
    - Search: "mixed flowers celebration bouquet"

14. **Premium Mixed Flower Basket**
    - Current: `https://via.placeholder.com/800x600?text=Premium+Flower+Basket`
    - Price: ₹1799
    - Search: "premium mixed flower basket"

### Combo Products (3 items)
15. **Love Combo - Flowers & Cake**
    - Current: `https://via.placeholder.com/800x600?text=Flowers+Cake+Combo`
    - Price: ₹1299
    - Search: "red roses with chocolate cake"

16. **Birthday Special Combo**
    - Current: `https://via.placeholder.com/800x600?text=Birthday+Special+Combo`
    - Price: ₹1399
    - Search: "birthday flowers cake combo"

17. **Teddy Bear & Roses Combo**
    - Current: `https://via.placeholder.com/800x600?text=Teddy+Roses+Combo`
    - Price: ₹1499
    - Search: "teddy bear with roses and chocolates"

### Premium Collections (3 items)
18. **Grand 50 Red Roses Bouquet**
    - Current: `https://via.placeholder.com/800x600?text=50+Red+Roses`
    - Price: ₹2999
    - Search: "50 red roses bouquet grand"

19. **100 Red Roses - Ultimate Love**
    - Current: `https://via.placeholder.com/800x600?text=100+Red+Roses`
    - Price: ₹4999
    - Search: "100 red roses bouquet luxury"

20. **Sunflower Happiness Bouquet**
    - Current: `https://via.placeholder.com/800x600?text=Sunflowers`
    - Price: ₹799
    - Search: "sunflowers bouquet bright"

## Server Seed Data (server/seeds/flowerProducts.json)

The same 20 products are in the seed file with placeholder URLs. When you update the images in `FlowerProductsPage.jsx`, also update them in the seed file to keep them in sync.

## Flower Categories (6 items)

In `server/seeds/flowerProducts.json`:

1. **Roses**
   - Current: `https://via.placeholder.com/400x300?text=Roses`
   - Search: "roses category banner"

2. **Carnations**
   - Current: `https://via.placeholder.com/400x300?text=Carnations`
   - Search: "carnations flowers category"

3. **Orchids**
   - Current: `https://via.placeholder.com/400x300?text=Orchids`
   - Search: "orchids flowers category"

4. **Lilies**
   - Current: `https://via.placeholder.com/400x300?text=Lilies`
   - Search: "lilies flowers category"

5. **Gerberas**
   - Current: `https://via.placeholder.com/400x300?text=Gerberas`
   - Search: "gerbera flowers category"

6. **Mixed Flowers**
   - Current: `https://via.placeholder.com/400x300?text=Mixed%20Flowers`
   - Search: "mixed flowers arrangement"

## How to Update Images

### Method 1: Direct Replacement in Code
1. Open the file you want to edit
2. Find the placeholder URL
3. Replace with your Google Images URL
4. Ensure the URL is accessible and not blocked

### Method 2: Using Find & Replace
1. Copy the "Current" URL
2. Use your editor's Find & Replace function
3. Replace with the new image URL

### Example:
```javascript
// Before
image: "https://via.placeholder.com/800x600?text=Red+Roses+Bouquet"

// After (example)
image: "https://images.example.com/red-roses-bouquet.jpg"
```

## Files to Update
- `/src/pages/FlowerServices/FlowerProductsPage.jsx` - Frontend display
- `/server/seeds/flowerProducts.json` - Database seed data

## Tips for Finding Good Images
1. Use high-quality images (minimum 800x600 for products)
2. Ensure images are relevant to the product name
3. Check image licensing/usage rights
4. Use images with clean backgrounds
5. Prefer images in landscape orientation for better display
