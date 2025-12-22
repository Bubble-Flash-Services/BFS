import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Car,
  Wrench,
  Shield,
  Clock,
  Camera,
  MapPin,
  Upload,
  Sparkles,
  Tag,
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";

const API = import.meta.env.VITE_API_URL || window.location.origin;

// Constants
const AUTOFIX_SERVICE_NAME = "autofix"; // Service name for cart compatibility

const AutoFixPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // State management
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [polishingType, setPolishingType] = useState(null);
  const [damagePhotos, setDamagePhotos] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [pricing, setPricing] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [carCategories, setCarCategories] = useState([]);

  // Service types
  const services = [
    {
      id: "minor-dent-repair",
      title: "Minor Dent Repair",
      subtitle: "Paintless Dent Removal",
      description: "Professional dent repair without painting",
      icon: Wrench,
      gradient: "from-blue-500 to-cyan-500",
      startingPrice: "₹999+",
    },
    {
      id: "scratch-repair",
      title: "Scratch Repair & Painting",
      subtitle: "Partial Panel / Touch-Up",
      description: "Expert scratch removal and repainting",
      icon: Car,
      gradient: "from-purple-500 to-pink-500",
      startingPrice: "₹1,799+",
    },
    {
      id: "bumper-repair",
      title: "Bumper Repair & Fibre Restoration",
      subtitle: "Complete Bumper Fix",
      description: "Bumper repair and fiber restoration",
      icon: Shield,
      gradient: "from-orange-500 to-red-500",
      startingPrice: "₹2,499+",
    },
    {
      id: "rubbing-polishing",
      title: "Rubbing & Polishing",
      subtitle: "Gloss & Shine Restoration",
      description: "Professional rubbing and polishing",
      icon: Sparkles,
      gradient: "from-green-500 to-emerald-500",
      startingPrice: "₹799+",
    },
  ];

  // Polishing types for rubbing-polishing service
  const polishingTypes = [
    { id: "single-panel", name: "Single Panel", price: 799 },
    { id: "full-rubbing", name: "Full Car Rubbing", price: 1499 },
    { id: "full-polishing", name: "Full Car Polishing", price: 2499 },
  ];

  // Time slots

  // Check if user is first time
  useEffect(() => {
    if (user) {
      checkFirstTimeUser();
    }
  }, [user]);

  // Fetch car categories
  useEffect(() => {
    fetchCarCategories();
  }, []);

  const fetchCarCategories = async () => {
    try {
      const response = await fetch(`${API}/api/autofix/car-categories`);
      const result = await response.json();
      if (result.success) {
        setCarCategories(result.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const checkFirstTimeUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/autofix/check-first-time`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setIsFirstTime(result.data.isFirstTime);
      }
    } catch (error) {
      console.error("Error checking first time user:", error);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (selectedService.id === "rubbing-polishing") {
      setCurrentStep(3.5); // Show polishing type selection
    } else {
      fetchPricing(selectedService.id, category);
      setCurrentStep(3);
    }
  };

  const handlePolishingTypeSelect = (type) => {
    setPolishingType(type);
    fetchPricingForPolishing(type);
    setCurrentStep(3);
  };

  const fetchPricing = async (serviceType, category) => {
    try {
      const response = await fetch(
        `${API}/api/autofix/pricing?serviceType=${serviceType}&carCategory=${category}`
      );
      const result = await response.json();
      if (result.success) {
        setPricing(result.data);
      }
    } catch (error) {
      console.error("Error fetching pricing:", error);
    }
  };

  const fetchPricingForPolishing = async (type) => {
    try {
      const response = await fetch(
        `${API}/api/autofix/pricing?serviceType=rubbing-polishing&polishingType=${type.id}`
      );
      const result = await response.json();
      if (result.success) {
        setPricing(result.data);
      }
    } catch (error) {
      console.error("Error fetching pricing:", error);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (damagePhotos.length + files.length > 4) {
      toast.error("Maximum 4 photos allowed");
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setDamagePhotos([...damagePhotos, ...newPhotos]);
  };

  const removePhoto = (index) => {
    const photoToRemove = damagePhotos[index];
    // Revoke the object URL to prevent memory leaks
    if (photoToRemove.preview) {
      URL.revokeObjectURL(photoToRemove.preview);
    }
    const newPhotos = damagePhotos.filter((_, i) => i !== index);
    setDamagePhotos(newPhotos);
  };

  // Cleanup effect to revoke all object URLs when component unmounts
  useEffect(() => {
    return () => {
      damagePhotos.forEach((photo) => {
        if (photo.preview) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, [damagePhotos]);

  const handleContinueToUpload = () => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    setCurrentStep(4);
  };

  const handleContinueToAddToCart = () => {
    if (damagePhotos.length < 2) {
      toast.error("Please upload at least 2 photos of the damage");
      return;
    }
    handleAddToCart();
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!selectedService || !pricing) {
      toast.error("Service information is missing");
      return;
    }

    // Check if this is user's first booking (15% discount for first-time users)
    // User is considered first-time if totalOrders is 0, undefined, or null
    const isFirstTimeBooking = !user?.totalOrders || user.totalOrders === 0;
    const firstTimeDiscount = isFirstTimeBooking ? 0.15 : 0;
    const basePrice = pricing.basePrice;
    const discountAmount = Math.round(basePrice * firstTimeDiscount);
    const finalPrice = basePrice - discountAmount;

    // Convert damage photos to base64 or URLs for storage
    const photoData = damagePhotos.map((photo, index) => ({
      preview: photo.preview,
      name: `damage-photo-${index + 1}`,
    }));

    // Generate a unique identifier for the cart item
    const categoryIdentifier = selectedCategory || polishingType?.id || 'general';

    // Create cart item in the format expected by CartContext
    const cartItem = {
      id: `autofix-${selectedService.id}-${categoryIdentifier}-${Date.now()}`,
      type: "autofix",
      category: "AutoFix Pro",
      name: selectedService.title,
      serviceName: AUTOFIX_SERVICE_NAME,
      description: selectedService.description,
      image: "/car/car1.png", // Default AutoFix image
      price: finalPrice,
      basePrice: basePrice,
      originalPrice: basePrice,
      discount: discountAmount,
      isFirstTimeBooking: isFirstTimeBooking,
      quantity: 1,
      features: [selectedService.title],
      metadata: {
        serviceType: selectedService.id,
        carCategory: selectedCategory,
        polishingType: polishingType?.id,
        polishingTypeName: polishingType?.name,
        damagePhotos: photoData,
        specialInstructions: specialInstructions,
        isFirstTime: isFirstTimeBooking,
      },
    };

    addToCart(cartItem);

    let successMessage = `${selectedService.title} added to cart!`;
    if (isFirstTimeBooking) {
      successMessage += ` 🎉 15% First-Time Discount Applied!`;
    }

    toast.success(successMessage, {
      icon: "🚗",
      duration: 3000,
    });

    // Navigate to cart
    setTimeout(() => navigate("/cart"), 500);
  };

  const calculateFinalPrice = () => {
    if (!pricing) return 0;
    const basePrice = pricing.basePrice;
    if (isFirstTime) {
      const discount = Math.round((basePrice * 15) / 100);
      return basePrice - discount;
    }
    return basePrice;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white/20 p-4 rounded-full backdrop-blur-sm"
              >
                <Car className="w-16 h-16" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Doorstep Car Denting, Painting & Polishing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Professional car repair at your location using BFS mobile service
              van
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <MapPin className="w-5 h-5" />
                <span>Doorstep service only</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Camera className="w-5 h-5" />
                <span>Photo-based pricing</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Clock className="w-5 h-5" />
                <span>Quick doorstep service</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Tag className="w-5 h-5" />
                <span>🎉 15% OFF on first order</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() =>
                  document.getElementById("services")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Upload Damage Photos
              </button>
              <button
                onClick={() =>
                  document.getElementById("services")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Book Doorstep Service
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Select Service
              </h2>
              <p className="text-gray-600 text-lg">
                Choose the service you need
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-orange-500 transition-all"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div
                      className={`bg-gradient-to-br ${service.gradient} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {service.subtitle}
                    </p>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {service.startingPrice}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <button
                onClick={() => setCurrentStep(1)}
                className="mb-6 text-orange-600 hover:underline flex items-center mx-auto"
              >
                ← Back to Services
              </button>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Select Car Category
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Pricing depends on car category
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
                {carCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-orange-500 transition-all"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <Car className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {category.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 3.5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <button
                onClick={() => setCurrentStep(2)}
                className="mb-6 text-orange-600 hover:underline flex items-center mx-auto"
              >
                ← Back to Categories
              </button>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Select Polishing Type
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Choose the type of polishing service
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {polishingTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-orange-500 transition-all"
                    onClick={() => handlePolishingTypeSelect(type)}
                  >
                    <Sparkles className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">{type.name}</h3>
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{type.price}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && pricing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <button
                onClick={() => setCurrentStep(selectedService.id === "rubbing-polishing" ? 3.5 : 2)}
                className="mb-6 text-orange-600 hover:underline flex items-center"
              >
                ← Back
              </button>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  Service Details & Pricing
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold">
                      {selectedService.title}
                    </span>
                  </div>
                  {selectedCategory && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Car Category:</span>
                      <span className="font-semibold capitalize">
                        {selectedCategory}
                      </span>
                    </div>
                  )}
                  {polishingType && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Polishing Type:</span>
                      <span className="font-semibold">
                        {polishingType.name}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="text-xl font-bold">
                        ₹{pricing.basePrice}
                      </span>
                    </div>
                    {isFirstTime && (
                      <>
                        <div className="flex justify-between items-center text-green-600">
                          <span>First Order Discount (15%):</span>
                          <span className="font-semibold">
                            -₹{Math.round((pricing.basePrice * 15) / 100)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-bold text-orange-600 mt-4 pt-4 border-t">
                          <span>Final Price:</span>
                          <span>₹{calculateFinalPrice()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-500 text-center mb-6">
                  ✓ No hidden charges
                </p>

                <button
                  onClick={handleContinueToUpload}
                  className="w-full bg-orange-600 text-white py-4 rounded-full font-semibold text-lg hover:bg-orange-700 transition-all"
                >
                  Upload Damage Photos
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <button
                onClick={() => setCurrentStep(3)}
                className="mb-6 text-orange-600 hover:underline flex items-center"
              >
                ← Back
              </button>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">
                  Upload Damage Photos
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Upload 2-4 clear photos of the damage (JPG/PNG)
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {damagePhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo.preview}
                        alt={`Damage ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {damagePhotos.length < 4 && (
                    <label className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-all">
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-gray-500">Upload Photo</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
                  )}
                </div>

                <div className="bg-orange-50 p-6 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Estimated Price:</span>
                    <span className="text-3xl font-bold text-orange-600">
                      ₹{calculateFinalPrice()}
                    </span>
                  </div>
                  {isFirstTime && (
                    <p className="text-sm text-green-600 text-center">
                      🎉 15% first order discount applied!
                    </p>
                  )}
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Add to cart and provide location details during checkout
                  </p>
                </div>

                <button
                  onClick={handleContinueToAddToCart}
                  disabled={damagePhotos.length < 2}
                  className="w-full bg-orange-600 text-white py-4 rounded-full font-semibold text-lg hover:bg-orange-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add to Cart & Checkout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* NOT OFFERED Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Services NOT Offered
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span className="text-gray-700">Full body repaint</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span className="text-gray-700">Major accident repair</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span className="text-gray-700">
                  Structural/chassis work
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">✗</span>
                <span className="text-gray-700">
                  Car pickup & garage repair
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AutoFixPage;
