import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';
import SigninModal from '../signin/SigninModal';
import { X, Plus, Minus } from 'lucide-react';

// Main Category Structure based on the problem statement
const laundryCategories = [
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
const categoryData = {
  mens: {
    subcategories: [
      {
        id: 'formal-wear',
        name: 'Formal Wear (Regular Fabrics – Cotton / Poly)',
        items: [
          { name: 'Formal Shirt', washFold: 20, washIron: 30 },
          { name: 'Formal Pant / Trouser', washFold: 25, washIron: 35 },
          { name: 'Shirt + Pant Set', washFold: 45, washIron: 60 }
        ]
      },
      {
        id: 'linen-clothing',
        name: 'Linen Clothing (Separate Handling)',
        note: 'Linen Shirts & Pants',
        items: [
          { name: 'Linen Shirt', washIron: 40 },
          { name: 'Linen Pant', washIron: 45 },
          { name: 'Linen Set (Shirt + Pant)', washIron: 80 }
        ]
      },
      {
        id: 'linen-jackets',
        name: 'Linen Jackets (Separate Section)',
        items: [
          { name: 'Linen Jacket', service: 'Wash & Iron', price: 80 }
        ]
      },
      {
        id: 'formal-jacket',
        name: 'Formal Jacket (Non-Linen)',
        items: [
          { name: 'Formal Jacket', service: 'Wash & Iron', price: 60 }
        ]
      },
      {
        id: 'formal-blazer',
        name: 'Formal Blazer – Brand-Wise (Dry Clean Only)',
        brands: [
          { tier: 'Standard Brands', note: 'Local / mid-range', price: 300 },
          { tier: 'Premium Brands', note: 'Arrow, Van Heusen, LP, Allen Solly, Raymond', price: 350 },
          { tier: 'Luxury / Designer Brands', note: 'Hugo Boss, Armani, Canali, Imported', price: '450+' }
        ]
      },
      {
        id: 't-shirts',
        name: 'T-Shirts',
        items: [
          { name: 'Half Sleeve', washFold: 20, washIron: 30 },
          { name: 'Full Sleeve', washFold: 22, washIron: 32 },
          { name: 'Polo', washFold: 22, washIron: 32 }
        ]
      },
      {
        id: 'casual-bottom',
        name: 'Casual Bottom Wear',
        items: [
          { name: 'Jeans', washFold: 25, washIron: 35 },
          { name: 'Casual Pants / Chinos', washFold: 25, washIron: 35 },
          { name: 'Shorts / Half Pants', washFold: 15, washIron: 25 }
        ]
      },
      {
        id: 'innerwear',
        name: 'Innerwear / Undergarments (Separate Wash)',
        items: [
          { name: 'Vest / Banyan', washOnly: 15 },
          { name: 'Briefs / Boxers', washOnly: 15 },
          { name: 'Inner Shorts', washOnly: 15 },
          { name: 'Socks (Pair)', washOnly: 10 }
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
          { name: 'Tops / Blouses', washFold: 20, washIron: 30 },
          { name: 'Kurtas', washFold: 25, washIron: 35 },
          { name: 'Pants / Jeans', washFold: 25, washIron: 35 },
          { name: 'Skirts', washFold: 25, washIron: 35 },
          { name: 'Daily Wear Dress', washFold: 30, washIron: 45 }
        ]
      },
      {
        id: 'linen-womens',
        name: "Linen Women's Wear",
        items: [
          { name: 'Linen Kurta / Top', washIron: 45 },
          { name: 'Linen Pants', washIron: 45 },
          { name: 'Linen Dress', washIron: 60 }
        ]
      },
      {
        id: 'dupatta-stole',
        name: 'Dupatta / Stole',
        items: [
          { name: 'Cotton Dupatta', price: 25 },
          { name: 'Silk / Designer Dupatta', price: 40 }
        ]
      },
      {
        id: 'womens-jackets',
        name: "Women's Jackets / Shrugs",
        items: [
          { name: 'Light Jacket / Shrug', price: 60 }
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
          { name: 'Cotton Saree', price: 120 },
          { name: 'Synthetic Saree', price: 150 },
          { name: 'Rolling / Ironing', price: 80 }
        ]
      },
      {
        id: 'premium-sarees',
        name: 'Premium Sarees',
        items: [
          { name: 'Silk Saree', price: 180 },
          { name: 'Designer Saree', price: 250 },
          { name: 'Premium Rolling', price: 120 }
        ]
      },
      {
        id: 'bridal-sarees',
        name: 'Bridal / Heavy Sarees (VIP)',
        note: '✔ Hand wash only ✔ Individual care',
        items: [
          { name: 'Bridal / Heavy Work', price: '350+' }
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
          { name: 'Shirts / Tops', washFold: 18 },
          { name: 'Pants / Shorts', washFold: 20 },
          { name: 'Woollen Wear', washFold: 30 },
          { name: 'Jackets', washFold: 35 }
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
          { name: 'Blazer (Regular)', service: 'Dry Clean', price: 300 },
          { name: 'Coat', service: 'Dry Clean', price: 350 },
          { name: 'Sweater', service: 'Wash & Iron', price: 45 },
          { name: 'Hoodie / Sweatshirt', service: 'Wash & Iron', price: 50 },
          { name: 'Shawl / Stole', service: 'Wash', price: 40 },
          { name: 'Scarf / Muffler', service: 'Wash', price: 25 }
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
          { name: 'Sandals / Slippers', price: 199 },
          { name: 'Casual Shoes', price: 199 }
        ]
      },
      {
        id: 'premium-shoes',
        name: 'Premium Shoes',
        items: [
          { name: 'Sports Shoes / Sneakers', price: 249 },
          { name: 'Leather Shoes', price: 299 }
        ]
      },
      {
        id: 'luxury-shoes',
        name: 'Luxury / White Shoes (VIP Care)',
        items: [
          { name: 'Luxury Brand Shoes', price: 399 },
          { name: 'White Shoe Deep Clean', price: 349 }
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
          { name: 'Bedsheet (Single)', price: 40 },
          { name: 'Bedsheet (Double)', price: 60 },
          { name: 'Pillow Cover', price: 15 },
          { name: 'Blanket / Comforter', price: 199 },
          { name: 'Curtain (Thin)', price: 35 },
          { name: 'Curtain (Thick)', price: 60 },
          { name: 'Towel', price: 20 }
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
        notGuaranteed: ['Old stains', 'Ink / pain', 'Bleach damage', 'Dye bleed', 'Burn marks']
      }
    ]
  }
};

export default function LaundryPage() {
  const [selectedCategory, setSelectedCategory] = useState('mens');
  const [selectedItems, setSelectedItems] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adSlide, setAdSlide] = useState(0);
  
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Advertisement banners
  const adBanners = [
    {
      id: 1,
      title: "BFS SmartLaundry™",
      subtitle: "Fabric-wise • Brand-wise • Transparent pricing",
      bgColor: "from-purple-500 to-blue-600"
    },
    {
      id: 2,
      title: "Free Pickup & Delivery",
      subtitle: "Minimum order applies",
      bgColor: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "24-48 hrs Turnaround",
      subtitle: "Express service available",
      bgColor: "from-orange-500 to-red-600"
    }
  ];

  useEffect(() => {
    const adAutoSlide = setInterval(() => {
      setAdSlide((prev) => (prev + 1) % adBanners.length);
    }, 3000);
    return () => clearInterval(adAutoSlide);
  }, []);

  const handleItemQuantityChange = (itemKey, increment) => {
    setSelectedItems(prev => {
      const currentQuantity = prev[itemKey] || 0;
      const newQuantity = Math.max(0, currentQuantity + increment);
      
      if (newQuantity === 0) {
        const { [itemKey]: removed, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [itemKey]: newQuantity };
      }
    });
  };

  const getTotalPrice = () => {
    let total = 0;
    Object.entries(selectedItems).forEach(([itemKey, quantity]) => {
      const [categoryId, subcategoryId, itemIndex, service] = itemKey.split('-');
      const category = categoryData[categoryId];
      if (category) {
        const subcategory = category.subcategories.find(s => s.id === subcategoryId);
        if (subcategory && subcategory.items) {
          const item = subcategory.items[parseInt(itemIndex)];
          if (item) {
            let itemPrice = 0;
            if (service === 'washFold' && item.washFold) itemPrice = item.washFold;
            else if (service === 'washIron' && item.washIron) itemPrice = item.washIron;
            else if (service === 'washOnly' && item.washOnly) itemPrice = item.washOnly;
            else if (item.price) {
              const priceStr = String(item.price).replace('+', '');
              itemPrice = parseInt(priceStr) || 0;
            }
            total += itemPrice * quantity;
          }
        } else if (subcategory && subcategory.brands) {
          const brand = subcategory.brands[parseInt(itemIndex)];
          if (brand) {
            const priceStr = String(brand.price).replace('+', '');
            const itemPrice = parseInt(priceStr) || 0;
            total += itemPrice * quantity;
          }
        }
      }
    });
    return total;
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((total, quantity) => total + quantity, 0);
  };

  const checkAuthAndExecute = (callback) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    callback();
  };

  const handleAddToCart = () => {
    if (getTotalItems() === 0) {
      alert('Please select at least one item to add to cart');
      return;
    }

    checkAuthAndExecute(() => {
      const cartItem = {
        id: `laundry-${Date.now()}`,
        name: 'Laundry Service',
        serviceName: 'laundry',
        image: '/laundry/laundry1.png',
        price: getTotalPrice(),
        category: 'Laundry',
        type: 'laundry',
        laundryDetails: {
          selectedItems: selectedItems,
          totalItems: getTotalItems(),
          totalPrice: getTotalPrice()
        },
        quantity: 1
      };
      
      addToCart(cartItem);
      alert('Items added to cart successfully!');
    });
  };

  const handleBuyNow = () => {
    if (getTotalItems() === 0) {
      alert('Please select at least one item to proceed');
      return;
    }

    checkAuthAndExecute(() => {
      const cartItem = {
        id: `laundry-${Date.now()}`,
        name: 'Laundry Service',
        serviceName: 'laundry',
        image: '/laundry/laundry1.png',
        price: getTotalPrice(),
        category: 'Laundry',
        type: 'laundry',
        laundryDetails: {
          selectedItems: selectedItems,
          totalItems: getTotalItems(),
          totalPrice: getTotalPrice()
        },
        quantity: 1
      };
      
      addToCart(cartItem);
      navigate('/cart');
    });
  };

  const renderPricingTable = (subcategory, categoryId, subcategoryId) => {
    if (subcategory.brands) {
      // For brand-wise pricing (like blazers)
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Tier</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Price</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {subcategory.brands.map((brand, index) => {
                const itemKey = `${categoryId}-${subcategoryId}-${index}-brand`;
                const quantity = selectedItems[itemKey] || 0;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-medium">{brand.tier}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{brand.note}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold text-purple-600">₹{brand.price}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleItemQuantityChange(itemKey, -1)}
                          disabled={quantity === 0}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{quantity}</span>
                        <button
                          onClick={() => handleItemQuantityChange(itemKey, 1)}
                          className="w-8 h-8 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    // Regular items with service options
    const hasWashFold = subcategory.items?.some(item => item.washFold);
    const hasWashIron = subcategory.items?.some(item => item.washIron);
    const hasWashOnly = subcategory.items?.some(item => item.washOnly);
    const hasPrice = subcategory.items?.some(item => item.price);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
              {hasWashFold && <th className="border border-gray-300 px-4 py-2 text-center">Wash & Fold</th>}
              {hasWashIron && <th className="border border-gray-300 px-4 py-2 text-center">Wash & Iron</th>}
              {hasWashOnly && <th className="border border-gray-300 px-4 py-2 text-center">Wash Only</th>}
              {hasPrice && subcategory.items?.some(item => item.service) && (
                <th className="border border-gray-300 px-4 py-2 text-center">Service</th>
              )}
              {hasPrice && <th className="border border-gray-300 px-4 py-2 text-center">Price</th>}
            </tr>
          </thead>
          <tbody>
            {subcategory.items?.map((item, index) => {
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">{item.name}</td>
                  
                  {hasWashFold && (
                    <td className="border border-gray-300 px-4 py-2">
                      {item.washFold ? (
                        <div className="flex flex-col items-center space-y-2">
                          <span className="font-semibold text-purple-600">₹{item.washFold}</span>
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const itemKey = `${categoryId}-${subcategoryId}-${index}-washFold`;
                              const quantity = selectedItems[itemKey] || 0;
                              return (
                                <>
                                  <button
                                    onClick={() => handleItemQuantityChange(itemKey, -1)}
                                    disabled={quantity === 0}
                                    className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                                  <button
                                    onClick={() => handleItemQuantityChange(itemKey, 1)}
                                    className="w-7 h-7 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  )}
                  
                  {hasWashIron && (
                    <td className="border border-gray-300 px-4 py-2">
                      {item.washIron ? (
                        <div className="flex flex-col items-center space-y-2">
                          <span className="font-semibold text-purple-600">₹{item.washIron}</span>
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const itemKey = `${categoryId}-${subcategoryId}-${index}-washIron`;
                              const quantity = selectedItems[itemKey] || 0;
                              return (
                                <>
                                  <button
                                    onClick={() => handleItemQuantityChange(itemKey, -1)}
                                    disabled={quantity === 0}
                                    className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                                  <button
                                    onClick={() => handleItemQuantityChange(itemKey, 1)}
                                    className="w-7 h-7 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  )}

                  {hasWashOnly && (
                    <td className="border border-gray-300 px-4 py-2">
                      {item.washOnly ? (
                        <div className="flex flex-col items-center space-y-2">
                          <span className="font-semibold text-purple-600">₹{item.washOnly}</span>
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const itemKey = `${categoryId}-${subcategoryId}-${index}-washOnly`;
                              const quantity = selectedItems[itemKey] || 0;
                              return (
                                <>
                                  <button
                                    onClick={() => handleItemQuantityChange(itemKey, -1)}
                                    disabled={quantity === 0}
                                    className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                                  <button
                                    onClick={() => handleItemQuantityChange(itemKey, 1)}
                                    className="w-7 h-7 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  )}

                  {hasPrice && item.service && (
                    <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                      {item.service}
                    </td>
                  )}

                  {hasPrice && (
                    <td className="border border-gray-300 px-4 py-2">
                      {item.price ? (
                        <div className="flex flex-col items-center space-y-2">
                          <span className="font-semibold text-purple-600">₹{item.price}</span>
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const itemKey = `${categoryId}-${subcategoryId}-${index}-price`;
                              const quantity = selectedItems[itemKey] || 0;
                              return (
                                <>
                                  <button
                                    onClick={() => handleItemQuantityChange(itemKey, -1)}
                                    disabled={quantity === 0}
                                    className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                                  <button
                                    onClick={() => handleItemQuantityChange(itemKey, 1)}
                                    className="w-7 h-7 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4">
        {/* Advertisement Banner */}
        <div className="relative mb-12 h-48 rounded-2xl overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${adSlide * 100}%)` }}
          >
            {adBanners.map((ad) => (
              <div
                key={ad.id}
                className={`flex-shrink-0 w-full h-full bg-gradient-to-r ${ad.bgColor} flex items-center justify-center text-white relative`}
              >
                <div className="text-center px-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{ad.title}</h2>
                  <p className="text-lg md:text-xl opacity-90">{ad.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Ad Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {adBanners.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === adSlide ? 'bg-white shadow-lg' : 'bg-white/50 hover:bg-white/70'
                }`}
                onClick={() => setAdSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            BFS SmartLaundry™
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            COMPLETE CATEGORY-BASED PRICING
          </p>
          <p className="text-gray-500">
            Fabric-wise • Brand-wise • Separate handling • Transparent pricing
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Select Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {laundryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-xl transform scale-105`
                    : 'bg-white text-gray-700 hover:shadow-lg hover:scale-102'
                } border-2 ${
                  selectedCategory === category.id ? 'border-transparent' : 'border-gray-200'
                }`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <div className="text-sm font-bold mb-1">{category.name}</div>
                <div className="text-xs opacity-80">{category.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Content */}
        {categoryData[selectedCategory] && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                {laundryCategories.find(c => c.id === selectedCategory)?.name}
              </h2>
              
              {categoryData[selectedCategory].subcategories.map((subcategory, index) => (
                <div key={subcategory.id} className={`${index > 0 ? 'mt-8' : ''}`}>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {subcategory.name}
                    </h3>
                    {subcategory.note && (
                      <p className="text-sm text-gray-600 italic">{subcategory.note}</p>
                    )}
                  </div>
                  
                  {renderPricingTable(subcategory, selectedCategory, subcategory.id)}
                </div>
              ))}

              {/* Special Stain Treatment Info */}
              {selectedCategory === 'stainTreatment' && categoryData.stainTreatment.subcategories[0] && (
                <div className="mt-8 grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">✓ We Can Treat:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {categoryData.stainTreatment.subcategories[0].canTreat.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-bold text-red-800 mb-2">⚠ Not Guaranteed:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {categoryData.stainTreatment.subcategories[0].notGuaranteed.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary and Action Buttons */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600">{getTotalItems()} items selected</p>
                <p className="text-2xl font-bold text-purple-600">₹{getTotalPrice()}</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 md:flex-none bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 md:flex-none bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors shadow-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Notes */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">ℹ️ WEBSITE FOOTER NOTES</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-6 text-sm">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="font-semibold mb-2">💰 Prices are per piece</p>
                <p className="text-white/90 text-xs">Transparent pricing for all items</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="font-semibold mb-2">🔐 Linen & premium items washed separately</p>
                <p className="text-white/90 text-xs">Brand selection required for blazers & shoes</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <p className="font-semibold mb-2">🚚 Free pickup & delivery</p>
                <p className="text-white/90 text-xs">Minimum order applies • Turnaround: 24–48 hrs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <SigninModal
          open={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={() => setShowLoginModal(false)}
        />
      )}
    </section>
  );
}
