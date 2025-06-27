import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const bikeWashPackages = {
  commuter: {
    title: "Commuter Bikes wash deals",
    packages: [
      {
        id: 1,
        name: "Quick Bike wash Package",
        image: "/bike/bike1.png",
        price: "₹99",
        features: [
          "Exterior wash with mild soap",
          "Chain cleaning",
          "Basic polish",
          "Tire cleaning",
          "Quick dry"
        ]
      },
      {
        id: 2,
        name: "Essential Bike Care Package", 
        image: "/bike/bike2.png",
        price: "₹149",
        features: [
          "Exterior wash with mild soap",
          "Chain cleaning & lubrication",
          "Seat cleaning",
          "Handle cleaning",
          "Basic maintenance check"
        ]
      },
      {
        id: 3,
        name: "Premium Bike Wash Package",
        image: "/bike/bike3.png", 
        price: "₹249",
        features: [
          "Complete exterior wash",
          "Chain cleaning & lubrication",
          "Seat deep cleaning",
          "Engine bay cleaning",
          "Premium polish & wax"
        ]
      }
    ]
  },
  sports: {
    title: "Sports Bikes wash deals",
    packages: [
      {
        id: 1,
        name: "Quick Sports Bike wash Package",
        image: "/bike/bike1.png",
        price: "₹129",
        features: [
          "Exterior wash with mild soap",
          "Chain cleaning",
          "Basic polish",
          "Tire cleaning",
          "Quick dry"
        ]
      },
      {
        id: 2,
        name: "Essential Sports Bike Care Package", 
        image: "/bike/bike2.png",
        price: "₹199",
        features: [
          "Exterior wash with mild soap",
          "Chain cleaning & lubrication",
          "Seat cleaning",
          "Handle cleaning",
          "Performance check"
        ]
      },
      {
        id: 3,
        name: "Premium Sports Bike Wash Package",
        image: "/bike/bike3.png", 
        price: "₹349",
        features: [
          "Complete exterior wash",
          "Chain cleaning & lubrication",
          "Seat deep cleaning",
          "Engine bay detailing",
          "Premium polish & ceramic coating"
        ]
      }
    ]
  },
  cruiser: {
    title: "Cruiser Bikes wash deals",
    packages: [
      {
        id: 1,
        name: "Quick Cruiser wash Package",
        image: "/bike/bike1.png",
        price: "₹119",
        features: [
          "Exterior wash with mild soap",
          "Chain cleaning",
          "Basic polish",
          "Tire cleaning",
          "Quick dry"
        ]
      },
      {
        id: 2,
        name: "Essential Cruiser Care Package", 
        image: "/bike/bike2.png",
        price: "₹179",
        features: [
          "Exterior wash with mild soap",
          "Chain cleaning & lubrication",
          "Seat cleaning",
          "Chrome polishing",
          "Basic maintenance check"
        ]
      },
      {
        id: 3,
        name: "Premium Cruiser Wash Package",
        image: "/bike/bike3.png", 
        price: "₹299",
        features: [
          "Complete exterior wash",
          "Chain cleaning & lubrication",
          "Leather seat conditioning",
          "Chrome detailing",
          "Premium polish & protection"
        ]
      }
    ]
  }
};

export default function BikeWashDeals() {
  const { category } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [adSlide, setAdSlide] = useState(0);
  const [pricingType, setPricingType] = useState('basic');
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const categoryKey = category?.toLowerCase().replace(/\s+/g, '-').replace('&', '');
  const dealData = bikeWashPackages[categoryKey] || bikeWashPackages.commuter;

  // Function to get adjusted price based on pricing type
  const getPrice = (basePrice) => {
    if (pricingType === 'monthly') {
      const numericPrice = parseInt(basePrice.replace('₹', ''));
      return `₹${numericPrice - 50}`;
    }
    return basePrice;
  };

  // Advertisement data
  const adBanners = [
    {
      id: 1,
      title: "40% OFF on Bike Packages",
      subtitle: "Limited Time Offer - Book Now!",
      bgColor: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "Free Chain Lubrication",
      subtitle: "With Every Bike Wash Package",
      bgColor: "from-green-500 to-blue-500"
    },
    {
      id: 3,
      title: "Weekend Bike Deals",
      subtitle: "Extra 15% Off on Saturday & Sunday",
      bgColor: "from-orange-500 to-red-500"
    },
    {
      id: 4,
      title: "Refer & Earn ₹50",
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
          <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            BIKE WASH COMBOS
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
                      <span className="text-green-500 mr-2 text-lg leading-none">•</span>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center mt-auto">
                  <div className="text-2xl font-bold text-green-500 mb-4">
                    {getPrice(pkg.price)}
                  </div>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
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
                        <div className="text-2xl font-bold text-green-500 mb-4">
                          {getPrice(pkg.price)}
                        </div>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
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
      </div>
    </section>
  );
}
