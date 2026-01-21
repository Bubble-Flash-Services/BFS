import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  Search,
  ShoppingCart,
  Clock,
  Truck,
  Heart,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";

// Mock product data - In real scenario, this would come from API
// This data matches our seed file structure
const allProducts = [
  {
    id: 1,
    name: "Red Roses Bouquet - Classic Love",
    description: "A timeless expression of love with 12 fresh red roses",
    image: "https://via.placeholder.com/800x600?text=Red+Roses+Bouquet",
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviews: 234,
    occasion: ["love", "anniversary", "valentine"],
    flowerType: "roses",
    deliveryTime: "same-day",
    inStock: true,
    isBestseller: true,
  },
  {
    id: 2,
    name: "Premium Red Roses - Love Special",
    description: "Stunning arrangement of 24 premium red roses",
    image: "https://via.placeholder.com/800x600?text=Premium+Red+Roses",
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviews: 456,
    occasion: ["love", "anniversary", "proposal"],
    flowerType: "roses",
    deliveryTime: "same-day",
    inStock: true,
    isBestseller: true,
  },
  {
    id: 3,
    name: "Pink & White Roses Bouquet",
    description: "Delicate combination of 6 pink and 6 white roses",
    image: "https://via.placeholder.com/800x600?text=Pink+White+Roses",
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 189,
    occasion: ["birthday", "thank-you"],
    flowerType: "roses",
    deliveryTime: "2-hours",
    inStock: true,
  },
  {
    id: 4,
    name: "Yellow Roses - Sunshine Bright",
    description: "Cheerful yellow roses bouquet bringing warmth",
    image: "https://via.placeholder.com/800x600?text=Yellow+Roses",
    price: 749,
    originalPrice: 949,
    rating: 4.6,
    reviews: 167,
    occasion: ["friendship", "congratulations", "get-well-soon"],
    flowerType: "roses",
    deliveryTime: "same-day",
    inStock: true,
  },
  {
    id: 5,
    name: "Mixed Roses Bouquet - Rainbow",
    description: "Vibrant mix of colorful roses creating a rainbow effect",
    image: "https://via.placeholder.com/800x600?text=Mixed+Roses+Bouquet",
    price: 1099,
    originalPrice: 1399,
    rating: 4.8,
    reviews: 298,
    occasion: ["birthday", "congratulations", "celebration"],
    flowerType: "roses",
    deliveryTime: "same-day",
    inStock: true,
    isBestseller: true,
  },
  {
    id: 6,
    name: "Red Carnations Bouquet",
    description: "Beautiful arrangement of fresh red carnations",
    image: "https://via.placeholder.com/800x600?text=Red+Carnations",
    price: 649,
    originalPrice: 849,
    rating: 4.5,
    reviews: 145,
    occasion: ["love", "mother-day"],
    flowerType: "carnations",
    deliveryTime: "same-day",
    inStock: true,
  },
  {
    id: 7,
    name: "Pink Carnations Delight",
    description: "Soft pink carnations perfect for expressing admiration",
    image: "https://via.placeholder.com/800x600?text=Pink+Carnations",
    price: 699,
    originalPrice: 899,
    rating: 4.6,
    reviews: 178,
    occasion: ["birthday", "mother-day"],
    flowerType: "carnations",
    deliveryTime: "4-hours",
    inStock: true,
  },
  {
    id: 8,
    name: "White Orchids in Vase",
    description: "Elegant white orchid plant in decorative ceramic vase",
    image: "https://via.placeholder.com/800x600?text=White+Orchids",
    price: 1299,
    originalPrice: 1699,
    rating: 4.9,
    reviews: 312,
    occasion: ["anniversary", "congratulations", "corporate"],
    flowerType: "orchids",
    deliveryTime: "same-day",
    inStock: true,
    isBestseller: true,
  },
  {
    id: 9,
    name: "Purple Orchids Elegance",
    description: "Exotic purple orchids in elegant pot arrangement",
    image: "https://via.placeholder.com/800x600?text=Purple+Orchids",
    price: 1399,
    originalPrice: 1799,
    rating: 4.8,
    reviews: 267,
    occasion: ["birthday", "anniversary"],
    flowerType: "orchids",
    deliveryTime: "same-day",
    inStock: true,
  },
  {
    id: 10,
    name: "Elegant White Lilies",
    description: "Pure white lilies symbolizing peace and purity",
    image: "https://via.placeholder.com/800x600?text=White+Lilies",
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 201,
    occasion: ["sympathy", "get-well-soon"],
    flowerType: "lilies",
    deliveryTime: "same-day",
    inStock: true,
  },
  {
    id: 11,
    name: "Pink Lilies Bouquet",
    description: "Beautiful pink lilies with complementing green fillers",
    image: "https://via.placeholder.com/800x600?text=Pink+Lilies",
    price: 999,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 234,
    occasion: ["birthday", "celebration"],
    flowerType: "lilies",
    deliveryTime: "2-hours",
    inStock: true,
    isBestseller: true,
  },
  {
    id: 12,
    name: "Gerbera Happiness Bouquet",
    description: "Cheerful mix of colorful gerberas bringing joy",
    image: "https://via.placeholder.com/800x600?text=Gerbera+Flowers",
    price: 749,
    originalPrice: 949,
    rating: 4.6,
    reviews: 189,
    occasion: ["birthday", "get-well-soon"],
    flowerType: "gerberas",
    deliveryTime: "same-day",
    inStock: true,
  },
  {
    id: 13,
    name: "Mixed Flowers Celebration",
    description: "Vibrant mix of roses, carnations, and gerberas",
    image: "https://via.placeholder.com/800x600?text=Mixed+Flowers+Celebration",
    price: 1099,
    originalPrice: 1399,
    rating: 4.8,
    reviews: 276,
    occasion: ["birthday", "congratulations", "celebration"],
    flowerType: "mixed",
    deliveryTime: "same-day",
    inStock: true,
    isBestseller: true,
  },
  {
    id: 14,
    name: "Premium Mixed Flower Basket",
    description: "Luxurious basket arrangement with exotic flowers",
    image: "https://via.placeholder.com/800x600?text=Premium+Flower+Basket",
    price: 1799,
    originalPrice: 2299,
    rating: 4.9,
    reviews: 401,
    occasion: ["corporate", "grand-opening"],
    flowerType: "mixed",
    deliveryTime: "4-hours",
    inStock: true,
    isBestseller: true,
  },
  {
    id: 15,
    name: "Love Combo - Flowers & Cake",
    description: "12 red roses with 500gm chocolate cake",
    image: "https://via.placeholder.com/800x600?text=Flowers+Cake+Combo",
    price: 1299,
    originalPrice: 1699,
    rating: 4.9,
    reviews: 567,
    occasion: ["birthday", "anniversary", "love"],
    flowerType: "roses",
    deliveryTime: "same-day",
    inStock: true,
    isBestseller: true,
    isCombo: true,
  },
  {
    id: 16,
    name: "Birthday Special Combo",
    description: "Mixed flowers with 500gm cake and greeting card",
    image: "https://via.placeholder.com/800x600?text=Birthday+Special+Combo",
    price: 1399,
    originalPrice: 1799,
    rating: 4.8,
    reviews: 432,
    occasion: ["birthday"],
    flowerType: "mixed",
    deliveryTime: "same-day",
    inStock: true,
    isBestseller: true,
    isCombo: true,
  },
  {
    id: 17,
    name: "Teddy Bear & Roses Combo",
    description: "12 red roses with cute teddy bear and chocolates",
    image: "https://via.placeholder.com/800x600?text=Teddy+Roses+Combo",
    price: 1499,
    originalPrice: 1899,
    rating: 4.8,
    reviews: 389,
    occasion: ["love", "anniversary", "valentine"],
    flowerType: "roses",
    deliveryTime: "same-day",
    inStock: true,
    isBestseller: true,
    isCombo: true,
  },
  {
    id: 18,
    name: "Grand 50 Red Roses Bouquet",
    description: "Spectacular arrangement of 50 premium red roses",
    image: "https://via.placeholder.com/800x600?text=50+Red+Roses",
    price: 2999,
    originalPrice: 3999,
    rating: 5.0,
    reviews: 234,
    occasion: ["proposal", "grand-gesture"],
    flowerType: "roses",
    deliveryTime: "4-hours",
    inStock: true,
    isBestseller: true,
    isPremium: true,
  },
  {
    id: 19,
    name: "100 Red Roses - Ultimate Love",
    description: "The ultimate expression of love with 100 premium red roses",
    image: "https://via.placeholder.com/800x600?text=100+Red+Roses",
    price: 4999,
    originalPrice: 6999,
    rating: 5.0,
    reviews: 156,
    occasion: ["proposal", "grand-gesture"],
    flowerType: "roses",
    deliveryTime: "6-hours",
    inStock: true,
    isPremium: true,
  },
  {
    id: 20,
    name: "Sunflower Happiness Bouquet",
    description: "Bright sunflowers bringing warmth and positivity",
    image: "https://images.unsplash.com/photo-1597848212624-e530854ad7f6?w=800",
    price: 799,
    originalPrice: 999,
    rating: 4.7,
    reviews: 198,
    occasion: ["birthday", "get-well-soon"],
    flowerType: "mixed",
    deliveryTime: "same-day",
    inStock: true,
  },
];

const FlowerProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedOccasions, setSelectedOccasions] = useState(
    searchParams.get("occasion") ? [searchParams.get("occasion")] : []
  );
  const [selectedFlowerTypes, setSelectedFlowerTypes] = useState(
    searchParams.get("category") ? [searchParams.get("category")] : []
  );
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Filter options
  const occasions = [
    { id: "birthday", name: "Birthday" },
    { id: "anniversary", name: "Anniversary" },
    { id: "love", name: "Love & Romance" },
    { id: "congratulations", name: "Congratulations" },
    { id: "get-well-soon", name: "Get Well Soon" },
    { id: "thank-you", name: "Thank You" },
    { id: "sympathy", name: "Sympathy" },
    { id: "valentine", name: "Valentine's Day" },
  ];

  const flowerTypes = [
    { id: "roses", name: "Roses" },
    { id: "orchids", name: "Orchids" },
    { id: "carnations", name: "Carnations" },
    { id: "lilies", name: "Lilies" },
    { id: "gerberas", name: "Gerberas" },
    { id: "mixed", name: "Mixed Flowers" },
  ];

  const deliveryTimes = [
    { id: "2-hours", name: "2 Hours" },
    { id: "4-hours", name: "4 Hours" },
    { id: "same-day", name: "Same Day" },
    { id: "next-day", name: "Next Day" },
  ];

  const sortOptions = [
    { id: "popularity", name: "Most Popular" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "rating", name: "Highest Rated" },
    { id: "newest", name: "Newest First" },
  ];

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Occasion filter
    if (selectedOccasions.length > 0) {
      filtered = filtered.filter((p) =>
        p.occasion.some((o) => selectedOccasions.includes(o))
      );
    }

    // Flower type filter
    if (selectedFlowerTypes.length > 0) {
      filtered = filtered.filter((p) =>
        selectedFlowerTypes.includes(p.flowerType)
      );
    }

    // Delivery time filter
    if (selectedDeliveryTime.length > 0) {
      filtered = filtered.filter((p) =>
        selectedDeliveryTime.includes(p.deliveryTime)
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const toggleFilter = (filterArray, setFilterArray, value) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter((v) => v !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedOccasions([]);
    setSelectedFlowerTypes([]);
    setSelectedDeliveryTime([]);
    setPriceRange([0, 3000]);
    setSearchQuery("");
  };

  const handleProductClick = (productId) => {
    navigate(`/flower-product/${productId}`);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">All Flowers</h1>
          <p className="text-lg opacity-90">
            Browse our collection of beautiful flowers for every occasion
          </p>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="flex gap-2 bg-white rounded-full p-2 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flowers..."
                className="flex-1 px-4 py-2 text-gray-900 rounded-full outline-none"
              />
              <button className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter and Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
            >
              <Filter className="w-5 h-5" />
              <span className="font-semibold">Filters</span>
              {(selectedOccasions.length > 0 ||
                selectedFlowerTypes.length > 0 ||
                selectedDeliveryTime.length > 0) && (
                <span className="bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedOccasions.length +
                    selectedFlowerTypes.length +
                    selectedDeliveryTime.length}
                </span>
              )}
            </button>

            {(selectedOccasions.length > 0 ||
              selectedFlowerTypes.length > 0 ||
              selectedDeliveryTime.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="text-pink-600 hover:text-pink-700 font-semibold text-sm"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {filteredProducts.length} products
            </span>

            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-semibold">
                  {sortOptions.find((s) => s.id === sortBy)?.name}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          sortBy === option.id ? "bg-pink-50 text-pink-600" : ""
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-80 flex-shrink-0"
              >
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Occasion Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Occasion</h4>
                    <div className="space-y-2">
                      {occasions.map((occasion) => (
                        <label
                          key={occasion.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedOccasions.includes(occasion.id)}
                            onChange={() =>
                              toggleFilter(
                                selectedOccasions,
                                setSelectedOccasions,
                                occasion.id
                              )
                            }
                            className="w-4 h-4 text-pink-600 rounded"
                          />
                          <span className="text-gray-700">{occasion.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Flower Type Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Flower Type</h4>
                    <div className="space-y-2">
                      {flowerTypes.map((type) => (
                        <label
                          key={type.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFlowerTypes.includes(type.id)}
                            onChange={() =>
                              toggleFilter(
                                selectedFlowerTypes,
                                setSelectedFlowerTypes,
                                type.id
                              )
                            }
                            className="w-4 h-4 text-pink-600 rounded"
                          />
                          <span className="text-gray-700">{type.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Time Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Delivery Time</h4>
                    <div className="space-y-2">
                      {deliveryTimes.map((time) => (
                        <label
                          key={time.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDeliveryTime.includes(time.id)}
                            onChange={() =>
                              toggleFilter(
                                selectedDeliveryTime,
                                setSelectedDeliveryTime,
                                time.id
                              )
                            }
                            className="w-4 h-4 text-pink-600 rounded"
                          />
                          <span className="text-gray-700">{time.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Price Range</h4>
                    <div className="space-y-3">
                      {/* Single slider for max price - common UX pattern for filtering products up to a price */}
                      <input
                        type="range"
                        min="0"
                        max="3000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([0, parseInt(e.target.value)])
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-600 mb-4">No products found</p>
                <button
                  onClick={clearAllFilters}
                  className="text-pink-600 hover:text-pink-700 font-semibold"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => handleProductClick(product.id)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-2xl transition-all"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=Flower";
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </div>
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {product.deliveryTime === "2-hours"
                          ? "2 Hours"
                          : product.deliveryTime === "4-hours"
                          ? "4 Hours"
                          : "Same Day"}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-pink-600">
                            ₹{product.price}
                          </span>
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ₹{product.originalPrice}
                          </span>
                        </div>
                        <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all font-semibold text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
  );
};

export default FlowerProductsPage;
