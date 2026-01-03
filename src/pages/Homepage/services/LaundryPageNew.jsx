import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';
import SigninModal from '../signin/SigninModal';
import { X, Plus, Minus, Search } from 'lucide-react';
import { laundryCategories, categoryData } from '../../../data/laundryData';

export default function LaundryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null); // Start with no category selected
  const [selectedItems, setSelectedItems] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adSlide, setAdSlide] = useState(0);
  const [showItemsPage, setShowItemsPage] = useState(false); // New state for showing items page
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Filter function to check if item matches search query
  const itemMatchesSearch = (item, subcategoryName, query) => {
    if (!query) return true;
    
    const lowerQuery = query.toLowerCase();
    const itemName = (item.name || item.tier || '').toLowerCase();
    const subName = subcategoryName.toLowerCase();
    const itemNote = (item.note || '').toLowerCase();
    const itemService = (item.service || '').toLowerCase();
    
    // Check if any service type matches
    const hasWashFold = item.washFold && 'wash fold'.includes(lowerQuery);
    const hasWashIron = item.washIron && 'wash iron'.includes(lowerQuery);
    const hasWashOnly = item.washOnly && 'wash only'.includes(lowerQuery);
    
    return itemName.includes(lowerQuery) || 
           subName.includes(lowerQuery) || 
           itemNote.includes(lowerQuery) ||
           itemService.includes(lowerQuery) ||
           hasWashFold || hasWashIron || hasWashOnly;
  };

  // Advertisement banners
  const adBanners = [
    {
      id: 1,
      title: "BFS SmartLaundry™",
      subtitle: "Fabric-wise • Brand-wise • Transparent pricing",
      bgColor: "from-purple-500 to-blue-600",
      image: "/laundry/laundry1.png"
    },
    {
      id: 2,
      title: "Free Pickup & Delivery",
      subtitle: "Minimum order applies",
      bgColor: "from-green-500 to-teal-600",
      image: "/laundry/laundry2.png"
    },
    {
      id: 3,
      title: "24-48 hrs Turnaround",
      subtitle: "Express service available",
      bgColor: "from-orange-500 to-red-600",
      image: "/laundry/laundry3.png"
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

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4">
        {/* Advertisement Banner */}
        <div className="relative mb-12 h-64 rounded-2xl overflow-hidden shadow-xl">
          <div 
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${adSlide * 100}%)` }}
          >
            {adBanners.map((ad) => (
              <div
                key={ad.id}
                className={`flex-shrink-0 w-full h-full bg-gradient-to-r ${ad.bgColor} flex items-center justify-center text-white relative`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={ad.image} 
                    alt={ad.title}
                    className="w-full h-full object-cover opacity-30"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="text-center px-6 relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">{ad.title}</h2>
                  <p className="text-lg md:text-2xl opacity-90">{ad.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Ad Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
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

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 px-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items by name, category, or service type..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Searching for "{searchQuery}"
                </p>
              )}
            </div>

            {/* Category Content */}
            {categoryData[selectedCategory] && (
              <div className="max-w-7xl mx-auto px-4">
                {/* Uniform Grid Layout - All items in consistent grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryData[selectedCategory].subcategories.map((subcategory) => {
                    // Get all items/brands from this subcategory
                    const items = subcategory.brands || subcategory.items || [];
                    
                    // Filter items based on search query
                    const filteredItems = items.filter((item) => 
                      itemMatchesSearch(item, subcategory.name, searchQuery)
                    );
                    
                    return filteredItems.map((item, index) => {
                      // Find the original index for the item key
                      const originalIndex = items.indexOf(item);
                      const itemKey = subcategory.brands 
                        ? `${selectedCategory}-${subcategory.id}-${originalIndex}-brand`
                        : `${selectedCategory}-${subcategory.id}-${originalIndex}`;
                      
                      // For brand-wise items (blazers)
                      if (subcategory.brands) {
                        const quantity = selectedItems[itemKey] || 0;
                        return (
                          <div key={itemKey} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                            {/* Subcategory Badge */}
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 text-xs text-white font-semibold">
                              {subcategory.name}
                            </div>
                            
                            {/* Image Section */}
                            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.tier}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { 
                                    e.target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.className = 'text-6xl';
                                    fallback.textContent = '🧥';
                                    e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                    e.target.parentElement.appendChild(fallback);
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl">🧥</div>
                              )}
                              <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                ₹{item.price}
                              </div>
                            </div>
                            
                            {/* Details Section */}
                            <div className="p-4 flex-grow flex flex-col">
                              <h4 className="text-lg font-bold text-gray-800 mb-1">{item.tier}</h4>
                              {item.note && <p className="text-sm text-gray-600 mb-3 flex-grow">{item.note}</p>}
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-sm text-gray-500">Quantity</span>
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => handleItemQuantityChange(itemKey, -1)}
                                    disabled={quantity === 0}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                                  <button
                                    onClick={() => handleItemQuantityChange(itemKey, 1)}
                                    className="w-8 h-8 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // For regular items
                      return (
                        <div key={itemKey} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                          {/* Subcategory Badge */}
                          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 text-xs text-white font-semibold truncate">
                            {subcategory.name}
                          </div>
                          
                          {/* Image Section */}
                          <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { 
                                  e.target.style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.className = 'text-6xl';
                                  fallback.textContent = '👕';
                                  e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                  e.target.parentElement.appendChild(fallback);
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-6xl">👕</div>
                            )}
                          </div>
                          
                          {/* Details Section */}
                          <div className="p-4 flex-grow flex flex-col">
                            <h4 className="text-lg font-bold text-gray-800 mb-3">{item.name}</h4>
                            
                            {/* Service Options - Compact */}
                            <div className="space-y-2 flex-grow">
                              {item.washFold && (
                                <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                                  <div className="flex-grow">
                                    <p className="text-xs text-gray-600">Wash & Fold</p>
                                    <p className="text-sm font-bold text-purple-600">₹{item.washFold}</p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {(() => {
                                      const serviceKey = `${itemKey}-washFold`;
                                      const quantity = selectedItems[serviceKey] || 0;
                                      return (
                                        <>
                                          <button
                                            onClick={() => handleItemQuantityChange(serviceKey, -1)}
                                            disabled={quantity === 0}
                                            className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-colors"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                          <span className="w-5 text-center text-xs font-bold">{quantity}</span>
                                          <button
                                            onClick={() => handleItemQuantityChange(serviceKey, 1)}
                                            className="w-6 h-6 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center shadow-sm transition-colors"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              )}
                              
                              {item.washIron && (
                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                  <div className="flex-grow">
                                    <p className="text-xs text-gray-600">Wash & Iron</p>
                                    <p className="text-sm font-bold text-blue-600">₹{item.washIron}</p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {(() => {
                                      const serviceKey = `${itemKey}-washIron`;
                                      const quantity = selectedItems[serviceKey] || 0;
                                      return (
                                        <>
                                          <button
                                            onClick={() => handleItemQuantityChange(serviceKey, -1)}
                                            disabled={quantity === 0}
                                            className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-colors"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                          <span className="w-5 text-center text-xs font-bold">{quantity}</span>
                                          <button
                                            onClick={() => handleItemQuantityChange(serviceKey, 1)}
                                            className="w-6 h-6 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center shadow-sm transition-colors"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              )}
                              
                              {item.washOnly && (
                                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                  <div className="flex-grow">
                                    <p className="text-xs text-gray-600">Wash Only</p>
                                    <p className="text-sm font-bold text-green-600">₹{item.washOnly}</p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {(() => {
                                      const serviceKey = `${itemKey}-washOnly`;
                                      const quantity = selectedItems[serviceKey] || 0;
                                      return (
                                        <>
                                          <button
                                            onClick={() => handleItemQuantityChange(serviceKey, -1)}
                                            disabled={quantity === 0}
                                            className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-colors"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                          <span className="w-5 text-center text-xs font-bold">{quantity}</span>
                                          <button
                                            onClick={() => handleItemQuantityChange(serviceKey, 1)}
                                            className="w-6 h-6 rounded-full bg-green-600 text-white hover:bg-green-700 flex items-center justify-center shadow-sm transition-colors"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              )}
                              
                              {item.price && (
                                <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                                  <div className="flex-grow">
                                    {item.service && <p className="text-xs text-gray-600">{item.service}</p>}
                                    <p className="text-sm font-bold text-orange-600">₹{item.price}</p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {(() => {
                                      const serviceKey = `${itemKey}-price`;
                                      const quantity = selectedItems[serviceKey] || 0;
                                      return (
                                        <>
                                          <button
                                            onClick={() => handleItemQuantityChange(serviceKey, -1)}
                                            disabled={quantity === 0}
                                            className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm transition-colors"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                          <span className="w-5 text-center text-xs font-bold">{quantity}</span>
                                          <button
                                            onClick={() => handleItemQuantityChange(serviceKey, 1)}
                                            className="w-6 h-6 rounded-full bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center shadow-sm transition-colors"
                                          >
                                            <Plus className="w-3 h-3" />
                                          </button>
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>

                {/* No Results Message */}
                {searchQuery && categoryData[selectedCategory].subcategories.every(subcategory => {
                  const items = subcategory.brands || subcategory.items || [];
                  const filteredItems = items.filter((item) => 
                    itemMatchesSearch(item, subcategory.name, searchQuery)
                  );
                  return filteredItems.length === 0;
                }) && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No items found</h3>
                    <p className="text-gray-500 mb-6">
                      We couldn't find any items matching "{searchQuery}"
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                )}

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
