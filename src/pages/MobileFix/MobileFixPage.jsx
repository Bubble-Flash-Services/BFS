import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Select } from "antd";
import {
  Smartphone,
  Wrench,
  Shield,
  Clock,
  MapPin,
  Sparkles,
  Tag,
  Battery,
  Zap,
  Camera,
  Speaker,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";
import "antd/dist/reset.css";
import "./MobileFixPage.css";

const API = import.meta.env.VITE_API_URL || window.location.origin;

const MOBILEFIX_SERVICE_NAME = "mobilefix";

const MobileFixPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [allPricing, setAllPricing] = useState([]);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const services = [
    {
      id: "screen-replacement",
      title: "Screen / Display Replacement",
      description: "Professional screen replacement service",
      icon: Smartphone,
      gradient: "from-blue-500 to-cyan-500",
      timeRange: "30–45 minutes",
    },
    {
      id: "battery-replacement",
      title: "Battery Replacement",
      description: "Replace old or damaged battery",
      icon: Battery,
      gradient: "from-green-500 to-emerald-500",
      timeRange: "20–30 minutes",
    },
    {
      id: "charging-port-replacement",
      title: "Charging Port Replacement",
      description: "Fix charging port issues",
      icon: Zap,
      gradient: "from-yellow-500 to-orange-500",
      timeRange: "20–30 minutes",
    },
    {
      id: "speaker-microphone-replacement",
      title: "Speaker / Microphone Replacement",
      description: "Audio component replacement",
      icon: Speaker,
      gradient: "from-purple-500 to-pink-500",
      timeRange: "20–30 minutes",
    },
    {
      id: "camera-glass-replacement",
      title: "Camera Glass Replacement",
      description: "Replace damaged camera glass",
      icon: Camera,
      gradient: "from-red-500 to-rose-500",
      timeRange: "15–25 minutes",
    },
    {
      id: "phone-cleaning-diagnostics",
      title: "Phone Cleaning & Diagnostics",
      description: "Complete phone checkup and cleaning",
      icon: Sparkles,
      gradient: "from-indigo-500 to-blue-500",
      timeRange: "30–40 minutes",
    },
  ];

  const unsupportedServices = [
    "Motherboard repair",
    "Water damage repair",
    "Pickup & drop service",
    "iCloud / Google lock bypass",
    "Data recovery",
  ];

  useEffect(() => {
    fetchBrands();
    if (user) {
      checkFirstTimeUser();
    }
  }, [user]);

  useEffect(() => {
    if (selectedBrand) {
      fetchModels(selectedBrand._id);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedModel) {
      fetchAllPricingForModel(selectedModel._id);
    }
  }, [selectedModel]);

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API}/api/mobilefix/brands`);
      const result = await response.json();
      if (result.success) {
        setBrands(result.data.brands);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchModels = async (brandId) => {
    try {
      const response = await fetch(
        `${API}/api/mobilefix/brands/${brandId}/models`
      );
      const result = await response.json();
      if (result.success) {
        setModels(result.data.models);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const fetchAllPricingForModel = async (modelId) => {
    try {
      const response = await fetch(
        `${API}/api/mobilefix/pricing/model/${modelId}`
      );
      const result = await response.json();
      if (result.success) {
        setAllPricing(result.data.pricingList);
      }
    } catch (error) {
      console.error("Error fetching pricing:", error);
    }
  };

  const checkFirstTimeUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/mobilefix/check-first-time`, {
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

  const handleBrandSelect = (brandId) => {
    const brand = brands.find((b) => b._id === brandId);
    if (!brand) {
      toast.error("Invalid brand selection");
      return;
    }
    setSelectedBrand(brand);
    setSelectedModel(null);
    setModels([]);
    setSelectedService(null);
    setPricing(null);
    setAllPricing([]);
    setCurrentStep(2);
  };

  const handleModelSelect = (modelId) => {
    const model = models.find((m) => m._id === modelId);
    if (!model) {
      toast.error("Invalid model selection");
      return;
    }
    setSelectedModel(model);
    setSelectedService(null);
    setPricing(null);
    setCurrentStep(3);
  };

  const handleServiceSelect = async (service) => {
    if (!selectedModel) {
      toast.error("Please select a phone model first");
      return;
    }

    const servicePricing = allPricing.find((p) => p.serviceType === service.id);
    if (!servicePricing) {
      toast.error("Pricing not available for this service");
      return;
    }

    setSelectedService(service);
    setPricing({
      price: servicePricing.price,
      estimatedTime: servicePricing.estimatedTime,
      serviceType: service.id,
    });
    setCurrentStep(4);
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!selectedBrand || !selectedModel || !selectedService || !pricing) {
      toast.error("Service information is missing");
      return;
    }

    const isFirstTimeBooking = isFirstTime;
    const firstTimeDiscount = isFirstTimeBooking ? 0.15 : 0;
    const basePrice = pricing.price;
    const discountAmount = Math.round(basePrice * firstTimeDiscount);
    const finalPrice = basePrice - discountAmount;

    const cartItem = {
      id: `mobilefix-${selectedService.id}-${selectedModel._id}-${Date.now()}`,
      type: "mobilefix",
      category: "MobileFix Pro",
      name: `${selectedService.title} - ${selectedBrand.name} ${selectedModel.name}`,
      serviceName: MOBILEFIX_SERVICE_NAME,
      description: selectedService.description,
      image: "/phone-repair.png",
      price: finalPrice,
      basePrice: basePrice,
      originalPrice: basePrice,
      discount: discountAmount,
      isFirstTimeBooking: isFirstTimeBooking,
      quantity: 1,
      features: [
        selectedService.title,
        `${selectedBrand.name} ${selectedModel.name}`,
      ],
      metadata: {
        brandId: selectedBrand._id,
        brandName: selectedBrand.name,
        modelId: selectedModel._id,
        modelName: selectedModel.name,
        serviceType: selectedService.id,
        estimatedTime: pricing.estimatedTime,
        specialInstructions: specialInstructions,
      },
    };

    addToCart(cartItem);

    let successMessage = `${selectedService.title} added to cart!`;
    if (isFirstTimeBooking) {
      successMessage += ` 🎉 15% First-Time Discount Applied!`;
    }

    toast.success(successMessage, {
      icon: "📱",
      duration: 3000,
    });

    setTimeout(() => navigate("/cart"), 500);
  };

  const calculateFinalPrice = () => {
    if (!pricing) return 0;
    const basePrice = pricing.price;
    if (isFirstTime) {
      const discount = Math.round((basePrice * 15) / 100);
      return basePrice - discount;
    }
    return basePrice;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden">
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
                <Smartphone className="w-16 h-16" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              BFS Doorstep Mobile Repair
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Phone Repair at Your Home. No Shop. No Pickup.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <MapPin className="w-5 h-5" />
                <span>Doorstep-only service</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <DollarSign className="w-5 h-5" />
                <span>Model-based transparent pricing</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Clock className="w-5 h-5" />
                <span>Quick repair service</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Tag className="w-5 h-5" />
                <span>🎉 15% OFF on first order</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() =>
                  document.getElementById("select-phone")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Select Phone Model
              </button>
              <button
                onClick={() =>
                  document.getElementById("select-phone")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Book Doorstep Repair
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🔍 How Pricing Works
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Model-Based Pricing</h3>
                  <p className="text-gray-600 text-sm">
                    Pricing depends on phone brand, model, and repair service
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Transparent Pricing</h3>
                  <p className="text-gray-600 text-sm">
                    View final price instantly after selecting model
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">No Hidden Charges</h3>
                  <p className="text-gray-600 text-sm">
                    Pay only the displayed price after service completion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="select-phone" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                📲 STEP 1 — Select Phone Brand
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Choose your phone brand to continue
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
                {brands.map((brand) => (
                  <motion.div
                    key={brand._id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                    onClick={() => handleBrandSelect(brand)}
                  >
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{brand.name}</h3>
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
                className="mb-6 text-blue-600 hover:underline flex items-center mx-auto"
              >
                ← Back to Brands
              </button>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                📱 STEP 2 — Select {selectedBrand?.name} Model
              </h2>

              <p className="text-gray-600 text-lg mb-8">
                Choose your exact phone model
              </p>

              {models.length === 0 ? (
                <p className="text-gray-500">Loading models...</p>
              ) : (
                <div className="max-w-xl mx-auto text-left">
                  <label className="block text-gray-700 font-semibold mb-3 text-lg">
                    Select Your Phone Model
                  </label>

                  <Select
                    showSearch
                    size="large"
                    placeholder="Search and select your phone model"
                    optionFilterProp="label"
                    onChange={handleModelSelect}
                    value={selectedModel?._id}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    className="w-full"
                    options={models.map((model) => ({
                      value: model._id,
                      label: model.name,
                    }))}
                  />

                  <p className="text-sm text-gray-500 mt-3">
                    💡 Tip: You can type to search for your model
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <button
                onClick={() => setCurrentStep(2)}
                className="mb-6 text-blue-600 hover:underline flex items-center mx-auto"
              >
                ← Back to Models
              </button>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🔧 STEP 3 — Select Repair Service
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                Selected:{" "}
                <span className="font-bold">
                  {selectedBrand?.name} {selectedModel?.name}
                </span>
              </p>
              <p className="text-gray-600 text-lg mb-8">
                All services are doorstep-only
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {services.map((service) => {
                  const servicePricing = allPricing.find(
                    (p) => p.serviceType === service.id
                  );
                  const isPriceAvailable = !!servicePricing;

                  return (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: isPriceAvailable ? 1.05 : 1 }}
                      className={`bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent transition-all ${
                        isPriceAvailable
                          ? "cursor-pointer hover:border-blue-500"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        isPriceAvailable && handleServiceSelect(service)
                      }
                    >
                      <div
                        className={`bg-gradient-to-br ${service.gradient} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {service.description}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Time: {service.timeRange}
                      </p>
                      {isPriceAvailable ? (
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{servicePricing.price}
                        </p>
                      ) : (
                        <p className="text-sm text-red-500">
                          Price not available
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-16 bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-red-600 flex items-center justify-center gap-2">
                  <XCircle className="w-8 h-8" />
                  🚫 WHAT WE DO NOT OFFER
                </h3>
                <ul className="space-y-2 text-left max-w-md mx-auto">
                  {unsupportedServices.map((service, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-gray-600 text-sm">
                  These services require specialized equipment and cannot be
                  performed at doorstep
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <button
                onClick={() => setCurrentStep(3)}
                className="mb-6 text-blue-600 hover:underline flex items-center"
              >
                ← Back to Services
              </button>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-6">Booking Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-bold">
                      {selectedBrand?.name} {selectedModel?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Service</span>
                    <span className="font-bold">{selectedService?.title}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Estimated Time</span>
                    <span className="font-bold">{pricing?.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-bold">₹{pricing?.price}</span>
                  </div>
                  {isFirstTime && (
                    <div className="flex justify-between items-center pb-3 border-b text-green-600">
                      <span>First Order Discount (15%)</span>
                      <span className="font-bold">
                        -₹{Math.round(pricing?.price * 0.15)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-2xl font-bold text-blue-600">
                    <span>Final Price</span>
                    <span>₹{calculateFinalPrice()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any specific instructions for the technician..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            🚐 How BFS MobileFix Pro Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { step: "1", title: "Select Brand & Model", icon: Smartphone },
              { step: "2", title: "Choose Repair Service", icon: Wrench },
              { step: "3", title: "View Final Price", icon: DollarSign },
              { step: "4", title: "Confirm Booking", icon: CheckCircle },
              { step: "5", title: "Technician Arrives", icon: MapPin },
              { step: "6", title: "Pay After Service", icon: Tag },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-sm">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            💡 Why Choose BFS MobileFix Pro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "100% Doorstep Service",
                description:
                  "Technician comes to your location with all tools and parts",
              },
              {
                icon: DollarSign,
                title: "Model-Based Transparent Pricing",
                description: "Know exact price before booking, no surprises",
              },
              {
                icon: Clock,
                title: "No Pickup, No Waiting",
                description: "Get your phone repaired in front of you",
              },
              {
                icon: Wrench,
                title: "Trained Technicians",
                description: "Experienced professionals with proper tools",
              },
              {
                icon: Shield,
                title: "Quality Spare Parts",
                description: "Genuine quality parts with warranty",
              },
              {
                icon: Tag,
                title: "Pay After Repair",
                description: "Payment only after service completion",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileFixPage;
