import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Flower,
  Flower2,
  Heart,
  Gift,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  X,
  Package,
  Camera,
  Cake,
  Home,
  PartyPopper,
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";

const API = import.meta.env.VITE_API_URL || window.location.origin;

const FlowerServicesPage = () => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  // Form state
  const [serviceType, setServiceType] = useState("");
  const [category, setCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("anytime");
  const [customMessage, setCustomMessage] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [priceQuote, setPriceQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // Service categories data
  const serviceCategories = {
    bouquets: {
      title: "💐 Flower Bouquets",
      categories: {
        "classic-bouquet": {
          name: "🌹 Classic Bouquets",
          items: [
            { id: "rose-bouquet", name: "Rose Bouquet", price: "₹499 - ₹999" },
            { id: "mixed-flower-bouquet", name: "Mixed Flower Bouquet", price: "₹499 - ₹999" },
            { id: "seasonal-flower-bouquet", name: "Seasonal Flower Bouquet", price: "₹499 - ₹999" },
          ],
        },
        "love-couple-bouquet": {
          name: "❤️ Love & Couple Bouquets",
          items: [
            { id: "red-rose-bouquet", name: "Red Rose Bouquet", price: "₹799 - ₹1,499" },
            { id: "heart-style-bouquet", name: "Heart-Style Bouquet", price: "₹799 - ₹1,499" },
            { id: "rose-filler-flowers", name: "Rose + Filler Flowers", price: "₹799 - ₹1,499" },
          ],
        },
        "premium-bouquet": {
          name: "👑 Premium Bouquets",
          items: [
            { id: "imported-exotic-flowers", name: "Imported / Exotic Flowers", price: "₹1,499 - ₹2,999+" },
            { id: "designer-wrapping", name: "Designer Wrapping", price: "₹1,499 - ₹2,999+" },
            { id: "bigger-size-bouquets", name: "Bigger Size Bouquets", price: "₹1,499 - ₹2,999+" },
          ],
        },
      },
    },
    gifts: {
      title: "🎁 Gift Boxes & Surprise Combos",
      categories: {
        "gift-box": {
          name: "🧸 Gift Box Options",
          items: [
            { id: "teddy-bears", name: "Teddy Bears", price: "₹399 - ₹1,999+" },
            { id: "chocolate-boxes", name: "Chocolate Boxes", price: "₹399 - ₹1,999+" },
            { id: "greeting-cards", name: "Greeting Cards", price: "₹399 - ₹1,999+" },
            { id: "perfumes", name: "Perfumes", price: "₹399 - ₹1,999+" },
            { id: "soft-toys", name: "Soft Toys", price: "₹399 - ₹1,999+" },
          ],
        },
        "photo-gift": {
          name: "📸 Photo Gifts",
          items: [
            { id: "printed-photo-frames", name: "Printed Photo Frames", price: "₹299 - ₹999" },
            { id: "mini-photo-albums", name: "Mini Photo Albums", price: "₹299 - ₹999" },
            { id: "personalized-photo-cards", name: "Personalized Photo Cards", price: "₹299 - ₹999" },
          ],
        },
        "love-surprise-box": {
          name: "💖 Love Surprise Boxes",
          items: [
            { id: "bouquet-teddy", name: "Bouquet + Teddy", price: "₹999 - ₹2,499+" },
            { id: "bouquet-chocolates", name: "Bouquet + Chocolates", price: "₹999 - ₹2,499+" },
            { id: "bouquet-photo-gift", name: "Bouquet + Photo Gift", price: "₹999 - ₹2,499+" },
          ],
        },
      },
    },
    decorations: {
      title: "🎈 Decoration Services",
      categories: {
        "birthday-decoration": {
          name: "🎂 Birthday Decoration",
          items: [
            { id: "balloon-decoration", name: "Balloon Decoration", price: "₹1,499 - ₹3,999" },
            { id: "name-banner", name: "Name Banner", price: "₹1,499 - ₹3,999" },
            { id: "table-room-decor", name: "Table & Room Decor", price: "₹1,499 - ₹3,999" },
          ],
        },
        "couple-decoration": {
          name: "❤️ Couple / Anniversary Decoration",
          items: [
            { id: "romantic-balloon-decor", name: "Romantic Balloon Decor", price: "₹1,999 - ₹4,999" },
            { id: "rose-petals", name: "Rose Petals", price: "₹1,999 - ₹4,999" },
            { id: "led-lights", name: "LED Lights", price: "₹1,999 - ₹4,999" },
          ],
        },
        "party-decoration": {
          name: "🎉 Party & Function Decorations",
          items: [
            { id: "small-home-parties", name: "Small Home Parties", price: "₹2,999+ (custom)" },
            { id: "surprise-celebrations", name: "Surprise Celebrations", price: "₹2,999+ (custom)" },
            { id: "family-functions", name: "Family Functions", price: "₹2,999+ (custom)" },
          ],
        },
      },
    },
  };

  // Calculate price quote when selections change
  useEffect(() => {
    if (selectedItem && category) {
      calculateQuote();
    }
  }, [selectedItem, category, quantity, deliveryTime]);

  const calculateQuote = async () => {
    setLoadingQuote(true);
    try {
      // Find the selected item details
      let itemDetails = null;
      let serviceTypeKey = "";
      
      for (const [key, value] of Object.entries(serviceCategories)) {
        for (const [catKey, catValue] of Object.entries(value.categories)) {
          if (catKey === category) {
            itemDetails = catValue.items.find((item) => item.id === selectedItem);
            serviceTypeKey = key === "bouquets" ? "bouquet" : key === "gifts" ? "gift-box" : "decoration";
            break;
          }
        }
        if (itemDetails) break;
      }

      if (itemDetails) {
        const basePrice = extractBasePrice(itemDetails.price);
        const lateNightSurcharge = deliveryTime === "late-night" ? 299 : 0;
        const customizationCharge = customMessage ? 199 : 0;
        const totalPrice = (basePrice * quantity) + lateNightSurcharge + customizationCharge;
        
        setPriceQuote({
          basePrice: basePrice,
          lateNightSurcharge: lateNightSurcharge,
          customizationCharge: customizationCharge,
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

  // Extract base price from price range string
  const extractBasePrice = (priceString) => {
    if (typeof priceString === "number") return priceString;
    if (typeof priceString === "string") {
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
      return;
    }
    if (!selectedItem || !category || !deliveryDate) {
      toast.error("Please select a service and delivery date");
      return;
    }

    // Find the selected item details
    let itemDetails = null;
    let categoryDetails = null;
    let serviceTypeKey = "";
    
    for (const [key, value] of Object.entries(serviceCategories)) {
      for (const [catKey, catValue] of Object.entries(value.categories)) {
        if (catKey === category) {
          itemDetails = catValue.items.find((item) => item.id === selectedItem);
          categoryDetails = catValue;
          serviceTypeKey = key === "bouquets" ? "bouquet" : key === "gifts" ? "gift-box" : "decoration";
          break;
        }
      }
      if (itemDetails) break;
    }

    if (!itemDetails) {
      toast.error("Service not found");
      return;
    }

    const basePrice = priceQuote?.basePrice || extractBasePrice(itemDetails.price);
    const totalPrice = priceQuote?.totalPrice || basePrice;

    // Check if first-time booking
    const isFirstTimeBooking = !user?.totalOrders || user.totalOrders === 0;
    const firstTimeDiscount = isFirstTimeBooking ? 0.15 : 0;
    const discountAmount = Math.round(totalPrice * firstTimeDiscount);
    const finalPrice = totalPrice - discountAmount;

    // Create cart item
    const cartItem = {
      id: `flowers-${selectedItem}-${Date.now()}`,
      type: "flower-services",
      category: categoryDetails.name,
      name: itemDetails.name,
      serviceName: "flowers",
      image: "/services/flowers/bouquet.jpg",
      price: finalPrice,
      basePrice: basePrice,
      originalPrice: totalPrice,
      discount: discountAmount,
      isFirstTimeBooking: isFirstTimeBooking,
      quantity: quantity,
      features: [itemDetails.name],
      serviceCategory: categoryDetails.name,
      deliveryDate: deliveryDate,
      deliveryTime: deliveryTime,
      customMessage: customMessage,
      recipientName: recipientName,
      metadata: {
        serviceType: serviceTypeKey,
        category: category,
        itemId: selectedItem,
        deliveryDate: deliveryDate,
        deliveryTime: deliveryTime,
        isLateNightDelivery: deliveryTime === "late-night",
      },
    };

    addToCart(cartItem);

    let successMessage = `${itemDetails.name} added to cart!`;
    if (isFirstTimeBooking) {
      successMessage += ` 🎉 15% First-Time Discount Applied!`;
    }

    toast.success(successMessage, {
      icon: "💐",
      duration: 3000,
    });

    setTimeout(() => navigate("/cart"), 500);
  };

  const handleItemSelect = (type, cat, itemId) => {
    setServiceType(type);
    setCategory(cat);
    setSelectedItem(itemId);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flower2 className="w-12 h-12 text-pink-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              BFS Flowers, Bouquets & Surprises
            </h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-pink-600 mb-4">
            Beautiful Bouquets. Thoughtful Gifts. Perfect Moments.
          </h2>

          <div className="flex flex-wrap justify-center gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              <span>Doorstep delivery across Bangalore</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-500" />
              <span>Flowers, gifts & surprise decorations</span>
            </div>
          </div>

          {/* Important Note - Cakes NOT provided */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 inline-flex items-center gap-2 bg-red-100 border-2 border-red-400 text-red-800 px-6 py-3 rounded-lg"
          >
            <X className="w-5 h-5" />
            <Cake className="w-5 h-5" />
            <span className="font-semibold">Cakes are NOT provided</span>
          </motion.div>
        </motion.div>

        {/* What We Specialise In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎉 What We Specialise In
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <PartyPopper className="w-8 h-8" />, title: "Birthday Surprises", color: "blue" },
              { icon: <Heart className="w-8 h-8" />, title: "Love & Anniversary Bouquets", color: "pink" },
              { icon: <Flower className="w-8 h-8" />, title: "Party & Function Flower Bookings", color: "purple" },
              { icon: <Home className="w-8 h-8" />, title: "Room & Small-Event Decorations", color: "indigo" },
              { icon: <Package className="w-8 h-8" />, title: "Customized Gift Boxes", color: "green" },
              { icon: <X className="w-8 h-8" />, title: "Cakes NOT Provided", color: "red" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg bg-${item.color}-50 border-2 border-${item.color}-200`}
              >
                <div className={`text-${item.color}-600`}>{item.icon}</div>
                <span className="font-medium text-gray-800">{item.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Flower Bouquets Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            💐 Flower Bouquets
          </h3>
          {Object.entries(serviceCategories.bouquets.categories).map(([key, categoryData]) => (
            <div key={key} className="mb-8 bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">{categoryData.name}</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {categoryData.items.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleItemSelect("bouquets", key, item.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedItem === item.id && category === key
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <h5 className="font-semibold text-gray-900 mb-2">{item.name}</h5>
                    <p className="text-pink-600 font-bold">{item.price}</p>
                    {selectedItem === item.id && category === key && (
                      <CheckCircle className="w-5 h-5 text-pink-600 mt-2" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Gift Boxes & Surprise Combos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🎁 Gift Boxes & Surprise Combos
          </h3>
          {Object.entries(serviceCategories.gifts.categories).map(([key, categoryData]) => (
            <div key={key} className="mb-8 bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">{categoryData.name}</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {categoryData.items.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleItemSelect("gifts", key, item.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedItem === item.id && category === key
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <h5 className="font-semibold text-gray-900 mb-2">{item.name}</h5>
                    <p className="text-purple-600 font-bold">{item.price}</p>
                    {selectedItem === item.id && category === key && (
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-2" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Decoration Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🎈 Decoration Services (Small Events)
          </h3>
          {Object.entries(serviceCategories.decorations.categories).map(([key, categoryData]) => (
            <div key={key} className="mb-8 bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4">{categoryData.name}</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {categoryData.items.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleItemSelect("decorations", key, item.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedItem === item.id && category === key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <h5 className="font-semibold text-gray-900 mb-2">{item.name}</h5>
                    <p className="text-blue-600 font-bold">{item.price}</p>
                    {selectedItem === item.id && category === key && (
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bulk & Event Flower Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            🌼 Bulk & Event Flower Bookings
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-4">
            <div className="text-center">
              <p className="font-semibold text-gray-800">Pooja Flowers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800">Welcome Bouquets</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800">Stage Flower Bunches</p>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-orange-600 font-bold">📌 Advance booking required</p>
            <p className="text-orange-600 font-bold">📌 Custom pricing only</p>
          </div>
        </motion.div>

        {/* Booking Form */}
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="anytime">Anytime</option>
                  <option value="morning">Morning (6 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 10 PM)</option>
                  <option value="late-night">Late Night (10 PM - 6 AM) +₹299</option>
                </select>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name (Optional)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter recipient's name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Custom Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message (Optional) +₹199
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Write a personalized message..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Price Quote */}
            {priceQuote && (
              <div className="bg-pink-50 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-4">Price Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price (×{priceQuote.quantity})</span>
                    <span>₹{priceQuote.basePrice * priceQuote.quantity}</span>
                  </div>
                  {priceQuote.lateNightSurcharge > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Late Night Delivery</span>
                      <span>+₹{priceQuote.lateNightSurcharge}</span>
                    </div>
                  )}
                  {priceQuote.customizationCharge > 0 && (
                    <div className="flex justify-between text-purple-600">
                      <span>Customization</span>
                      <span>+₹{priceQuote.customizationCharge}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-300 pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-pink-600">₹{priceQuote.totalPrice}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!deliveryDate}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart
            </button>
          </motion.div>
        )}

        {/* Delivery & Service Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚚 Delivery & Service Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Same-day delivery</p>
                <p className="text-gray-600 text-sm">Available in selected areas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Scheduled delivery</p>
                <p className="text-gray-600 text-sm">Plan your perfect moment</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Doorstep delivery only</p>
                <p className="text-gray-600 text-sm">Across Bangalore</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Late-night / urgent delivery</p>
                <p className="text-orange-600 text-sm font-semibold">+₹299 - ₹499 surcharge</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚐 How BFS Flowers & Surprises Work
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: "1", text: "Choose bouquet / gift / decoration" },
              { step: "2", text: "Customize message, photos, or theme" },
              { step: "3", text: "Select delivery date & time" },
              { step: "4", text: "Confirm order" },
              { step: "5", text: "BFS prepares & delivers with care" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">
                  {item.step}
                </div>
                <p className="text-sm font-medium text-gray-800">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What We Do NOT Provide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-12 bg-red-50 border-2 border-red-300 rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">
            ❌ What We Do NOT Provide
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <Cake className="w-8 h-8" />, text: "Cakes", important: true },
              { icon: <Sparkles className="w-8 h-8" />, text: "Large-scale wedding decorations" },
              { icon: <AlertCircle className="w-8 h-8" />, text: "Outdoor stage events without advance planning" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  item.important ? "bg-red-200 border-2 border-red-500" : "bg-red-100"
                }`}
              >
                <div className="text-red-600">{item.icon}</div>
                <span className={`font-semibold ${item.important ? "text-red-900 text-lg" : "text-red-700"}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose BFS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 Why Choose BFS
          </h3>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: <Flower className="w-10 h-10" />, text: "Fresh Flowers", color: "pink" },
              { icon: <Sparkles className="w-10 h-10" />, text: "Beautiful Presentation", color: "purple" },
              { icon: <Clock className="w-10 h-10" />, text: "Fast Delivery", color: "blue" },
              { icon: <Heart className="w-10 h-10" />, text: "Custom Surprises", color: "red" },
              { icon: <CheckCircle className="w-10 h-10" />, text: "Trusted BFS Service", color: "green" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`text-${item.color}-600 mb-3 flex justify-center`}>{item.icon}</div>
                <p className="font-semibold text-gray-800">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-12 bg-yellow-50 border-2 border-yellow-400 rounded-2xl shadow-lg p-6"
        >
          <h4 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            📌 Important Note
          </h4>
          <ul className="space-y-2 text-gray-700">
            <li>• Flower availability varies by season</li>
            <li>• Final design may slightly differ while maintaining quality and value</li>
          </ul>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Create Perfect Moments?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              Order Bouquets
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
            >
              Book Decoration
            </button>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              WhatsApp Us
            </a>
          </div>
        </motion.div>

        {/* Floating Cart Button */}
        {getCartItemCount() > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => navigate("/cart")}
            className="fixed bottom-6 right-6 bg-pink-600 text-white p-4 rounded-full shadow-2xl hover:bg-pink-700 transition-all z-50"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-white text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {getCartItemCount()}
              </span>
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default FlowerServicesPage;
