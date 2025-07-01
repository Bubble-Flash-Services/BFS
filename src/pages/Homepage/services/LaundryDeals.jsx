import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';

const laundryPackages = {
  'dry-cleaning': {
    title: "Dry Cleaning deals",
    packages: [
      {
        id: 1,
        name: "Basic Dry Clean Package",
        image: "/laundry/laundry1.png",
        price: "₹149",
        features: [
          "Shirt dry cleaning (5 pieces)",
          "Professional pressing",
          "Stain treatment",
          "Fabric care",
          "Same day service"
        ]
      },
      {
        id: 2,
        name: "Premium Dry Clean Package", 
        image: "/laundry/laundry2.png",
        price: "₹299",
        features: [
          "Formal wear cleaning (10 pieces)",
          "Premium pressing",
          "Stain removal guarantee",
          "Fabric protection",
          "Express delivery"
        ]
      },
      {
        id: 3,
        name: "Luxury Dry Clean Package",
        image: "/laundry/laundry3.png", 
        price: "₹599",
        features: [
          "Designer wear cleaning (15 pieces)",
          "Hand finishing",
          "Advanced stain treatment",
          "Garment protection spray",
          "Premium packaging"
        ]
      }
    ]
  },
  'wash-fold': {
    title: "Wash & Fold deals",
    packages: [
      {
        id: 1,
        name: "Basic Wash & Fold Package",
        image: "/laundry/laundry1.png",
        price: "₹99",
        features: [
          "Regular clothes washing (3kg)",
          "Machine wash",
          "Standard detergent",
          "Basic folding",
          "24-hour service"
        ]
      },
      {
        id: 2,
        name: "Premium Wash & Fold Package", 
        image: "/laundry/laundry2.png",
        price: "₹179",
        features: [
          "Clothes washing (5kg)",
          "Premium detergent",
          "Fabric softener",
          "Professional folding",
          "Same day pickup/delivery"
        ]
      },
      {
        id: 3,
        name: "Family Wash & Fold Package",
        image: "/laundry/laundry3.png", 
        price: "₹299",
        features: [
          "Large load washing (8kg)",
          "Eco-friendly detergent",
          "Fabric care treatment",
          "Organized folding & packing",
          "Express service"
        ]
      }
    ]
  },
  'ironing': {
    title: "Ironing & Pressing deals",
    packages: [
      {
        id: 1,
        name: "Quick Iron Package",
        image: "/laundry/laundry1.png",
        price: "₹79",
        features: [
          "Basic ironing (10 pieces)",
          "Standard pressing",
          "Wrinkle removal",
          "Quick service",
          "Ready in 2 hours"
        ]
      },
      {
        id: 2,
        name: "Professional Iron Package", 
        image: "/laundry/laundry2.png",
        price: "₹149",
        features: [
          "Professional ironing (20 pieces)",
          "Steam pressing",
          "Crease setting",
          "Fabric care",
          "Express delivery"
        ]
      },
      {
        id: 3,
        name: "Premium Iron Package",
        image: "/laundry/laundry3.png", 
        price: "₹249",
        features: [
          "Luxury ironing (30 pieces)",
          "Hand pressing for delicates",
          "Perfect crease finishing",
          "Garment steaming",
          "Same day service"
        ]
      }
    ]
  }
};

export default function LaundryDeals() {
  const { category } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [adSlide, setAdSlide] = useState(0);
  const [pricingType, setPricingType] = useState('basic');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalCurrentSlide, setModalCurrentSlide] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [modalStartX, setModalStartX] = useState(0);
  const [modalIsDragging, setModalIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const categoryKey = category?.toLowerCase().replace(/\s+/g, '-').replace('&', '');
  const dealData = laundryPackages[categoryKey] || laundryPackages['wash-fold'];

  // Laundry service details for booking modal
  const laundryServiceDetails = {
    slides: [
      {
        id: 0,
        title: "Washing",
        image: "/laundry/washing.png",
        description: "Professional washing with premium detergents"
      },
      {
        id: 1,
        title: "Drying", 
        image: "/laundry/drying.png",
        description: "Gentle drying process to maintain fabric quality"
      },
      {
        id: 2,
        title: "Ironing",
        image: "/laundry/ironing.png", 
        description: "Expert ironing and pressing for crisp finish"
      },
      {
        id: 3,
        title: "Folding",
        image: "/laundry/folding.png",
        description: "Neat folding and professional packaging"
      },
      {
        id: 4,
        title: "Delivery",
        image: "/laundry/delivery.png",
        description: "Safe and timely delivery to your doorstep"
      }
    ]
  };

  const addons = [
    {
      id: 1,
      name: "Express Service",
      price: 99,
      description: "Same day pickup and delivery",
      icon: "⚡"
    },
    {
      id: 2,
      name: "Fabric Softener",
      price: 49,
      description: "Premium fabric softener for extra comfort",
      icon: "🧴"
    },
    {
      id: 3,
      name: "Stain Protection",
      price: 149,
      description: "Advanced stain protection treatment",
      icon: "🛡️"
    },
    {
      id: 4,
      name: "Eco-Friendly Detergent",
      price: 79,
      description: "Environmentally safe cleaning products",
      icon: "🌿"
    },
    {
      id: 5,
      name: "Fragrance Treatment",
      price: 59,
      description: "Pleasant long-lasting fragrance",
      icon: "🌸"
    },
    {
      id: 6,
      name: "Premium Packaging",
      price: 39,
      description: "Professional garment bags and hangers",
      icon: "📦"
    }
  ];

  // Function to get adjusted price based on pricing type
  const getPrice = (basePrice) => {
    if (pricingType === 'monthly') {
      const numericPrice = parseInt(basePrice.replace('₹', ''));
      return `₹${numericPrice - 30}`;
    }
    return basePrice;
  };

  // Advertisement data
  const adBanners = [
    {
      id: 1,
      title: "30% OFF on Laundry Packages",
      subtitle: "Limited Time Offer - Book Now!",
      bgColor: "from-purple-500 to-pink-600"
    },
    {
      id: 2,
      title: "Free Pickup & Delivery",
      subtitle: "With Every Laundry Package",
      bgColor: "from-indigo-500 to-purple-500"
    },
    {
      id: 3,
      title: "Weekend Laundry Deals",
      subtitle: "Extra 20% Off on Saturday & Sunday",
      bgColor: "from-pink-500 to-red-500"
    },
    {
      id: 4,
      title: "Refer & Earn ₹75",
      subtitle: "For Every Successful Referral",
      bgColor: "from-blue-500 to-indigo-500"
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigation functions for arrow controls
  const goToPrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToNext = () => {
    if (currentSlide < dealData.packages.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  // Auto-slide functionality for advertisements
  useEffect(() => {
    const adAutoSlide = setInterval(() => {
      setAdSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide >= adBanners.length ? 0 : nextSlide;
      });
    }, 2500);

    return () => clearInterval(adAutoSlide);
  }, []);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX;
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !isDragging.current) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !isDragging.current) return;
    isDragging.current = false;
    
    const endX = e.changedTouches[0].pageX;
    const diffX = startX.current - endX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && currentSlide < dealData.packages.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else if (diffX < 0 && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev => {
      const isSelected = prev.find(item => item.id === addon.id);
      if (isSelected) {
        return prev.filter(item => item.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const calculateTotal = () => {
    const packagePrice = selectedPackage?.price ? parseInt(selectedPackage.price.replace('₹', '')) : 99;
    const addonsTotal = selectedAddons.reduce((total, addon) => total + addon.price, 0);
    return packagePrice + addonsTotal;
  };

  const getAddonsTotal = () => {
    return selectedAddons.reduce((total, addon) => total + addon.price, 0);
  };

  const getCategoryDisplayName = () => {
    switch(categoryKey) {
      case 'dry-cleaning': return 'Dry Cleaning';
      case 'wash-fold': return 'Wash & Fold';
      case 'ironing': return 'Ironing & Pressing';
      default: return 'Wash & Fold';
    }
  };

  const handleBookNow = (pkg) => {
    setSelectedPackage({
      ...pkg,
      price: getPrice(pkg.price)
    });
    setSelectedAddons([]);
    setModalCurrentSlide(0);
    setShowBookingModal(true);
  };

  // Touch/swipe handlers for modal image slider
  const handleModalTouchStart = (e) => {
    const startX = e.touches[0].pageX;
    setModalStartX(startX);
    setModalIsDragging(true);
  };

  const handleModalTouchMove = (e) => {
    if (!modalIsDragging) return;
    e.preventDefault();
  };

  const handleModalTouchEnd = (e) => {
    if (!modalIsDragging) return;
    setModalIsDragging(false);
    
    const endX = e.changedTouches[0].pageX;
    const diffX = modalStartX - endX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && modalCurrentSlide < laundryServiceDetails.slides.length - 1) {
        setModalCurrentSlide(modalCurrentSlide + 1);
      } else if (diffX < 0 && modalCurrentSlide > 0) {
        setModalCurrentSlide(modalCurrentSlide - 1);
      }
    }
  };

  // Mouse event handlers for desktop interaction
  const handleModalMouseDown = (e) => {
    e.preventDefault();
    const startX = e.pageX;
    setModalStartX(startX);
    setModalIsDragging(true);
  };

  const handleModalMouseMove = (e) => {
    if (!modalIsDragging) return;
    e.preventDefault();
  };

  const handleModalMouseUp = (e) => {
    if (!modalIsDragging) return;
    setModalIsDragging(false);
    
    const endX = e.pageX;
    const diffX = modalStartX - endX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && modalCurrentSlide < laundryServiceDetails.slides.length - 1) {
        setModalCurrentSlide(modalCurrentSlide + 1);
      } else if (diffX < 0 && modalCurrentSlide > 0) {
        setModalCurrentSlide(modalCurrentSlide - 1);
      }
    }
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Advertisement Banner */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${adSlide * 100}%)`,
              }}
            >
              {adBanners.map((ad) => (
                <div
                  key={ad.id}
                  className={`flex-shrink-0 w-full bg-gradient-to-r ${ad.bgColor} text-white p-8 md:p-12 text-center`}
                >
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">
                    {ad.title}
                  </h2>
                  <p className="text-lg md:text-xl opacity-90">
                    {ad.subtitle}
                  </p>
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
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            LAUNDRY COMBOS
          </div>
          
          {/* Pricing Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 rounded-full p-1 flex">
              <button
                onClick={() => setPricingType('basic')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pricingType === 'basic'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Basic
              </button>
              <button
                onClick={() => setPricingType('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pricingType === 'monthly'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {dealData.title}
          </h1>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {dealData.packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full">
              <div className="p-6 h-full flex flex-col">
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-4 min-h-[3rem]">
                  {pkg.name}
                </h3>
                <ul className="space-y-2 mb-6 flex-grow">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-purple-500 mr-2 text-lg leading-none">•</span>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center mt-auto">
                  <div className="text-2xl font-bold text-purple-500 mb-4">
                    {getPrice(pkg.price)}
                  </div>
                  <button 
                    onClick={() => handleBookNow(pkg)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider Layout */}
        <div className="md:hidden relative">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            disabled={currentSlide === 0}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
              currentSlide === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50 hover:shadow-xl'
            }`}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            disabled={currentSlide === dealData.packages.length - 1}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
              currentSlide === dealData.packages.length - 1 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50 hover:shadow-xl'
            }`}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="overflow-hidden px-12">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {dealData.packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className="flex-shrink-0 w-full px-4"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg max-w-sm mx-auto h-full">
                    <div className="p-6 h-full flex flex-col">
                      <img 
                        src={pkg.image} 
                        alt={pkg.name} 
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-xl font-bold text-gray-800 mb-4 min-h-[3rem]">
                        {pkg.name}
                      </h3>
                      <ul className="space-y-2 mb-6 flex-grow">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-purple-500 mr-2 text-lg leading-none">•</span>
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-center mt-auto">
                        <div className="text-2xl font-bold text-purple-500 mb-4">
                          {getPrice(pkg.price)}
                        </div>
                        <button 
                          onClick={() => handleBookNow(pkg)}
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-lg font-semibold">{getCategoryDisplayName()}</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Laundry Image Slider */}
              <div className="relative bg-gray-100 h-80 overflow-hidden">
                {/* Left Arrow */}
                <button
                  onClick={() => modalCurrentSlide > 0 && setModalCurrentSlide(modalCurrentSlide - 1)}
                  disabled={modalCurrentSlide === 0}
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                    modalCurrentSlide === 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-50 hover:shadow-xl'
                  }`}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => modalCurrentSlide < laundryServiceDetails.slides.length - 1 && setModalCurrentSlide(modalCurrentSlide + 1)}
                  disabled={modalCurrentSlide === laundryServiceDetails.slides.length - 1}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                    modalCurrentSlide === laundryServiceDetails.slides.length - 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-50 hover:shadow-xl'
                  }`}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div 
                  className="flex h-full transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing"
                  style={{
                    transform: `translateX(-${modalCurrentSlide * 100}%)`,
                  }}
                  onTouchStart={handleModalTouchStart}
                  onTouchMove={handleModalTouchMove}
                  onTouchEnd={handleModalTouchEnd}
                  onMouseDown={handleModalMouseDown}
                  onMouseMove={handleModalMouseMove}
                  onMouseUp={handleModalMouseUp}
                  onMouseLeave={handleModalMouseUp}
                >
                  {laundryServiceDetails.slides.map((slide, index) => (
                    <div key={slide.id} className="flex-shrink-0 w-full h-full flex items-center justify-center p-8">
                      <img 
                        src={selectedPackage?.image || "/laundry/laundry1.png"} 
                        alt={slide.title}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {laundryServiceDetails.slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setModalCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === modalCurrentSlide 
                          ? 'bg-blue-600 scale-125' 
                          : 'bg-gray-400 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Service Types Display */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  {laundryServiceDetails.slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setModalCurrentSlide(index)}
                      className={`transition-colors duration-200 hover:text-blue-500 cursor-pointer ${
                        index === modalCurrentSlide ? 'text-blue-600 font-semibold' : ''
                      }`}
                    >
                      {slide.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="px-6 py-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  Professional Laundry Care
                </h1>
                
                <div className="flex space-x-3 mb-6">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    100% Safe cleaning
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Eco-friendly
                  </span>
                </div>

                {/* Service Overview */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">Service Overview</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">
                      Kindly note that water will be provided by owner.
                    </p>
                  </div>
                </div>

                {/* Add-ons Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Explore Add-ons</h2>
                  <div className="space-y-3">
                    {addons.map((addon) => (
                      <div key={addon.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`addon-${addon.id}`}
                            checked={selectedAddons.find(item => item.id === addon.id)}
                            onChange={() => handleAddonToggle(addon)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`addon-${addon.id}`} className="ml-3 text-gray-800 font-medium">
                            {addon.name}
                          </label>
                        </div>
                        <span className="font-semibold text-gray-800">₹{addon.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Package</span>
                    <span className="text-gray-800">{selectedPackage?.price || '₹99'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="text-gray-800">₹{getAddonsTotal()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-blue-600">Total</span>
                      <span className="text-xl font-bold text-blue-600">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
