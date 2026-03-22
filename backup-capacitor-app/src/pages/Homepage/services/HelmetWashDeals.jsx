import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Camera, Upload } from "lucide-react";
import { useCart } from "../../../components/CartContext";
import { useAuth } from "../../../components/AuthContext";
import SigninModal from "../signin/SigninModal";

const helmetWashPackages = {
  commuter: {
    title: "Commuter Helmet Packages",
    subtitle:
      "Tailored for daily commuting helmets: Half-face, Open-face, etc.",
    packages: [
      {
        id: 1,
        name: "Basic Clean",
        image: "/helmet/commuter & midsize/DeWatermark.ai_1755851413119.jpeg",
        price: "₹99",
        description: "Essential Cleaning for Daily Use",
        features: [
          "Exterior foam wash",
          "Visor cleaning",
          "Strap sanitization",
          "Basic interior wipe",
        ],
      },
      {
        id: 2,
        name: "Fresh Shield",
        image: "/helmet/commuter & midsize/halfhelmet.webp",
        price: "₹169",
        description: "Complete Hygiene Package",
        features: [
          "Deep exterior wash",
          "Anti-fog visor treatment",
          "Complete strap cleaning",
          "Interior sanitization",
          "Odor elimination",
        ],
      },
      {
        id: 3,
        name: "Premium Care",
        image: "/helmet/commuter & midsize/BLACK-4-3.webp",
        price: "₹199",
        description: "Professional Deep Clean & Protection",
        features: [
          "Professional exterior detailing",
          "Premium visor coating",
          "Complete strap replacement option",
          "Deep interior sanitization",
          "UV protection treatment",
          "Fresh padding replacement",
        ],
      },
    ],
  },
  midsize: {
    title: "Mid-size Helmet Packages",
    subtitle:
      "Enhanced care for sport and touring helmets: Full-face, Modular, etc.",
    packages: [
      {
        id: 4,
        name: "Sport Clean",
        image: "/helmet/midsize/midsize2.jpg",
        price: "₹199",
        description: "Performance Helmet Care",
        features: [
          "Aerodynamic shell cleaning",
          "Anti-scratch visor care",
          "Ventilation system cleaning",
          "Sport padding care",
        ],
      },
      {
        id: 5,
        name: "Race Ready",
        image: "/helmet/midsize/midsize1.jpg",
        price: "₹249",
        description: "Competition Grade Cleaning",
        features: [
          "Professional shell polishing",
          "Racing visor treatment",
          "Complete ventilation overhaul",
          "Performance padding refresh",
          "Weight optimization check",
        ],
      },
      {
        id: 6,
        name: "Champion Shield",
        image: "/helmet/midsize/midsize.webp",
        price: "₹299",
        description: "Ultimate Racing Protection",
        features: [
          "Race-grade shell treatment",
          "Pro-level visor coating",
          "Complete system overhaul",
          "Premium padding upgrade",
          "Performance optimization",
          "Safety certification check",
        ],
      },
    ],
  },
  "sports-touring": {
    title: "Sports Helmet Packages",
    subtitle:
      "Luxury care for high-end and premium helmets: Carbon fiber, Designer, etc.",
    packages: [
      {
        id: 7,
        name: "Luxury Clean",
        image: "/helmet/sports/126078715.cms",
        price: "₹299",
        description: "Premium Helmet Maintenance",
        features: [
          "Luxury shell detailing",
          "Premium visor care",
          "Designer element protection",
          "High-end padding care",
        ],
      },
      {
        id: 8,
        name: "Elite Care",
        image: "/helmet/sports/aiease_1755850623823.jpg",
        price: "₹399",
        description: "Exclusive Premium Service",
        features: [
          "Hand-detailed cleaning",
          "Luxury visor treatment",
          "Premium material protection",
          "Elite padding refresh",
          "Exclusive coating application",
        ],
      },
      {
        id: 9,
        name: "Platinum Service",
        image: "/helmet/sports/sports1.png",
        price: "₹499",
        description: "Ultimate Luxury Experience",
        features: [
          "Concierge-level service",
          "Platinum shell treatment",
          "Diamond-grade visor care",
          "Luxury padding replacement",
          "Premium protection suite",
          "VIP service guarantee",
        ],
      },
    ],
  },
  premium: {
    title: "Premium Helmet Packages",
    subtitle:
      "Exclusive service for luxury and high-end helmets. Send us a photo for personalized care.",
    packages: [
      {
        id: 10,
        name: "Custom Premium Care",
        image: "/helmet/helmethome.png",
        price: "Contact Us",
        description: "Personalized Service for Your Premium Helmet",
        features: [
          "Send helmet photo for assessment",
          "Customized cleaning plan",
          "White-glove service",
          "Premium materials only",
          "Expert consultation included",
          "Contact us for pricing",
        ],
        isPremium: true,
      },
    ],
  },
};

// Add-on services for promotional offerings
const helmetAddons = [
  {
    id: "visor-coating",
    name: "Anti-Fog Visor Coating",
    price: 50,
    description: "Professional anti-fog treatment for clear vision",
  },
  {
    id: "sanitizer-spray",
    name: "Deep Sanitizer Treatment",
    price: 75,
    description: "Hospital-grade sanitization for maximum hygiene",
  },
  {
    id: "padding-refresh",
    name: "Padding Refresh Service",
    price: 99,
    description: "Complete interior padding cleaning and deodorizing",
  },
  {
    id: "uv-protection",
    name: "UV Protection Shield",
    price: 125,
    description: "Premium UV protection coating for helmet exterior",
  },
  {
    id: "express-service",
    name: "Express 2-Hour Service",
    price: 149,
    description: "Priority service with 2-hour completion guarantee",
  },
  {
    id: "premium-wax",
    name: "Premium Wax Finish",
    price: 199,
    description: "High-end wax treatment for long-lasting shine and protection",
  },
];

// Promotional banners
const adBanners = [
  {
    title: "🪖 HELMET CARE SPECIALISTS",
    subtitle: "Professional helmet cleaning & maintenance services",
    bgColor: "from-orange-400 to-red-500",
  },
  {
    title: "✨ HYGIENE GUARANTEE",
    subtitle: "Hospital-grade sanitization for your safety",
    bgColor: "from-blue-400 to-purple-500",
  },
  {
    title: "🚀 EXPRESS SERVICE",
    subtitle: "Quick turnaround without compromising quality",
    bgColor: "from-green-400 to-teal-500",
  },
];

export default function HelmetWashDeals() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // State management
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalCurrentSlide, setModalCurrentSlide] = useState(0);
  const [adSlide, setAdSlide] = useState(0);

  // Premium helmet photo upload state
  const [helmetPhoto, setHelmetPhoto] = useState(null);
  const [helmetPhotoPreview, setHelmetPhotoPreview] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const fileInputRef = useRef(null);

  // Touch/swipe handling
  const startX = useRef(0);
  const isDragging = useRef(false);

  const dealData = helmetWashPackages[category] || helmetWashPackages.commuter;

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-rotate ad banners
  useEffect(() => {
    const timer = setInterval(() => {
      setAdSlide((prev) => (prev + 1) % adBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Touch/swipe handlers for mobile carousel
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    startX.current = e.touches[0].pageX;
    isDragging.current = true;
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
    setSelectedAddons((prev) => {
      const isSelected = prev.find((item) => item.id === addon.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const calculateTotal = () => {
    const packagePrice = selectedPackage?.price
      ? parseInt(selectedPackage.price.replace("₹", ""))
      : 79;
    const addonsTotal = selectedAddons.reduce(
      (total, addon) => total + addon.price,
      0
    );
    return packagePrice + addonsTotal;
  };

  const getAddonsTotal = () => {
    return selectedAddons.reduce((total, addon) => total + addon.price, 0);
  };

  const getCategoryDisplayName = () => {
    switch (category) {
      case "commuter":
        return "Commuter Helmet Wash";
      case "midsize":
        return "Sport Helmet Wash";
      case "sports-touring":
        return "Premium Helmet Wash";
      default:
        return "Commuter Helmet Wash";
    }
  };

  const handleBookNow = (pkg) => {
    // Check if this is a premium package that requires photo
    if (pkg.isPremium) {
      setSelectedPackage(pkg);
      setShowPremiumModal(true);
      setHelmetPhoto(null);
      setHelmetPhotoPreview(null);
    } else {
      setSelectedPackage(pkg);
      setSelectedAddons([]);
      setModalCurrentSlide(0);
      setShowBookingModal(true);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHelmetPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHelmetPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePremiumContact = () => {
    if (!helmetPhoto) {
      alert("Please upload a photo of your helmet first");
      return;
    }

    // Create WhatsApp message
    const message = encodeURIComponent(
      `Hello! I'm interested in the Premium Helmet Care service. I have uploaded a photo of my helmet and would like to get a personalized quote.`
    );

    // Open WhatsApp with the message
    window.open(`https://wa.me/919591572775?text=${message}`, "_blank");

    // Show success message
    alert(
      "Please send the helmet photo through WhatsApp. Our team will contact you shortly with a personalized quote."
    );
    setShowPremiumModal(false);
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const cartItem = {
      id: `helmetwash-${category}-${selectedPackage.id}-${Date.now()}`,
      name: selectedPackage.name,
      serviceName: "washing", // Hardcoded serviceName
      packageName: selectedPackage.name,
      image: selectedPackage.image,
      price: calculateTotal(),
      category: "Helmet Wash",
      type: "helmet-wash",
      includedFeatures: selectedPackage.features,
      packageDetails: {
        basePrice: parseInt(selectedPackage.price.replace("₹", "")),
        addons: selectedAddons,
        addonsTotal: getAddonsTotal(),
        features: selectedPackage.features,
      },
    };

    addToCart(cartItem);
    setShowBookingModal(false);
    navigate("/cart");
  };

  const handleLoginSuccess = (userData) => {
    setShowLoginModal(false);
    setTimeout(() => handleAddToCart(), 100);
  };

  // Handle category not found
  if (!helmetWashPackages[category]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Category not found
          </h1>
          <button
            onClick={() => navigate("/services")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
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
              {adBanners.map((ad, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-full bg-gradient-to-r ${ad.bgColor} text-white p-8 md:p-12 text-center`}
                >
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">
                    {ad.title}
                  </h2>
                  <p className="text-lg md:text-xl opacity-90">{ad.subtitle}</p>
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
                      ? "bg-white shadow-lg"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  onClick={() => setAdSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            HELMET WASH COMBOS
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {dealData.title}
          </h1>

          {dealData.subtitle && (
            <p className="text-lg text-gray-600 mb-6">{dealData.subtitle}</p>
          )}
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {dealData.packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full"
            >
              <div className="p-6 h-full flex flex-col">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-48 object-contain mb-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-48 object-contain mb-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 items-center justify-center text-6xl"
                  style={{ display: "none" }}
                >
                  🪖
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {pkg.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start text-sm text-gray-700"
                      >
                        <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-orange-600">
                      {pkg.price}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookNow(pkg)}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-colors duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel Layout */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {dealData.packages.map((pkg) => (
                <div key={pkg.id} className="min-w-full px-4">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg mx-2">
                    <div className="p-6">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-48 object-contain mb-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="w-full h-48 object-contain mb-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 items-center justify-center text-6xl"
                        style={{ display: "none" }}
                      >
                        🪖
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {pkg.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {pkg.description}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {pkg.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start text-sm text-gray-700"
                          >
                            <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">
                              ✓
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-3">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-orange-600">
                            {pkg.price}
                          </span>
                        </div>

                        <button
                          onClick={() => handleBookNow(pkg)}
                          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-colors duration-200"
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

          {/* Mobile Slide Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {dealData.packages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-orange-500 shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Complete Your Booking
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Selected Package */}
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedPackage.image}
                    alt={selectedPackage.name}
                    className="w-16 h-16 object-contain bg-white rounded-lg p-2"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-16 h-16 object-contain bg-white rounded-lg p-2 items-center justify-center text-2xl"
                    style={{ display: "none" }}
                  >
                    🪖
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedPackage.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {getCategoryDisplayName()}
                    </p>
                    <p className="text-orange-600 font-semibold">
                      {selectedPackage.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add-ons Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Enhance Your Service
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {helmetAddons.map((addon) => (
                    <div
                      key={addon.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedAddons.find((item) => item.id === addon.id)
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleAddonToggle(addon)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {addon.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {addon.description}
                          </p>
                          <p className="text-orange-600 font-semibold">
                            +₹{addon.price}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ml-3 ${
                            selectedAddons.find((item) => item.id === addon.id)
                              ? "border-orange-500 bg-orange-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedAddons.find(
                            (item) => item.id === addon.id
                          ) && <span className="text-white text-xs">✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {selectedPackage.name}
                    </span>
                    <span className="font-medium">{selectedPackage.price}</span>
                  </div>
                  {selectedAddons.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">{addon.name}</span>
                      <span>+₹{addon.price}</span>
                    </div>
                  ))}
                  {selectedAddons.length > 0 && (
                    <div className="border-t pt-2 flex justify-between text-sm">
                      <span className="text-gray-600">Add-ons Total</span>
                      <span>₹{getAddonsTotal()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-colors duration-200"
                >
                  Add to Cart - ₹{calculateTotal()}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <SigninModal
          open={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLoginSuccess}
        />
      )}

      {/* Premium Helmet Modal */}
      {showPremiumModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Premium Helmet Care
                </h2>
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  📸 How It Works
                </h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Upload a clear photo of your helmet</li>
                  <li>Click "Contact Us" to reach our team via WhatsApp</li>
                  <li>Send the photo through WhatsApp</li>
                  <li>We'll provide a personalized quote and service plan</li>
                </ol>
              </div>

              {/* Photo Upload Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Upload Helmet Photo
                </h3>

                {!helmetPhotoPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <Camera className="w-16 h-16 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Take a photo or upload from your device
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2"
                      >
                        <Upload className="w-5 h-5" />
                        Upload Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={helmetPhotoPreview}
                      alt="Helmet preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setHelmetPhoto(null);
                        setHelmetPhotoPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Change Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Package Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Service Details
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">
                    {selectedPackage.name}
                  </p>
                  <p className="text-gray-600">{selectedPackage.description}</p>
                  <ul className="space-y-1 mt-3">
                    {selectedPackage.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start text-sm text-gray-700"
                      >
                        <span className="text-green-500 mr-2 mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePremiumContact}
                  disabled={!helmetPhoto}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515" />
                  </svg>
                  Contact Us on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requirements Notice (water & power) */}
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-red-600 text-center font-semibold">
          Note: For every wash, please ensure 2 buckets of water and a power
          supply are available at the service location.
        </p>
      </div>

      {/* Service Availability Information */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Service Availability
            </h3>
            <div className="w-20 h-1 bg-green-500 mx-auto rounded"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Service */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
                <h4 className="text-xl font-bold text-green-700">
                  Free Service
                </h4>
              </div>
              <p className="text-gray-600 text-lg">
                Free within{" "}
                <span className="font-semibold text-green-600">
                  5 km radius
                </span>
              </p>
            </div>

            {/* Extra Charges */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">₹</span>
                </div>
                <h4 className="text-xl font-bold text-orange-700">
                  Extra Charges
                </h4>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>5–10 km</span>
                  <span className="font-semibold text-orange-600">₹50</span>
                </div>
                <div className="flex justify-between">
                  <span>10–15 km</span>
                  <span className="font-semibold text-orange-600">₹100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
