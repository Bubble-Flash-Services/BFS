import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';
import SigninModal from '../signin/SigninModal';
import { X, Plus, Minus } from 'lucide-react';
import { laundryCategories, categoryData } from '../../../data/laundryData';

export default function LaundryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null); // Start with no category selected
  const [selectedItems, setSelectedItems] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adSlide, setAdSlide] = useState(0);
  const [showItemsPage, setShowItemsPage] = useState(false); // New state for showing items page
  
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
      // Parse the itemKey - format: categoryId-subcategoryId-itemIndex-serviceType
      // Note: subcategoryId and serviceType can contain hyphens, so we need to be careful
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
      
      const category = categoryData[categoryId];
      if (category) {
        const subcategory = category.subcategories.find(s => s.id === subcategoryId);
        if (subcategory && subcategory.items) {
          const item = subcategory.items[itemIndex];
          if (item) {
            let itemPrice = 0;
            if (service === 'washFold' && item.washFold) {
              itemPrice = parseFloat(item.washFold) || 0;
            } else if (service === 'washIron' && item.washIron) {
              itemPrice = parseFloat(item.washIron) || 0;
            } else if (service === 'washOnly' && item.washOnly) {
              itemPrice = parseFloat(item.washOnly) || 0;
            } else if (service === 'price' && item.price) {
              const priceStr = String(item.price).replace('+', '');
              itemPrice = parseFloat(priceStr) || 0;
            } else if (item.price && !item.washFold && !item.washIron && !item.washOnly) {
              // For items that only have a price field
              const priceStr = String(item.price).replace('+', '');
              itemPrice = parseFloat(priceStr) || 0;
            }
            total += itemPrice * quantity;
          }
        } else if (subcategory && subcategory.brands) {
          const brand = subcategory.brands[itemIndex];
          if (brand) {
            const priceStr = String(brand.price).replace('+', '');
            const itemPrice = parseFloat(priceStr) || 0;
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

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowItemsPage(true);
    // Scroll to top when showing items page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setShowItemsPage(false);
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <div className="relative mb-12 h-48 rounded-2xl overflow-hidden shadow-xl">
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
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">{ad.title}</h2>
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

        {/* Conditional rendering: Show category selection or items */}
        {!showItemsPage ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                BFS SmartLaundry™
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Choose Your Laundry Category
              </p>
              <p className="text-gray-500">
                Professional • Transparent • Convenient
              </p>
            </div>

            {/* Category Selection Grid */}
            <div className="mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {laundryCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`group relative p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${category.color} text-white overflow-hidden`}
                  >
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="text-6xl mb-4">{category.icon}</div>
                      <div className="text-lg font-bold mb-2">{category.name}</div>
                      <div className="text-sm opacity-90 mb-4">{category.description}</div>
                      <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                        View Items →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-16 max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Why Choose BFS SmartLaundry?</h2>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <div className="text-4xl mb-3">💰</div>
                    <p className="font-semibold mb-2 text-lg">Transparent Pricing</p>
                    <p className="text-white/90 text-sm">Clear per-piece pricing. No hidden charges.</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <div className="text-4xl mb-3">🔐</div>
                    <p className="font-semibold mb-2 text-lg">Premium Care</p>
                    <p className="text-white/90 text-sm">Fabric-wise & brand-wise separate handling</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    <div className="text-4xl mb-3">🚚</div>
                    <p className="font-semibold mb-2 text-lg">Doorstep Service</p>
                    <p className="text-white/90 text-sm">Free pickup & delivery • 24-48 hrs turnaround</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={handleBackToCategories}
                className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Categories
              </button>
            </div>

            {/* Header for Items Page */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {laundryCategories.find(c => c.id === selectedCategory)?.name}
              </h1>
              <p className="text-gray-600">
                {laundryCategories.find(c => c.id === selectedCategory)?.description}
              </p>
            </div>

            {/* Category Content */}
            {categoryData[selectedCategory] && (
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
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
          </>
        )}

        {/* Summary and Action Buttons - Only show when items are selected AND on items page */}
        {getTotalItems() > 0 && showItemsPage && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl p-4 z-50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600">{getTotalItems()} items selected</p>
                <p className="text-2xl font-bold text-purple-600">₹{getTotalPrice().toFixed(2)}</p>
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

        {/* Footer Notes - Only on category selection page */}
        {!showItemsPage && (
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Service Information</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="text-4xl mb-3">📦</div>
                  <h4 className="font-bold text-gray-800 mb-2">Per Piece Pricing</h4>
                  <p className="text-sm text-gray-600">Transparent pricing for all items</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl mb-3">⚡</div>
                  <h4 className="font-bold text-gray-800 mb-2">Quick Turnaround</h4>
                  <p className="text-sm text-gray-600">24-48 hours standard delivery</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl mb-3">✨</div>
                  <h4 className="font-bold text-gray-800 mb-2">Premium Care</h4>
                  <p className="text-sm text-gray-600">Special handling for delicate items</p>
                </div>
              </div>
            </div>
          </div>
        )}
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
