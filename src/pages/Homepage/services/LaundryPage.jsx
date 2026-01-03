import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';
import SigninModal from '../signin/SigninModal';

// Main Category Data Structure
const laundryCategories = {
  mens: {
    id: 'mens',
    name: "Men's Wash",
    icon: '👨',
    description: 'Fabric-wise • Brand-wise • Transparent pricing',
    subcategories: [
      {
        id: 'mens-formal',
        name: 'Formal Wear (Regular Fabrics)',
        description: 'Cotton / Poly',
        items: [
          { id: 'mf-shirt-wf', name: 'Formal Shirt', washFold: 20, washIron: 30 },
          { id: 'mf-pant-wf', name: 'Formal Pant / Trouser', washFold: 25, washIron: 35 },
          { id: 'mf-set-wf', name: 'Shirt + Pant Set', washFold: 45, washIron: 60 }
        ]
      },
      {
        id: 'mens-linen',
        name: 'Linen Clothing',
        description: 'Separate Handling',
        items: [
          { id: 'ml-shirt', name: 'Linen Shirt', washIron: 40 },
          { id: 'ml-pant', name: 'Linen Pant', washIron: 45 },
          { id: 'ml-set', name: 'Linen Set (Shirt + Pant)', washIron: 80 }
        ]
      },
      {
        id: 'mens-jackets',
        name: 'Jackets',
        items: [
          { id: 'mj-linen', name: 'Linen Jacket', washIron: 80 },
          { id: 'mj-formal', name: 'Formal Jacket (Non-Linen)', washIron: 60 }
        ]
      },
      {
        id: 'mens-blazer',
        name: 'Formal Blazer (Dry Clean Only)',
        description: 'Brand-wise pricing',
        items: [
          { id: 'mb-standard', name: 'Standard Brands', price: 300, description: 'Local / mid-range' },
          { id: 'mb-premium', name: 'Premium Brands', price: 350, description: 'Arrow, Van Heusen, LP, Allen Solly, Raymond' },
          { id: 'mb-luxury', name: 'Luxury / Designer Brands', price: 450, description: 'Hugo Boss, Armani, Canali, Imported' }
        ]
      },
      {
        id: 'mens-tshirts',
        name: 'T-Shirts',
        items: [
          { id: 'mt-half', name: 'Half Sleeve', washFold: 20, washIron: 30 },
          { id: 'mt-full', name: 'Full Sleeve', washFold: 22, washIron: 32 },
          { id: 'mt-polo', name: 'Polo', washFold: 22, washIron: 32 }
        ]
      },
      {
        id: 'mens-casual-bottom',
        name: 'Casual Bottom Wear',
        items: [
          { id: 'mcb-jeans', name: 'Jeans', washFold: 25, washIron: 35 },
          { id: 'mcb-pants', name: 'Casual Pants / Chinos', washFold: 25, washIron: 35 },
          { id: 'mcb-shorts', name: 'Shorts / Half Pants', washFold: 15, washIron: 25 }
        ]
      },
      {
        id: 'mens-innerwear',
        name: 'Innerwear / Undergarments',
        description: 'Separate Wash',
        items: [
          { id: 'mi-vest', name: 'Vest / Banyan', washOnly: 15 },
          { id: 'mi-briefs', name: 'Briefs / Boxers', washOnly: 15 },
          { id: 'mi-shorts', name: 'Inner Shorts', washOnly: 15 },
          { id: 'mi-socks', name: 'Socks (Pair)', washOnly: 10 }
        ]
      }
    ]
  },
  womens: {
    id: 'womens',
    name: "Women's Wash",
    icon: '👩',
    description: 'Gentle care • Separate handling • Special fabrics',
    subcategories: [
      {
        id: 'womens-regular',
        name: 'Regular Wear',
        items: [
          { id: 'wr-tops', name: 'Tops / Blouses', washFold: 20, washIron: 30 },
          { id: 'wr-kurtas', name: 'Kurtas', washFold: 25, washIron: 35 },
          { id: 'wr-pants', name: 'Pants / Jeans', washFold: 25, washIron: 35 },
          { id: 'wr-skirts', name: 'Skirts', washFold: 25, washIron: 35 },
          { id: 'wr-dress', name: 'Daily Wear Dress', washFold: 30, washIron: 45 }
        ]
      },
      {
        id: 'womens-linen',
        name: 'Linen Women\'s Wear',
        items: [
          { id: 'wl-kurta', name: 'Linen Kurta / Top', washIron: 45 },
          { id: 'wl-pants', name: 'Linen Pants', washIron: 45 },
          { id: 'wl-dress', name: 'Linen Dress', washIron: 60 }
        ]
      },
      {
        id: 'womens-dupatta',
        name: 'Dupatta / Stole',
        items: [
          { id: 'wd-cotton', name: 'Cotton Dupatta', price: 25 },
          { id: 'wd-silk', name: 'Silk / Designer Dupatta', price: 40 }
        ]
      },
      {
        id: 'womens-jackets',
        name: 'Women\'s Jackets / Shrugs',
        items: [
          { id: 'wj-light', name: 'Light Jacket / Shrug', price: 60 }
        ]
      }
    ]
  },
  sarees: {
    id: 'sarees',
    name: 'Sarees & Rolling',
    icon: '🥻',
    description: 'Hand wash • Individual care • Premium packaging',
    subcategories: [
      {
        id: 'sarees-normal',
        name: 'Normal Sarees',
        items: [
          { id: 'sn-cotton', name: 'Cotton Saree', price: 120 },
          { id: 'sn-synthetic', name: 'Synthetic Saree', price: 150 },
          { id: 'sn-rolling', name: 'Rolling / Ironing', price: 80 }
        ]
      },
      {
        id: 'sarees-premium',
        name: 'Premium Sarees',
        items: [
          { id: 'sp-silk', name: 'Silk Saree', price: 180 },
          { id: 'sp-designer', name: 'Designer Saree', price: 250 },
          { id: 'sp-rolling', name: 'Premium Rolling', price: 120 }
        ]
      },
      {
        id: 'sarees-bridal',
        name: 'Bridal / Heavy Sarees (VIP)',
        description: '✔ Hand wash only ✔ Individual care',
        items: [
          { id: 'sb-bridal', name: 'Bridal / Heavy Work', price: 350, priceNote: '+' }
        ]
      }
    ]
  },
  kids: {
    id: 'kids',
    name: 'Kids Clothing',
    icon: '🧒',
    description: 'Washed Separately • Gentle detergents',
    subcategories: [
      {
        id: 'kids-clothing',
        name: 'Kids Clothing',
        description: 'Washed separately with gentle care',
        items: [
          { id: 'kc-shirts', name: 'Shirts / Tops', washFold: 18 },
          { id: 'kc-pants', name: 'Pants / Shorts', washFold: 20 },
          { id: 'kc-woollen', name: 'Woollen Wear', washFold: 30 },
          { id: 'kc-jackets', name: 'Jackets', washFold: 35 }
        ]
      }
    ]
  },
  winterWear: {
    id: 'winterWear',
    name: 'Blazers, Coats & Winter Wear',
    icon: '🧥',
    description: 'Professional care for heavy garments',
    subcategories: [
      {
        id: 'winter-items',
        name: 'Winter Wear',
        items: [
          { id: 'wi-blazer', name: 'Blazer (Regular)', service: 'Dry Clean', price: 300 },
          { id: 'wi-coat', name: 'Coat', service: 'Dry Clean', price: 350 },
          { id: 'wi-sweater', name: 'Sweater', service: 'Wash & Iron', price: 45 },
          { id: 'wi-hoodie', name: 'Hoodie / Sweatshirt', service: 'Wash & Iron', price: 50 },
          { id: 'wi-shawl', name: 'Shawl / Stole', service: 'Wash', price: 40 },
          { id: 'wi-scarf', name: 'Scarf / Muffler', service: 'Wash', price: 25 }
        ]
      }
    ]
  },
  shoes: {
    id: 'shoes',
    name: 'Shoes Cleaning',
    icon: '👟',
    description: 'Brand-wise premium care',
    subcategories: [
      {
        id: 'shoes-regular',
        name: 'Regular Shoes',
        items: [
          { id: 'sr-sandals', name: 'Sandals / Slippers', price: 199 },
          { id: 'sr-casual', name: 'Casual Shoes', price: 199 }
        ]
      },
      {
        id: 'shoes-premium',
        name: 'Premium Shoes',
        items: [
          { id: 'sp-sports', name: 'Sports Shoes / Sneakers', price: 249 },
          { id: 'sp-leather', name: 'Leather Shoes', price: 299 }
        ]
      },
      {
        id: 'shoes-luxury',
        name: 'Luxury / White Shoes (VIP Care)',
        items: [
          { id: 'sl-luxury', name: 'Luxury Brand Shoes', price: 399 },
          { id: 'sl-white', name: 'White Shoe Deep Clean', price: 349 }
        ]
      }
    ]
  },
  homeLinen: {
    id: 'homeLinen',
    name: 'Home Linen',
    icon: '🛏️',
    description: 'Fresh and hygienic',
    subcategories: [
      {
        id: 'home-items',
        name: 'Home Linen Items',
        items: [
          { id: 'hl-bedsheet-s', name: 'Bedsheet (Single)', price: 40 },
          { id: 'hl-bedsheet-d', name: 'Bedsheet (Double)', price: 60 },
          { id: 'hl-pillow', name: 'Pillow Cover', price: 15 },
          { id: 'hl-blanket', name: 'Blanket / Comforter', price: 199 },
          { id: 'hl-curtain-thin', name: 'Curtain (Thin)', price: 35 },
          { id: 'hl-curtain-thick', name: 'Curtain (Thick)', price: 60 },
          { id: 'hl-towel', name: 'Towel', price: 20 }
        ]
      }
    ]
  },
  stainTreatment: {
    id: 'stainTreatment',
    name: 'Stain Treatment (ADD-ON)',
    icon: '✨',
    description: 'Professional stain removal',
    subcategories: [
      {
        id: 'stain-service',
        name: 'Stain Treatment',
        description: '₹40 per item',
        items: [
          { 
            id: 'st-service',
            name: 'Stain Treatment Service',
            price: 40,
            canTreat: ['Food', 'Sweat', 'Mud', 'Light oil', 'Tea / coffee'],
            notGuaranteed: ['Old stains', 'Ink / pain', 'Bleach damage', 'Dye bleed', 'Burn marks']
          }
        ]
      }
    ]
  }
};

// Men's Wash Pricing (Wash & Fold) - Keep for backward compatibility
const mensWashFold = [
  {
    id: 'mw-wf-shirt',
    name: 'Shirt / T-Shirt',
    image: '/laundry/wash & fold/top waer.jpg',
    price: 25,
    category: 'Wash & Fold',
    description: 'Hygienically washed and neatly packed'
  },
  {
    id: 'mw-wf-jeans',
    name: 'Jeans / Trouser',
    image: '/laundry/wash & fold/bottom wear.jpg',
    price: 30,
    category: 'Wash & Fold',
    description: 'Hygienically washed and neatly packed'
  },
  {
    id: 'mw-wf-shorts',
    name: 'Shorts',
    image: '/laundry/wash & fold/bottom wear half.jpg',
    price: 20,
    category: 'Wash & Fold',
    description: 'Hygienically washed and neatly packed'
  },
  {
    id: 'mw-wf-under',
    name: 'Undergarments',
    image: '/laundry/wash & fold/undergarment.webp',
    price: 15,
    category: 'Wash & Fold',
    description: 'Hygienically washed and neatly packed'
  }
];

// Men's Wash & Iron Pricing
const mensWashIron = [
  {
    id: 'mw-wi-shirt',
    name: 'Shirt / T-Shirt',
    image: '/laundry/ironing/top wear.webp',
    price: 40,
    category: 'Wash & Iron',
    description: 'Washed, dried, and neatly packed'
  },
  {
    id: 'mw-wi-jeans',
    name: 'Jeans / Trouser',
    image: '/laundry/ironing/Bottom Wear.webp',
    price: 45,
    category: 'Wash & Iron',
    description: 'Washed, dried, and neatly packed'
  }
];

// Women's Wash Pricing (Wash & Fold)
const womensWashFold = [
  {
    id: 'ww-wf-top',
    name: 'Top / Blouse',
    image: '/laundry/wash & fold/top wear women.jpg',
    price: 25,
    category: 'Wash & Fold',
    description: 'Suitable for casual and office wear'
  },
  {
    id: 'ww-wf-kurta',
    name: 'Kurta',
    image: '/laundry/wash & fold/top wear women.jpg',
    price: 30,
    category: 'Wash & Fold',
    description: 'Suitable for casual and office wear'
  },
  {
    id: 'ww-wf-jeans',
    name: 'Jeans / Skirt',
    image: '/laundry/wash & fold/bottom wear women.jpg',
    price: 30,
    category: 'Wash & Fold',
    description: 'Suitable for casual and office wear'
  },
  {
    id: 'ww-wf-inner',
    name: 'Innerwear',
    image: '/laundry/wash & fold/bottom wear half women.jpg',
    price: 15,
    category: 'Wash & Fold',
    description: 'Suitable for casual and office wear'
  }
];

// Women's Wash & Iron Pricing
const womensWashIron = [
  {
    id: 'ww-wi-top',
    name: 'Top / Blouse',
    image: '/laundry/ironing/top wear women.webp',
    price: 40,
    category: 'Wash & Iron',
    description: 'Suitable for casual and office wear'
  },
  {
    id: 'ww-wi-kurta',
    name: 'Kurta',
    image: '/laundry/ironing/top wear women.webp',
    price: 45,
    category: 'Wash & Iron',
    description: 'Suitable for casual and office wear'
  },
  {
    id: 'ww-wi-jeans',
    name: 'Jeans / Skirt',
    image: '/laundry/ironing/bottom wear women.webp',
    price: 45,
    category: 'Wash & Iron',
    description: 'Suitable for casual and office wear'
  }
];

const clothingItems = {
  men: [
    {
      id: 1,
      name: 'Bottom Wear',
      image: '/laundry/wash & fold/bottom wear.jpg',
      price: 25,
      description: 'Jeans, trousers, formal pants'
    },
    {
      id: 2,
      name: 'Top Wear',
      image: '/laundry/wash & fold/top waer.jpg',
      price: 20,
      description: 'Shirts, t-shirts, polo shirts'
    },
    {
      id: 3,
      name: 'Bottom Wear Half',
      image: '/laundry/wash & fold/bottom wear half.jpg',
      price: 15,
      description: 'Undergarments, shorts'
    },
    {
      id: 4,
      name: 'Casual Jacket',
      image: '/laundry/wash & fold/casual jacket.jpg',
      price: 40,
      description: 'Hoodies, light jackets'
    },
  ],
  women: [
    {
      id: 5,
      name: 'Bottom Wear',
      image: '/laundry/wash & fold/bottom wear women.jpg',
      price: 25,
      description: 'Jeans, trousers, skirts'
    },
    {
      id: 6,
      name: 'Top Wear',
      image: '/laundry/wash & fold/top wear women.jpg',
      price: 20,
      description: 'Blouses, tops, kurtas'
    },
    {
      id: 7,
      name: 'Bottom Wear Half',
      image: '/laundry/wash & fold/bottom wear half women.jpg',
      price: 15,
      description: 'Undergarments, shorts'
    },
    {
      id: 8,
      name: 'Casual Jacket',
      image: '/laundry/wash & fold/casual jacket women.jpg',
      price: 40,
      description: 'Cardigans, light jackets'
    },
  ],
  homeLinen: [
    {
      id: 9,
      name: 'Curtain Thin',
      image: '/laundry/wash & fold/curtain thin.jpg',
      price: 35,
      description: 'Light curtains, sheers'
    },
    {
      id: 10,
      name: 'Towel',
      image: '/laundry/wash & fold/towel.jpg',
      price: 20,
      description: 'Bath towels, hand towels'
    },
    {
      id: 11,
      name: 'Big Table Cloth',
      image: '/laundry/wash & fold/big table cloth.webp',
      price: 50,
      description: 'Large table covers'
    },
    {
      id: 12,
      name: 'Pillow Cover',
      image: '/laundry/wash & fold/pillow cover.jpg',
      price: 15,
      description: 'Cushion covers, pillow cases'
    },
    {
      id: 13,
      name: 'Small Table Cloth',
      image: '/laundry/wash & fold/small table cloth.avif',
      price: 25,
      description: 'Small table covers'
    },
  ],
  accessories: [
    {
      id: 14,
      name: 'Socks',
      image: '/laundry/wash & fold/socks.jpg',
      price: 10,
      description: 'All types of socks'
    },
    {
      id: 15,
      name: 'Apron',
      image: '/laundry/wash & fold/apron.jpg',
      price: 30,
      description: 'Kitchen aprons'
    },
    {
      id: 16,
      name: 'Handkerchief',
      image: '/laundry/wash & fold/handkerchief.jpg',
      price: 8,
      description: 'Cloth handkerchiefs'
    },
    {
      id: 17,
      name: 'Undergarment',
      image: '/laundry/wash & fold/undergarment.webp',
      price: 15,
      description: 'Inner wear items'
    },
    {
      id: 18,
      name: 'Bath Robe',
      image: '/laundry/wash & fold/bath robe.jpg',
      price: 60,
      description: 'Terry cloth robes'
    },
  ],
  winterWear: [
    {
      id: 19,
      name: 'Sweatshirt/Hoodie',
      image: '/laundry/wash & fold/sweatshirthoodie.jpg',
      price: 50,
      description: 'Heavy sweatshirts, hoodies'
    },
    {
      id: 20,
      name: 'Sweater',
      image: '/laundry/wash & fold/sweater.jpg',
      price: 45,
      description: 'Woolen sweaters'
    },
    {
      id: 21,
      name: 'Shawl',
      image: '/laundry/wash & fold/shawl.jpg',
      price: 40,
      description: 'Woolen shawls, stoles'
    },
    {
      id: 22,
      name: 'Scarf/Muffler',
      image: '/laundry/wash & fold/scarf.jpg',
      price: 25,
      description: 'Winter scarfs, mufflers'
    },
  ],
  kids: [
    {
      id: 23,
      name: 'Kids Woollenwear Bottom',
      image: '/laundry/wash & fold/kids wollenwear.jpg',
      price: 30,
      description: 'Kids woolen pants'
    },
    {
      id: 24,
      name: 'Kids Bottomwear',
      image: '/laundry/wash & fold/kids bottomwear.jpg',
      price: 20,
      description: 'Kids shorts, pants'
    },
    {
      id: 25,
      name: 'Kids Jacket',
      image: '/laundry/wash & fold/kids jacket.webp',
      price: 35,
      description: 'Kids jackets, hoodies'
    },
    {
      id: 26,
      name: 'Kids Topwear',
      image: '/laundry/wash & fold/kids top wear.jpg',
      price: 18,
      description: 'Kids shirts, t-shirts'
    },
    {
      id: 27,
      name: 'Kids Woollenwear Top',
      image: '/laundry/wash & fold/kids wollenwear top.webp',
      price: 32,
      description: 'Kids woolen tops'
    },
  ]
};

const ironingItems = {
  men: [
    {
      id: 201,
      name: 'Top Wear',
      image: '/laundry/ironing/top wear.webp',
      price: 25,
      description: 'Shirts, t-shirts, polo shirts'
    },
    {
      id: 202,
      name: 'Bottom Wear',
      image: '/laundry/ironing/Bottom Wear.webp',
      price: 30,
      description: 'Jeans, trousers, formal pants'
    },
    {
      id: 203,
      name: 'Blazer/Jacket',
      image: '/laundry/ironing/blazer jacket.png',
      price: 60,
      description: 'Formal blazers and jackets'
    },
  ],
  women: [
    {
      id: 101,
      name: 'Bottom Wear',
      image: '/laundry/ironing/bottom wear women.webp',
      price: 30,
      description: 'Jeans, trousers, formal pants'
    },
    {
      id: 102,
      name: 'Top Wear',
      image: '/laundry/ironing/top wear women.webp',
      price: 25,
      description: 'Blouses, shirts, kurtas'
    },
    {
      id: 103,
      name: 'Saree/Lehenga',
      image: '/laundry/ironing/saree lehanga women.webp',
      price: 80,
      description: 'Traditional sarees and lehengas'
    },
    {
      id: 104,
      name: 'Blazer/Jacket',
      image: '/laundry/ironing/blazer jacket women.webp',
      price: 60,
      description: 'Formal blazers and jackets'
    },
  ],
  homeLinen: [
    {
      id: 105,
      name: 'Pillow Cover',
      image: '/laundry/ironing/pilow cover.webp',
      price: 20,
      description: 'Cushion covers, pillow cases'
    },
    {
      id: 106,
      name: 'Curtain Thin',
      image: '/laundry/ironing/curtain thin.webp',
      price: 40,
      description: 'Light curtains, sheers'
    },
    {
      id: 107,
      name: 'Towel',
      image: '/laundry/ironing/towel.webp',
      price: 25,
      description: 'Bath towels, hand towels'
    },
    {
      id: 108,
      name: 'Sofa Cover',
      image: '/laundry/ironing/sofa cover.webp',
      price: 70,
      description: 'Sofa and furniture covers'
    },
  ],
  accessories: [
    {
      id: 109,
      name: 'Handkerchief',
      image: '/laundry/ironing/handerkerchief.jpg',
      price: 12,
      description: 'Cloth handkerchiefs'
    },
    {
      id: 110,
      name: 'Bath Robe',
      image: '/laundry/ironing/bath robe.jpg',
      price: 65,
      description: 'Terry cloth robes'
    },
    {
      id: 111,
      name: 'Apron',
      image: '/laundry/ironing/apron.jpg',
      price: 35,
      description: 'Kitchen aprons'
    },
    {
      id: 112,
      name: 'Socks',
      image: '/laundry/ironing/socks.jpg',
      price: 15,
      description: 'All types of socks'
    },
    {
      id: 113,
      name: 'Undergarment',
      image: '/laundry/ironing/undergarment.webp',
      price: 18,
      description: 'Inner wear items'
    },
  ],
  winterWear: [
    {
      id: 114,
      name: 'Shawl',
      image: '/laundry/ironing/shawl.webp',
      price: 45,
      description: 'Woolen shawls, stoles'
    },
    {
      id: 115,
      name: 'Sweater',
      image: '/laundry/ironing/sweater.jpg',
      price: 50,
      description: 'Woolen sweaters'
    },
    {
      id: 116,
      name: 'Sweatshirt/Hoodie',
      image: '/laundry/ironing/sweatshirt hoodie.jpg',
      price: 55,
      description: 'Heavy sweatshirts, hoodies'
    },
    {
      id: 117,
      name: 'Scarf/Muffler',
      image: '/laundry/ironing/scurf muffler.jpg',
      price: 30,
      description: 'Winter scarfs, mufflers'
    },
  ],
  kids: [
    {
      id: 118,
      name: 'Kids Topwear',
      image: '/laundry/ironing/kids topwear.jpg',
      price: 22,
      description: 'Kids shirts, t-shirts'
    },
    {
      id: 119,
      name: 'Kids Bottomwear',
      image: '/laundry/ironing/kids bottomwear.jpg',
      price: 25,
      description: 'Kids shorts, pants'
    },
    {
      id: 120,
      name: 'Kids Jacket',
      image: '/laundry/ironing/kids jacket.webp',
      price: 40,
      description: 'Kids jackets, hoodies'
    },
    {
      id: 121,
      name: 'Kids Woollenwear Top',
      image: '/laundry/ironing/kids wollen top.webp',
      price: 35,
      description: 'Kids woolen tops'
    },
    {
      id: 122,
      name: 'Kids Woollenwear Bottom',
      image: '/laundry/ironing/kids wollenwear bottom.jpg',
      price: 35,
      description: 'Kids woolen pants'
    },
  ]
};

const dryCleanItems = {
  men: [
    {
      id: 301,
      name: 'Tshirt',
      image: '/laundry/dry clean/tshirt.webp',
      price: 45,
      description: 'Regular t-shirts'
    },
    {
      id: 302,
      name: 'Trousers/Pants Normal',
      image: '/laundry/dry clean/trousers pants normal.webp',
      price: 65,
      description: 'Regular trousers and pants'
    },
    {
      id: 303,
      name: 'Trousers/Pants Silk',
      image: '/laundry/dry clean/trousers pants silk.jpg',
      price: 85,
      description: 'Silk trousers and pants'
    },
    {
      id: 304,
      name: 'Casual Jacket Half',
      image: '/laundry/dry clean/casual jacket half.jpg',
      price: 120,
      description: 'Half-length casual jackets'
    },
    {
      id: 305,
      name: 'Casual Jacket Full',
      image: '/laundry/dry clean/causual jacket.jpg',
      price: 150,
      description: 'Full-length casual jackets'
    },
    {
      id: 306,
      name: 'Casual Jacket Leather',
      image: '/laundry/dry clean/casual jacket leather.jpg',
      price: 200,
      description: 'Leather jackets'
    },
    {
      id: 307,
      name: 'Ethnic Jacket Top',
      image: '/laundry/dry clean/ethnic jacket top.jpg',
      price: 140,
      description: 'Traditional ethnic jackets'
    },
    {
      id: 308,
      name: 'Sherwani Top',
      image: '/laundry/dry clean/sherwani top.jpg',
      price: 180,
      description: 'Traditional sherwani tops'
    },
    {
      id: 309,
      name: 'Shorts',
      image: '/laundry/dry clean/shorts.jpg',
      price: 50,
      description: 'All types of shorts'
    },
    {
      id: 310,
      name: 'Blazer/Suit 1 Piece',
      image: '/laundry/dry clean/blazer suit 1 piece.png',
      price: 160,
      description: 'Single piece blazer'
    },
    {
      id: 311,
      name: 'Blazer/Suit 2 Piece',
      image: '/laundry/dry clean/blazer suit 2 piece.jpg',
      price: 280,
      description: 'Two piece suit'
    },
    {
      id: 312,
      name: 'Kurta Silk',
      image: '/laundry/dry clean/kurta silk.jpg',
      price: 90,
      description: 'Silk kurtas'
    },
    {
      id: 313,
      name: 'Shirt Silk/Designer',
      image: '/laundry/dry clean/shirt silk designer.jpg',
      price: 75,
      description: 'Silk and designer shirts'
    },
    {
      id: 314,
      name: 'Shirt Normal',
      image: '/laundry/dry clean/shirt normal.jpg',
      price: 55,
      description: 'Regular cotton shirts'
    },
    {
      id: 315,
      name: 'Kurta Normal/Cotton',
      image: '/laundry/dry clean/kurta normal cotton.jpg',
      price: 70,
      description: 'Cotton kurtas'
    },
    {
      id: 316,
      name: 'Blazer/Suit 3 Piece',
      image: '/laundry/dry clean/blazer suit 3 piece.jpg',
      price: 380,
      description: 'Three piece suit'
    },
    {
      id: 317,
      name: 'Pathani Suit Top',
      image: '/laundry/dry clean/pathani suit top.jpg',
      price: 85,
      description: 'Pathani suit tops'
    },
    {
      id: 318,
      name: 'Tracksuit Jacket',
      image: '/laundry/dry clean/tracksuit jacket.jpg',
      price: 80,
      description: 'Sports tracksuit jackets'
    },
    {
      id: 319,
      name: 'Jeans',
      image: '/laundry/dry clean/jeans.webp',
      price: 70,
      description: 'Denim jeans'
    },
    {
      id: 320,
      name: 'Dhoti/Lungi',
      image: '/laundry/dry clean/dhoti lungi.jpg',
      price: 60,
      description: 'Traditional dhoti and lungi'
    },
  ],
  women: [
    {
      id: 401,
      name: 'Shirt Silk/Designer',
      image: '/laundry/dry clean/shirt silk designer women.webp',
      price: 75,
      description: 'Silk and designer shirts'
    },
    {
      id: 402,
      name: 'Jeans',
      image: '/laundry/dry clean/jeans women.jpg',
      price: 70,
      description: 'Denim jeans'
    },
    {
      id: 403,
      name: 'Blazer/Suit 1 Piece',
      image: '/laundry/dry clean/Blazer Suit 1 Piece women.webp',
      price: 160,
      description: 'Single piece blazer'
    },
    {
      id: 404,
      name: 'Shorts',
      image: '/laundry/dry clean/shorts women.jpg',
      price: 50,
      description: 'All types of shorts'
    },
    {
      id: 405,
      name: 'Top/Tshirt',
      image: '/laundry/dry clean/tshirt.webp',
      price: 45,
      description: 'Tops and t-shirts'
    },
    {
      id: 406,
      name: 'Saree Plain',
      image: '/laundry/dry clean/saree plain.jpg',
      price: 120,
      description: 'Plain sarees'
    },
    {
      id: 407,
      name: 'Saree Designer',
      image: '/laundry/dry clean/saree designer.jpg',
      price: 180,
      description: 'Designer sarees'
    },
    {
      id: 408,
      name: 'Saree Silk',
      image: '/laundry/dry clean/saree silk.jpg',
      price: 200,
      description: 'Pure silk sarees'
    },
    {
      id: 409,
      name: 'Saree Designer Heavy',
      image: '/laundry/dry clean/saree designer heavy.jpg',
      price: 300,
      description: 'Heavy designer sarees'
    },
    {
      id: 410,
      name: 'Blouse Normal/Cotton',
      image: '/laundry/dry clean/blouse normal cotton.jpg',
      price: 55,
      description: 'Cotton blouses'
    },
    {
      id: 411,
      name: 'Blouse Heavy Work',
      image: '/laundry/dry clean/blouse heavy work.jpg',
      price: 90,
      description: 'Heavy work blouses'
    },
    {
      id: 412,
      name: 'Petticoat/Shapewear',
      image: '/laundry/dry clean/petticoat.webp',
      price: 45,
      description: 'Petticoats and shapewear'
    },
    {
      id: 413,
      name: 'Frock',
      image: '/laundry/dry clean/frock.jpg',
      price: 80,
      description: 'Traditional frocks'
    },
    {
      id: 414,
      name: 'Kameez/Kurti Heavy Work',
      image: '/laundry/dry clean/kamezz.jpg',
      price: 95,
      description: 'Heavy work kameez/kurti'
    },
    {
      id: 415,
      name: 'Kameez/Kurti Normal',
      image: '/laundry/dry clean/kameez kurti normal.jpg',
      price: 65,
      description: 'Regular kameez/kurti'
    },
    {
      id: 416,
      name: 'Skirt Normal',
      image: '/laundry/dry clean/skirt normal.jpg',
      price: 60,
      description: 'Regular skirts'
    },
    {
      id: 417,
      name: 'Skirt Silk/Designer',
      image: '/laundry/dry clean/skirt silk designer.jpg',
      price: 85,
      description: 'Silk and designer skirts'
    },
    {
      id: 418,
      name: 'Lehenga Cotton',
      image: '/laundry/dry clean/lehanga cotton.jpg',
      price: 200,
      description: 'Cotton lehengas'
    },
    {
      id: 419,
      name: 'Lehenga High Work',
      image: '/laundry/dry clean/lehanga high work.webp',
      price: 400,
      description: 'High work lehengas'
    },
    {
      id: 420,
      name: 'Lehenga/Ghaagra Silk',
      image: '/laundry/dry clean/lehanga ghagra silk.jpg',
      price: 350,
      description: 'Silk lehengas and ghagras'
    },
    {
      id: 421,
      name: 'Shirt Normal',
      image: '/laundry/dry clean/shirt normal women.webp',
      price: 55,
      description: 'Regular cotton shirts'
    },
    {
      id: 422,
      name: 'Blazer/Suit 3 Piece',
      image: '/laundry/dry clean/blazer suit 3 piece women.jpg',
      price: 380,
      description: 'Three piece suit'
    },
    {
      id: 423,
      name: 'Blazer/Suit 2 Piece',
      image: '/laundry/dry clean/blazer suit 2 piece women.jpg',
      price: 280,
      description: 'Two piece suit'
    },
    {
      id: 424,
      name: 'Leggings',
      image: '/laundry/dry clean/leggings.jpg',
      price: 40,
      description: 'All types of leggings'
    },
    {
      id: 425,
      name: 'Pants',
      image: '/laundry/dry clean/pants.jpg',
      price: 65,
      description: 'Regular pants'
    },
    {
      id: 426,
      name: 'Pyjama (Normal)',
      image: '/laundry/dry clean/pyjama.jpg',
      price: 50,
      description: 'Regular pyjamas'
    },
    {
      id: 427,
      name: 'Pyjama (Silk)',
      image: '/laundry/dry clean/pyjama silk.jpg',
      price: 70,
      description: 'Silk pyjamas'
    },
    {
      id: 428,
      name: 'Salwaar Normal',
      image: '/laundry/dry clean/salwaar normal.jpg',
      price: 60,
      description: 'Regular salwar'
    },
    {
      id: 429,
      name: 'Salwaar Slik',
      image: '/laundry/dry clean/salwaar silk.jpg',
      price: 80,
      description: 'Silk salwar'
    },
    {
      id: 430,
      name: 'Dupatta Normal',
      image: '/laundry/dry clean/dupatta normal.jpg',
      price: 50,
      description: 'Regular dupatta'
    },
    {
      id: 431,
      name: 'Dupatta Silk',
      image: '/laundry/dry clean/dupatta silk.jpg',
      price: 75,
      description: 'Silk dupatta'
    },
    {
      id: 432,
      name: 'Dupatta Heavy Work',
      image: '/laundry/dry clean/dupatta heavy work.jpg',
      price: 120,
      description: 'Heavy work dupatta'
    },
    {
      id: 433,
      name: 'Tracksuit Jacket',
      image: '/laundry/dry clean/tracksuit jacket women.jpg',
      price: 80,
      description: 'Sports tracksuit jackets'
    },
    {
      id: 434,
      name: 'Lehenga Low Work',
      image: '/laundry/dry clean/lehenga low work.webp',
      price: 250,
      description: 'Low work lehengas'
    },
    {
      id: 435,
      name: 'Gown Medium Work',
      image: '/laundry/dry clean/gown medium work.jpg',
      price: 180,
      description: 'Medium work gowns'
    },
    {
      id: 436,
      name: 'Gown Heavy Work',
      image: '/laundry/dry clean/gown heavy work.jpg',
      price: 250,
      description: 'Heavy work gowns'
    },
    {
      id: 437,
      name: 'Wedding Gown Normal',
      image: '/laundry/dry clean/Wedding Gown Normal.jpg',
      price: 300,
      description: 'Regular wedding gowns'
    },
    {
      id: 438,
      name: 'Wedding Gown Heavy',
      image: '/laundry/dry clean/Wedding Gown Heavy.jpg',
      price: 500,
      description: 'Heavy wedding gowns'
    },
    {
      id: 439,
      name: 'Maxi',
      image: '/laundry/dry clean/maxi.jpg',
      price: 70,
      description: 'Maxi dresses'
    },
    {
      id: 440,
      name: 'Jumpsuit',
      image: '/laundry/dry clean/Jumpsuit.jpg',
      price: 90,
      description: 'All types of jumpsuits'
    },
    {
      id: 441,
      name: 'Trousers/Pants Normal',
      image: '/laundry/dry clean/Trousers Pants Normal women.jpg',
      price: 65,
      description: 'Regular trousers and pants'
    },
    {
      id: 442,
      name: 'Trousers/Pants Silk',
      image: '/laundry/dry clean/Trousers Pants Silk women.jpg',
      price: 85,
      description: 'Silk trousers and pants'
    },
    {
      id: 443,
      name: 'Casual Jacket Leather',
      image: '/laundry/dry clean/casual jacket leather women.jpg',
      price: 200,
      description: 'Leather jackets'
    },
    {
      id: 444,
      name: 'Casual Jacket',
      image: '/laundry/dry clean/causual jacket.jpg',
      price: 120,
      description: 'Regular casual jackets'
    },
    {
      id: 445,
      name: 'Dress- One Piece',
      image: '/laundry/dry clean/Dress- One Piece.jpg',
      price: 85,
      description: 'One piece dresses'
    },
  ],
  homeLinen: [
    {
      id: 501,
      name: 'Quilt Single Size',
      image: '/laundry/dry clean/Quilt Single Size.jpg',
      price: 150,
      description: 'Single size quilts'
    },
    {
      id: 502,
      name: 'Bedsheet Single Size',
      image: '/laundry/dry clean/Bedsheet Single Size.jpg',
      price: 80,
      description: 'Single size bedsheets'
    },
    {
      id: 503,
      name: 'Bedsheet Double/Queen Size',
      image: '/laundry/dry clean/Bedsheet Double Queen Size.jpg',
      price: 120,
      description: 'Double/Queen size bedsheets'
    },
    {
      id: 504,
      name: 'Bedsheet King Size',
      image: '/laundry/dry clean/Bedsheet King Size.jpg',
      price: 150,
      description: 'King size bedsheets'
    },
    {
      id: 505,
      name: 'Quilt Double/Queen Size',
      image: '/laundry/dry clean/quilt double queen size.jpg',
      price: 250,
      description: 'Double/Queen size quilts'
    },
    {
      id: 506,
      name: 'Quilt King Size',
      image: '/laundry/dry clean/quilt king size.jpg',
      price: 300,
      description: 'King size quilts'
    },
    {
      id: 507,
      name: 'Blanket Single Size',
      image: '/laundry/dry clean/Blanket Single Size.jpg',
      price: 120,
      description: 'Single size blankets'
    },
    {
      id: 508,
      name: 'Blanket Double/Queen Size',
      image: '/laundry/dry clean/Blanket Double Queen Size.jpg',
      price: 180,
      description: 'Double/Queen size blankets'
    },
    {
      id: 509,
      name: 'Blanket King Size',
      image: '/laundry/dry clean/Blanket King Size.jpg',
      price: 220,
      description: 'King size blankets'
    },
    {
      id: 510,
      name: 'Window Curtain',
      image: '/laundry/dry clean/Window Curtain.jpg',
      price: 100,
      description: 'Window curtains'
    },
    {
      id: 511,
      name: 'Door Curtain',
      image: '/laundry/dry clean/Door Curtain.jpg',
      price: 80,
      description: 'Door curtains'
    },
    {
      id: 512,
      name: 'Door Mat',
      image: '/laundry/dry clean/door mat.jpg',
      price: 60,
      description: 'Door mats'
    },
    {
      id: 513,
      name: 'Bath Towel',
      image: '/laundry/dry clean/Bath Towel.jpg',
      price: 50,
      description: 'Bath towels'
    },
    {
      id: 514,
      name: 'Hand Towel',
      image: '/laundry/dry clean/Hand Towel.jpg',
      price: 30,
      description: 'Hand towels'
    },
    {
      id: 515,
      name: 'Small Table Cloth',
      image: '/laundry/dry clean/Small Table Cloth.avif',
      price: 40,
      description: 'Small table covers'
    },
    {
      id: 516,
      name: 'Big Table Cloth',
      image: '/laundry/dry clean/Big Table Cloth.avif',
      price: 80,
      description: 'Large table covers'
    },
    {
      id: 517,
      name: 'Car Cover',
      image: '/laundry/dry clean/car cover.jpg',
      price: 200,
      description: 'Car covers'
    },
    {
      id: 518,
      name: 'Comforter Single',
      image: '/laundry/dry clean/Comforter Single.jpg',
      price: 180,
      description: 'Single size comforters'
    },
    {
      id: 519,
      name: 'Comforter Double',
      image: '/laundry/dry clean/Comforter Double.jpg',
      price: 280,
      description: 'Double size comforters'
    },
    {
      id: 520,
      name: 'Bed Cover',
      image: '/laundry/dry clean/Bed Cover.avif',
      price: 120,
      description: 'Bed covers'
    },
    {
      id: 521,
      name: 'Pillow Cover',
      image: '/laundry/dry clean/Pillow Cover.jpg',
      price: 25,
      description: 'Pillow covers'
    },
    {
      id: 522,
      name: 'Cushion Cover',
      image: '/laundry/dry clean/Cushion Cover.jpg',
      price: 30,
      description: 'Cushion covers'
    },
  ],
  accessories: [
    {
      id: 601,
      name: 'Tie',
      image: '/laundry/dry clean/Tie.webp',
      price: 35,
      description: 'Neckties'
    },
    {
      id: 602,
      name: 'Small Bag',
      image: '/laundry/dry clean/Small Bag.webp',
      price: 60,
      description: 'Small bags'
    },
    {
      id: 603,
      name: 'Medium Bag',
      image: '/laundry/dry clean/Medium Bag.jpg',
      price: 80,
      description: 'Medium bags'
    },
    {
      id: 604,
      name: 'Large Bag',
      image: '/laundry/dry clean/Large Bag.jpg',
      price: 120,
      description: 'Large bags'
    },
    {
      id: 605,
      name: 'Normal Cap/Hat',
      image: '/laundry/dry clean/Normal Cap Hat.jpg',
      price: 40,
      description: 'Regular caps and hats'
    },
    {
      id: 606,
      name: 'Socks Cotton',
      image: '/laundry/dry clean/socks cotton.jpg',
      price: 20,
      description: 'Cotton socks'
    },
    {
      id: 607,
      name: 'Handkerchief Cotton',
      image: '/laundry/dry clean/Handkerchief Cotton.jpg',
      price: 15,
      description: 'Cotton handkerchiefs'
    },
    {
      id: 608,
      name: 'Handkerchief Silk',
      image: '/laundry/dry clean/Handkerchief Silk.jpg',
      price: 25,
      description: 'Silk handkerchiefs'
    },
    {
      id: 609,
      name: 'Bath Robe',
      image: '/laundry/dry clean/Bath Robe.jpg',
      price: 120,
      description: 'Bath robes'
    },
    {
      id: 610,
      name: 'Apron',
      image: '/laundry/dry clean/apron.jpg',
      price: 50,
      description: 'Kitchen aprons'
    },
    {
      id: 611,
      name: 'Leather Gloves',
      image: '/laundry/dry clean/Leather Gloves.jpg',
      price: 80,
      description: 'Leather gloves'
    },
  ],
  winterWear: [
    {
      id: 701,
      name: 'Woollen Innerwear Top',
      image: '/laundry/dry clean/Woollen Innerwear Top.jpg',
      price: 60,
      description: 'Woollen inner tops'
    },
    {
      id: 702,
      name: 'Woollen Innerwear Bottom',
      image: '/laundry/dry clean/Woollen Innerwear Bottom.jpg',
      price: 65,
      description: 'Woollen inner bottoms'
    },
    {
      id: 703,
      name: 'Long Coat',
      image: '/laundry/dry clean/Long Coat.jpg',
      price: 250,
      description: 'Long winter coats'
    },
    {
      id: 704,
      name: 'Quilted Jacket',
      image: '/laundry/dry clean/quilted jacket.jpg',
      price: 180,
      description: 'Quilted jackets'
    },
    {
      id: 705,
      name: 'Woollen Coat Half',
      image: '/laundry/dry clean/Woollen Coat Half.jpg',
      price: 200,
      description: 'Half-length woollen coats'
    },
    {
      id: 706,
      name: 'Woollen Coat Full',
      image: '/laundry/dry clean/Woollen Coat Full.jpg',
      price: 280,
      description: 'Full-length woollen coats'
    },
    {
      id: 707,
      name: 'Shawl',
      image: '/laundry/dry clean/Shawl.jpg',
      price: 70,
      description: 'Woollen shawls'
    },
    {
      id: 708,
      name: 'Cardigan/Shrug',
      image: '/laundry/dry clean/Cardigan Shrug.jpg',
      price: 80,
      description: 'Cardigans and shrugs'
    },
    {
      id: 709,
      name: 'Scarf/Muffler',
      image: '/laundry/dry clean/Scarf Muffler.jpg',
      price: 45,
      description: 'Scarfs and mufflers'
    },
    {
      id: 710,
      name: 'Windcheater',
      image: '/laundry/dry clean/Windcheater.webp',
      price: 120,
      description: 'Windcheater jackets'
    },
    {
      id: 711,
      name: 'Sweater',
      image: '/laundry/dry clean/sweater.jpg',
      price: 90,
      description: 'Woollen sweaters'
    },
    {
      id: 712,
      name: 'Sweatshirt/Hoodie',
      image: '/laundry/dry clean/sweatshirt.jpg',
      price: 100,
      description: 'Sweatshirts and hoodies'
    },
    {
      id: 713,
      name: 'Woollen Gloves',
      image: '/laundry/dry clean/Woollen Gloves.jpg',
      price: 40,
      description: 'Woollen gloves'
    },
    {
      id: 714,
      name: 'Woollen Cap/Hat',
      image: '/laundry/dry clean/Woollen Cap Hat.jpg',
      price: 35,
      description: 'Woollen caps and hats'
    },
    {
      id: 715,
      name: 'Socks Woollen',
      image: '/laundry/dry clean/Socks Woollen.jpg',
      price: 30,
      description: 'Woollen socks'
    },
  ],
  kids: [
    {
      id: 801,
      name: 'Kids Bottomwear',
      image: '/laundry/dry clean/Kids Bottomwear.jpg',
      price: 45,
      description: 'Kids bottom wear'
    },
    {
      id: 802,
      name: 'Kids Topwear',
      image: '/laundry/dry clean/Kids Topwear.jpg',
      price: 40,
      description: 'Kids top wear'
    },
    {
      id: 803,
      name: 'Kids Woollenwear Top',
      image: '/laundry/dry clean/Kids Woollenwear Top.webp',
      price: 60,
      description: 'Kids woollen tops'
    },
    {
      id: 804,
      name: 'Kids Woollenwear Bottom',
      image: '/laundry/dry clean/Kids Woollenwear Bottom.jpg',
      price: 65,
      description: 'Kids woollen bottoms'
    },
    {
      id: 805,
      name: 'Kids Jacket',
      image: '/laundry/dry clean/kids jacket.webp',
      price: 80,
      description: 'Kids jackets'
    },
  ]
};

// Reorganized Shoe Clean Items with Tiers
const shoeCleanItems = {
  dailyWear: [
    {
      id: 901,
      name: 'Sandals',
      image: '/laundry/shoe clean/Normal Shoes.jpg',
      price: 70,
      description: 'Casual and formal sandals',
      tier: 'Daily Wear / Regulars',
      icon: '🩴'
    },
    {
      id: 902,
      name: 'Slippers',
      image: '/laundry/shoe clean/Normal Shoes.jpg',
      price: 60,
      description: 'Indoor and outdoor slippers',
      tier: 'Daily Wear / Regulars',
      icon: '🩴'
    },
    {
      id: 903,
      name: 'Normal Shoes',
      image: '/laundry/shoe clean/Normal Shoes.jpg',
      price: 80,
      description: 'Regular casual shoes',
      tier: 'Daily Wear / Regulars',
      icon: '👟'
    },
  ],
  premium: [
    {
      id: 904,
      name: 'Sports Shoes',
      image: '/laundry/shoe clean/Sports Shoes.jpg',
      price: 90,
      description: 'Athletic and sports shoes',
      tier: 'Premium',
      icon: '⚽'
    },
    {
      id: 905,
      name: 'Sneakers',
      image: '/laundry/shoe clean/Sports Shoes.jpg',
      price: 95,
      description: 'Canvas and fabric sneakers',
      tier: 'Premium',
      icon: '👟'
    },
    {
      id: 906,
      name: 'Running Shoes',
      image: '/laundry/shoe clean/Sports Shoes.jpg',
      price: 100,
      description: 'Performance running shoes',
      tier: 'Premium',
      icon: '🏃'
    },
  ],
  luxury: [
    {
      id: 907,
      name: 'White Shoes',
      image: '/laundry/shoe clean/leather shoes.jpg',
      price: 110,
      description: 'Premium white shoes and sneakers',
      tier: 'Luxury',
      icon: '✨'
    },
    {
      id: 908,
      name: 'Leather Shoes',
      image: '/laundry/shoe clean/leather shoes.jpg',
      price: 100,
      description: 'Formal leather shoes',
      tier: 'Luxury',
      icon: '👞'
    },
    {
      id: 909,
      name: 'Heels',
      image: '/laundry/shoe clean/Heels.jpg',
      price: 110,
      description: 'High heels and formal shoes',
      tier: 'Luxury',
      icon: '👠'
    },
    {
      id: 910,
      name: 'Designer Shoes',
      image: '/laundry/shoe clean/leather shoes.jpg',
      price: 150,
      description: 'Premium designer footwear',
      tier: 'Luxury',
      icon: '💎'
    },
  ],
  elite: [
    {
      id: 911,
      name: 'Elite Boots',
      image: '/laundry/shoe clean/boots.jpg',
      price: 200,
      description: 'Premium boots with complete care',
      tier: 'Elite',
      icon: '🥾',
      includes: 'Spray kit + Premium socks'
    },
    {
      id: 912,
      name: 'Elite Formal',
      image: '/laundry/shoe clean/leather shoes.jpg',
      price: 180,
      description: 'Premium formal shoes with elite service',
      tier: 'Elite',
      icon: '👔',
      includes: 'Spray kit + Premium socks'
    },
    {
      id: 913,
      name: 'Elite Loafers',
      image: '/laundry/shoe clean/leather shoes.jpg',
      price: 170,
      description: 'Premium loafers with complete care',
      tier: 'Elite',
      icon: '🎩',
      includes: 'Spray kit + Premium socks'
    },
  ]
};

// Saree Items with Different Service Tiers
const sareeItems = {
  regularWash: [
    {
      id: 1101,
      name: 'Cotton Saree',
      image: '/laundry/dry clean/saree plain.jpg',
      price: 80,
      description: 'Regular wash for everyday cotton sarees',
      tier: 'Regular Wash',
      icon: '👗'
    },
    {
      id: 1102,
      name: 'Synthetic Saree',
      image: '/laundry/dry clean/saree plain.jpg',
      price: 70,
      description: 'Regular wash for synthetic sarees',
      tier: 'Regular Wash',
      icon: '👗'
    },
  ],
  luxuryWash: [
    {
      id: 1103,
      name: 'Silk Saree',
      image: '/laundry/dry clean/saree silk.jpg',
      price: 200,
      description: 'Luxury care for pure silk sarees',
      tier: 'Luxury Wash',
      icon: '✨'
    },
    {
      id: 1104,
      name: 'Designer Saree',
      image: '/laundry/dry clean/saree designer.jpg',
      price: 180,
      description: 'Luxury care for designer sarees',
      tier: 'Luxury Wash',
      icon: '💎'
    },
    {
      id: 1105,
      name: 'Heavy Work Saree',
      image: '/laundry/dry clean/saree designer heavy.jpg',
      price: 300,
      description: 'Luxury care for heavily embroidered sarees',
      tier: 'Luxury Wash',
      icon: '👑'
    },
  ],
  personalizedCare: [
    {
      id: 1106,
      name: 'Bridal Saree',
      image: '/laundry/dry clean/saree designer heavy.jpg',
      price: 500,
      description: 'Personalized care for bridal sarees',
      tier: 'Personalized Care',
      icon: '💍',
      includes: 'Hand wash + Special packaging + Photo documentation'
    },
    {
      id: 1107,
      name: 'Kanjivaram Saree',
      image: '/laundry/dry clean/saree silk.jpg',
      price: 400,
      description: 'Personalized care for traditional Kanjivaram silk',
      tier: 'Personalized Care',
      icon: '🪷',
      includes: 'Hand wash + Special packaging + Photo documentation'
    },
    {
      id: 1108,
      name: 'Heirloom Saree',
      image: '/laundry/dry clean/saree designer.jpg',
      price: 600,
      description: 'Personalized care for precious heirloom sarees',
      tier: 'Personalized Care',
      icon: '🏛️',
      includes: 'Hand wash + Special packaging + Photo documentation'
    },
  ]
};

// Blazers, Suits, and Sherwanis with Service Tiers
const formalWearItems = {
  regular: [
    {
      id: 1201,
      name: 'Blazer - Regular',
      image: '/laundry/dry clean/blazer suit 1 piece.png',
      price: 160,
      description: 'Standard dry cleaning for blazers',
      tier: 'Regular',
      icon: '🧥'
    },
    {
      id: 1202,
      name: '2-Piece Suit',
      image: '/laundry/dry clean/blazer suit 2 piece.jpg',
      price: 280,
      description: 'Standard dry cleaning for 2-piece suits',
      tier: 'Regular',
      icon: '👔'
    },
    {
      id: 1203,
      name: 'Sherwani - Regular',
      image: '/laundry/dry clean/sherwani top.jpg',
      price: 180,
      description: 'Standard cleaning for sherwanis',
      tier: 'Regular',
      icon: '🤵'
    },
  ],
  premium: [
    {
      id: 1204,
      name: 'Premium Blazer',
      image: '/laundry/dry clean/blazer suit 1 piece.png',
      price: 220,
      description: 'Premium care with steam press',
      tier: 'Premium',
      icon: '✨'
    },
    {
      id: 1205,
      name: 'Premium 3-Piece Suit',
      image: '/laundry/dry clean/blazer suit 3 piece.jpg',
      price: 380,
      description: 'Premium care for 3-piece suits',
      tier: 'Premium',
      icon: '💼'
    },
    {
      id: 1206,
      name: 'Premium Sherwani',
      image: '/laundry/dry clean/sherwani top.jpg',
      price: 250,
      description: 'Premium care with special attention',
      tier: 'Premium',
      icon: '👑'
    },
  ],
  elite: [
    {
      id: 1207,
      name: 'Elite Blazer',
      image: '/laundry/dry clean/blazer suit 1 piece.png',
      price: 300,
      description: 'Elite service with special perks',
      tier: 'Elite',
      icon: '💎',
      includes: '10% off alterations + Free perfume',
      discount: '10% off alterations'
    },
    {
      id: 1208,
      name: 'Elite Designer Suit',
      image: '/laundry/dry clean/blazer suit 3 piece.jpg',
      price: 500,
      description: 'Elite care for designer suits',
      tier: 'Elite',
      icon: '🎩',
      includes: '10% off alterations + Free perfume',
      discount: '10% off alterations'
    },
    {
      id: 1209,
      name: 'Elite Sherwani',
      image: '/laundry/dry clean/sherwani top.jpg',
      price: 400,
      description: 'Elite care for premium sherwanis',
      tier: 'Elite',
      icon: '🔱',
      includes: '10% off alterations + Free perfume',
      discount: '10% off alterations'
    },
  ]
};

// Stain Removal Items (with variable pricing)
const stainRemovalItems = [
  {
    id: 1301,
    name: 'Basic Stain Treatment',
    image: '/laundry/wash & fold/top waer.jpg',
    basePrice: 40,
    description: 'Fresh food stains, tea, coffee, light sweat marks',
    tier: 'Basic',
    icon: '🧼',
    requiresPhoto: false,
    examples: 'Coffee, Tea, Light Food Stains, Sweat',
    category: 'Everyday Stains'
  },
  {
    id: 1302,
    name: 'Oil & Grease Removal',
    image: '/laundry/wash & fold/bottom wear.jpg',
    basePrice: 80,
    description: 'Oil, butter, cooking grease, automotive oils',
    tier: 'Medium',
    icon: '🛢️',
    requiresPhoto: true,
    examples: 'Cooking Oil, Butter, Vehicle Grease',
    category: 'Oil-Based Stains'
  },
  {
    id: 1303,
    name: 'Ink & Dye Removal',
    image: '/laundry/ironing/top wear.webp',
    basePrice: 120,
    description: 'Pen ink, marker stains, fabric dye bleeding',
    tier: 'Advanced',
    icon: '🖊️',
    requiresPhoto: true,
    requiresVideo: false,
    examples: 'Pen Ink, Markers, Dye Transfer',
    category: 'Chemical Stains'
  },
  {
    id: 1304,
    name: 'Wine & Beverage Stains',
    image: '/laundry/wash & fold/casual jacket.jpg',
    basePrice: 100,
    description: 'Red wine, soft drinks, juice, beer stains',
    tier: 'Advanced',
    icon: '🍷',
    requiresPhoto: true,
    examples: 'Wine, Juice, Cola, Beer',
    category: 'Beverage Stains'
  },
  {
    id: 1305,
    name: 'Blood & Protein Stains',
    image: '/laundry/wash & fold/bottom wear half.jpg',
    basePrice: 90,
    description: 'Blood, sweat, egg, dairy product stains',
    tier: 'Medium',
    icon: '💉',
    requiresPhoto: true,
    examples: 'Blood, Heavy Sweat, Egg, Milk',
    category: 'Protein-Based Stains'
  },
  {
    id: 1306,
    name: 'Mud & Outdoor Stains',
    image: '/laundry/wash & fold/kids bottomwear.jpg',
    basePrice: 70,
    description: 'Mud, grass, dirt, clay stains',
    tier: 'Medium',
    icon: '🌿',
    requiresPhoto: false,
    examples: 'Mud, Grass, Dirt, Clay',
    category: 'Outdoor Stains'
  },
  {
    id: 1307,
    name: 'Makeup & Cosmetic Removal',
    image: '/laundry/wash & fold/top wear women.jpg',
    basePrice: 85,
    description: 'Lipstick, foundation, mascara, nail polish',
    tier: 'Advanced',
    icon: '💄',
    requiresPhoto: true,
    examples: 'Lipstick, Foundation, Nail Polish',
    category: 'Cosmetic Stains'
  },
  {
    id: 1308,
    name: 'Rust & Metal Stains',
    image: '/laundry/wash & fold/bottom wear women.jpg',
    basePrice: 110,
    description: 'Rust marks, metal transfer, oxidation stains',
    tier: 'Advanced',
    icon: '🔩',
    requiresPhoto: true,
    requiresVideo: false,
    examples: 'Rust, Metal Transfer, Iron Stains',
    category: 'Metal-Based Stains'
  },
  {
    id: 1309,
    name: 'Premium Delicate Fabric Treatment',
    image: '/laundry/ironing/saree lehanga women.webp',
    basePrice: 200,
    description: 'Specialized treatment for silk, wool, designer fabrics',
    tier: 'Premium',
    icon: '💎',
    requiresPhoto: true,
    requiresVideo: true,
    examples: 'Silk, Wool, Designer Fabrics',
    note: 'Price varies based on fabric type',
    category: 'Specialty Treatment'
  },
  {
    id: 1310,
    name: 'Emergency Same-Day Stain Removal',
    image: '/laundry/wash & fold/apron.jpg',
    basePrice: 150,
    description: 'Urgent stain treatment within 24 hours',
    tier: 'Express',
    icon: '⚡',
    requiresPhoto: true,
    examples: 'Any Fresh Stain - Express Service',
    note: 'Base price + 50% of treatment cost',
    category: 'Express Service'
  },
];

// Detergent options for wash services
const detergentOptions = [
  { id: 'detergent-ariel', name: 'Ariel', price: 0 },
  { id: 'detergent-surf-excel', name: 'Surf Excel', price: 0 },
  { id: 'detergent-comfort', name: 'Comfort', price: 0 },
  { id: 'detergent-dettol', name: 'Dettol', price: 0 },
  { id: 'detergent-bio-wash', name: 'Bio wash', price: 0 },
  { id: 'detergent-organic', name: 'Organic wash', price: 0 },
];

// Add-ons for different categories (Express Service removed as per requirements)
const addOns = {
  shoeClean: [
    {
      id: 'addon-shoe-1',
      name: 'Shoe Deodorizer',
      price: 30,
      description: 'Fresh scent treatment'
    },
    {
      id: 'addon-shoe-2',
      name: 'Lace Replacement',
      price: 40,
      description: 'New premium laces'
    },
    {
      id: 'addon-shoe-3',
      name: 'Sole Whitening',
      price: 50,
      description: 'Restore white soles'
    },
    {
      id: 'addon-shoe-4',
      name: 'Waterproof Spray',
      price: 60,
      description: 'Water and stain protection'
    },
    {
      id: 'addon-shoe-5',
      name: 'Premium Socks',
      price: 100,
      description: 'High-quality premium socks (Elite package included)'
    },
  ],
  washFold: [
    {
      id: 'addon-wash-1',
      name: 'Fabric Softener',
      price: 30,
      description: 'Extra soft and fragrant'
    },
    {
      id: 'addon-wash-2',
      name: 'Stain Treatment',
      price: 40,
      description: 'Deep stain removal'
    },
    {
      id: 'addon-wash-3',
      name: 'Perfume Spray',
      price: 35,
      description: 'Long-lasting fragrance'
    },
  ],
  ironing: [
    {
      id: 'addon-iron-1',
      name: 'Starch Treatment',
      price: 25,
      description: 'Crisp finish'
    },
    {
      id: 'addon-iron-2',
      name: 'Perfume Spray',
      price: 35,
      description: 'Fresh scent'
    },
    {
      id: 'addon-iron-3',
      name: 'Crease Protection',
      price: 30,
      description: 'Long-lasting press'
    },
  ],
  dryClean: [
    {
      id: 'addon-dry-1',
      name: 'Stain Guard',
      price: 50,
      description: 'Protective coating'
    },
    {
      id: 'addon-dry-2',
      name: 'Delicate Care',
      price: 45,
      description: 'Extra gentle handling'
    },
    {
      id: 'addon-dry-3',
      name: 'Perfume Infusion',
      price: 40,
      description: 'Luxury fragrance'
    },
  ],
  sarees: [
    {
      id: 'addon-saree-1',
      name: 'Special Packaging',
      price: 50,
      description: 'Premium gift-ready packaging'
    },
    {
      id: 'addon-saree-2',
      name: 'Photo Documentation',
      price: 30,
      description: 'Before and after photos'
    },
    {
      id: 'addon-saree-3',
      name: 'Pleat Setting',
      price: 80,
      description: 'Traditional pleat arrangement and setting'
    },
    {
      id: 'addon-saree-4',
      name: 'Border Restoration',
      price: 100,
      description: 'Special care for damaged borders'
    },
  ],
  formalWear: [
    {
      id: 'addon-formal-1',
      name: 'Premium Perfume',
      price: 60,
      description: 'Luxury fragrance infusion (Included in Elite)'
    },
    {
      id: 'addon-formal-2',
      name: 'Alterations Service',
      price: 200,
      description: '10% discount applied for Elite package'
    },
    {
      id: 'addon-formal-3',
      name: 'Steam Press',
      price: 50,
      description: 'Professional steam pressing'
    },
    {
      id: 'addon-formal-4',
      name: 'Hanger Packaging',
      price: 40,
      description: 'Premium hanger with garment bag'
    },
  ],
  stainRemoval: [
    {
      id: 'addon-stain-1',
      name: 'Express Service',
      price: 100,
      description: '24-hour service'
    },
    {
      id: 'addon-stain-2',
      name: 'Fabric Protection',
      price: 80,
      description: 'Post-treatment protection spray'
    },
    {
      id: 'addon-stain-3',
      name: 'Color Restoration',
      price: 120,
      description: 'Restore faded colors'
    },
  ],
};

const bedsheetWashItems = {
  homeLinen: [
    {
      id: 1001,
      name: 'Wash-Single Size',
      image: '/laundry/bedsheet/Wash-Single Size.webp',
      price: 60,
      description: 'Single size bedsheet washing'
    },
    {
      id: 1002,
      name: 'Wash-Double Size',
      image: '/laundry/bedsheet/Wash-Double Size.webp',
      price: 80,
      description: 'Double size bedsheet washing'
    },
    {
      id: 1003,
      name: 'Wash-King Size',
      image: '/laundry/bedsheet/Wash-King Size.webp',
      price: 100,
      description: 'King size bedsheet washing'
    },
    {
      id: 1004,
      name: 'Sofa Cover',
      image: '/laundry/bedsheet/Sofa Cover.jpg',
      price: 120,
      description: 'Sofa cover heavy washing'
    },
    {
      id: 1005,
      name: 'Iron-Single Size',
      image: '/laundry/bedsheet/Iron-Single Size.webp',
      price: 40,
      description: 'Single size bedsheet ironing'
    },
    {
      id: 1006,
      name: 'Iron-Double Size',
      image: '/laundry/bedsheet/Iron-Double Size.webp',
      price: 60,
      description: 'Double size bedsheet ironing'
    },
    {
      id: 1007,
      name: 'Iron-King Size',
      image: '/laundry/bedsheet/Iron-King Size.webp',
      price: 80,
      description: 'King size bedsheet ironing'
    },
    {
      id: 1008,
      name: 'Wash&Iron-Single',
      image: '/laundry/bedsheet/Wash&Iron-Single.webp',
      price: 90,
      description: 'Single size wash and iron'
    },
    {
      id: 1009,
      name: 'Wash&Iron-Double',
      image: '/laundry/bedsheet/Wash&Iron-Double.webp',
      price: 120,
      description: 'Double size wash and iron'
    },
    {
      id: 1010,
      name: 'Wash&Iron-King',
      image: '/laundry/bedsheet/Wash&Iron-King.webp',
      price: 150,
      description: 'King size wash and iron'
    },
  ]
};

export default function LaundryPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('mens-wash');
  const [quantities, setQuantities] = useState({});
  const [selectedAddons, setSelectedAddons] = useState({});
  const [showAddonsModal, setShowAddonsModal] = useState(false);
  const [selectedDetergent, setSelectedDetergent] = useState(null);
  const [tempSelectedAddons, setTempSelectedAddons] = useState({});
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Check for booking data from HeroSection
  useEffect(() => {
    const storedBooking = localStorage.getItem('pendingBooking');
    if (storedBooking) {
      const data = JSON.parse(storedBooking);
      // Only show booking data if it's for laundry service and within 10 minutes
      if (data.category === 'Laundry Service' && (Date.now() - data.timestamp) < 600000) {
        setBookingData(data);
      }
    }
  }, []);

  const clearBookingData = () => {
    setBookingData(null);
    localStorage.removeItem('pendingBooking');
  };

  const addToBasket = (item) => {
    const currentQuantity = quantities[item.id] || 0;
    setQuantities(prev => ({
      ...prev,
      [item.id]: currentQuantity + 1
    }));
  };

  const removeFromBasket = (item) => {
    const currentQuantity = quantities[item.id] || 0;
    if (currentQuantity > 0) {
      setQuantities(prev => ({
        ...prev,
        [item.id]: currentQuantity - 1
      }));
    }
  };

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonId]: !prev[addonId]
    }));
  };

  const toggleTempAddon = (addonId) => {
    setTempSelectedAddons(prev => ({
      ...prev,
      [addonId]: !prev[addonId]
    }));
  };

  const getRelevantAddons = () => {
    // Determine which addons to show based on selected items
    const hasWashFoldItems = Object.keys(quantities).some(id => {
      const numId = parseInt(id);
      return (numId >= 1 && numId <= 27) && quantities[id] > 0; // wash-fold items
    });
    
    const hasIroningItems = Object.keys(quantities).some(id => {
      const numId = parseInt(id);
      return (numId >= 101 && numId <= 122) && quantities[id] > 0; // ironing items
    });
    
    const hasDryCleanItems = Object.keys(quantities).some(id => {
      const numId = parseInt(id);
      return (numId >= 301 && numId <= 541) && quantities[id] > 0; // dry clean items
    });
    
    const hasShoeItems = Object.keys(quantities).some(id => {
      const numId = parseInt(id);
      return (numId >= 901 && numId <= 910) && quantities[id] > 0; // shoe items
    });

    let relevantAddons = [];
    if (hasWashFoldItems) relevantAddons = [...relevantAddons, ...addOns.washFold];
    if (hasIroningItems) relevantAddons = [...relevantAddons, ...addOns.ironing];
    if (hasDryCleanItems) relevantAddons = [...relevantAddons, ...addOns.dryClean];
    if (hasShoeItems) relevantAddons = [...relevantAddons, ...addOns.shoeClean];

    // Remove duplicates based on id
    return relevantAddons.filter((addon, index, self) =>
      index === self.findIndex((a) => a.id === addon.id)
    );
  };

  const shouldShowDetergentSelection = () => {
    // Show detergent selection for wash-fold and wash-iron items
    return Object.keys(quantities).some(id => {
      const numId = parseInt(id);
      return (numId >= 1 && numId <= 27) && quantities[id] > 0; // wash-fold items
    });
  };

  const getItemQuantity = (itemId) => {
    return quantities[itemId] || 0;
  };

  const openAddonsModal = () => {
    // Reset temp selections
    setTempSelectedAddons({});
    setSelectedDetergent(null);
    setShowAddonsModal(true);
  };

  const closeAddonsModal = () => {
    setShowAddonsModal(false);
  };

  const skipAddonsAndAddToCart = () => {
    // Clear temp selections and proceed without add-ons
    setTempSelectedAddons({});
    setSelectedDetergent(null);
    proceedToAddToCart();
    closeAddonsModal();
  };

  const confirmAddToCart = () => {
    // Proceed with adding to cart
    proceedToAddToCart();
    
    // Close modal
    closeAddonsModal();
  };

  const proceedToAddToCart = () => {
    // Check all categories for items with quantities, regardless of active category
    const allCategoryItems = [
      { items: clothingItems, categoryName: 'Laundry Service', serviceName: 'laundry' },
      { items: ironingItems, categoryName: 'Ironing Service', serviceName: 'laundry' },
      { items: dryCleanItems, categoryName: 'Dry Clean Service', serviceName: 'laundry' },
      { items: shoeCleanItems, categoryName: 'Shoe Clean Service', serviceName: 'laundry' },
      { items: bedsheetWashItems, categoryName: 'Bedsheet/Heavy Wash Service', serviceName: 'laundry' }
    ];
    
    // Also add new category items as flat arrays
    const newCategoryItemsFlat = [
      ...mensWashFold,
      ...mensWashIron,
      ...womensWashFold,
      ...womensWashIron
    ];
    
    // Collect selected addons as uiAddOns
    const allAddons = [...addOns.shoeClean, ...addOns.washFold, ...addOns.ironing, ...addOns.dryClean];
    const selectedAddonsList = allAddons.filter(addon => tempSelectedAddons[addon.id]);
    
    // Build uiAddOns array for laundry items
    const uiAddOns = [];
    
    // Add selected add-ons to uiAddOns
    selectedAddonsList.forEach(addon => {
      uiAddOns.push({
        name: addon.name,
        price: addon.price,
        quantity: 1
      });
    });
    
    // Add detergent selection to uiAddOns if selected
    if (selectedDetergent) {
      const detergent = detergentOptions.find(d => d.id === selectedDetergent);
      if (detergent) {
        uiAddOns.push({
          name: `Detergent: ${detergent.name}`,
          price: detergent.price,
          quantity: 1
        });
      }
    }
    
    // Add items from old structure to cart with addons and detergent as uiAddOns
    allCategoryItems.forEach(({ items, categoryName, serviceName }) => {
      Object.entries(items).forEach(([category, itemsList]) => {
        itemsList.forEach(item => {
          const quantity = quantities[item.id];
          if (quantity && quantity > 0) {
            const cartItem = {
              id: `laundry-${item.id}`,
              name: item.name,
              serviceName: 'washing', // Hardcoded serviceName
              image: item.image,
              price: item.price,
              quantity: quantity, // Include quantity directly
              category: 'Laundry', // Standardized category for proper filtering in admin
              type: 'laundry',
              description: item.description,
              uiAddOns: uiAddOns.length > 0 ? uiAddOns : [] // Attach addons and detergent to the item
            };
            
            // Add the item with the correct quantity
            addToCart(cartItem);
          }
        });
      });
    });
    
    // Add items from new category structure to cart
    newCategoryItemsFlat.forEach(item => {
      const quantity = quantities[item.id];
      if (quantity && quantity > 0) {
        const cartItem = {
          id: `laundry-${item.id}`,
          name: item.name,
          serviceName: 'washing',
          image: item.image,
          price: item.price,
          quantity: quantity, // Include quantity directly
          category: 'Laundry',
          type: 'laundry',
          description: item.description,
          uiAddOns: uiAddOns.length > 0 ? uiAddOns : []
        };
        
        addToCart(cartItem);
      }
    });
    
    // Clear quantities and addons
    setQuantities({});
    setSelectedAddons({});
    setSelectedDetergent(null);
    setTempSelectedAddons({});
    
    // Navigate to cart
    navigate('/cart');
  };

  const addSelectedItemsToCart = () => {
    // Open modal instead of directly adding to cart
    openAddonsModal();
  };

  const getTotalItems = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    let total = 0;
    
    // Check all categories for items with quantities, regardless of active category
    const allCategoryItems = [
      clothingItems,
      ironingItems,
      dryCleanItems,
      shoeCleanItems,
      bedsheetWashItems
    ];
    
    // Also check new category items
    const newCategoryItems = [
      ...mensWashFold,
      ...mensWashIron,
      ...womensWashFold,
      ...womensWashIron
    ];
    
    // Calculate total from old structure
    allCategoryItems.forEach(categoryItems => {
      Object.entries(categoryItems).forEach(([category, items]) => {
        items.forEach(item => {
          const quantity = quantities[item.id] || 0;
          total += item.price * quantity;
        });
      });
    });
    
    // Calculate total from new category items
    newCategoryItems.forEach(item => {
      const quantity = quantities[item.id] || 0;
      total += item.price * quantity;
    });
    
    // Add addon prices
    const allAddons = [...addOns.shoeClean, ...addOns.washFold, ...addOns.ironing, ...addOns.dryClean];
    allAddons.forEach(addon => {
      if (selectedAddons[addon.id]) {
        total += addon.price;
      }
    });
    
    return total;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide functionality - removed as we don't need category slider

  // Touch handlers - removed as we don't need swipe functionality for categories

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Booking Data Banner */}
        {bookingData && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <span className="text-2xl">👕</span> Your Laundry Service Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-purple-700">Service:</span> {bookingData.category}
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Pickup Date:</span> {new Date(bookingData.pickupDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Phone:</span> {bookingData.phoneNumber}
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Location:</span> {bookingData.address.substring(0, 50)}...
                  </div>
                </div>
                <p className="text-purple-600 text-sm mt-2">
                  Please select your laundry service type below to complete your booking.
                </p>
              </div>
              <button
                onClick={clearBookingData}
                className="text-purple-500 hover:text-purple-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Main Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md">
              BFS SMARTLAUNDRY™
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              BFS Laundry Services
            </span>
          </h1>
          <p className="text-gray-700 text-xl font-semibold max-w-2xl mx-auto mb-3">
            Professional Laundry & Fabric Care at Your Doorstep
          </p>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From daily wear to designer fabrics, BFS offers specialized laundry care with transparent pricing and doorstep convenience.
          </p>
        </div>

        {/* Service Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {[
              { id: 'mens-wash', label: "Men's Wash", icon: '👔' },
              { id: 'womens-wash', label: "Women's Wash", icon: '👗' },
              { id: 'dry-clean', label: 'Dry Cleaning', icon: '✨' },
              { id: 'sarees-rolling', label: 'Sarees & Rolling', icon: '🥻' },
              { id: 'shoe-clean', label: 'Shoe Cleaning', icon: '👟' },
              { id: 'stain-removal', label: 'Stain Removal', icon: '🧼' },
              { id: 'kids-clothes', label: 'Kids Clothes', icon: '👶' },
              { id: 'blazers-coats', label: 'Blazers & Suits', icon: '🧥' },
              { id: 'winter-wear', label: 'Winter Wear', icon: '❄️' },
              { id: 'home-linen', label: 'Home Linen', icon: '🛏️' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Why BFS Laundry Section */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ✅ WHY BFS LAUNDRY?
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🚪', text: 'Doorstep pickup & delivery' },
              { icon: '👔', text: 'Separate handling for premium items' },
              { icon: '👟', text: 'Brand-wise shoe care' },
              { icon: '🥻', text: 'Saree & blazer specialists' },
              { icon: '💰', text: 'Transparent per-item pricing' },
              { icon: '⭐', text: 'Trusted BFS service quality' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:shadow-md transition-shadow">
                <span className="text-3xl">{feature.icon}</span>
                <p className="text-gray-700 font-medium">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content based on active category */}
        {(activeCategory === 'mens-wash') && (
          <div>
            {/* Men's Wash & Fold Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-purple-600 mb-4">
                Men's Wash - Wash & Fold
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mensWashFold.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h4>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-purple-600">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-4">📌 Clothes are hygienically washed, dried, and neatly packed.</p>
            </div>

            {/* Men's Wash & Iron Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-blue-600 mb-4">
                Men's Wash - Wash & Iron
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mensWashIron.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h4>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-blue-600">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-blue-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-4">📌 Clothes are hygienically washed, dried, and neatly packed.</p>
            </div>
          </div>
        )}

        {/* Women's Wash Category */}
        {(activeCategory === 'womens-wash') && (
          <div>
            {/* Women's Wash & Fold Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-pink-600 mb-4">
                Women's Wash - Wash & Fold
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {womensWashFold.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h4>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-pink-600">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-pink-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-pink-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-pink-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-4">📌 Suitable for both casual and office wear.</p>
            </div>

            {/* Women's Wash & Iron Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-indigo-600 mb-4">
                Women's Wash - Wash & Iron
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {womensWashIron.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h4>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-indigo-600">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-indigo-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-4">📌 Suitable for both casual and office wear.</p>
            </div>
          </div>
        )}

        {/* Original wash-fold content for backward compatibility */}
        {(activeCategory === 'wash-fold' || activeCategory === 'wash-iron') && (
          <div>
            {/* Men's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Men's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {clothingItems.men.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Women's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Women's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {clothingItems.women.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Linen Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Home Linen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {clothingItems.homeLinen.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessories Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Accessories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {clothingItems.accessories.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Winter Wear Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Winter Wear
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {clothingItems.winterWear.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kids Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Kids Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {clothingItems.kids.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shoes Section - Now displayed in wash-fold category */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Shoes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shoeCleanItems.shoes.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Section for Wash & Fold */}
            {addOns.washFold && addOns.washFold.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b-2 border-green-300 pb-2">
                  <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    Premium Add-ons for Wash & Fold
                  </span>
                </h3>
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 shadow-lg">
                  <p className="text-center text-gray-600 mb-6">
                    ✨ Enhance your wash & fold service with these premium add-ons
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {addOns.washFold.map((addon) => (
                      <div 
                        key={addon.id} 
                        className={`relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                          selectedAddons[addon.id] ? 'ring-2 ring-green-500 bg-green-50' : ''
                        }`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{addon.name}</h4>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedAddons[addon.id] ? 'bg-green-600 border-green-600' : 'border-gray-300'
                            }`}>
                              {selectedAddons[addon.id] && (
                                <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{addon.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">₹{addon.price}</span>
                            <span className="text-xs text-gray-500">
                              {selectedAddons[addon.id] ? '✓ Selected' : 'Tap to add'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ironing Category Content */}
        {activeCategory === 'ironing' && (
          <div>
            {/* Men's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Men's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ironingItems.men.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Women's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Women's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ironingItems.women.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Linen Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Home Linen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ironingItems.homeLinen.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessories Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Accessories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ironingItems.accessories.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Winter Wear Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Winter Wear
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ironingItems.winterWear.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kids Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Kids Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ironingItems.kids.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Section for Ironing */}
            {addOns.ironing && addOns.ironing.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b-2 border-blue-300 pb-2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Premium Add-ons for Ironing
                  </span>
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg">
                  <p className="text-center text-gray-600 mb-6">
                    ✨ Enhance your ironing service with these premium add-ons
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {addOns.ironing.map((addon) => (
                      <div 
                        key={addon.id} 
                        className={`relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                          selectedAddons[addon.id] ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{addon.name}</h4>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedAddons[addon.id] ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`}>
                              {selectedAddons[addon.id] && (
                                <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{addon.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-blue-600">₹{addon.price}</span>
                            <span className="text-xs text-gray-500">
                              {selectedAddons[addon.id] ? '✓ Selected' : 'Tap to add'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dry Clean Category Content */}
        {activeCategory === 'dry-clean' && (
          <div>
            {/* Men's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Men's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.men.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Women's Clothing Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Women's Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.women.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Home Linen Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Home Linen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.homeLinen.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessories Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Accessories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.accessories.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Winter Wear Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Winter Wear
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.winterWear.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kids Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Kids Clothing
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dryCleanItems.kids.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Section for Dry Clean */}
            {addOns.dryClean && addOns.dryClean.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b-2 border-orange-300 pb-2">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Premium Add-ons for Dry Clean
                  </span>
                </h3>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 shadow-lg">
                  <p className="text-center text-gray-600 mb-6">
                    ✨ Enhance your dry clean service with these premium add-ons
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {addOns.dryClean.map((addon) => (
                      <div 
                        key={addon.id} 
                        className={`relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                          selectedAddons[addon.id] ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                        }`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{addon.name}</h4>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedAddons[addon.id] ? 'bg-orange-600 border-orange-600' : 'border-gray-300'
                            }`}>
                              {selectedAddons[addon.id] && (
                                <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{addon.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-orange-600">₹{addon.price}</span>
                            <span className="text-xs text-gray-500">
                              {selectedAddons[addon.id] ? '✓ Selected' : 'Tap to add'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shoe Clean Category Content */}
        {activeCategory === 'shoe-clean' && (
          <div>
            {/* Daily Wear / Regulars Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">
                <span className="mr-2">🩴</span>Daily Wear / Regulars
              </h3>
              <p className="text-center text-gray-600 mb-6">Sandals, slippers, and everyday shoes</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shoeCleanItems.dailyWear.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-blue-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b border-purple-300 pb-2">
                <span className="mr-2">⚽</span>Premium
              </h3>
              <p className="text-center text-gray-600 mb-6">Sports shoes and premium footwear</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shoeCleanItems.premium.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-purple-100">
                    <div className="aspect-square bg-gradient-to-br from-purple-50 to-white p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-purple-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Luxury Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b border-yellow-300 pb-2">
                <span className="mr-2">✨</span>Luxury
              </h3>
              <p className="text-center text-gray-600 mb-6">White shoes, designer footwear, and luxury items</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shoeCleanItems.luxury.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border-2 border-yellow-200">
                    <div className="aspect-square bg-gradient-to-br from-yellow-50 to-white p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-yellow-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-yellow-600 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-yellow-500 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-yellow-600 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Elite Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b border-pink-300 pb-2">
                <span className="mr-2">💎</span>Elite
              </h3>
              <p className="text-center text-gray-600 mb-6">Premium service with spray kit and premium socks included</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shoeCleanItems.elite.map((item) => (
                  <div key={item.id} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow border-2 border-pink-300">
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      {item.includes && (
                        <div className="bg-pink-100 border border-pink-200 rounded-md p-2 mb-2">
                          <p className="text-xs text-pink-800 font-semibold">✨ Includes:</p>
                          <p className="text-xs text-pink-700">{item.includes}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-pink-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:from-pink-700 hover:to-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:from-pink-700 hover:to-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Section for Shoes */}
            {addOns.shoeClean && addOns.shoeClean.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b-2 border-purple-300 pb-2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Premium Add-ons for Shoes
                  </span>
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-lg">
                  <p className="text-center text-gray-600 mb-6">
                    ✨ Enhance your shoe cleaning service with these premium add-ons
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {addOns.shoeClean.map((addon) => (
                      <div 
                        key={addon.id} 
                        className={`relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                          selectedAddons[addon.id] ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                        }`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{addon.name}</h4>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedAddons[addon.id] ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                            }`}>
                              {selectedAddons[addon.id] && (
                                <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{addon.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-purple-600">₹{addon.price}</span>
                            <span className="text-xs text-gray-500">
                              {selectedAddons[addon.id] ? '✓ Selected' : 'Tap to add'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bedsheet/Heavy Wash Category Content */}
        {activeCategory === 'bedsheet-wash' && (
          <div>
            {/* Home Linen Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b border-gray-300 pb-2">
                Home Linen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {bedsheetWashItems.homeLinen.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sarees & Rolling Category */}
        {activeCategory === 'sarees-rolling' && (
          <div>
            {/* Regular Wash Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b border-pink-300 pb-2">
                <span className="mr-2">👗</span>Regular Wash
              </h3>
              <p className="text-center text-gray-600 mb-6">Everyday cotton and synthetic sarees</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sareeItems.regularWash.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-pink-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-pink-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-pink-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-pink-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Luxury Wash Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b border-purple-300 pb-2">
                <span className="mr-2">✨</span>Luxury Wash
              </h3>
              <p className="text-center text-gray-600 mb-6">Silk and designer sarees with special care</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sareeItems.luxuryWash.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border-2 border-purple-200">
                    <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-purple-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-purple-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Care Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b border-yellow-300 pb-2">
                <span className="mr-2">💎</span>Personalized Care
              </h3>
              <p className="text-center text-gray-600 mb-6">Bridal, heirloom, and premium silk sarees with hand wash and special packaging</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sareeItems.personalizedCare.map((item) => (
                  <div key={item.id} className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow border-2 border-yellow-300">
                    <div className="aspect-square bg-gradient-to-br from-yellow-100 to-pink-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      {item.includes && (
                        <div className="bg-yellow-100 border border-yellow-200 rounded-md p-2 mb-2">
                          <p className="text-xs text-yellow-800 font-semibold">✨ Includes:</p>
                          <p className="text-xs text-yellow-700">{item.includes}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-yellow-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-gradient-to-r from-yellow-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:from-yellow-700 hover:to-pink-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-gradient-to-r from-yellow-600 to-pink-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:from-yellow-700 hover:to-pink-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Section for Sarees */}
            {addOns.sarees && addOns.sarees.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b-2 border-pink-300 pb-2">
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Premium Add-ons for Sarees
                  </span>
                </h3>
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 shadow-lg">
                  <p className="text-center text-gray-600 mb-6">
                    ✨ Enhance your saree care service with these premium add-ons
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {addOns.sarees.map((addon) => (
                      <div 
                        key={addon.id} 
                        className={`relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                          selectedAddons[addon.id] ? 'ring-2 ring-pink-500 bg-pink-50' : ''
                        }`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{addon.name}</h4>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedAddons[addon.id] ? 'bg-pink-600 border-pink-600' : 'border-gray-300'
                            }`}>
                              {selectedAddons[addon.id] && (
                                <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{addon.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-pink-600">₹{addon.price}</span>
                            <span className="text-xs text-gray-500">
                              {selectedAddons[addon.id] ? '✓ Selected' : 'Tap to add'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kids Clothes Category */}
        {activeCategory === 'kids-clothes' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                👶 Kids Clothes Laundry
              </span>
            </h2>
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🔜</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h3>
              <p className="text-gray-600">Gentle care for kids clothing with separate washing</p>
              <p className="text-gray-500 mt-4">Special attention to soft fabrics and hygienic cleaning</p>
            </div>
          </div>
        )}

        {/* Blazers & Coats Category */}
        {activeCategory === 'blazers-coats' && (
          <div>
            {/* Regular Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">
                <span className="mr-2">🧥</span>Regular
              </h3>
              <p className="text-center text-gray-600 mb-6">Standard dry cleaning for blazers, suits, and sherwanis</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formalWearItems.regular.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-square bg-gray-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-gray-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-gray-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b border-blue-300 pb-2">
                <span className="mr-2">✨</span>Premium
              </h3>
              <p className="text-center text-gray-600 mb-6">Premium care with steam press and special attention</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formalWearItems.premium.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border-2 border-blue-200">
                    <div className="aspect-square bg-gradient-to-br from-blue-50 to-white p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-blue-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-blue-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Elite Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4 border-b border-purple-300 pb-2">
                <span className="mr-2">💎</span>Elite
              </h3>
              <p className="text-center text-gray-600 mb-6">Elite service with 10% off alterations + free perfume</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formalWearItems.elite.map((item) => (
                  <div key={item.id} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow border-2 border-purple-300">
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-xl mr-2">{item.icon}</span>
                        <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                      {item.includes && (
                        <div className="bg-purple-100 border border-purple-200 rounded-md p-2 mb-2">
                          <p className="text-xs text-purple-800 font-semibold">✨ Includes:</p>
                          <p className="text-xs text-purple-700">{item.includes}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-purple-700">₹{item.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors flex-1"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              -
                            </button>
                            <span className="mx-3 font-medium">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white w-8 h-8 rounded-full text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Section for Formal Wear */}
            {addOns.formalWear && addOns.formalWear.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b-2 border-indigo-300 pb-2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Premium Add-ons for Formal Wear
                  </span>
                </h3>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg">
                  <p className="text-center text-gray-600 mb-6">
                    ✨ Enhance your formal wear service with these premium add-ons
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {addOns.formalWear.map((addon) => (
                      <div 
                        key={addon.id} 
                        className={`relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                          selectedAddons[addon.id] ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                        }`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{addon.name}</h4>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedAddons[addon.id] ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                            }`}>
                              {selectedAddons[addon.id] && (
                                <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{addon.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-indigo-600">₹{addon.price}</span>
                            <span className="text-xs text-gray-500">
                              {selectedAddons[addon.id] ? '✓ Selected' : 'Tap to add'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stain Removal Category */}
        {activeCategory === 'stain-removal' && (
          <div>
            {/* Header Section */}
            <div className="mb-10 bg-gradient-to-r from-orange-100 via-red-50 to-yellow-100 rounded-2xl p-8 shadow-xl border-2 border-orange-200">
              <h2 className="text-4xl font-bold text-center mb-4">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  🧼 Professional Stain Removal Services
                </span>
              </h2>
              <p className="text-center text-gray-700 text-lg mb-4 max-w-3xl mx-auto">
                Expert stain treatment for all fabric types with specialized techniques and eco-friendly solutions
              </p>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-orange-500 p-5 rounded-lg shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      How it works:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Select your stain type below</li>
                      <li>✓ Upload photos for accurate assessment (where required)</li>
                      <li>✓ Get instant pricing or custom quote</li>
                      <li>✓ We pickup, treat, and deliver fresh clothes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Stain Removal Services Grid */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Choose Your Stain Treatment
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stainRemovalItems.map((item) => (
                  <div key={item.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-300">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white rounded-full p-3 shadow-lg">
                        <span className="text-4xl">{item.icon}</span>
                      </div>
                      {item.tier && (
                        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                          {item.tier}
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      
                      {/* Examples Badge */}
                      {item.examples && (
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-2 mb-3 border border-orange-200">
                          <p className="text-xs font-semibold text-orange-800 mb-1">Treats:</p>
                          <p className="text-xs text-gray-700">{item.examples}</p>
                        </div>
                      )}
                      
                      {/* Requirements */}
                      <div className="flex gap-2 mb-3">
                        {item.requiresPhoto && (
                          <div className="flex-1 bg-blue-50 rounded-md p-2 border border-blue-200">
                            <p className="text-xs font-semibold text-blue-800 flex items-center gap-1">
                              <span>📷</span> Photo
                            </p>
                          </div>
                        )}
                        {item.requiresVideo && (
                          <div className="flex-1 bg-purple-50 rounded-md p-2 border border-purple-200">
                            <p className="text-xs font-semibold text-purple-800 flex items-center gap-1">
                              <span>📹</span> Video
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Price */}
                      <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3 mb-4 border-2 border-orange-300">
                        <p className="text-lg font-bold text-orange-800 text-center">₹{item.basePrice}</p>
                        {item.note && (
                          <p className="text-xs text-orange-700 text-center mt-1">{item.note}</p>
                        )}
                      </div>
                      
                      {/* Add Button */}
                      <div className="flex justify-between items-center">
                        {getItemQuantity(item.id) === 0 ? (
                          <button
                            onClick={() => addToBasket(item)}
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <div className="flex items-center justify-between w-full bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-2">
                            <button
                              onClick={() => removeFromBasket(item)}
                              className="bg-white text-gray-700 w-10 h-10 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors shadow-sm"
                            >
                              -
                            </button>
                            <span className="mx-3 font-bold text-lg text-orange-800">{getItemQuantity(item.id)}</span>
                            <button
                              onClick={() => addToBasket(item)}
                              className="bg-gradient-to-r from-orange-600 to-red-600 text-white w-10 h-10 rounded-lg text-lg font-bold hover:from-orange-700 hover:to-red-700 transition-colors shadow-sm"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stain Categories Information */}
            <div className="mb-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-xl border-2 border-orange-200">
              <h4 className="text-2xl font-bold text-center mb-6">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Stain Categories We Specialize In
                </span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { name: 'Food & Beverage', icon: '🍝', examples: 'Coffee, wine, sauce, oil' },
                  { name: 'Ink & Dye', icon: '🖊️', examples: 'Pen, markers, dye transfer' },
                  { name: 'Organic', icon: '🌿', examples: 'Blood, sweat, grass, mud' },
                  { name: 'Cosmetic', icon: '💄', examples: 'Makeup, lipstick, polish' },
                  { name: 'Chemical', icon: '⚗️', examples: 'Bleach, rust, paint' }
                ].map((stainType, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-orange-200 hover:border-orange-400">
                    <div className="text-4xl mb-3 text-center">{stainType.icon}</div>
                    <h5 className="font-bold text-gray-800 text-sm mb-2 text-center">{stainType.name}</h5>
                    <p className="text-xs text-gray-600 text-center leading-relaxed">{stainType.examples}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Our Stain Removal */}
            <div className="mb-12 bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200">
              <h4 className="text-2xl font-bold text-center mb-6 text-gray-800">
                ✨ Why Choose BFS Stain Removal?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🔬', title: 'Advanced Technology', desc: 'Latest stain removal techniques' },
                  { icon: '🌱', title: 'Eco-Friendly', desc: 'Safe for fabrics and environment' },
                  { icon: '👨‍🔬', title: 'Expert Team', desc: 'Trained stain specialists' },
                  { icon: '💯', title: 'Quality Guarantee', desc: 'Satisfaction assured' }
                ].map((feature, index) => (
                  <div key={index} className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl border border-orange-200 hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-3 text-center">{feature.icon}</div>
                    <h5 className="font-bold text-gray-800 text-center mb-2">{feature.title}</h5>
                    <p className="text-sm text-gray-600 text-center">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Section for Stain Removal */}
            {addOns.stainRemoval && addOns.stainRemoval.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b-2 border-orange-300 pb-2">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Premium Add-ons for Stain Removal
                  </span>
                </h3>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 shadow-lg">
                  <p className="text-center text-gray-600 mb-6">
                    ✨ Enhance your stain removal service with these premium add-ons
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {addOns.stainRemoval.map((addon) => (
                      <div 
                        key={addon.id} 
                        className={`relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                          selectedAddons[addon.id] ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                        }`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800 text-sm">{addon.name}</h4>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              selectedAddons[addon.id] ? 'bg-orange-600 border-orange-600' : 'border-gray-300'
                            }`}>
                              {selectedAddons[addon.id] && (
                                <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{addon.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-orange-600">₹{addon.price}</span>
                            <span className="text-xs text-gray-500">
                              {selectedAddons[addon.id] ? '✓ Selected' : 'Tap to add'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Winter Wear Category */}
        {activeCategory === 'winter-wear' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                ❄️ Winter Wear Cleaning
              </span>
            </h2>
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🔜</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h3>
              <p className="text-gray-600">Specialized care for jackets, hoodies, sweaters, and shawls</p>
              <p className="text-gray-500 mt-4">Suitable for woollen and padded clothing</p>
            </div>
          </div>
        )}

        {/* Home Linen Category */}
        {activeCategory === 'home-linen' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                🛏️ Home Linen Services
              </span>
            </h2>
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🔜</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h3>
              <p className="text-gray-600">Complete care for bedsheets, pillow covers, curtains, blankets, and towels</p>
              <p className="text-gray-500 mt-4">Cleaned hygienically and packed neatly</p>
            </div>
          </div>
        )}

        {/* Placeholder for other categories */}
        {activeCategory !== 'mens-wash' && activeCategory !== 'womens-wash' && activeCategory !== 'wash-fold' && activeCategory !== 'wash-iron' && activeCategory !== 'ironing' && activeCategory !== 'dry-clean' && activeCategory !== 'shoe-clean' && activeCategory !== 'bedsheet-wash' && activeCategory !== 'sarees-rolling' && activeCategory !== 'stain-removal' && activeCategory !== 'kids-clothes' && activeCategory !== 'blazers-coats' && activeCategory !== 'winter-wear' && activeCategory !== 'home-linen' && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-600 mb-4">Coming Soon</h3>
            <p className="text-gray-500">This service category will be available soon.</p>
          </div>
        )}

        {/* Add to Cart Button - Fixed at bottom when items selected */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="text-left">
                <p className="text-sm text-gray-600">{getTotalItems()} items selected</p>
                <p className="text-lg font-bold text-gray-800">₹{getTotalPrice()}</p>
              </div>
              <button
                onClick={addSelectedItemsToCart}
                className="bg-purple-600 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}

        {/* Add-ons Modal */}
        {showAddonsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Customize Your Order</h2>
                  <button
                    onClick={closeAddonsModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mt-2">Select add-ons and preferences for your laundry</p>
              </div>

              <div className="p-6">
                {/* Detergent Selection */}
                {shouldShowDetergentSelection() && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        Choose Your Detergent
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Select your preferred detergent for washing</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {detergentOptions.map((detergent) => (
                        <button
                          key={detergent.id}
                          onClick={() => setSelectedDetergent(detergent.id)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedDetergent === detergent.id
                              ? 'border-blue-600 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{detergent.name}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedDetergent === detergent.id
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedDetergent === detergent.id && (
                                <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Premium Add-ons */}
                {getRelevantAddons().length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Premium Add-ons
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Enhance your service with these optional add-ons</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getRelevantAddons().map((addon) => (
                        <div
                          key={addon.id}
                          onClick={() => toggleTempAddon(addon.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            tempSelectedAddons[addon.id]
                              ? 'border-purple-600 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-1">{addon.name}</h4>
                              <p className="text-xs text-gray-600">{addon.description}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 ${
                              tempSelectedAddons[addon.id]
                                ? 'border-purple-600 bg-purple-600'
                                : 'border-gray-300'
                            }`}>
                              {tempSelectedAddons[addon.id] && (
                                <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-bold text-purple-600">₹{addon.price}</span>
                            <span className="text-xs text-gray-500">
                              {tempSelectedAddons[addon.id] ? '✓ Selected' : 'Tap to add'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
                <div className="flex gap-4">
                  <button
                    onClick={skipAddonsAndAddToCart}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors"
                  >
                    Skip Add-ons
                  </button>
                  <button
                    onClick={confirmAddToCart}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-colors shadow-lg"
                  >
                    Confirm & Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final Branding Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-center text-white">
          <div className="mb-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">BFS SmartLaundry™</h2>
            <p className="text-xl md:text-2xl font-medium">From daily wear to designer care — cleaned right.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="font-semibold">💰 Transparent Pricing</p>
              <p className="text-white/90 text-xs mt-1">All prices are per piece unless mentioned</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="font-semibold">📸 Photo Inspection</p>
              <p className="text-white/90 text-xs mt-1">Premium & VIP items may require photo inspection</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="font-semibold">🚚 Doorstep Service</p>
              <p className="text-white/90 text-xs mt-1">Pickup & delivery within serviceable areas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
