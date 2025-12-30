import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Plus,
  Minus,
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";

const API = import.meta.env.VITE_API_URL || window.location.origin;

const FlowerServicesPage = () => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const { category: urlCategory } = useParams();

  // Form state
  const [serviceType, setServiceType] = useState("");
  const [category, setCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Service categories data
  const serviceCategories = {
    bouquets: {
      title: "💐 Flower Bouquets",
      categories: {
        "classic-bouquet": {
          name: "🌹 Classic Bouquets",
          items: [
            { id: "rose-bouquet", name: "Rose Bouquet", price: "₹499 - ₹899" },
            {
              id: "mixed-flower-bouquet",
              name: "Mixed Flower Bouquet",
              price: "₹599 - ₹999",
            },
            {
              id: "seasonal-flower-bouquet",
              name: "Seasonal Flower Bouquet",
              price: "₹549 - ₹949",
            },
          ],
        },
        "love-couple-bouquet": {
          name: "❤️ Love & Couple Bouquets",
          items: [
            {
              id: "red-rose-bouquet",
              name: "Red Rose Bouquet",
              price: "₹799 - ₹1,499",
            },
            {
              id: "heart-style-bouquet",
              name: "Heart-Style Bouquet",
              price: "₹799 - ₹1,499",
            },
            {
              id: "rose-filler-flowers",
              name: "Rose + Filler Flowers",
              price: "₹799 - ₹1,499",
            },
          ],
        },
        "premium-bouquet": {
          name: "👑 Premium Bouquets",
          items: [
            {
              id: "imported-exotic-flowers",
              name: "Imported / Exotic Flowers",
              price: "₹1,499 - ₹2,999+",
            },
            {
              id: "designer-wrapping",
              name: "Designer Wrapping",
              price: "₹1,499 - ₹2,999+",
            },
            {
              id: "bigger-size-bouquets",
              name: "Bigger Size Bouquets",
              price: "₹1,499 - ₹2,999+",
            },
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
            {
              id: "chocolate-boxes",
              name: "Chocolate Boxes",
              price: "₹399 - ₹1,999+",
            },
            {
              id: "greeting-cards",
              name: "Greeting Cards",
              price: "₹399 - ₹1,999+",
            },
            { id: "perfumes", name: "Perfumes", price: "₹399 - ₹1,999+" },
            { id: "soft-toys", name: "Soft Toys", price: "₹399 - ₹1,999+" },
          ],
        },
        "photo-gift": {
          name: "📸 Photo Gifts",
          items: [
            {
              id: "printed-photo-frames",
              name: "Printed Photo Frames",
              price: "₹299 - ₹999",
            },
            {
              id: "mini-photo-albums",
              name: "Mini Photo Albums",
              price: "₹299 - ₹999",
            },
            {
              id: "personalized-photo-cards",
              name: "Personalized Photo Cards",
              price: "₹299 - ₹999",
            },
          ],
        },
        "love-surprise-box": {
          name: "💖 Love Surprise Boxes",
          items: [
            {
              id: "bouquet-teddy",
              name: "Bouquet + Teddy",
              price: "₹999 - ₹2,499+",
            },
            {
              id: "bouquet-chocolates",
              name: "Bouquet + Chocolates",
              price: "₹999 - ₹2,499+",
            },
            {
              id: "bouquet-photo-gift",
              name: "Bouquet + Photo Gift",
              price: "₹999 - ₹2,499+",
            },
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
            {
              id: "balloon-decoration",
              name: "Balloon Decoration",
              price: "₹1,499 - ₹3,999",
            },
            {
              id: "name-banner",
              name: "Name Banner",
              price: "₹1,499 - ₹3,999",
            },
            {
              id: "table-room-decor",
              name: "Table & Room Decor",
              price: "₹1,499 - ₹3,999",
            },
          ],
        },
        "couple-decoration": {
          name: "❤️ Couple / Anniversary Decoration",
          items: [
            {
              id: "romantic-balloon-decor",
              name: "Romantic Balloon Decor",
              price: "₹1,999 - ₹4,999",
            },
            {
              id: "rose-petals",
              name: "Rose Petals",
              price: "₹1,999 - ₹4,999",
            },
            { id: "led-lights", name: "LED Lights", price: "₹1,999 - ₹4,999" },
          ],
        },
        "party-decoration": {
          name: "🎉 Party & Function Decorations",
          items: [
            {
              id: "small-home-parties",
              name: "Small Home Parties",
              price: "₹2,999+ (custom)",
            },
            {
              id: "surprise-celebrations",
              name: "Surprise Celebrations",
              price: "₹2,999+ (custom)",
            },
            {
              id: "family-functions",
              name: "Family Functions",
              price: "₹2,999+ (custom)",
            },
          ],
        },
      },
    },
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
    if (!selectedItem || !category) {
      toast.error("Please select a service");
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
          serviceTypeKey =
            key === "bouquets"
              ? "bouquet"
              : key === "gifts"
              ? "gift-box"
              : "decoration";
          break;
        }
      }
      if (itemDetails) break;
    }

    if (!itemDetails) {
      toast.error("Service not found");
      return;
    }

    const basePrice = extractBasePrice(itemDetails.price);

    // Check if first-time booking
    const isFirstTimeBooking = !user?.totalOrders || user.totalOrders === 0;
    const firstTimeDiscount = isFirstTimeBooking ? 0.15 : 0;
    const discountAmount = Math.round(basePrice * firstTimeDiscount);
    const finalPrice = basePrice - discountAmount;

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
      originalPrice: basePrice,
      discount: discountAmount,
      isFirstTimeBooking: isFirstTimeBooking,
      quantity: quantity,
      features: [itemDetails.name],
      serviceCategory: categoryDetails.name,
      metadata: {
        serviceType: serviceTypeKey,
        category: category,
        itemId: selectedItem,
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

  // Get the service data for the selected category
  const getServiceData = () => {
    if (!urlCategory || !serviceCategories[urlCategory]) {
      return null;
    }
    return serviceCategories[urlCategory];
  };

  const serviceData = getServiceData();

  // Redirect if invalid category
  useEffect(() => {
    if (urlCategory && !serviceCategories[urlCategory]) {
      navigate("/flower-categories");
    }
  }, [urlCategory, navigate]);

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h2>
          <button
            onClick={() => navigate("/flower-categories")}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  // Get category display name
  const getCategoryTitle = () => {
    switch(urlCategory) {
      case 'bouquets': return '💐 Flower Bouquets';
      case 'gifts': return '🎁 Gift Boxes & Surprise Combos';
      case 'decorations': return '🎈 Decoration Services';
      default: return 'Flower Services';
    }
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
              {getCategoryTitle()}
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

          {/* Back button */}
          <button
            onClick={() => navigate("/flower-categories")}
            className="mt-4 text-pink-600 hover:text-pink-700 font-semibold"
          >
            ← Back to Categories
          </button>
        </motion.div>

        {/* Services Section - Display only selected category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          {Object.entries(serviceData.categories).map(
            ([key, categoryData]) => (
              <div
                key={key}
                className="mb-8 bg-white rounded-2xl shadow-lg p-6"
              >
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  {categoryData.name}
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {categoryData.items.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleItemSelect(urlCategory, key, item.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedItem === item.id && category === key
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <h5 className="font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h5>
                      <p className="text-pink-600 font-bold">{item.price}</p>
                      {selectedItem === item.id && category === key && (
                        <CheckCircle className="w-5 h-5 text-pink-600 mt-2" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          )}
        </motion.div>

        {/* Add to Cart Section */}
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Add to Cart
            </h3>

            <div className="mb-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full flex items-center justify-center transition-all"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-pink-50 rounded-lg p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-4">Price Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per item</span>
                  <span>
                    ₹
                    {extractBasePrice(
                      serviceData?.categories[category]
                        ?.items.find((item) => item.id === selectedItem)?.price
                    )}
                  </span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 flex justify-between font-bold text-lg">
                  <span>Subtotal</span>
                  <span className="text-pink-600">
                    ₹
                    {quantity *
                      extractBasePrice(
                        serviceData?.categories[category]
                          ?.items.find((item) => item.id === selectedItem)
                          ?.price
                      )}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * Delivery details, custom messages, and timing preferences can be added during checkout
              </p>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
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
          transition={{ delay: 0.4 }}
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
                <p className="text-gray-600 text-sm">
                  Available in selected areas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">
                  Scheduled delivery
                </p>
                <p className="text-gray-600 text-sm">
                  Plan your perfect moment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">
                  Doorstep delivery only
                </p>
                <p className="text-gray-600 text-sm">Across Bangalore</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">
                  Late-night / urgent delivery
                </p>
                <p className="text-orange-600 text-sm font-semibold">
                  +₹299 - ₹499 surcharge
                </p>
              </div>
            </div>
          </div>
          
          {/* Delivery Charges Note */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              📌 Delivery Charges:
            </p>
            <p className="text-sm text-blue-800">
              Free delivery for distances less than 2 kms. Additional charges will be applied based on distance (kms) for locations beyond 2 kms.
            </p>
          </div>
        </motion.div>

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12 bg-yellow-50 border-2 border-yellow-400 rounded-2xl shadow-lg p-6"
        >
          <h4 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            📌 Important Note
          </h4>
          <ul className="space-y-2 text-gray-700">
            <li>• Flower availability varies by season</li>
            <li>
              • Final design may slightly differ while maintaining quality and
              value
            </li>
          </ul>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Ready to Create Perfect Moments?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              Select Service
            </button>
            <a
              href="https://wa.me/919591572775"
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
