import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Gift,
  Cake,
  Home as HomeIcon,
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";

const FlowerLandingPage = () => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Product data with local images as fallback
  const products = {
    decorations: [
      {
        id: "rose-candles-decoration",
        name: "Rose and Candles Decoration",
        category: "Balloon Decorations",
        subcategory: "Romantic",
        price: 3799,
        image: "/services/flowers/decoration.avif",
        description: "Romantic rose petals with candle decoration",
        features: ["Rose petals", "Candles", "Romantic setup"]
      },
      {
        id: "birthday-party-decoration",
        name: "Birthday Party Decoration",
        category: "Balloon Decorations",
        subcategory: "Birthday",
        price: 3999,
        image: "/services/flowers/decoration.avif",
        description: "Fun birthday themed party setup"
      },
      {
        id: "theme-decoration",
        name: "Theme Party Decoration",
        category: "Balloon Decorations",
        subcategory: "Birthday",
        price: 3399,
        image: "/services/flowers/decoration.avif",
        description: "Cute themed party decoration"
      },
      {
        id: "gold-hall-decoration",
        name: "Gold Hall Decoration",
        category: "Balloon Decorations",
        subcategory: "Premium",
        price: 4899,
        image: "/services/flowers/decoration.avif",
        description: "Elegant gold themed hall decoration"
      },
      {
        id: "kids-birthday-decoration",
        name: "Kids Birthday Decoration",
        category: "Balloon Decorations",
        subcategory: "Birthday",
        price: 3499,
        image: "/services/flowers/decoration.avif",
        description: "Special themed birthday decoration for kids"
      },
      {
        id: "simple-party-hall",
        name: "Simple Party Hall",
        category: "Balloon Decorations",
        subcategory: "Budget",
        price: 2999,
        image: "/services/flowers/decoration.avif",
        description: "Clean and simple party hall setup"
      },
      {
        id: "birthday-event-decoration",
        name: "Birthday Event Decoration",
        category: "Balloon Decorations",
        subcategory: "Birthday",
        price: 3199,
        image: "/services/flowers/decoration.avif",
        description: "Complete birthday event decoration"
      },
      {
        id: "special-occasion-balloon",
        name: "Special Occasion Setup",
        category: "Balloon Decorations",
        subcategory: "Premium",
        price: 2699,
        image: "/services/flowers/decoration.avif",
        description: "Special balloon setup for any occasion"
      },
      {
        id: "surprise-room-decoration",
        name: "Surprise Room Decoration",
        category: "Balloon Decorations",
        subcategory: "Romantic",
        price: 2499,
        image: "/services/flowers/decoration.avif",
        description: "Surprise room decoration with balloons"
      },
      {
        id: "luxury-room-decor",
        name: "Luxury Room Decor",
        category: "Balloon Decorations",
        subcategory: "Premium",
        price: 4299,
        image: "/services/flowers/decoration.avif",
        description: "Luxury style room decoration"
      },
      {
        id: "room-decoration-balloons",
        name: "Room Decoration with Balloons",
        category: "Balloon Decorations",
        subcategory: "Budget",
        price: 1999,
        image: "/services/flowers/decoration.avif",
        description: "Beautiful room decoration with colorful balloons"
      },
      {
        id: "circular-decoration",
        name: "Circular Style Decoration",
        category: "Balloon Decorations",
        subcategory: "Budget",
        price: 1699,
        image: "/services/flowers/decoration.avif",
        description: "Circular ring style balloon decoration"
      }
    ],
    flowers: [
      {
        id: "red-roses-bouquet",
        name: "Red Roses Bouquet",
        category: "Fresh Flowers",
        subcategory: "Roses",
        price: 799,
        image: "/services/flowers/bouquet.webp",
        description: "Fresh red roses in elegant wrapping",
        features: ["12 Red Roses", "Premium wrapping", "Free greeting card"]
      },
      {
        id: "mixed-flowers-bouquet",
        name: "Mixed Flowers Bouquet",
        category: "Fresh Flowers",
        subcategory: "Mixed",
        price: 999,
        image: "/services/flowers/bouquet.webp",
        description: "Colorful mix of fresh seasonal flowers"
      },
      {
        id: "pink-roses-bouquet",
        name: "Pink Roses Bouquet",
        category: "Fresh Flowers",
        subcategory: "Roses",
        price: 899,
        image: "/services/flowers/bouquet.webp",
        description: "Soft pink roses with beautiful packaging"
      },
      {
        id: "yellow-flowers-bouquet",
        name: "Yellow Flowers Bouquet",
        category: "Fresh Flowers",
        subcategory: "Mixed",
        price: 849,
        image: "/services/flowers/bouquet.webp",
        description: "Bright yellow flowers for cheerful moments"
      },
      {
        id: "white-flowers-bouquet",
        name: "White Flowers Bouquet",
        category: "Fresh Flowers",
        subcategory: "Premium",
        price: 899,
        image: "/services/flowers/bouquet.webp",
        description: "Pure white flowers in premium wrapping"
      },
      {
        id: "orange-roses-bouquet",
        name: "Orange Roses Bouquet",
        category: "Fresh Flowers",
        subcategory: "Roses",
        price: 949,
        image: "/services/flowers/bouquet.webp",
        description: "Vibrant orange roses arrangement"
      },
      {
        id: "purple-flowers-bouquet",
        name: "Purple Flowers Bouquet",
        category: "Fresh Flowers",
        subcategory: "Premium",
        price: 999,
        image: "/services/flowers/bouquet.webp",
        description: "Elegant purple flowers bouquet"
      },
      {
        id: "premium-mixed-bouquet",
        name: "Premium Mixed Bouquet",
        category: "Fresh Flowers",
        subcategory: "Premium",
        price: 1299,
        image: "/services/flowers/bouquet.webp",
        description: "Luxurious mix of premium flowers"
      },
      {
        id: "exotic-flowers-bouquet",
        name: "Exotic Flowers Bouquet",
        category: "Fresh Flowers",
        subcategory: "Premium",
        price: 1499,
        image: "/services/flowers/bouquet.webp",
        description: "Exotic imported flowers arrangement"
      },
      {
        id: "classic-red-roses",
        name: "Classic Red Roses",
        category: "Fresh Flowers",
        subcategory: "Roses",
        price: 749,
        image: "/services/flowers/bouquet.webp",
        description: "Classic dozen red roses"
      },
      {
        id: "sunflowers-bouquet",
        name: "Sunflowers Bouquet",
        category: "Fresh Flowers",
        subcategory: "Mixed",
        price: 899,
        image: "/services/flowers/bouquet.webp",
        description: "Cheerful sunflowers arrangement"
      },
      {
        id: "pastel-flowers-mix",
        name: "Pastel Flowers Mix",
        category: "Fresh Flowers",
        subcategory: "Mixed",
        price: 949,
        image: "/services/flowers/bouquet.webp",
        description: "Soft pastel colored flowers"
      }
    ],
    gifts: [
      {
        id: "flowers-with-cake",
        name: "Flowers with Cake",
        category: "Gift Combos",
        subcategory: "Combo",
        price: 1499,
        image: "/services/flowers/gift-box.png",
        description: "Beautiful flowers with delicious cake"
      },
      {
        id: "flowers-with-chocolate",
        name: "Flowers with Chocolates",
        category: "Gift Combos",
        subcategory: "Combo",
        price: 1299,
        image: "/services/flowers/gift-box.png",
        description: "Fresh flowers with premium chocolates"
      },
      {
        id: "flowers-teddy-combo",
        name: "Flowers & Teddy Bear",
        category: "Gift Combos",
        subcategory: "Combo",
        price: 1199,
        image: "/services/flowers/gift-box.png",
        description: "Lovely flowers with cute teddy bear"
      },
      {
        id: "premium-gift-hamper",
        name: "Premium Gift Hamper",
        category: "Gift Combos",
        subcategory: "Premium",
        price: 1999,
        image: "/services/flowers/gift-box.png",
        description: "Complete gift hamper with flowers and goodies"
      }
    ]
  };

  const allProducts = [...products.decorations, ...products.flowers, ...products.gifts];

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Products", icon: Sparkles, count: allProducts.length },
    { id: "flowers", name: "Fresh Flowers", icon: Flower2, count: products.flowers.length },
    { id: "decorations", name: "Decorations", icon: PartyPopper, count: products.decorations.length },
    { id: "gifts", name: "Gift Combos", icon: Gift, count: products.gifts.length },
  ];

  // Subcategories for filtering
  const subcategories = {
    flowers: ["All", "Roses", "Mixed", "Premium"],
    decorations: ["All", "Birthday", "Romantic", "Premium", "Budget"],
    gifts: ["All", "Combo", "Premium"]
  };

  const [activeSubcategory, setActiveSubcategory] = useState("All");

  // Featured carousel items
  const featuredItems = [
    {
      title: "Premium Flower Collection",
      subtitle: "Handpicked fresh flowers delivered to your door",
      image: "/services/flowers/bouquet.webp",
      cta: "Shop Flowers",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Balloon Decorations",
      subtitle: "Make every celebration memorable",
      image: "/services/flowers/decoration.avif",
      cta: "View Decorations",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Gift Combos",
      subtitle: "Perfect gifts for your loved ones",
      image: "/services/flowers/gift-box.png",
      cta: "Explore Gifts",
      gradient: "from-amber-500 to-orange-500"
    }
  ];

  const getFilteredProducts = () => {
    let filtered = allProducts;
    
    if (activeCategory !== "all") {
      if (activeCategory === "flowers") {
        filtered = products.flowers;
      } else if (activeCategory === "decorations") {
        filtered = products.decorations;
      } else if (activeCategory === "gifts") {
        filtered = products.gifts;
      }
    }

    if (activeSubcategory !== "All") {
      filtered = filtered.filter(p => p.subcategory === activeSubcategory);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

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

    const isFirstTimeBooking = !user?.totalOrders || user.totalOrders === 0;
    const firstTimeDiscount = isFirstTimeBooking ? 0.15 : 0;
    const discountAmount = Math.round(product.price * firstTimeDiscount);
    const finalPrice = product.price - discountAmount;

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
      features: product.features || [product.description],
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  // Auto-rotate carousel
  React.useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Carousel */}
      <div className="relative h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-r ${featuredItems[currentSlide].gradient}`}
          >
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
              <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                <div className="text-white">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-bold mb-4"
                  >
                    {featuredItems[currentSlide].title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-2xl mb-8 text-white/90"
                  >
                    {featuredItems[currentSlide].subtitle}
                  </motion.p>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
                    className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
                  >
                    {featuredItems[currentSlide].cta}
                  </motion.button>
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="hidden md:block"
                >
                  <img
                    src={featuredItems[currentSlide].image}
                    alt={featuredItems[currentSlide].title}
                    className="w-full h-80 object-contain drop-shadow-2xl"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {featuredItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveSubcategory("All");
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    activeCategory === cat.id
                      ? "border-pink-500 bg-pink-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-pink-300"
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${
                    activeCategory === cat.id ? "text-pink-600" : "text-gray-600"
                  }`} />
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.count} items</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Subcategory Filters */}
        {activeCategory !== "all" && subcategories[activeCategory] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-wrap gap-3"
          >
            {subcategories[activeCategory].map((subcat) => (
              <button
                key={subcat}
                onClick={() => setActiveSubcategory(subcat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeSubcategory === subcat
                    ? "bg-pink-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-pink-300"
                }`}
              >
                {subcat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {activeCategory === "all" ? "All Products" : categories.find(c => c.id === activeCategory)?.name}
            <span className="text-gray-500 text-lg ml-2">({filteredProducts.length} items)</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedItem(product.id)}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all ${
                  selectedItem === product.id
                    ? "ring-4 ring-pink-500"
                    : "hover:shadow-2xl"
                }`}
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/logo.png";
                    }}
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                    {product.subcategory}
                  </span>
                  <h4 className="font-bold text-gray-900 mt-2 mb-1 text-sm md:text-base line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-600 font-bold text-lg">₹{product.price}</p>
                      {product.features && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-500">4.8</span>
                        </div>
                      )}
                    </div>
                    {selectedItem === product.id && (
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-pink-500 shadow-2xl p-6 z-50"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={allProducts.find(p => p.id === selectedItem)?.image}
                      alt="Selected"
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/logo.png";
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {allProducts.find(p => p.id === selectedItem)?.name}
                      </h3>
                      <p className="text-pink-600 font-bold text-xl">
                        ₹{quantity * (allProducts.find(p => p.id === selectedItem)?.price || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all"
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-gray-500 hover:text-gray-700 p-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <MapPin className="w-12 h-12 text-pink-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free Delivery</h3>
            <p className="text-gray-600">Free delivery for distances less than 2 kms</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <Sparkles className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600">100% fresh flowers and quality decorations</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <Phone className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Always here to help with your orders</p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl p-12 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">
            Need Help Choosing the Perfect Gift?
          </h3>
          <p className="text-xl mb-8 text-white/90">
            Our team is ready to assist you!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Browse More
            </button>
            <a
              href="https://wa.me/919591572775"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-600 transition-all flex items-center gap-2 shadow-xl"
            >
              <Phone className="w-5 h-5" />
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating Cart Button */}
      {getCartItemCount() > 0 && !selectedItem && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => navigate("/cart")}
          className="fixed bottom-6 right-6 bg-pink-600 text-white p-4 rounded-full shadow-2xl hover:bg-pink-700 transition-all z-40"
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

export default FlowerLandingPage;
