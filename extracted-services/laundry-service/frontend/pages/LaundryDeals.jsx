import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';
import SigninModal from '../signin/SigninModal';

const laundryServices = {
  'dry-cleaning': {
    title: "Dry Cleaning Services",
    basePrice: 25, // Base price per item
    items: [
      { id: 1, name: "Suits (men's and women's)", price: 150 },
      { id: 2, name: "Blazers & Jackets", price: 120 },
      { id: 3, name: "Dress Pants & Trousers", price: 80 },
      { id: 4, name: "Formal Dresses & Gowns", price: 200 },
      { id: 5, name: "Sarees / Lehengas / Sherwanis", price: 250 },
      { id: 6, name: "Silk garments", price: 100 },
      { id: 7, name: "Wool coats / overcoats", price: 300 },
      { id: 8, name: "Blouses & Dress shirts", price: 60 },
      { id: 9, name: "Ties & Scarves", price: 40 },
      { id: 10, name: "Skirts", price: 70 },
      { id: 11, name: "Embellished or sequined clothes", price: 180 },
      { id: 12, name: "Cashmere or delicate sweaters", price: 150 },
      { id: 13, name: "Curtains and drapes", price: 200 },
      { id: 14, name: "Costumes or uniforms", price: 120 }
    ]
  },
  'wash-fold': {
    title: "Wash & Fold Services",
    basePrice: 15, // Base price per item
    items: [
      { id: 15, name: "T-shirts & Polos", price: 30 },
      { id: 16, name: "Casual shirts", price: 40 },
      { id: 17, name: "Jeans & Trousers", price: 50 },
      { id: 18, name: "Shorts", price: 30 },
      { id: 19, name: "Socks & Undergarments", price: 20 },
      { id: 20, name: "Casual Dresses", price: 60 },
      { id: 21, name: "Gym wear / Activewear", price: 35 },
      { id: 22, name: "Pajamas & Loungewear", price: 40 },
      { id: 23, name: "Bed sheets & pillowcases", price: 80 },
      { id: 24, name: "Towels", price: 40 },
      { id: 25, name: "Cotton scarves", price: 25 },
      { id: 26, name: "Baby clothes", price: 25 },
      { id: 27, name: "Simple tops and blouses", price: 35 },
      { id: 28, name: "Hoodies & Sweatshirts", price: 60 },
      { id: 29, name: "Casual skirts", price: 45 }
    ]
  },
  'ironing': {
    title: "Ironing & Pressing Services",
    basePrice: 10, // Base price per item
    items: [
      { id: 30, name: "Dress shirts", price: 25 },
      { id: 31, name: "Blouses", price: 30 },
      { id: 32, name: "Sarees / Dupattas / Shawls", price: 50 },
      { id: 33, name: "Trousers & Dress pants", price: 35 },
      { id: 34, name: "Uniforms", price: 40 },
      { id: 35, name: "Formal dresses & gowns", price: 80 },
      { id: 36, name: "Cotton kurta / kurti", price: 40 },
      { id: 37, name: "Skirts", price: 30 },
      { id: 38, name: "Jackets & blazers", price: 60 },
      { id: 39, name: "Bed linens", price: 50 },
      { id: 40, name: "Curtains", price: 80 }
    ]
  }
};

export default function LaundryDeals() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adSlide, setAdSlide] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);

  const categoryKey = category?.toLowerCase().replace(/\s+/g, '-').replace('&', '');
  const serviceData = laundryServices[categoryKey] || laundryServices['dry-cleaning'];

  // Advertisement data
  const adBanners = [
    {
      id: 1,
      title: "50% OFF on Laundry Services",
      subtitle: "Limited Time Offer - Book Now!",
      bgColor: "from-purple-500 to-blue-600"
    },
    {
      id: 2,
      title: "Free Pickup & Delivery",
      subtitle: "For Orders Above ₹500",
      bgColor: "from-green-500 to-purple-500"
    },
    {
      id: 3,
      title: "Same Day Service Available",
      subtitle: "Express Laundry Solutions",
      bgColor: "from-orange-500 to-pink-500"
    },
    {
      id: 4,
      title: "Professional Care Guarantee",
      subtitle: "100% Satisfaction Assured",
      bgColor: "from-blue-500 to-green-500"
    }
  ];

  useEffect(() => {
    const adAutoSlide = setInterval(() => {
      setAdSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide >= adBanners.length ? 0 : nextSlide;
      });
    }, 3000);

    return () => clearInterval(adAutoSlide);
  }, []);

  const handleItemQuantityChange = (itemId, increment) => {
    setSelectedItems(prev => {
      const currentQuantity = prev[itemId] || 0;
      const newQuantity = Math.max(0, currentQuantity + increment);
      
      if (newQuantity === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [itemId]: newQuantity };
      }
    });
  };

  const getTotalPrice = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = serviceData.items.find(item => item.id === parseInt(itemId));
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((total, quantity) => total + quantity, 0);
  };

  const getCategoryDisplayName = () => {
    switch(categoryKey) {
      case 'dry-cleaning': return 'Dry Cleaning';
      case 'wash-fold': return 'Wash & Fold';
      case 'ironing': return 'Ironing & Pressing';
      default: return 'Dry Cleaning';
    }
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
      const selectedItemsArray = Object.entries(selectedItems).map(([itemId, quantity]) => {
        const item = serviceData.items.find(item => item.id === parseInt(itemId));
        return {
          ...item,
          quantity,
          totalPrice: item.price * quantity
        };
      });

      const cartItem = {
        id: `laundry-${categoryKey}-${Date.now()}`,
        name: `${getCategoryDisplayName()} Service`,
        image: "/laundry/laundry1.png",
        price: getTotalPrice(),
        category: getCategoryDisplayName(),
        type: 'laundry-service',
        laundryDetails: {
          serviceType: categoryKey,
          items: selectedItemsArray,
          totalItems: getTotalItems(),
          totalPrice: getTotalPrice()
        },
        quantity: 1
      };
      
      addToCart(cartItem);
      setShowBookingModal(false);
      alert('Items added to cart successfully!');
    });
  };

  const handleBuyNow = () => {
    if (getTotalItems() === 0) {
      alert('Please select at least one item to proceed');
      return;
    }

    checkAuthAndExecute(() => {
      const selectedItemsArray = Object.entries(selectedItems).map(([itemId, quantity]) => {
        const item = serviceData.items.find(item => item.id === parseInt(itemId));
        return {
          ...item,
          quantity,
          totalPrice: item.price * quantity
        };
      });

      const cartItem = {
        id: `laundry-${categoryKey}-${Date.now()}`,
        name: `${getCategoryDisplayName()} Service`,
        image: "/laundry/laundry1.png",
        price: getTotalPrice(),
        category: getCategoryDisplayName(),
        type: 'laundry-service',
        laundryDetails: {
          serviceType: categoryKey,
          items: selectedItemsArray,
          totalItems: getTotalItems(),
          totalPrice: getTotalPrice()
        },
        quantity: 1
      };
      
      addToCart(cartItem);
      setShowBookingModal(false);
      navigate('/cart');
    });
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4">
        
        {/* Advertisement Banner */}
        <div className="relative mb-12 h-48 rounded-2xl overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${adSlide * 100}%)`,
            }}
          >
            {adBanners.map((ad) => (
              <div
                key={ad.id}
                className={`flex-shrink-0 w-full h-full bg-gradient-to-r ${ad.bgColor} flex items-center justify-center text-white relative`}
              >
                <div className="text-center px-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {ad.title}
                  </h2>
                  <p className="text-lg md:text-xl opacity-90">
                    {ad.subtitle}
                  </p>
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
                  index === adSlide 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                onClick={() => setAdSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            LAUNDRY SERVICES
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {serviceData.title}
          </h1>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional laundry care for your garments. Select the quantity for each item type below.
          </p>
        </div>

        {/* Service Items Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Select Items & Quantities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceData.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">₹{item.price} per piece</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleItemQuantityChange(item.id, -1)}
                      disabled={!selectedItems[item.id]}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        selectedItems[item.id] 
                          ? 'bg-purple-500 text-white hover:bg-purple-600' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="w-8 text-center font-semibold text-gray-800">
                      {selectedItems[item.id] || 0}
                    </span>
                    
                    <button
                      onClick={() => handleItemQuantityChange(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-purple-500 text-white hover:bg-purple-600 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary Section */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Total Items: {getTotalItems()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getCategoryDisplayName()} Service
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{getTotalPrice()}
                  </p>
                  <p className="text-sm text-gray-600">Total Amount</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={getTotalItems() === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    getTotalItems() > 0
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={getTotalItems() === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    getTotalItems() > 0
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Service Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="text-center p-4">
                <div className="text-purple-500 text-2xl mb-2">🚚</div>
                <h4 className="font-semibold mb-1">Free Pickup & Delivery</h4>
                <p>Convenient doorstep service</p>
              </div>
              <div className="text-center p-4">
                <div className="text-purple-500 text-2xl mb-2">⚡</div>
                <h4 className="font-semibold mb-1">Quick Turnaround</h4>
                <p>Express service available</p>
              </div>
              <div className="text-center p-4">
                <div className="text-purple-500 text-2xl mb-2">✨</div>
                <h4 className="font-semibold mb-1">Professional Care</h4>
                <p>Expert handling of garments</p>
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
          onLogin={handleLoginSuccess}
        />
      )}
    </section>
  );
}
