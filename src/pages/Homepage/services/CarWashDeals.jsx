import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';

const carWashPackages = {
  hatchbacks: {
    title: "Hatchback car wash deals",
    packages: [
      {
        id: 1,
        name: "Quick Car wash Package",
        image: "/car/car1.png",
        price: "₹199",
        features: [
          "Exterior wash with mild soap",
          "Foam wash",
          "Car mats cleaning",
          "Stains removal",
          "Swirl free clean"
        ]
      },
      {
        id: 2,
        name: "Essential Interior & Exterior Care Package", 
        image: "/car/car2.png",
        price: "₹299",
        features: [
          "Exterior wash with mild soap",
          "Foam wash",
          "Car mats cleaning",
          "Tyre Vacuuming",
          "Trunk Vacuuming"
        ]
      },
      {
        id: 3,
        name: "Premium Car Wash Package",
        image: "/car/car3.png", 
        price: "₹699",
        features: [
          "Exterior wash with mild soap",
          "Foam wash",
          "Car mats cleaning",
          "Tyre & trunk vacuuming",
          "Exterior polishing for a glossy finish and waxing"
        ]
      }
    ]
  },
  suv: {
    title: "SUV car wash deals",
    packages: [
      {
        id: 1,
        name: "Quick SUV wash Package",
        image: "/car/car1.png",
        price: "₹249",
        features: [
          "Exterior wash with mild soap",
          "Foam wash",
          "Car mats cleaning",
          "Stains removal",
          "Swirl free clean"
        ]
      },
      {
        id: 2,
        name: "Essential SUV Interior & Exterior Care Package", 
        image: "/car/car2.png",
        price: "₹399",
        features: [
          "Exterior wash with mild soap",
          "Foam wash",
          "Car mats cleaning",
          "Tyre Vacuuming",
          "Trunk Vacuuming"
        ]
      },
      {
        id: 3,
        name: "Premium SUV Wash Package",
        image: "/car/car3.png", 
        price: "₹899",
        features: [
          "Exterior wash with mild soap",
          "Foam wash",
          "Car mats cleaning",
          "Tyre & trunk vacuuming",
          "Exterior polishing for a glossy finish and waxing"
        ]
      }
    ]
  },
  "sedans-luxuries": {
    title: "Sedans & Luxuries car wash deals",
    packages: [
      {
        id: 1,
        name: "Quick Sedan wash Package",
        image: "/car/car1.png",
        price: "₹299",
        features: [
          "Exterior wash with mild soap",
          "Foam wash",
          "Car mats cleaning",
          "Stains removal",
          "Swirl free clean"
        ]
      },
      {
        id: 2,
        name: "Essential Sedan Interior & Exterior Care Package", 
        image: "/car/car2.png",
        price: "₹499",
        features: [
          "Exterior wash with mild soap",
          "Foam wash",
          "Car mats cleaning",
          "Tyre Vacuuming",
          "Trunk Vacuuming"
        ]
      },
      {
        id: 3,
        name: "Premium Luxury Car Wash Package",
        image: "/car/car3.png", 
        price: "₹999",
        features: [
          "Exterior wash with mild soap",
          "Foam wash",
          "Car mats cleaning",
          "Tyre & trunk vacuuming",
          "Exterior polishing for a glossy finish and waxing"
        ]
      }
    ]
  }
};

export default function CarWashDeals() {
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
  const dealData = carWashPackages[categoryKey] || carWashPackages.hatchbacks;

  // Car wash details for booking modal
  const carWashDetails = {
    slides: [
      {
        id: 0,
        title: "Exterior Wash",
        image: "/car/exterior-wash.png",
        description: "Complete exterior cleaning with high-pressure water and premium soap"
      },
      {
        id: 1,
        title: "Interior Wash", 
        image: "/car/interior-wash.png",
        description: "Deep cleaning of seats, dashboard, and interior surfaces"
      },
      {
        id: 2,
        title: "Features",
        image: "/car/features.png", 
        description: "Advanced cleaning techniques and premium equipment"
      },
      {
        id: 3,
        title: "Highlights",
        image: "/car/highlights.png",
        description: "Special attention to detail and finishing touches"
      },
      {
        id: 4,
        title: "Tyre Wash",
        image: "/car/tyre-wash.png",
        description: "Professional tyre cleaning and shine treatment"
      }
    ]
  };

  const addons = [
    {
      id: 1,
      name: "High Quality Foam",
      price: 199,
      description: "Premium foam wash for superior cleaning",
      icon: "🧽"
    },
    {
      id: 2,
      name: "Complete dashboard polishing",
      price: 399,
      description: "Professional dashboard cleaning and polishing",
      icon: "🔧"
    },
    {
      id: 3,
      name: "Remove stains from leather and fibre",
      price: 1499,
      description: "Deep stain removal from all surfaces",
      icon: "🧽"
    },
    {
      id: 4,
      name: "Car fibre restoration & interior cleaning",
      price: 799,
      description: "Complete interior restoration service",
      icon: "🧽"
    },
    {
      id: 5,
      name: "Super wax coating",
      price: 199,
      description: "Premium wax protection coating",
      icon: "🚗"
    },
    {
      id: 6,
      name: "Car roof cleaning",
      price: 699,
      description: "Specialized roof cleaning service",
      icon: "🧽"
    }
  ];

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
    const packagePrice = selectedPackage?.price ? parseInt(selectedPackage.price.replace('₹', '')) : 199;
    const addonsTotal = selectedAddons.reduce((total, addon) => total + addon.price, 0);
    return packagePrice + addonsTotal;
  };

  const getAddonsTotal = () => {
    return selectedAddons.reduce((total, addon) => total + addon.price, 0);
  };

  const getCategoryDisplayName = () => {
    switch(categoryKey) {
      case 'hatchbacks': return 'Hatchbacks';
      case 'suv': return 'SUV';
      case 'sedans-luxuries': return 'Sedans & Luxuries';
      default: return 'Hatchbacks';
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
      if (diffX > 0 && modalCurrentSlide < carWashDetails.slides.length - 1) {
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
      if (diffX > 0 && modalCurrentSlide < carWashDetails.slides.length - 1) {
        setModalCurrentSlide(modalCurrentSlide + 1);
      } else if (diffX < 0 && modalCurrentSlide > 0) {
        setModalCurrentSlide(modalCurrentSlide - 1);
      }
    }
  };

  // Function to get adjusted price based on pricing type
  const getPrice = (basePrice) => {
    if (pricingType === 'monthly') {
      const numericPrice = parseInt(basePrice.replace('₹', ''));
      return `₹${numericPrice - 100}`;
    }
    return basePrice;
  };

  // Advertisement data
  const adBanners = [
    {
      id: 1,
      title: "50% OFF on Premium Packages",
      subtitle: "Limited Time Offer - Book Now!",
      bgColor: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "Free Car Mats Cleaning",
      subtitle: "With Every Exterior Wash Package",
      bgColor: "from-green-500 to-blue-500"
    },
    {
      id: 3,
      title: "Weekend Special Deals",
      subtitle: "Extra 20% Off on Saturday & Sunday",
      bgColor: "from-orange-500 to-red-500"
    },
    {
      id: 4,
      title: "Refer & Earn ₹100",
      subtitle: "For Every Successful Referral",
      bgColor: "from-purple-500 to-pink-500"
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
    }, 2500); // Different timing for ads

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
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            CAR WASH COMBOS
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

        {/* Pricing Toggle Buttons - New Section */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setPricingType('basic')}
            className={`inline-block px-4 py-2 rounded-full font-semibold transition-all duration-300 mr-4 ${
              pricingType === 'basic' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Basic Pricing
          </button>
          <button
            onClick={() => setPricingType('monthly')}
            className={`inline-block px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
              pricingType === 'monthly' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Monthly Pricing
          </button>
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
                      <span className="text-green-500 mr-2 text-lg leading-none">•</span>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center mt-auto">
                  <div className="text-2xl font-bold text-blue-500 mb-4">
                    {getPrice(pkg.price)}
                  </div>
                  <button 
                    onClick={() => handleBookNow(pkg)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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
                            <span className="text-green-500 mr-2 text-lg leading-none">•</span>
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-center mt-auto">
                        <div className="text-2xl font-bold text-blue-500 mb-4">
                          {getPrice(pkg.price)}
                        </div>
                        <button 
                          onClick={() => handleBookNow(pkg)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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

            {/* Car Image Slider */}
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
                onClick={() => modalCurrentSlide < carWashDetails.slides.length - 1 && setModalCurrentSlide(modalCurrentSlide + 1)}
                disabled={modalCurrentSlide === carWashDetails.slides.length - 1}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                  modalCurrentSlide === carWashDetails.slides.length - 1 
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
                {carWashDetails.slides.map((slide, index) => (
                  <div key={slide.id} className="flex-shrink-0 w-full h-full flex items-center justify-center p-8">
                    <img 
                      src={selectedPackage?.image || "/car/car1.png"} 
                      alt={slide.title}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {carWashDetails.slides.map((slide, index) => (
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
                {carWashDetails.slides.map((slide, index) => (
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
                Great Cars Deserve Great Care
              </h1>
              
              <div className="flex space-x-3 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  100% Stain removal
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Efficient
                </span>
              </div>

              {/* Car Overview */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Car Overview</h2>
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
                  <span className="text-gray-800">{selectedPackage?.price || '₹199'}</span>
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
    </section>
  );
}
