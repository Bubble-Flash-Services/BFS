// Laundry categories and data structure
export const laundryCategories = [
  {
    id: 'mens',
    name: "MEN'S WASH",
    icon: '👨',
    color: 'from-blue-500 to-indigo-600',
    description: 'Fabric-wise • Brand-wise • Separate handling • Transparent pricing'
  },
  {
    id: 'womens',
    name: "WOMEN'S WASH",
    icon: '👩',
    color: 'from-pink-500 to-purple-600',
    description: 'Gentle care • Special fabrics • Individual attention'
  },
  {
    id: 'sarees',
    name: 'SAREES & ROLLING',
    icon: '🥻',
    color: 'from-purple-500 to-pink-600',
    description: 'Hand wash only • Individual care • Premium packaging'
  },
  {
    id: 'kids',
    name: 'KIDS CLOTHING',
    icon: '🧒',
    color: 'from-green-500 to-teal-600',
    description: 'Washed Separately • Gentle detergents • Extra care'
  },
  {
    id: 'winterWear',
    name: 'BLAZERS, COATS & WINTER WEAR',
    icon: '🧥',
    color: 'from-cyan-500 to-blue-600',
    description: 'Professional care • Premium handling'
  },
  {
    id: 'shoes',
    name: 'SHOES CLEANING',
    icon: '👟',
    color: 'from-orange-500 to-red-600',
    description: 'Brand-Wise • VIP Care available'
  },
  {
    id: 'homeLinen',
    name: 'HOME LINEN',
    icon: '🛏️',
    color: 'from-teal-500 to-green-600',
    description: 'Fresh and hygienic • Professional care'
  },
  {
    id: 'stainTreatment',
    name: 'STAIN TREATMENT',
    icon: '✨',
    color: 'from-yellow-500 to-orange-600',
    description: 'Add-on service • ₹40 per item'
  }
];

// Subcategories and items for each main category
export const categoryData = {
  mens: {
    subcategories: [
      {
        id: 'formal-wear',
        name: 'Formal Wear (Regular Fabrics – Cotton / Poly)',
        items: [
          { name: 'Formal Shirt', washFold: 20, washIron: 30, image: '/laundry/dry clean/shirt normal.jpg' },
          { name: 'Formal Pant / Trouser', washFold: 25, washIron: 35, image: '/laundry/dry clean/trousers pants normal.webp' }
        ]
      },
      {
        id: 'linen-clothing',
        name: 'Linen Clothing (Separate Handling)',
        note: 'Linen Shirts & Pants',
        items: [
          { name: 'Linen Shirt', washIron: 40, image: '/laundry/dry clean/shirt silk designer.jpg' },
          { name: 'Linen Pant', washIron: 45, image: '/laundry/dry clean/trousers pants silk.jpg' }
        ]
      },
      {
        id: 'linen-jackets',
        name: 'Linen Jackets (Separate Section)',
        items: [
          { name: 'Linen Jacket', service: 'Wash & Iron', price: 80, image: '/laundry/dry clean/casual jacket half.jpg' }
        ]
      },
      {
        id: 'formal-jacket',
        name: 'Formal Jacket (Non-Linen)',
        items: [
          { name: 'Formal Jacket', service: 'Wash & Iron', price: 60, image: '/laundry/ironing/blazer jacket.png' }
        ]
      },
      {
        id: 'formal-blazer',
        name: 'Formal Blazer – Brand-Wise (Dry Clean Only)',
        brands: [
          { tier: 'Standard Brands', note: 'Local / mid-range', price: 300, image: '/laundry/dry clean/blazer suit 1 piece.png' },
          { tier: 'Premium Brands', note: 'Arrow, Van Heusen, LP, Allen Solly, Raymond', price: 350, image: '/laundry/dry clean/blazer suit 2 piece.jpg' },
          { tier: 'Luxury / Designer Brands', note: 'Hugo Boss, Armani, Canali, Imported', price: '450+', image: '/laundry/dry clean/blazer suit 3 piece.jpg' }
        ]
      },
      {
        id: 't-shirts',
        name: 'T-Shirts',
        items: [
          { name: 'Half Sleeve', washFold: 20, washIron: 30, image: '/laundry/dry clean/tshirt.webp' },
          { name: 'Full Sleeve', washFold: 22, washIron: 32, image: '/laundry/ironing/top wear.webp' },
          { name: 'Polo', washFold: 22, washIron: 32, image: '/laundry/dry clean/tshirt.webp' }
        ]
      },
      {
        id: 'casual-bottom',
        name: 'Casual Bottom Wear',
        items: [
          { name: 'Jeans', washFold: 25, washIron: 35, image: '/laundry/dry clean/jeans.webp' },
          { name: 'Casual Pants / Chinos', washFold: 25, washIron: 35, image: '/laundry/dry clean/pants.jpg' },
          { name: 'Shorts / Half Pants', washFold: 15, washIron: 25, image: '/laundry/dry clean/shorts.jpg' }
        ]
      },
      {
        id: 'innerwear',
        name: 'Innerwear / Undergarments (Separate Wash)',
        items: [
          { name: 'Vest / Banyan', washOnly: 15, image: '/laundry/ironing/undergarment.webp' },
          { name: 'Briefs / Boxers', washOnly: 15, image: '/laundry/ironing/undergarment.webp' },
          { name: 'Inner Shorts', washOnly: 15, image: '/laundry/dry clean/shorts.jpg' },
          { name: 'Socks (Pair)', washOnly: 10, image: '/laundry/ironing/socks.jpg' }
        ]
      }
    ]
  },
  womens: {
    subcategories: [
      {
        id: 'regular-wear',
        name: 'Regular Wear',
        items: [
          { name: 'Tops / Blouses', washFold: 20, washIron: 30, image: '/laundry/dry clean/blouse normal cotton.jpg' },
          { name: 'Kurtas', washFold: 25, washIron: 35, image: '/laundry/dry clean/kurta normal cotton.jpg' },
          { name: 'Pants / Jeans', washFold: 25, washIron: 35, image: '/laundry/dry clean/jeans women.jpg' },
          { name: 'Skirts', washFold: 25, washIron: 35, image: '/laundry/dry clean/skirt normal.jpg' },
          { name: 'Daily Wear Dress', washFold: 30, washIron: 45, image: '/laundry/dry clean/Dress- One Piece.jpg' }
        ]
      },
      {
        id: 'linen-womens',
        name: "Linen Women's Wear",
        items: [
          { name: 'Linen Kurta / Top', washIron: 45, image: '/laundry/dry clean/shirt silk designer women.webp' },
          { name: 'Linen Pants', washIron: 45, image: '/laundry/dry clean/Trousers Pants Silk women.jpg' },
          { name: 'Linen Dress', washIron: 60, image: '/laundry/dry clean/gown medium work.jpg' }
        ]
      },
      {
        id: 'dupatta-stole',
        name: 'Dupatta / Stole',
        items: [
          { name: 'Cotton Dupatta', price: 25, image: '/laundry/dry clean/dupatta normal.jpg' },
          { name: 'Silk / Designer Dupatta', price: 40, image: '/laundry/dry clean/dupatta silk.jpg' }
        ]
      },
      {
        id: 'womens-jackets',
        name: "Women's Jackets / Shrugs",
        items: [
          { name: 'Light Jacket / Shrug', price: 60, image: '/laundry/dry clean/Cardigan Shrug.jpg' }
        ]
      }
    ]
  },
  sarees: {
    subcategories: [
      {
        id: 'normal-sarees',
        name: 'Normal Sarees',
        items: [
          { name: 'Cotton Saree', price: 120, image: '/laundry/dry clean/saree plain.jpg' },
          { name: 'Synthetic Saree', price: 150, image: '/laundry/dry clean/saree designer.jpg' },
          { name: 'Rolling / Ironing', price: 80, image: '/laundry/ironing/saree lehanga women.webp' }
        ]
      },
      {
        id: 'premium-sarees',
        name: 'Premium Sarees',
        items: [
          { name: 'Silk Saree', price: 180, image: '/laundry/dry clean/saree silk.jpg' },
          { name: 'Designer Saree', price: 250, image: '/laundry/dry clean/saree designer heavy.jpg' },
          { name: 'Premium Rolling', price: 120, image: '/laundry/ironing/saree lehanga women.webp' }
        ]
      },
      {
        id: 'bridal-sarees',
        name: 'Bridal / Heavy Sarees (VIP)',
        note: '✔ Hand wash only ✔ Individual care',
        items: [
          { name: 'Bridal / Heavy Work', price: '350+', image: '/laundry/dry clean/lehanga high work.webp' }
        ]
      }
    ]
  },
  kids: {
    subcategories: [
      {
        id: 'kids-clothing',
        name: 'Kids Clothing (Washed Separately)',
        items: [
          { name: 'Shirts / Tops', washFold: 18, image: '/laundry/dry clean/Kids Topwear.jpg' },
          { name: 'Pants / Shorts', washFold: 20, image: '/laundry/dry clean/Kids Bottomwear.jpg' },
          { name: 'Woollen Wear', washFold: 30, image: '/laundry/dry clean/Kids Woollenwear Top.webp' },
          { name: 'Jackets', washFold: 35, image: '/laundry/dry clean/kids jacket.webp' }
        ]
      }
    ]
  },
  winterWear: {
    subcategories: [
      {
        id: 'winter-items',
        name: 'Blazers, Coats & Winter Wear',
        items: [
          { name: 'Blazer (Regular)', service: 'Dry Clean', price: 300, image: '/laundry/dry clean/blazer suit 1 piece.png' },
          { name: 'Coat', service: 'Dry Clean', price: 350, image: '/laundry/dry clean/Woollen Coat Full.jpg' },
          { name: 'Sweater', service: 'Wash & Iron', price: 45, image: '/laundry/dry clean/sweater.jpg' },
          { name: 'Hoodie / Sweatshirt', service: 'Wash & Iron', price: 50, image: '/laundry/dry clean/sweatshirt.jpg' },
          { name: 'Shawl / Stole', service: 'Wash', price: 40, image: '/laundry/dry clean/Shawl.jpg' },
          { name: 'Scarf / Muffler', service: 'Wash', price: 25, image: '/laundry/dry clean/Scarf Muffler.jpg' }
        ]
      }
    ]
  },
  shoes: {
    subcategories: [
      {
        id: 'regular-shoes',
        name: 'Regular Shoes',
        items: [
          { name: 'Sandals / Slippers', price: 199, image: '/laundry/shoe clean/Normal Shoes.jpg' },
          { name: 'Casual Shoes', price: 199, image: '/laundry/shoe clean/Normal Shoes.jpg' }
        ]
      },
      {
        id: 'premium-shoes',
        name: 'Premium Shoes',
        items: [
          { name: 'Sports Shoes / Sneakers', price: 249, image: '/laundry/shoe clean/Sports Shoes.jpg' },
          { name: 'Leather Shoes', price: 299, image: '/laundry/shoe clean/leather shoes.jpg' }
        ]
      },
      {
        id: 'luxury-shoes',
        name: 'Luxury / White Shoes (VIP Care)',
        items: [
          { name: 'Luxury Brand Shoes', price: 399, image: '/laundry/shoe clean/Heels.jpg' },
          { name: 'White Shoe Deep Clean', price: 349, image: '/laundry/shoe clean/Sports Shoes.jpg' }
        ]
      }
    ]
  },
  homeLinen: {
    subcategories: [
      {
        id: 'home-items',
        name: 'Home Linen',
        items: [
          { name: 'Bedsheet (Single)', price: 40, image: '/laundry/bedsheet/Wash&Iron-Single.webp' },
          { name: 'Bedsheet (Double)', price: 60, image: '/laundry/bedsheet/Wash&Iron-Double.webp' },
          { name: 'Pillow Cover', price: 15, image: '/laundry/dry clean/Pillow Cover.jpg' },
          { name: 'Blanket / Comforter', price: 199, image: '/laundry/dry clean/Comforter Double.jpg' },
          { name: 'Curtain (Thin)', price: 35, image: '/laundry/dry clean/Door Curtain.jpg' },
          { name: 'Curtain (Thick)', price: 60, image: '/laundry/dry clean/Window Curtain.jpg' },
          { name: 'Towel', price: 20, image: '/laundry/dry clean/Bath Towel.jpg' }
        ]
      }
    ]
  },
  stainTreatment: {
    subcategories: [
      {
        id: 'stain-service',
        name: 'Stain Treatment (ADD-ON)',
        price: 40,
        perItem: true,
        canTreat: ['Food', 'Sweat', 'Mud', 'Light oil', 'Tea / coffee'],
        notGuaranteed: ['Old stains', 'Ink / paint', 'Bleach damage', 'Dye bleed', 'Burn marks']
      }
    ]
  }
};

// Helper function to parse laundry item keys and get item details
export const parseLaundryItemKey = (itemKey) => {
  // Parse the itemKey - format: categoryId-subcategoryId-itemIndex-serviceType
  // Note: subcategoryId and serviceType can contain hyphens
  const parts = itemKey.split('-');
  
  // The last part is always the service type
  const serviceIndex = parts.length - 1;
  const service = parts[serviceIndex];
  
  // The second-to-last part is the item index
  const itemIndexStr = parts[serviceIndex - 1];
  const itemIndex = parseInt(itemIndexStr);
  
  // The first part is the category ID
  const categoryId = parts[0];
  
  // Everything in between is the subcategory ID (may contain hyphens)
  const subcategoryId = parts.slice(1, serviceIndex - 1).join('-');
  
  return { categoryId, subcategoryId, itemIndex, service };
};

// Helper function to get item details from parsed key
export const getLaundryItemDetails = (itemKey) => {
  const { categoryId, subcategoryId, itemIndex, service } = parseLaundryItemKey(itemKey);
  
  const category = categoryData[categoryId];
  if (!category) return null;
  
  const subcategory = category.subcategories.find(s => s.id === subcategoryId);
  if (!subcategory) return null;
  
  // Handle both items and brands
  if (subcategory.items) {
    const item = subcategory.items[itemIndex];
    if (!item) return null;
    
    let itemPrice = 0;
    let serviceName = '';
    
    if (service === 'washFold' && item.washFold) {
      itemPrice = parseFloat(item.washFold) || 0;
      serviceName = 'Wash & Fold';
    } else if (service === 'washIron' && item.washIron) {
      itemPrice = parseFloat(item.washIron) || 0;
      serviceName = 'Wash & Iron';
    } else if (service === 'washOnly' && item.washOnly) {
      itemPrice = parseFloat(item.washOnly) || 0;
      serviceName = 'Wash Only';
    } else if (service === 'price' && item.price) {
      const priceStr = String(item.price).replace('+', '');
      itemPrice = parseFloat(priceStr) || 0;
      serviceName = item.service || '';
    } else if (item.price && !item.washFold && !item.washIron && !item.washOnly) {
      // For items that only have a price field
      const priceStr = String(item.price).replace('+', '');
      itemPrice = parseFloat(priceStr) || 0;
      serviceName = item.service || '';
    }
    
    return {
      name: item.name,
      price: itemPrice,
      serviceName: serviceName
    };
  } else if (subcategory.brands) {
    const brand = subcategory.brands[itemIndex];
    if (!brand) return null;
    
    const priceStr = String(brand.price).replace('+', '');
    const itemPrice = parseFloat(priceStr) || 0;
    
    return {
      name: brand.tier,
      price: itemPrice,
      serviceName: 'Dry Clean'
    };
  }
  
  return null;
};

// Helper function to convert selectedItems object to array format for display
export const convertSelectedItemsToArray = (selectedItems) => {
  if (!selectedItems) return [];
  
  return Object.entries(selectedItems).map(([itemKey, quantity]) => {
    const details = getLaundryItemDetails(itemKey);
    
    if (!details) {
      // Fallback if we can't parse the item
      return {
        name: itemKey,
        quantity: quantity,
        price: 0,
        totalPrice: 0
      };
    }
    
    return {
      name: details.serviceName ? `${details.name} (${details.serviceName})` : details.name,
      quantity: quantity,
      price: details.price,
      totalPrice: details.price * quantity
    };
  });
};
