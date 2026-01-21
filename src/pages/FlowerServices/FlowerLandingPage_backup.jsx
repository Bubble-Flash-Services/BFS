import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flower2,
  Heart,
  Gift,
  Cake,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  Clock,
  Truck,
  Award,
  Phone,
  MapPin,
} from "lucide-react";

// Occasions data
const occasions = [
  { id: "birthday", name: "Birthday", icon: Cake, color: "bg-pink-500" },
  { id: "anniversary", name: "Anniversary", icon: Heart, color: "bg-red-500" },
  { id: "love", name: "Love & Romance", icon: Heart, color: "bg-rose-500" },
  { id: "congratulations", name: "Congratulations", icon: Award, color: "bg-green-500" },
  { id: "get-well-soon", name: "Get Well Soon", icon: Sparkles, color: "bg-blue-500" },
  { id: "thank-you", name: "Thank You", icon: Gift, color: "bg-purple-500" },
];

// Featured products - Best sellers
const featuredProducts = [
  {
    id: 1,
    name: "Red Roses Bouquet - Classic Love",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800",
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviews: 234,
    occasion: "Love & Romance",
    deliveryTime: "Same Day",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Premium Red Roses - Love Special",
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=800",
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviews: 456,
    occasion: "Anniversary",
    deliveryTime: "Same Day",
    tag: "Premium",
  },
  {
    id: 8,
    name: "White Orchids in Vase",
    image: "https://images.unsplash.com/photo-1559087867-ce4c91325525?w=800",
    price: 1299,
    originalPrice: 1699,
    rating: 4.9,
    reviews: 312,
    occasion: "Congratulations",
    deliveryTime: "Same Day",
    tag: "Bestseller",
  },
  {
    id: 11,
    name: "Pink Lilies Bouquet",
    image: "https://images.unsplash.com/photo-1563241412-b80d234e6f3f?w=800",
    price: 999,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 234,
    occasion: "Birthday",
    deliveryTime: "2 Hours",
    tag: "Bestseller",
  },
  {
    id: 15,
    name: "Love Combo - Flowers & Cake",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800",
    price: 1299,
    originalPrice: 1699,
    rating: 4.9,
    reviews: 567,
    occasion: "Anniversary",
    deliveryTime: "Same Day",
    tag: "Combo",
  },
  {
    id: 13,
    name: "Mixed Flowers Celebration",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800",
    price: 1099,
    originalPrice: 1399,
    rating: 4.8,
    reviews: 276,
    occasion: "Celebration",
    deliveryTime: "Same Day",
    tag: "Bestseller",
  },
];

// Flower categories with better images
const flowerCategories = [
  {
    id: "roses",
    name: "Roses",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
    count: "50+ Options",
  },
  {
    id: "orchids",
    name: "Orchids",
    image: "https://images.unsplash.com/photo-1559087867-ce4c91325525?w=400",
    count: "25+ Options",
  },
  {
    id: "carnations",
    name: "Carnations",
    image: "https://images.unsplash.com/photo-1563241424-64c2604073ee?w=400",
    count: "30+ Options",
  },
  {
    id: "lilies",
    name: "Lilies",
    image: "https://images.unsplash.com/photo-1563241412-b80d234e6f3f?w=400",
    count: "35+ Options",
  },
  {
    id: "gerberas",
    name: "Gerberas",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
    count: "40+ Options",
  },
  {
    id: "mixed",
    name: "Mixed Flowers",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400",
    count: "60+ Options",
  },
];

const FlowerLandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleOccasionClick = (occasion) => {
    navigate(`/flower-products?occasion=${occasion}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/flower-products?category=${category}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/flower-product/${productId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/flower-products?search=${searchQuery}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-3">
              <Flower2 className="w-12 h-12" />
              BFS Flowers
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Fresh Flowers Delivered to Your Doorstep in Bangalore
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2 bg-white rounded-full p-2 shadow-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for flowers, occasions, or gifts..."
                  className="flex-1 px-6 py-3 text-gray-900 rounded-full outline-none"
                />
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition-colors flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </form>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { icon: Truck, text: "Same Day Delivery", subtext: "2-4 Hours" },
              { icon: Flower2, text: "Fresh Flowers", subtext: "100% Quality" },
              { icon: Award, text: "5000+ Happy Customers", subtext: "Trusted Service" },
              { icon: Clock, text: "24/7 Support", subtext: "Always Available" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">{stat.text}</p>
                <p className="text-sm opacity-90">{stat.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Occasion
            </h2>
            <p className="text-gray-600 text-lg">
              Find the perfect flowers for every special moment
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {occasions.map((occasion, index) => (
              <motion.div
                key={occasion.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleOccasionClick(occasion.id)}
                className="cursor-pointer group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all group-hover:scale-105">
                  <div
                    className={`${occasion.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <occasion.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-center font-semibold text-gray-900">
                    {occasion.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-pink-600" />
              <h2 className="text-4xl font-bold text-gray-900">
                Trending Flowers
              </h2>
            </div>
            <p className="text-gray-600 text-lg">
              Most loved flowers by our customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleProductClick(product.id)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-2xl transition-all"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Flower";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    % OFF
                  </div>
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {product.deliveryTime}
                  </div>
                  {product.tag && (
                    <div className="absolute bottom-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {product.tag}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {product.occasion}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-pink-600">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all font-semibold">
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/flower-products")}
              className="bg-pink-600 text-white px-8 py-4 rounded-full hover:bg-pink-700 transition-colors text-lg font-semibold"
            >
              View All Flowers
            </button>
          </div>
        </div>
      </section>

      {/* Shop by Flower Type */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Flower Type
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our wide collection of beautiful flowers
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {flowerCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCategoryClick(category.id)}
                className="cursor-pointer group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group-hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200x160?text=" + category.name;
                    }}
                  />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">{category.count}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose BFS Flowers?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Flower2,
                title: "Fresh & Quality",
                description: "100% fresh flowers sourced daily from the best farms",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Same-day and express delivery across Bangalore",
              },
              {
                icon: Gift,
                title: "Custom Arrangements",
                description: "Personalized bouquets for your special moments",
              },
              {
                icon: Award,
                title: "Trusted Service",
                description: "5000+ happy customers and counting",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MapPin className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">
              Delivering Across Bangalore
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Fast and reliable flower delivery to your doorstep
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/flower-products")}
                className="bg-white text-pink-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-lg font-semibold"
              >
                Order Now
              </button>
              <a
                href="https://wa.me/919591572775"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-colors text-lg font-semibold flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FlowerLandingPage;
