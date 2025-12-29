import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Key,
  Lock,
  Shield,
  Clock,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  User,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";
import KeyServiceCard from "../../components/KeyServiceCard";
import EmergencyKeyService from "../../components/EmergencyKeyService";

const API = import.meta.env.VITE_API_URL || window.location.origin;

const KeyServicesPage = () => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  // Form state
  const [serviceType, setServiceType] = useState("");
  const [specificService, setSpecificService] = useState("");
  const [keyType, setKeyType] = useState({ name: "", description: "" });
  const [quantity, setQuantity] = useState(1);
  const [isEmergency, setIsEmergency] = useState(false);
  const [nightService, setNightService] = useState(false);
  const [priceQuote, setPriceQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // Service categories data
  const serviceCategories = {
    "house-apartment": {
      title: "🏠 House & Apartment Door Services",
      services: [
        {
          id: "house-duplicate-key",
          name: "Duplicate Key (Key Available)",
          price: "₹200 - ₹400",
          icon: "🔑",
          description: "Quick key duplication service",
        },
        {
          id: "house-lost-normal",
          name: "Lost Key - Normal Door Locks",
          price: "₹1,200 - ₹1,800",
          icon: "🚪",
          description: "Professional lock opening for normal doors",
        },
        {
          id: "house-lost-security",
          name: "Lost Key - High-Security Locks",
          price: "₹1,800 - ₹2,800",
          icon: "🔐",
          description: "Advanced security lock opening",
        },
        {
          id: "house-apartment-main",
          name: "Apartment Main Doors",
          price: "₹2,000 - ₹3,500",
          icon: "🏢",
          description: "Complex apartment door systems",
        },
      ],
    },
    "cupboard-locker": {
      title: "🗄️ Cupboard, Locker & Almirah Services",
      services: [
        {
          id: "wooden-cupboard",
          name: "Wooden Cupboards",
          price: "₹1,000 - ₹1,500",
          icon: "🗄️",
          description: "Wooden cupboard lock opening",
        },
        {
          id: "steel-almirah",
          name: "Steel Almirahs",
          price: "₹1,500 - ₹2,500",
          icon: "🔒",
          description: "Steel almirah lock services",
        },
        {
          id: "office-drawers",
          name: "Office Drawers & File Lockers",
          price: "₹1,200 - ₹2,000",
          icon: "📁",
          description: "Office furniture lock services",
        },
      ],
    },
    "bike-key": {
      title: "🏍️ Bike Key Services",
      services: [
        {
          id: "bike-duplicate",
          name: "Duplicate Bike Key (Key Available)",
          price: "₹400 - ₹700",
          icon: "🔑",
          description: "Bike key duplication",
        },
        {
          id: "bike-lost-normal",
          name: "Lost Bike Key - Normal Bikes",
          price: "₹800 - ₹1,200",
          icon: "🏍️",
          description: "Standard bike key replacement",
        },
        {
          id: "bike-lost-chip",
          name: "Lost Bike Key - Chip/Transponder",
          price: "₹1,200 - ₹2,000",
          icon: "🔐",
          description: "Advanced transponder bike keys",
        },
      ],
    },
    "car-key": {
      title: "🚗 Car Key & Unlock Services",
      services: [
        {
          id: "car-lost-normal",
          name: "Lost Car Key - Normal Key",
          price: "₹3,000 - ₹5,000",
          icon: "🔑",
          description: "Basic car key replacement",
        },
        {
          id: "car-lost-remote",
          name: "Lost Car Key - Remote Key",
          price: "₹5,000 - ₹8,000",
          icon: "🚗",
          description: "Remote car key programming",
        },
        {
          id: "car-lost-smart",
          name: "Lost Car Key - Smart Key/FOB",
          price: "₹8,000 - ₹15,000+",
          icon: "📱",
          description: "Advanced smart key systems",
        },
        {
          id: "car-unlock-day",
          name: "Car Door Unlock (Day)",
          price: "₹1,200 - ₹2,000",
          icon: "🚗",
          description: "Key locked inside - Day service",
        },
        {
          id: "car-unlock-night",
          name: "Car Door Unlock (Night)",
          price: "₹2,000 - ₹3,000",
          icon: "🌙",
          description: "Key locked inside - Night service",
        },
      ],
    },
    "digital-smart": {
      title: "🔐 Digital & Smart Lock Services",
      services: [
        {
          id: "digital-opening",
          name: "Digital Lock Opening & Reset",
          price: "₹2,500 - ₹5,000",
          icon: "🔢",
          description: "Digital lock services",
        },
        {
          id: "digital-programming",
          name: "Programming & Configuration",
          price: "₹3,000 - ₹6,000",
          icon: "⚙️",
          description: "Smart lock setup and programming",
        },
      ],
    },
  };

  // Accessories/Add-ons for key services
  const accessories = [
    { 
      id: "spare-key",
      name: "Spare Key (Extra Copy)", 
      price: 150,
      icon: "🔑",
      description: "Get an additional key copy for backup",
      category: "house-apartment"
    },
    { 
      id: "lock-cleaning",
      name: "Lock Cleaning & Maintenance", 
      price: 200,
      icon: "🧹",
      description: "Clean and lubricate your locks",
      category: "all"
    },
    { 
      id: "door-stopper",
      name: "Door Stopper Installation", 
      price: 100,
      icon: "🚪",
      description: "Install quality door stopper",
      category: "house-apartment"
    },
    { 
      id: "key-holder",
      name: "Decorative Key Holder", 
      price: 250,
      icon: "🎨",
      description: "Stylish wall-mounted key holder",
      category: "all"
    },
    { 
      id: "smart-lock",
      name: "Smart Lock Consultation", 
      price: 500,
      icon: "📱",
      description: "Expert advice on upgrading to smart locks",
      category: "digital-smart"
    },
  ];

  useEffect(() => {
    if (serviceType && specificService) {
      calculatePriceQuote();
    }
  }, [serviceType, specificService, quantity, nightService]);

  const calculatePriceQuote = () => {
    setLoadingQuote(true);
    try {
      const category = serviceCategories[serviceType];
      const service = category.services.find((s) => s.id === specificService);
      
      if (service) {
        const basePrice = extractBasePrice(service.price);
        const nightSurcharge = nightService ? Math.round(basePrice * 0.3) : 0; // 30% surcharge for night service
        const totalPrice = (basePrice * quantity) + nightSurcharge;
        
        setPriceQuote({
          basePrice: basePrice,
          nightSurcharge: nightSurcharge,
          totalPrice: totalPrice,
          quantity: quantity
        });
      }
    } catch (error) {
      console.error("Error calculating quote:", error);
    } finally {
      setLoadingQuote(false);
    }
  };

  // Extract base price from price range string (e.g., "₹200 - ₹400" -> 200)
  const extractBasePrice = (priceString) => {
    if (typeof priceString === "number") return priceString;
    if (typeof priceString === "string") {
      // Match price format: ₹200, 200, ₹1,200 etc.
      const match = priceString.match(/^₹?(\d+(?:,\d+)*)/);
      if (match) {
        return parseInt(match[1].replace(/,/g, ""));
      }
    }
    return 0;
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to book a service");
      navigate("/login");
      return;
    }
    if (!serviceType || !specificService) {
      toast.error("Please select a service");
      return;
    }

    // Get the selected service details
    const category = serviceCategories[serviceType];
    const service = category.services.find((s) => s.id === specificService);

    if (!service) {
      toast.error("Service not found");
      return;
    }

    // Use priceQuote if available, otherwise extract from price string
    const basePrice = priceQuote?.basePrice || extractBasePrice(service.price);
    const totalPrice = priceQuote?.totalPrice || basePrice;

    // Check if this is user's first booking (15% discount for first-time users)
    // User is considered first-time if totalOrders is 0, undefined, or null
    const isFirstTimeBooking = !user?.totalOrders || user.totalOrders === 0;
    const firstTimeDiscount = isFirstTimeBooking ? 0.15 : 0;
    const discountAmount = Math.round(totalPrice * firstTimeDiscount);
    const finalPrice = totalPrice - discountAmount;

    // Create cart item
    const cartItem = {
      id: `key-${specificService}-${Date.now()}`,
      type: "key-services",
      category: category.title,
      name: service.name,
      serviceName: "key", // Hardcoded serviceName
      image: "/services/keys/key-duplication.jpg", // Use generic key image
      icon: service.icon, // Store emoji icon separately
      price: finalPrice,
      basePrice: basePrice,
      originalPrice: totalPrice,
      discount: discountAmount,
      isFirstTimeBooking: isFirstTimeBooking,
      quantity: quantity,
      isEmergency: isEmergency,
      nightService: nightService,
      features: [service.name],
      serviceCategory: category.title,
      metadata: {
        serviceType: serviceType,
        specificService: specificService,
        serviceId: service.id,
        isEmergency: isEmergency,
        nightService: nightService,
      },
    };

    addToCart(cartItem);

    let successMessage = `${service.name} added to cart!`;
    if (isFirstTimeBooking) {
      successMessage += ` 🎉 15% First-Time Discount Applied!`;
    }

    toast.success(successMessage, {
      icon: "🔑",
      duration: 3000,
    });

    // Navigate to cart
    setTimeout(() => navigate("/cart"), 500);
  };

  const handleServiceSelect = (type, serviceId) => {
    setServiceType(type);
    setSpecificService(serviceId);
    const category = serviceCategories[type];
    const service = category.services.find((s) => s.id === serviceId);
    if (service) {
      setKeyType({ name: service.name, description: "" });
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Key className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              BFS KeyCare Pro
            </h1>
          </div>

          {/* Highlighted Service in 10 mins Badge */}
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full shadow-lg"
            >
              <Clock className="w-6 h-6" />
              <span className="text-lg font-bold">
                Service in 10 Minutes! ⚡
              </span>
            </motion.div>
          </div>

          <p className="text-xl text-gray-600 mb-6">
            Lost Keys? Locked Out? We Fix It — Fast & Safely
          </p>
          <p className="text-md text-gray-500 mb-4">
            Professional doorstep locksmith services for homes, bikes, cars, and
            apartments across Bangalore
          </p>
          <p className="text-sm text-gray-500 italic">
            No shortcuts. No illegal methods. Transparent pricing based on real
            situations.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Verified Locksmiths</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium">
                24/7 Emergency Support
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Transparent Pricing</span>
            </div>
          </div>
        </motion.div>

        {!isEmergency && (
          <EmergencyKeyService onEmergencyClick={() => setIsEmergency(true)} />
        )}

        {/* Shopping Cart Badge */}
        {getCartItemCount() > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => navigate("/cart")}
            className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            </div>
          </motion.button>
        )}

        <div className="grid lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                Select Your Service
              </h2>

              <div className="space-y-8">
                {Object.entries(serviceCategories).map(([type, category]) => (
                  <div key={type}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {category.title}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {category.services.map((service) => (
                        <KeyServiceCard
                          key={service.id}
                          service={service}
                          isSelected={specificService === service.id}
                          onSelect={() => handleServiceSelect(type, service.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {specificService &&
                (serviceType === "house-apartment" ||
                  specificService.includes("duplicate")) && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

              {(specificService === "car-unlock-night" ||
                specificService === "house-apartment-main") && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nightService}
                      onChange={(e) => setNightService(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Night Service (10PM - 6AM) - Additional charges apply
                    </span>
                  </label>
                </div>
              )}
            </motion.div>

            {specificService && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isEmergency
                    ? "Emergency Service Selected"
                    : "Selected Service"}
                </h2>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">
                        Important Service Information:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Add to cart and proceed to checkout</li>
                        <li>
                          Provide location, date, time, and contact details
                        </li>
                        <li>Ownership proof required before service</li>
                        <li>All technicians are police-verified</li>
                        <li>
                          Night & emergency services may have additional charges
                        </li>
                        <li>Final price confirmed before starting the job</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <p className="font-medium mb-1">❌ What We Do NOT Do:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Illegal lock breaking</li>
                        <li>Safe cracking without proof</li>
                        <li>ECU hacking</li>
                        <li>Forced entry methods</li>
                      </ul>
                      <p className="mt-2 text-xs italic">
                        We follow ethical and legal locksmith practices only.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                    isEmergency
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isEmergency
                    ? "🚨 Add Emergency Service to Cart"
                    : "🔑 Book Service"}
                </button>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Price Quote
              </h3>

              {loadingQuote ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
                  <p className="text-sm text-gray-600 mt-2">Calculating...</p>
                </div>
              ) : priceQuote ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">
                      ₹{priceQuote.basePrice}
                    </span>
                  </div>
                  {priceQuote.nightSurcharge > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Night Surcharge:</span>
                      <span className="font-semibold text-orange-600">
                        +₹{priceQuote.nightSurcharge}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{priceQuote.totalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Service Includes:
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Doorstep service</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Professional technician</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Quality work guarantee</span>
                      </div>
                      {isEmergency && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Professional service</span>
                        </div>
                      )}
                      {serviceType === "digital-smart" && (
                        <>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span>Ownership proof required</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span>Supported brands only</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Key className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a service to see pricing</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  📲 Need Help Now?
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  Locked out or lost your key? We'll help you safely and
                  quickly.
                </p>
                <a
                  href="tel:+919591572775"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all mb-2"
                >
                  <Phone className="w-4 h-4" />
                  Call Now: 9591572775
                </a>
                <a
                  href="https://wa.me/919591572775"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Accessories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            🛠️ Add-On Services & Accessories
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Enhance your key service with these optional add-ons
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {accessories.map((accessory) => (
              <motion.div
                key={accessory.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-blue-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{accessory.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {accessory.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {accessory.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{accessory.price}
                      </span>
                      <button
                        onClick={() => {
                          if (!user) {
                            toast.error("Please sign in to add accessories");
                            return;
                          }
                          addToCart({
                            id: `accessory-${accessory.id}-${Date.now()}`,
                            type: "key-accessory",
                            name: accessory.name,
                            price: accessory.price,
                            quantity: 1,
                            image: "/logo.jpg", // Using generic logo for key accessories
                            serviceName: "key",
                            category: "Key Service Accessory",
                          });
                          toast.success(`${accessory.name} added to cart!`, {
                            icon: accessory.icon,
                          });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border-2 border-blue-200">
            <p className="text-sm text-gray-700 text-center">
              <strong>💡 Tip:</strong> Add accessories to your cart separately or along with your key service booking for convenience.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🚐 How BFS KeyCare Pro Works
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                step: "1",
                title: "Contact Us",
                desc: "Call or WhatsApp",
                icon: "📱",
              },
              {
                step: "2",
                title: "Share Details",
                desc: "Share photos if possible",
                icon: "📸",
              },
              {
                step: "3",
                title: "Get Price Confirmation",
                desc: "Expert confirms pricing",
                icon: "💰",
              },
              {
                step: "4",
                title: "Doorstep Service",
                desc: "Technician with tools",
                icon: "🔧",
              },
              {
                step: "5",
                title: "Pay After Work",
                desc: "No hidden charges",
                icon: "✅",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.icon}
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 Why Choose BFS KeyCare Pro
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Real-Market Pricing
                </h3>
                <p className="text-sm text-gray-600">
                  No fake low prices - transparent quotes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Experienced Locksmiths
                </h3>
                <p className="text-sm text-gray-600">
                  Professional and verified technicians
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Doorstep Service
                </h3>
                <p className="text-sm text-gray-600">
                  Available across Bangalore
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  24/7 Emergency Support
                </h3>
                <p className="text-sm text-gray-600">
                  Night and emergency services available
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Trusted BFS Network
                </h3>
                <p className="text-sm text-gray-600">
                  Part of reliable service network
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Transparent Pricing
                </h3>
                <p className="text-sm text-gray-600">
                  Final price confirmed before work
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700 text-center">
              <strong>📌 Important Pricing Note:</strong> Prices vary based on
              lock type, vehicle model, and time of service. Night and emergency
              services may include additional charges. Final price is always
              confirmed before starting the job.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🌙 Night & Emergency Services
          </h2>
          <p className="text-gray-700 mb-4">
            We offer 24/7 emergency locksmith support across Bangalore.
          </p>
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-gray-600 mb-2">
              Additional charges apply for:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <span className="bg-white px-4 py-2 rounded-full text-sm font-medium">
                Late night (10 PM – 6 AM)
              </span>
              <span className="bg-white px-4 py-2 rounded-full text-sm font-medium">
                Heavy rain
              </span>
              <span className="bg-white px-4 py-2 rounded-full text-sm font-medium">
                Remote locations
              </span>
            </div>
            <p className="text-xs text-gray-500 italic">
              This is standard practice across Bangalore.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KeyServicesPage;
