import React, { useState, useRef, useEffect } from 'react';
import FullBodyCheckup from '../../../components/FullBodyCheckup';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';
import SigninModal from '../signin/SigninModal';

const bikeWashPackages = {
  commuter: {
    title: "Commuter Wash Packages",
    subtitle: "Tailored for all scooters: Activa, Jupiter, Dio, Access, Ntorq, etc.",
    packages: [
      {
        id: 1,
        name: "Basic Shine",
        image: "/bike/commuter/tvs-ntorq-125-race-edition-matte-white-175501476-vc4uk (1).png",
        price: "₹129",
        description: "Quick Refresh for Daily Riders",
        features: [
          "High-pressure water wash",
          "Normal foam wash",
          "Tyre cleaning",
          "Seat wipe & number plate clean"
        ]
      },
      {
        id: 2,
        name: "Urban Shine",
        image: "/bike/commuter/pexels-pixabay-159192.png",
        price: "₹169",
        description: "Weekly Clean for Better Look & Feel",
        features: [
          "High-pressure water wash",
          "Tyre cleaning",
          "Seat wipe & number plate clean",
          "Red foam wash",
          "Mat cleaning"
        ]
      },
      {
        id: 3,
        name: "Supreme Spa",
        image: "/bike/commuter/tvs-ntorq-125-race-edition-matte-white-175501476-vc4uk (1).png",
        price: "₹229",
        description: "Deep Clean & Shine – Like New Again",
        features: [
          "High-pressure water wash",
          "Tyre cleaning",
          "Seat wipe & number plate clean",
          "Diamond foam wash",
          "Mat cleaning",
          "Tyre polish"
        ]
      }
    ]
  },
  cruiser: {
    title: "Cruiser Bike Wash Packages",
    subtitle: "For: Royal Enfield, KTM, Jawa, R15, Interceptor, Dominar, Ninja, Harley & more",
    packages: [
      {
        id: 1,
        name: "Torque Wash",
        image: "/bike/cruiser/bike3.png",
        price: "₹159",
        description: "Quick & effective clean for regular maintenance",
        features: [
          "High-pressure water wash",
          "Red foam wash",
          "Tyre cleaning",
          "Seat wipe",
          "Dashboard/speedo wipe"
        ]
      },
      {
        id: 2,
        name: "Nitro Detail",
        image: "/bike/cruiser/pexels-sahil-dethe-590388386-17266142.png",
        price: "₹249",
        description: "Detailed cleaning + engine & chain care",
        features: [
          "All services from Torque Wash",
          "Red foam wash",
          "Chain cleaning & lubrication",
          "Dashboard/speedo wipe",
          "Tyre polish",
          "Perfume spray",
          "Helmet wipe included"
        ]
      },
      {
        id: 3,
        name: "HyperCare Spa",
        image: "/bike/cruiser/pexels-sai-krishna-179319646-14674649.png",
        price: "₹349",
        description: "Full-body spa for your beast – shine, polish & protect",
        features: [
          "All services from Nitro Detail",
          "Diamond foam wash",
          "Full-body wax polish (UV-protect, scratch safe)",
          "Chrome polish (silencer, mirrors, frame)",
          "Helmet foam cleaning",
          "Headlight, indicator & mirror shine"
        ]
      }
    ]
  },
  sports: {
    title: "Sports Bike Wash Packages",
    subtitle: "For bikes like Splendor, Pulsar, Apache, FZ, Shine, Xtreme, Unicorn, etc.",
    packages: [
      {
        id: 1,
        name: "Basic Ride",
        image: "/bike/sports/pexels-shrinidhi-holla-30444780.png",
        price: "₹249",
        description: "Perfect for daily-use bikes needing a quick clean",
        features: [
          "High-pressure water wash",
          "Normal foam wash",
          "Tyre cleaning",
          "Seat wipe",
          "Number plate wipe"
        ]
      },
      {
        id: 2,
        name: "Street Pro",
        image: "/bike/sports/pexels-shrinidhi-holla-30444780.png",
        price: "₹379",
        description: "Ideal for weekly city riders wanting a fresh look",
        features: [
          "All services from Basic Ride",
          "Red foam wash",
          "High-pressure water wash",
          "Tyre cleaning",
          "Seat wipe",
          "Number plate wipe"
        ]
      },
      {
        id: 3,
        name: "Xtreme Spa",
        image: "/bike/sports/pexels-thenoctishouse-10659911.png",
        price: "₹449",
        description: "For mid-segment or polished riders who want their bike to shine like new",
        features: [
          "All services from Street Pro",
          "Diamond foam wash",
          "Alloy & tyre polish",
          "Mirror & headlight polish",
          "High-pressure water wash",
          "Tyre cleaning",
          "Seat wipe",
          "Number plate wipe"
        ]
      }
    ]
  },
  
};

export default function BikeWashDeals() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [adSlide, setAdSlide] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalCurrentSlide, setModalCurrentSlide] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [modalStartX, setModalStartX] = useState(0);
  const [modalIsDragging, setModalIsDragging] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const categoryKey = category?.toLowerCase().replace(/\s+/g, '-').replace('&', '');
  const dealData = bikeWashPackages[categoryKey] || bikeWashPackages.commuter;
  const isLuxury = categoryKey === 'sports';

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

  // Bike wash details for booking modal
  const bikeWashDetails = {
    slides: [
      {
        id: 0,
        title: "Exterior Wash",
        image: "/bike/exterior-wash.png",
        description: "Complete bike exterior cleaning with premium soap"
      },
      {
        id: 1,
        title: "Chain Cleaning", 
        image: "/bike/chain-cleaning.png",
        description: "Deep chain cleaning and lubrication service"
      },
      {
        id: 2,
        title: "Polishing",
        image: "/bike/polishing.png", 
        description: "Professional polishing for shiny finish"
      },
      {
        id: 3,
        title: "Engine Bay",
        image: "/bike/engine-bay.png",
        description: "Engine bay cleaning and maintenance"
      },
      {
        id: 4,
        title: "Final Check",
        image: "/bike/final-check.png",
        description: "Quality check and finishing touches"
      }
    ]
  };

  const addons = [
    {
      id: 1,
      name: "Tyre Polishing",
      price: 69,
      description: "Restores black shine to tyres",
      icon: ""
    },
    {
      id: 2,
      name: "Body Polish",
      price: 99,
      description: "Surface polish for plastic/paint (UV safe)",
      icon: ""
    },
    {
      id: 3,
      name: categoryKey === 'commuter' ? "Mat Cleaning" : "Chain Cleaning & Lubrication",
      price: categoryKey === 'commuter' ? 29 : 120,
      description: categoryKey === 'commuter' ? "Scrub & dry rubber floor mats" : "Chain Cleaning & Lubrication",
      icon: ""
    },
    {
      id: 4,
      name: "Air Filling (Both Tyres)",
      price: 50,
      description: "Tyre pressure check & refill",
      icon: ""
    },
    ...(categoryKey === 'cruiser' ? [
      {
        id: 5,
        name: "Chrome Polish",
        price: 149,
        description: "Chrome polish for silencer, mirrors, frame",
        icon: ""
      },
      {
        id: 6,
        name: "Helmet Foam Cleaning",
        price: 79,
        description: "Complete helmet foam cleaning service",
        icon: ""
      },
      {
        id: 7,
        name: "Full-body Wax Polish",
        price: 199,
        description: "UV-protect, scratch safe wax polish",
        icon: ""
      }
    ] : [])
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

  // Handler functions for the booking modal
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
      case 'commuter': return 'Scooter Wash';
      case 'sports': return 'Motorbike Wash';
      case 'cruiser': return 'Sports/Premium Bike Wash';
      default: return 'Scooter Wash';
    }
  };

  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setSelectedAddons([]);
    setModalCurrentSlide(0);
    setShowBookingModal(true);
  };

  // Authentication check functions
  const checkAuthAndExecute = (callback) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    callback();
  };

  const handleAddToCart = () => {
    checkAuthAndExecute(() => {
      const packagePrice = parseInt(selectedPackage.price.replace('₹', ''));
      const addonsTotal = getAddonsTotal();
      const totalPrice = packagePrice + addonsTotal;
      
      const cartItem = {
        id: `bikewash-${selectedPackage.id}-${Date.now()}`,
        serviceId: `bikewash-${selectedPackage.id}`,
        name: selectedPackage.name,
        image: selectedPackage.image,
        price: totalPrice,
        category: getCategoryDisplayName(),
        type: 'bike-wash',
        serviceName: getCategoryDisplayName(),
        packageName: selectedPackage.name,
        includedFeatures: selectedPackage.features,
        vehicleType: categoryKey,
        packageDetails: {
          basePrice: packagePrice,
          addons: selectedAddons,
          addonsTotal: addonsTotal,
          features: selectedPackage.features
        },
        quantity: 1
      };
      
      addToCart(cartItem);
      setShowBookingModal(false);
      alert('Item added to cart successfully!');
    });
  };

  const handleBuyNow = () => {
    checkAuthAndExecute(() => {
      const packagePrice = parseInt(selectedPackage.price.replace('₹', ''));
      const addonsTotal = getAddonsTotal();
      const totalPrice = packagePrice + addonsTotal;
      
      const cartItem = {
        id: `bikewash-${selectedPackage.id}-${Date.now()}`,
        serviceId: `bikewash-${selectedPackage.id}`,
        name: selectedPackage.name,
        image: selectedPackage.image,
        price: totalPrice,
        category: getCategoryDisplayName(),
        type: 'bike-wash',
        serviceName: getCategoryDisplayName(),
        packageName: selectedPackage.name,
        includedFeatures: selectedPackage.features,
        vehicleType: categoryKey,
        packageDetails: {
          basePrice: packagePrice,
          addons: selectedAddons,
          addonsTotal: addonsTotal,
          features: selectedPackage.features
        },
        quantity: 1
      };
      
      addToCart(cartItem);
      setShowBookingModal(false);
      navigate('/cart');
    });
  };

  const handleLoginSuccess = (userData) => {
    setShowLoginModal(false);
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
      if (diffX > 0 && modalCurrentSlide < bikeWashDetails.slides.length - 1) {
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
      if (diffX > 0 && modalCurrentSlide < bikeWashDetails.slides.length - 1) {
        setModalCurrentSlide(modalCurrentSlide + 1);
      } else if (diffX < 0 && modalCurrentSlide > 0) {
        setModalCurrentSlide(modalCurrentSlide - 1);
      }
    }
  };

  return (
    <section
      className={
        isLuxury
          ? "py-16 min-h-screen bg-[#0a0a0a] text-white"
          : "py-16 bg-gray-50 min-h-screen"
      }
      style={isLuxury ? { fontFamily: 'Montserrat, ui-sans-serif, system-ui' } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Advertisement Banner */}
        <div className="mb-12">
          <div className={`relative overflow-hidden rounded-2xl shadow-lg h-48 ${isLuxury ? 'bg-black/60 ring-1 ring-[#d4af37]/30' : ''}`}>
            <div
              className={`flex transition-transform duration-500 ease-in-out ${isLuxury ? 'bg-gradient-to-r from-black/60 to-black/30' : ''}`}
              style={{
                transform: `translateX(-${adSlide * 100}%)`,
              }}
            >
              {adBanners.map((ad) => (
                <div
                  key={ad.id}
                  className={`flex-shrink-0 w-full ${isLuxury ? 'bg-black text-[#d4af37]' : 'bg-gradient-to-r ' + ad.bgColor + ' text-white'} p-8 md:p-12 text-center`}
                >
                  <h2 className={`text-2xl md:text-4xl font-bold mb-2 ${isLuxury ? "font-['Playfair Display'] text-[#d4af37]" : ''}`}>
                    {ad.title}
                  </h2>
                  <p className={`text-lg md:text-xl opacity-90 ${isLuxury ? 'text-white/80' : ''}`}>
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
                      ? (isLuxury ? 'bg-[#d4af37]' : 'bg-white shadow-lg')
                      : (isLuxury ? 'bg-white/30 hover:bg-white/50' : 'bg-white/50 hover:bg-white/70')
                  }`}
                  onClick={() => setAdSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          {!isLuxury && (
            <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
              BIKE WASH COMBOS
            </div>
          )}
          
          <h1
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isLuxury ? "text-[#d4af37] font-['Playfair Display',serif]" : "text-gray-800"
            }`}
          >
            {dealData.title}
          </h1>
          
          {dealData.subtitle && (
            <p className={`text-lg mb-6 ${isLuxury ? 'text-white/80' : 'text-gray-600'}`}>
              {dealData.subtitle}
            </p>
          )}
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {dealData.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={
                isLuxury
                  ? "rounded-2xl overflow-hidden h-full bg-black/60 border border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                  : "bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full"
              }
            >
              <div className="p-6 h-full flex flex-col">
                <div className={`${isLuxury ? 'w-full h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden ring-1 ring-[#d4af37]/30 bg-black/30' : 'w-full h-48 bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden'}`}>
                  <img 
                    src={pkg.image} 
                    alt={pkg.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h3 className={`text-xl font-bold mb-3 min-h-[3rem] ${isLuxury ? "text-[#d4af37] font-['Playfair Display',serif]" : 'text-gray-800'}`}>
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p className={`${isLuxury ? 'text-white/80 italic' : 'text-gray-600'} text-sm mb-4 italic`}>
                    {pkg.description}
                  </p>
                )}
                <div className="mb-4">
                  <h4 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-700'}`}>Included Services:</h4>
                  <ul className="space-y-2 mb-4 flex-grow">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-green-500'} mr-2 text-lg leading-none mt-1`}>•</span>
                        <span className={`${isLuxury ? 'text-white/90' : 'text-gray-600'} text-sm`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center mt-auto">
                  <div className={`text-2xl font-bold mb-4 ${isLuxury ? 'text-[#d4af37]' : 'text-green-500'}`}>
                    {pkg.price}
                  </div>
                  <button 
                    className={
                      isLuxury
                        ? "w-full bg-black border border-[#d4af37] text-[#d4af37] font-semibold py-3 px-6 rounded-lg hover:bg-[#0f0f0f] hover:shadow-[0_0_10px_rgba(212,175,55,0.4)] transition"
                        : "w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    }
                    onClick={() => handleBookNow(pkg)}
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
                  <div className={`${isLuxury ? 'bg-black/60 border border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-white shadow-lg'} rounded-2xl overflow-hidden max-w-sm mx-auto h-full`}>
                    <div className="p-6 h-full flex flex-col">
                      <div className={`${isLuxury ? 'w-full h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden ring-1 ring-[#d4af37]/30 bg-black/30' : 'w-full h-48 bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden'}`}>
                        <img 
                          src={pkg.image} 
                          alt={pkg.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <h3 className={`text-xl font-bold mb-3 min-h-[3rem] ${isLuxury ? "text-[#d4af37] font-['Playfair Display',serif]" : 'text-gray-800'}`}>
                        {pkg.name}
                      </h3>
                      {pkg.description && (
                        <p className={`${isLuxury ? 'text-white/80 italic' : 'text-gray-600'} text-sm mb-4 italic`}>
                          {pkg.description}
                        </p>
                      )}
                      <ul className="space-y-2 mb-6 flex-grow">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-green-500'} mr-2 text-lg leading-none`}>•</span>
                            <span className={`${isLuxury ? 'text-white/90' : 'text-gray-600'} text-sm`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-center mt-auto">
                        <div className={`text-2xl font-bold mb-4 ${isLuxury ? 'text-[#d4af37]' : 'text-green-500'}`}>
                          {pkg.price}
                        </div>
                        <button 
                          className={
                            isLuxury
                              ? "w-full bg-black border border-[#d4af37] text-[#d4af37] font-semibold py-3 px-6 rounded-lg hover:bg-[#0f0f0f] hover:shadow-[0_0_10px_rgba(212,175,55,0.4)] transition"
                              : "w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                          }
                          onClick={() => handleBookNow(pkg)}
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

              {/* Bike Image Slider */}
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
                  onClick={() => modalCurrentSlide < bikeWashDetails.slides.length - 1 && setModalCurrentSlide(modalCurrentSlide + 1)}
                  disabled={modalCurrentSlide === bikeWashDetails.slides.length - 1}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                    modalCurrentSlide === bikeWashDetails.slides.length - 1 
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
                  {bikeWashDetails.slides.map((slide, index) => (
                    <div key={slide.id} className="flex-shrink-0 w-full h-full flex items-center justify-center p-8">
                      <img 
                        src={selectedPackage?.image || "/bike/bike1.png"} 
                        alt={slide.title}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {bikeWashDetails.slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setModalCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === modalCurrentSlide 
                          ? (isLuxury ? 'bg-[#d4af37] scale-125' : 'bg-blue-600 scale-125') 
                          : (isLuxury ? 'bg-white/30 hover:bg-white/50' : 'bg-gray-400 hover:bg-gray-500')
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Service Types Display */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className={`flex justify-between text-sm ${isLuxury ? 'text-white/80' : 'text-gray-600'}`}>
                  {bikeWashDetails.slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setModalCurrentSlide(index)}
                      className={`transition-colors duration-200 cursor-pointer ${
                        isLuxury ? 'hover:text-[#d4af37]' : 'hover:text-blue-500'
                      } ${
                        index === modalCurrentSlide 
                          ? (isLuxury ? 'text-[#d4af37] font-semibold' : 'text-blue-600 font-semibold')
                          : ''
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
                  Great Bikes Deserve Great Care
                </h1>
                
                <div className="flex space-x-3 mb-6">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    100% Chain cleaning
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Efficient
                  </span>
                </div>

                {/* Bike Overview */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">Bike Overview</h2>
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
                            className={`w-5 h-5 border-gray-300 rounded ${isLuxury ? 'text-[#d4af37] focus:ring-[#d4af37]' : 'text-blue-600 focus:ring-blue-500'}`}
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
                      <span className={`text-lg font-semibold ${isLuxury ? 'text-[#d4af37]' : 'text-blue-600'}`}>Total</span>
                      <span className={`text-xl font-bold ${isLuxury ? 'text-[#d4af37]' : 'text-blue-600'}`}>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                      isLuxury
                        ? 'bg-black border border-[#d4af37] text-[#d4af37] hover:bg-[#0f0f0f]'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Buy Now
                  </button>
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
          onLogin={handleLoginSuccess}
        />
      )}

      {/* Requirements Notice (water & power) */}
      <div className="max-w-6xl mx-auto px-4">
        <p className={`${isLuxury ? 'text-[#d4af37] italic font-semibold text-center' : 'text-red-600 text-center font-semibold'}`}>
          Note: For every wash, please ensure 2 buckets of water and a power supply are available at the service location.
        </p>
      </div>

      {/* Service Availability Information */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className={`${isLuxury ? 'bg-black/60 border border-[#d4af37]/30' : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'} rounded-xl p-8`}>
          <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold mb-2 ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-800'}`}>Service Availability</h3>
            {!isLuxury && <div className="w-20 h-1 bg-green-500 mx-auto rounded"></div>}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Service */}
            <div className={`${isLuxury ? 'bg-black/50 border border-[#d4af37]/20' : 'bg-white border border-green-100'} rounded-lg p-6 shadow-sm`}>
              <div className="flex items-center mb-4">
                <div className={`${isLuxury ? 'w-8 h-8 bg-black border border-[#d4af37]/40' : 'w-8 h-8 bg-green-500'} rounded-full flex items-center justify-center mr-3`}>
                  <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-white'} font-bold text-lg`}>✓</span>
                </div>
                <h4 className={`text-xl font-bold ${isLuxury ? 'text-[#d4af37]' : 'text-green-700'}`}>Free Service</h4>
              </div>
              <p className={`${isLuxury ? 'text-white/80' : 'text-gray-600'} text-lg`}>
                Free within <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-green-600'} font-semibold`}>5 km radius</span>
              </p>
            </div>

            {/* Extra Charges */}
            <div className={`${isLuxury ? 'bg-black/50 border border-[#d4af37]/20' : 'bg-white border border-orange-100'} rounded-lg p-6 shadow-sm`}>
              <div className="flex items-center mb-4">
                <div className={`${isLuxury ? 'w-8 h-8 bg-black border border-[#d4af37]/40' : 'w-8 h-8 bg-orange-500'} rounded-full flex items-center justify-center mr-3`}>
                  <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-white'} font-bold text-lg`}>₹</span>
                </div>
                <h4 className={`text-xl font-bold ${isLuxury ? 'text-[#d4af37]' : 'text-orange-700'}`}>Extra Charges</h4>
              </div>
              <div className={`${isLuxury ? 'text-white/80' : 'text-gray-600'} space-y-2`}>
                <div className="flex justify-between">
                  <span>5–10 km</span>
                  <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-orange-600'} font-semibold`}>₹50</span>
                </div>
                <div className="flex justify-between">
                  <span>10–15 km</span>
                  <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-orange-600'} font-semibold`}>₹100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Full Body Bike Checkup Section */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-amber-50 py-16 px-4 md:px-10 mt-16 rounded-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-serif bg-gradient-to-r from-amber-600 to-blue-600 bg-clip-text text-transparent mb-4">BFS Full Body Bike Checkup</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">Quick visual checkpoint list we cover while performing premium bike wash packages.</p>
          </div>
          <FullBodyCheckup type="bike" />
          <div className="mt-10 text-center text-xs text-gray-500">Disclaimer: Visual inspection only. For mechanical tuning please visit a certified workshop.</div>
        </div>
      </section>
    </section>
  );
}
