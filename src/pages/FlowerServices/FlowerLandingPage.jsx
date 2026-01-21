import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Flower2,
  Heart,
  MapPin,
  Phone,
  ShoppingCart,
  PartyPopper,
  Plus,
  Minus,
  Star,
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";

const FlowerLandingPage = () => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Combined products from templates 2 and 4
  const products = {
    decorations: [
      {
        id: "rose-candles-decoration",
        name: "Rose and Candles Decoration",
        category: "Balloon Decorations",
        price: 3799,
        image: "https://cdn.7eventzz.com/11/1742447659717.webp",
        description: "Romantic rose petals with candle decoration"
      },
      {
        id: "cocomelon-decoration",
        name: "Cocomelon Birthday Decoration",
        category: "Balloon Decorations",
        price: 3999,
        image: "https://cdn.7eventzz.com/18/1742038323157.webp",
        description: "Fun Cocomelon themed birthday setup"
      },
      {
        id: "minnie-mouse-decoration",
        name: "Minnie Mouse Theme Decoration",
        category: "Balloon Decorations",
        price: 3399,
        image: "https://cdn.7eventzz.com/18/1742283982145.webp",
        description: "Cute Minnie Mouse party decoration"
      },
      {
        id: "gold-birthday-hall",
        name: "Gold Birthday Hall Decoration",
        category: "Balloon Decorations",
        price: 4899,
        image: "https://cdn.7eventzz.com/11/1741850560591.webp",
        description: "Elegant gold themed hall decoration"
      },
      {
        id: "boss-baby-decoration",
        name: "Boss Baby Decoration",
        category: "Balloon Decorations",
        price: 3499,
        image: "https://cdn.7eventzz.com/18/1742287939206.webp",
        description: "Boss Baby themed birthday decoration"
      },
      {
        id: "simple-party-hall",
        name: "Simple Party Hall",
        category: "Balloon Decorations",
        price: 2999,
        image: "https://cdn.7eventzz.com/11/1742643106575.webp",
        description: "Clean and simple party hall setup"
      },
      {
        id: "birthday-event-decoration",
        name: "Birthday Event Decoration",
        category: "Balloon Decorations",
        price: 3199,
        image: "https://cdn.7eventzz.com/11/1741854364791.webp",
        description: "Complete birthday event decoration"
      },
      {
        id: "mom-birthday-balloon",
        name: "Mom Birthday Balloon Setup",
        category: "Balloon Decorations",
        price: 2699,
        image: "https://cdn.7eventzz.com/11/1741862921166.webp",
        description: "Special balloon setup for mom's birthday"
      },
      {
        id: "surprise-room-decoration",
        name: "Surprise Room Decoration",
        category: "Balloon Decorations",
        price: 2499,
        image: "https://cdn.7eventzz.com/11/1742360733346.webp",
        description: "Surprise room decoration with balloons"
      },
      {
        id: "cabana-room-decor",
        name: "Cabana Room Decor",
        category: "Balloon Decorations",
        price: 4299,
        image: "https://cdn.7eventzz.com/21/1742447693971.webp",
        description: "Luxury cabana style room decoration"
      },
      {
        id: "room-decoration-balloons",
        name: "Room Decoration with Balloons",
        category: "Balloon Decorations",
        price: 1999,
        image: "https://cdn.7eventzz.com/28/1742452860297.webp",
        description: "Beautiful room decoration with colorful balloons"
      },
      {
        id: "birthday-ring-decoration",
        name: "Birthday Ring Decoration",
        category: "Balloon Decorations",
        price: 1699,
        image: "https://cdn.7eventzz.com/11/1742023234270.webp",
        description: "Circular ring style balloon decoration"
      }
    ],
    flowers: [
      {
        id: "red-roses-bouquet",
        name: "Red Roses Bouquet",
        category: "Fresh Flowers",
        price: 799,
        image: "https://cdn.7eventzz.com/47/1768479778505.webp",
        description: "Fresh red roses in elegant wrapping"
      },
      {
        id: "mixed-flowers-bouquet",
        name: "Mixed Flowers Bouquet",
        category: "Fresh Flowers",
        price: 999,
        image: "https://cdn.7eventzz.com/47/1768479494213.webp",
        description: "Colorful mix of fresh seasonal flowers"
      },
      {
        id: "pink-roses-bouquet",
        name: "Pink Roses Bouquet",
        category: "Fresh Flowers",
        price: 899,
        image: "https://cdn.7eventzz.com/47/1768479494065.webp",
        description: "Soft pink roses with beautiful packaging"
      },
      {
        id: "yellow-flowers-bouquet",
        name: "Yellow Flowers Bouquet",
        category: "Fresh Flowers",
        price: 849,
        image: "https://cdn.7eventzz.com/47/1768479494305.webp",
        description: "Bright yellow flowers for cheerful moments"
      },
      {
        id: "white-flowers-bouquet",
        name: "White Flowers Bouquet",
        category: "Fresh Flowers",
        price: 899,
        image: "https://cdn.7eventzz.com/47/1768479494394.webp",
        description: "Pure white flowers in premium wrapping"
      },
      {
        id: "orange-roses-bouquet",
        name: "Orange Roses Bouquet",
        category: "Fresh Flowers",
        price: 949,
        image: "https://cdn.7eventzz.com/47/1768479778615.webp",
        description: "Vibrant orange roses arrangement"
      },
      {
        id: "purple-flowers-bouquet",
        name: "Purple Flowers Bouquet",
        category: "Fresh Flowers",
        price: 999,
        image: "https://cdn.7eventzz.com/47/1768479778694.webp",
        description: "Elegant purple flowers bouquet"
      },
      {
        id: "premium-mixed-bouquet",
        name: "Premium Mixed Bouquet",
        category: "Fresh Flowers",
        price: 1299,
        image: "https://cdn.7eventzz.com/47/1768479778779.webp",
        description: "Luxurious mix of premium flowers"
      },
      {
        id: "exotic-flowers-bouquet",
        name: "Exotic Flowers Bouquet",
        category: "Fresh Flowers",
        price: 1499,
        image: "https://cdn.7eventzz.com/47/1768480275776.webp",
        description: "Exotic imported flowers arrangement"
      },
      {
        id: "classic-red-roses",
        name: "Classic Red Roses",
        category: "Fresh Flowers",
        price: 749,
        image: "https://cdn.7eventzz.com/47/1768479939616.webp",
        description: "Classic dozen red roses"
      },
      {
        id: "sunflowers-bouquet",
        name: "Sunflowers Bouquet",
        category: "Fresh Flowers",
        price: 899,
        image: "https://cdn.7eventzz.com/47/1768479939811.webp",
        description: "Cheerful sunflowers arrangement"
      },
      {
        id: "pastel-flowers-mix",
        name: "Pastel Flowers Mix",
        category: "Fresh Flowers",
        price: 949,
        image: "https://cdn.7eventzz.com/47/1768479939905.webp",
        description: "Soft pastel colored flowers"
      }
    ]
  };

  const allProducts = [...products.decorations, ...products.flowers];

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to book a service");
      return;
    }
    if (!selectedItem) {
      toast.error("Please select a service");
      return;
    }

    const product = allProducts.find(p => p.id === selectedItem);
    if (!product) {
      toast.error("Service not found");
      return;
    }

    // Check if first-time booking
    const isFirstTimeBooking = !user?.totalOrders || user.totalOrders === 0;
    const firstTimeDiscount = isFirstTimeBooking ? 0.15 : 0;
    const discountAmount = Math.round(product.price * firstTimeDiscount);
    const finalPrice = product.price - discountAmount;

    // Create cart item
    const cartItem = {
      id: `flowers-${selectedItem}-${Date.now()}`,
      type: "flower-services",
      category: product.category,
      name: product.name,
      serviceName: "flowers",
      image: product.image,
      price: finalPrice,
      basePrice: product.price,
      originalPrice: product.price,
      discount: discountAmount,
      isFirstTimeBooking: isFirstTimeBooking,
      quantity: quantity,
      features: [product.description],
      serviceCategory: product.category,
      metadata: {
        serviceType: product.category.includes("Decoration") ? "decoration" : "bouquet",
        itemId: selectedItem,
      },
    };

    addToCart(cartItem);

    let successMessage = `${product.name} added to cart!`;
    if (isFirstTimeBooking) {
      successMessage += ` 🎉 15% First-Time Discount Applied!`;
    }

    toast.success(successMessage, {
      icon: "💐",
      duration: 3000,
    });

    setTimeout(() => navigate("/cart"), 500);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
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
              Flowers & Decorations
            </h1>
            <PartyPopper className="w-12 h-12 text-purple-600" />
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-pink-600 mb-4">
            Beautiful Bouquets & Stunning Balloon Decorations
          </h2>

          <div className="flex flex-wrap justify-center gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              <span>Doorstep delivery across Bangalore</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Premium Quality Products</span>
            </div>
          </div>
        </motion.div>

        {/* Fresh Flowers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Flower2 className="w-8 h-8 text-pink-600" />
            <h3 className="text-3xl font-bold text-gray-900">Fresh Flowers</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.flowers.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedItem(product.id)}
                className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all ${
                  selectedItem === product.id
                    ? "ring-4 ring-pink-500"
                    : "hover:shadow-xl"
                }`}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-pink-600 font-bold text-lg">₹{product.price}</p>
                    {selectedItem === product.id && (
                      <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Balloon Decorations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <PartyPopper className="w-8 h-8 text-purple-600" />
            <h3 className="text-3xl font-bold text-gray-900">Balloon Decorations</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.decorations.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedItem(product.id)}
                className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all ${
                  selectedItem === product.id
                    ? "ring-4 ring-purple-500"
                    : "hover:shadow-xl"
                }`}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-purple-600 font-bold text-lg">₹{product.price}</p>
                    {selectedItem === product.id && (
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Add to Cart Section */}
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 mb-12 sticky bottom-4 z-40"
          >
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Selected: {allProducts.find(p => p.id === selectedItem)?.name}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
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

                {/* Price Display */}
                <div className="bg-pink-50 rounded-lg p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Price per item</span>
                      <span>₹{allProducts.find(p => p.id === selectedItem)?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-2 flex justify-between font-bold text-lg">
                      <span>Subtotal</span>
                      <span className="text-pink-600">
                        ₹{quantity * (allProducts.find(p => p.id === selectedItem)?.price || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Need Help Choosing?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              Browse More
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
          
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              📌 Delivery Information:
            </p>
            <p className="text-sm text-blue-800">
              Free delivery for distances less than 2 kms. Additional charges apply beyond 2 kms. Same-day delivery available in selected areas.
            </p>
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

export default FlowerLandingPage;
