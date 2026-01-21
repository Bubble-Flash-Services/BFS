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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Gift,
  Cake,
  Home as HomeIcon,
  Package,
  Users,
  Building,
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

  // All categories from templates
  const allCategories = [
    // Decorations from Template 2
    { id: "all", name: "All Products", icon: Sparkles, type: "all" },
    { id: "birthday-decor", name: "Birthday", icon: Cake, type: "decoration" },
    { id: "anniversary-decor", name: "Anniversary", icon: Heart, type: "decoration" },
    { id: "baby-shower", name: "Baby Shower", icon: Heart, type: "decoration" },
    { id: "baby-welcome", name: "Baby Welcome", icon: Heart, type: "decoration" },
    { id: "bachelorette", name: "Bachelorette", icon: PartyPopper, type: "decoration" },
    { id: "canopy-decor", name: "Canopy Decor", icon: HomeIcon, type: "decoration" },
    { id: "car-boot-decor", name: "Car Boot Decor", icon: PartyPopper, type: "decoration" },
    { id: "ceremony-decor", name: "Ceremony Decor", icon: Sparkles, type: "decoration" },
    { id: "corporate-events", name: "Corporate Events", icon: Building, type: "decoration" },
    { id: "kids-special", name: "Kids Special", icon: PartyPopper, type: "decoration" },
    { id: "proposal-decor", name: "Proposal Decor", icon: Heart, type: "decoration" },
    { id: "room-decor", name: "Room Decor", icon: HomeIcon, type: "decoration" },
    
    // From Template 4
    { id: "flowers", name: "Flowers", icon: Flower2, type: "flower" },
    { id: "cakes", name: "Cakes", icon: Cake, type: "gift" },
    { id: "combos", name: "Combos", icon: Gift, type: "gift" },
    { id: "plants", name: "Plants", icon: Flower2, type: "gift" },
    { id: "hampers", name: "Hampers", icon: Package, type: "gift" },
    { id: "personalised", name: "Personalised", icon: Heart, type: "gift" },
    { id: "chocolates", name: "Chocolates", icon: Gift, type: "gift" },
    { id: "international", name: "International", icon: Sparkles, type: "gift" },
    { id: "birthday-gifts", name: "Birthday Gifts", icon: Gift, type: "gift" },
    { id: "anniversary-gifts", name: "Anniversary Gifts", icon: Heart, type: "gift" },
    { id: "gifts-for-him", name: "Gifts for Him", icon: Users, type: "gift" },
    { id: "gifts-for-her", name: "Gifts for Her", icon: Users, type: "gift" },
  ];

  // Product data organized by category
  const productsByCategory = {
    "birthday-decor": [
      { id: "bday-1", name: "Classic Birthday Decoration", price: 2999, category: "birthday-decor", description: "Perfect birthday setup with balloons" },
      { id: "bday-2", name: "Premium Birthday Theme", price: 3999, category: "birthday-decor", description: "Luxury birthday decoration" },
      { id: "bday-3", name: "Kids Birthday Special", price: 3499, category: "birthday-decor", description: "Colorful kids birthday setup" },
      { id: "bday-4", name: "Adult Birthday Decor", price: 3199, category: "birthday-decor", description: "Elegant adult birthday theme" },
    ],
    "anniversary-decor": [
      { id: "anni-1", name: "Romantic Anniversary Setup", price: 3799, category: "anniversary-decor", description: "Romantic anniversary decoration with roses and candles" },
      { id: "anni-2", name: "Premium Anniversary Theme", price: 4299, category: "anniversary-decor", description: "Luxury anniversary celebration" },
      { id: "anni-3", name: "Golden Anniversary Decor", price: 4899, category: "anniversary-decor", description: "Elegant gold themed setup" },
    ],
    "baby-shower": [
      { id: "baby-shower-1", name: "Baby Shower Blue Theme", price: 3499, category: "baby-shower", description: "Beautiful blue baby shower decoration" },
      { id: "baby-shower-2", name: "Baby Shower Pink Theme", price: 3499, category: "baby-shower", description: "Lovely pink baby shower setup" },
      { id: "baby-shower-3", name: "Gender Neutral Baby Shower", price: 3299, category: "baby-shower", description: "Yellow and white theme" },
    ],
    "baby-welcome": [
      { id: "baby-welcome-1", name: "Baby Welcome Home Decor", price: 2999, category: "baby-welcome", description: "Welcome home decoration for newborn" },
      { id: "baby-welcome-2", name: "Premium Baby Welcome", price: 3499, category: "baby-welcome", description: "Luxury welcome setup" },
    ],
    "bachelorette": [
      { id: "bach-1", name: "Bachelorette Party Decor", price: 3999, category: "bachelorette", description: "Fun bachelorette party setup" },
      { id: "bach-2", name: "Premium Bachelorette Theme", price: 4499, category: "bachelorette", description: "Luxury bachelorette decoration" },
    ],
    "canopy-decor": [
      { id: "canopy-1", name: "Elegant Canopy Setup", price: 4299, category: "canopy-decor", description: "Beautiful canopy decoration" },
      { id: "canopy-2", name: "Premium Canopy Decor", price: 4899, category: "canopy-decor", description: "Luxury canopy with drapes" },
    ],
    "car-boot-decor": [
      { id: "car-1", name: "Car Boot Surprise Decor", price: 1999, category: "car-boot-decor", description: "Perfect car boot decoration" },
      { id: "car-2", name: "Premium Car Boot Setup", price: 2499, category: "car-boot-decor", description: "Luxury car boot surprise" },
    ],
    "ceremony-decor": [
      { id: "ceremony-1", name: "Ceremony Hall Decoration", price: 4999, category: "ceremony-decor", description: "Grand ceremony decoration" },
      { id: "ceremony-2", name: "Premium Ceremony Setup", price: 5999, category: "ceremony-decor", description: "Luxury ceremony theme" },
    ],
    "corporate-events": [
      { id: "corp-1", name: "Corporate Event Decor", price: 5999, category: "corporate-events", description: "Professional corporate setup" },
      { id: "corp-2", name: "Premium Corporate Theme", price: 7999, category: "corporate-events", description: "Luxury corporate decoration" },
    ],
    "kids-special": [
      { id: "kids-1", name: "Cartoon Theme Decor", price: 3499, category: "kids-special", description: "Popular cartoon characters theme" },
      { id: "kids-2", name: "Superhero Theme", price: 3999, category: "kids-special", description: "Superhero party decoration" },
      { id: "kids-3", name: "Princess Theme", price: 3799, category: "kids-special", description: "Magical princess decoration" },
    ],
    "proposal-decor": [
      { id: "prop-1", name: "Romantic Proposal Setup", price: 3999, category: "proposal-decor", description: "Perfect proposal decoration" },
      { id: "prop-2", name: "Premium Proposal Theme", price: 4999, category: "proposal-decor", description: "Luxury proposal setup with lights" },
    ],
    "room-decor": [
      { id: "room-1", name: "Surprise Room Decoration", price: 2499, category: "room-decor", description: "Beautiful room decoration" },
      { id: "room-2", name: "Romantic Room Setup", price: 2999, category: "room-decor", description: "Romantic room decoration" },
      { id: "room-3", name: "Premium Room Decor", price: 3499, category: "room-decor", description: "Luxury room decoration" },
    ],
    "flowers": [
      { id: "flower-1", name: "Red Roses Bouquet", price: 799, category: "flowers", description: "Fresh red roses in elegant wrapping" },
      { id: "flower-2", name: "Mixed Flowers Bouquet", price: 999, category: "flowers", description: "Colorful mix of fresh seasonal flowers" },
      { id: "flower-3", name: "Pink Roses Bouquet", price: 899, category: "flowers", description: "Soft pink roses with beautiful packaging" },
      { id: "flower-4", name: "White Lilies", price: 949, category: "flowers", description: "Elegant white lilies" },
      { id: "flower-5", name: "Orchids Arrangement", price: 1299, category: "flowers", description: "Exotic orchids arrangement" },
      { id: "flower-6", name: "Sunflowers Bouquet", price: 849, category: "flowers", description: "Cheerful sunflowers" },
    ],
    "cakes": [
      { id: "cake-1", name: "Chocolate Cake", price: 699, category: "cakes", description: "Delicious chocolate cake" },
      { id: "cake-2", name: "Vanilla Cake", price: 599, category: "cakes", description: "Classic vanilla cake" },
      { id: "cake-3", name: "Black Forest Cake", price: 799, category: "cakes", description: "Premium black forest" },
      { id: "cake-4", name: "Fruit Cake", price: 749, category: "cakes", description: "Fresh fruit cake" },
    ],
    "combos": [
      { id: "combo-1", name: "Flowers with Cake", price: 1499, category: "combos", description: "Beautiful flowers with delicious cake" },
      { id: "combo-2", name: "Flowers with Chocolates", price: 1299, category: "combos", description: "Fresh flowers with premium chocolates" },
      { id: "combo-3", name: "Flowers & Teddy Bear", price: 1199, category: "combos", description: "Lovely flowers with cute teddy bear" },
    ],
    "plants": [
      { id: "plant-1", name: "Indoor Plant", price: 499, category: "plants", description: "Beautiful indoor plant" },
      { id: "plant-2", name: "Lucky Bamboo", price: 399, category: "plants", description: "Lucky bamboo plant" },
      { id: "plant-3", name: "Money Plant", price: 349, category: "plants", description: "Money plant in pot" },
    ],
    "hampers": [
      { id: "hamper-1", name: "Premium Gift Hamper", price: 1999, category: "hampers", description: "Complete gift hamper" },
      { id: "hamper-2", name: "Chocolate Hamper", price: 1499, category: "hampers", description: "Assorted chocolates hamper" },
    ],
    "personalised": [
      { id: "pers-1", name: "Personalised Photo Frame", price: 799, category: "personalised", description: "Custom photo frame" },
      { id: "pers-2", name: "Personalised Mug", price: 499, category: "personalised", description: "Custom printed mug" },
    ],
    "chocolates": [
      { id: "choc-1", name: "Ferrero Rocher Box", price: 699, category: "chocolates", description: "Premium chocolates" },
      { id: "choc-2", name: "Assorted Chocolates", price: 599, category: "chocolates", description: "Mixed chocolates box" },
    ],
    "international": [
      { id: "intl-1", name: "International Flowers", price: 1999, category: "international", description: "Exotic international flowers" },
      { id: "intl-2", name: "International Gifts", price: 2499, category: "international", description: "Premium international gifts" },
    ],
    "birthday-gifts": [
      { id: "bgift-1", name: "Birthday Special Gift", price: 1299, category: "birthday-gifts", description: "Perfect birthday gift" },
      { id: "bgift-2", name: "Birthday Hamper", price: 1599, category: "birthday-gifts", description: "Complete birthday hamper" },
    ],
    "anniversary-gifts": [
      { id: "agift-1", name: "Anniversary Special", price: 1499, category: "anniversary-gifts", description: "Perfect anniversary gift" },
      { id: "agift-2", name: "Anniversary Combo", price: 1799, category: "anniversary-gifts", description: "Anniversary gift combo" },
    ],
    "gifts-for-him": [
      { id: "him-1", name: "Grooming Kit", price: 1299, category: "gifts-for-him", description: "Premium grooming kit" },
      { id: "him-2", name: "Wallet & Belt Set", price: 1499, category: "gifts-for-him", description: "Leather wallet and belt" },
    ],
    "gifts-for-her": [
      { id: "her-1", name: "Jewellery Set", price: 1999, category: "gifts-for-her", description: "Beautiful jewellery set" },
      { id: "her-2", name: "Perfume Gift Set", price: 1799, category: "gifts-for-her", description: "Premium perfume set" },
    ],
  };

  // Get all products
  const allProducts = Object.values(productsByCategory).flat();

  // Featured carousel items
  const featuredItems = [
    {
      title: "Premium Flower Collection",
      subtitle: "Handpicked fresh flowers delivered to your door",
      image: "/services/flowers/bouquet.webp",
      cta: "Shop Flowers",
      gradient: "from-pink-500 to-rose-500",
      categoryId: "flowers"
    },
    {
      title: "Balloon Decorations",
      subtitle: "Make every celebration memorable",
      image: "/services/flowers/decoration.avif",
      cta: "View Decorations",
      gradient: "from-purple-500 to-indigo-500",
      categoryId: "birthday-decor"
    },
    {
      title: "Gift Combos",
      subtitle: "Perfect gifts for your loved ones",
      image: "/services/flowers/gift-box.png",
      cta: "Explore Gifts",
      gradient: "from-amber-500 to-orange-500",
      categoryId: "combos"
    }
  ];

  const getFilteredProducts = () => {
    if (activeCategory === "all") {
      return allProducts;
    }
    return productsByCategory[activeCategory] || [];
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
      image: "/services/flowers/bouquet.webp",
      price: finalPrice,
      basePrice: product.price,
      originalPrice: product.price,
      discount: discountAmount,
      isFirstTimeBooking: isFirstTimeBooking,
      quantity: quantity,
      features: [product.description],
      serviceCategory: product.category,
      metadata: {
        serviceType: product.category,
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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredItems.length]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSelectedItem(null);
    // Scroll to products section
    window.scrollTo({ top: 650, behavior: "smooth" });
  };

  const handleCarouselCTA = (categoryId) => {
    setActiveCategory(categoryId);
    window.scrollTo({ top: 650, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Carousel */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
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
                    className="text-4xl md:text-6xl font-bold mb-4"
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
                    onClick={() => handleCarouselCTA(featuredItems[currentSlide].categoryId)}
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
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="w-full h-80 flex items-center justify-center text-white text-2xl font-bold">${featuredItems[currentSlide].title}</div>`;
                    }}
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

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Explore Our Categories
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {allCategories.map((cat) => {
              const Icon = cat.icon;
              const productCount = cat.id === "all" ? allProducts.length : (productsByCategory[cat.id]?.length || 0);
              
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all text-center ${
                    activeCategory === cat.id
                      ? "border-pink-500 bg-pink-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-pink-300"
                  }`}
                >
                  <Icon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 ${
                    activeCategory === cat.id ? "text-pink-600" : "text-gray-600"
                  }`} />
                  <h3 className="font-semibold text-gray-900 text-xs md:text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{productCount} items</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {activeCategory === "all" ? "All Products" : allCategories.find(c => c.id === activeCategory)?.name || "Products"}
            <span className="text-gray-500 text-lg ml-2">({filteredProducts.length} items)</span>
          </h3>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedItem(product.id)}
                  className={`bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all ${
                    selectedItem === product.id
                      ? "ring-4 ring-pink-500"
                      : "hover:shadow-2xl"
                  }`}
                >
                  <div className="aspect-square overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="text-4xl md:text-6xl mb-2">
                        {product.category.includes('flower') ? '💐' : 
                         product.category.includes('cake') ? '🎂' : 
                         product.category.includes('plant') ? '🌿' : 
                         product.category === 'chocolates' ? '🍫' : 
                         product.category.includes('gift') ? '🎁' : '🎈'}
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{product.name}</p>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h4 className="font-bold text-gray-900 mb-1 text-sm md:text-base line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-pink-600 font-bold text-base md:text-lg">₹{product.price}</p>
                      {selectedItem === product.id && (
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-pink-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products available in this category</p>
              <button
                onClick={() => handleCategoryClick("all")}
                className="mt-4 text-pink-600 hover:text-pink-700 font-semibold"
              >
                View All Products
              </button>
            </div>
          )}
        </motion.div>

        {/* Add to Cart Section */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-pink-500 shadow-2xl p-4 md:p-6 z-50"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-3xl md:text-4xl bg-gray-100 rounded-lg">
                      {allProducts.find(p => p.id === selectedItem)?.category.includes('flower') ? '💐' : 
                       allProducts.find(p => p.id === selectedItem)?.category.includes('cake') ? '🎂' : 
                       allProducts.find(p => p.id === selectedItem)?.category.includes('plant') ? '🌿' : 
                       allProducts.find(p => p.id === selectedItem)?.category === 'chocolates' ? '🍫' : 
                       allProducts.find(p => p.id === selectedItem)?.category.includes('gift') ? '🎁' : '🎈'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg">
                        {allProducts.find(p => p.id === selectedItem)?.name}
                      </h3>
                      <p className="text-pink-600 font-bold text-lg md:text-xl">
                        ₹{quantity * (allProducts.find(p => p.id === selectedItem)?.price || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2 md:gap-3 bg-gray-100 rounded-full px-3 md:px-4 py-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 md:w-8 md:h-8 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
                      >
                        <Minus className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
                      </button>
                      <span className="w-8 md:w-12 text-center font-semibold text-base md:text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 md:w-8 md:h-8 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all"
                      >
                        <Plus className="h-3 w-3 md:h-4 md:w-4 text-white" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 md:flex-initial bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 md:px-8 py-3 rounded-full font-semibold text-base md:text-lg hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl md:rounded-3xl p-8 md:p-12 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Need Help Choosing the Perfect Gift?
          </h3>
          <p className="text-lg md:text-xl mb-6 md:mb-8 text-white/90">
            Our team is ready to assist you!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-white text-pink-600 px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Browse More
            </button>
            <a
              href="https://wa.me/919591572775"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
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
