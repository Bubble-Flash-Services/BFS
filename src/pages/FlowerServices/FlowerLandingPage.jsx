import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Flower2,
  Heart,
  Phone,
  ShoppingCart,
  PartyPopper,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Gift,
  Cake,
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

  // Constants
  const PRODUCTS_SECTION_OFFSET = 650;

  // Helper function to get emoji for product category
  const getProductEmoji = (category) => {
    if (category.includes("rose") || category.includes("flower")) return "💐";
    if (category.includes("birthday")) return "🎂";
    if (category.includes("anniversary") || category.includes("romantic"))
      return "❤️";
    if (category.includes("baby")) return "👶";
    if (category.includes("party")) return "🎉";
    return "🎈";
  };

  // Flower Categories (5)
  const flowerCategories = [
    {
      id: "roses",
      name: "Roses",
      icon: "🌹",
      image:
        "https://png.pngtree.com/png-clipart/20250124/original/pngtree-luxurious-red-rose-bouquet-tied-with-satin-ribbon-png-image_20326684.png",
      description: "Fresh rose bouquets",
    },
    {
      id: "mixed-flowers",
      name: "Mixed Flowers",
      icon: "💐",
      image:
        "https://png.pngtree.com/png-clipart/20241112/original/pngtree-flower-bouquet-png-image_16936472.png",
      description: "Colorful flower arrangements",
    },
    {
      id: "premium-flowers",
      name: "Premium Flowers",
      icon: "🌺",
      image:
        "https://static.vecteezy.com/system/resources/previews/044/570/491/non_2x/vibrant-bouquet-of-mixed-flowers-wrapped-in-brown-paper-and-tied-with-blue-ribbon-on-transparent-background-png.png",
      description: "Luxury flower collections",
    },
    {
      id: "exotic-flowers",
      name: "Exotic Flowers",
      icon: "🌸",
      image:
        "https://i.pinimg.com/originals/2a/88/03/2a88036caf6b42d073d025f820376f0b.png",
      description: "Rare and beautiful blooms",
    },
    {
      id: "seasonal-flowers",
      name: "Seasonal Flowers",
      icon: "🌻",
      image:
        "https://png.pngtree.com/png-vector/20250408/ourmid/pngtree-hand-holding-beautiful-bouquet-of-fresh-colorful-blooming-tulips-png-image_15941493.png",
      description: "Fresh seasonal picks",
    },
  ];

  // Decoration Categories (5)
  const decorationCategories = [
    {
      id: "birthday-decor",
      name: "Birthday",
      icon: "🎂",
      image:
        "https://ae01.alicdn.com/kf/Sffed5964e4004876907fc357a50f6122k.jpg",
      description: "Birthday party decorations",
    },
    {
      id: "anniversary-decor",
      name: "Anniversary",
      icon: "❤️",
      image:
        "https://storage.googleapis.com/shy-pub/337348/1701802123782_SKU-0327_0.jpg",
      description: "Romantic anniversary setups",
    },
    {
      id: "baby-celebration",
      name: "Baby Celebration",
      icon: "👶",
      image:
        "https://bubbletrouble.in/wp-content/uploads/2024/02/71vlzXMhhqL._SL1500_.jpg",
      description: "Baby shower & welcome",
    },
    {
      id: "romantic-decor",
      name: "Romantic Decor",
      icon: "💕",
      image: "https://cheetah.cherishx.com/uploads/1575968344_large.jpg",
      description: "Romantic surprises",
    },
    {
      id: "party-decor",
      name: "Party Decor",
      icon: "🎉",
      image:
        "https://cdn.shopify.com/s/files/1/2690/0106/files/Birthday_1_480x480.jpg?v=1712321554",
      description: "General party themes",
    },
  ];

  // Product data
  const productsByCategory = {
    roses: [
      {
        id: "rose-1",
        name: "Red Roses Bouquet",
        price: 799,
        category: "roses",
        description: "Classic red roses - 12 stems",
        image: "https://via.placeholder.com/400x300?text=Red+Roses+Bouquet",
      },
      {
        id: "rose-2",
        name: "Pink Roses Bouquet",
        price: 899,
        category: "roses",
        description: "Soft pink roses - 12 stems",
        image: "https://via.placeholder.com/400x300?text=Pink+Roses+Bouquet",
      },
      {
        id: "rose-3",
        name: "White Roses Bouquet",
        price: 849,
        category: "roses",
        description: "Pure white roses - 12 stems",
        image: "https://via.placeholder.com/400x300?text=White+Roses+Bouquet",
      },
      {
        id: "rose-4",
        name: "Yellow Roses Bouquet",
        price: 799,
        category: "roses",
        description: "Cheerful yellow roses - 12 stems",
        image: "https://via.placeholder.com/400x300?text=Yellow+Roses+Bouquet",
      },
      {
        id: "rose-5",
        name: "Orange Roses Bouquet",
        price: 949,
        category: "roses",
        description: "Vibrant orange roses - 12 stems",
        image: "https://via.placeholder.com/400x300?text=Orange+Roses+Bouquet",
      },
      {
        id: "rose-6",
        name: "Premium Rose Arrangement",
        price: 1499,
        category: "roses",
        description: "Luxury mixed roses - 24 stems",
        image: "https://via.placeholder.com/400x300?text=Premium+Rose+Arrangement",
      },
    ],
    "mixed-flowers": [
      {
        id: "mixed-1",
        name: "Seasonal Mix",
        price: 999,
        category: "mixed-flowers",
        description: "Colorful seasonal flowers",
        image: "https://via.placeholder.com/400x300?text=Seasonal+Mix",
      },
      {
        id: "mixed-2",
        name: "Garden Fresh Mix",
        price: 1099,
        category: "mixed-flowers",
        description: "Fresh garden flowers",
        image: "https://via.placeholder.com/400x300?text=Garden+Fresh+Mix",
      },
      {
        id: "mixed-3",
        name: "Spring Collection",
        price: 1199,
        category: "mixed-flowers",
        description: "Beautiful spring blooms",
        image: "https://via.placeholder.com/400x300?text=Spring+Collection",
      },
      {
        id: "mixed-4",
        name: "Summer Delight",
        price: 1149,
        category: "mixed-flowers",
        description: "Bright summer flowers",
        image: "https://via.placeholder.com/400x300?text=Summer+Delight",
      },
    ],
    "premium-flowers": [
      {
        id: "premium-1",
        name: "Orchid Arrangement",
        price: 1499,
        category: "premium-flowers",
        description: "Elegant orchid display",
        image: "https://via.placeholder.com/400x300?text=Orchid+Arrangement",
      },
      {
        id: "premium-2",
        name: "Lily Paradise",
        price: 1399,
        category: "premium-flowers",
        description: "Premium lily bouquet",
        image: "https://via.placeholder.com/400x300?text=Lily+Paradise",
      },
      {
        id: "premium-3",
        name: "Tulip Collection",
        price: 1599,
        category: "premium-flowers",
        description: "Imported tulips",
        image: "https://via.placeholder.com/400x300?text=Tulip+Collection",
      },
      {
        id: "premium-4",
        name: "Designer Bouquet",
        price: 1999,
        category: "premium-flowers",
        description: "Exclusive designer arrangement",
        image: "https://via.placeholder.com/400x300?text=Designer+Bouquet",
      },
    ],
    "exotic-flowers": [
      {
        id: "exotic-1",
        name: "Bird of Paradise",
        price: 1799,
        category: "exotic-flowers",
        description: "Exotic tropical flowers",
        image: "https://via.placeholder.com/400x300?text=Bird+of+Paradise",
      },
      {
        id: "exotic-2",
        name: "Anthurium Arrangement",
        price: 1699,
        category: "exotic-flowers",
        description: "Stunning anthurium display",
        image: "https://via.placeholder.com/400x300?text=Anthurium+Arrangement",
      },
      {
        id: "exotic-3",
        name: "Protea Collection",
        price: 1899,
        category: "exotic-flowers",
        description: "Unique protea flowers",
        image: "https://via.placeholder.com/400x300?text=Protea+Collection",
      },
    ],
    "seasonal-flowers": [
      {
        id: "seasonal-1",
        name: "Sunflower Bunch",
        price: 899,
        category: "seasonal-flowers",
        description: "Cheerful sunflowers",
        image: "https://via.placeholder.com/400x300?text=Sunflower+Bunch",
      },
      {
        id: "seasonal-2",
        name: "Daisy Collection",
        price: 749,
        category: "seasonal-flowers",
        description: "Fresh daisies",
        image: "https://via.placeholder.com/400x300?text=Daisy+Collection",
      },
      {
        id: "seasonal-3",
        name: "Carnation Mix",
        price: 799,
        category: "seasonal-flowers",
        description: "Colorful carnations",
        image: "https://via.placeholder.com/400x300?text=Carnation+Mix",
      },
      {
        id: "seasonal-4",
        name: "Gerbera Bouquet",
        price: 949,
        category: "seasonal-flowers",
        description: "Vibrant gerberas",
        image: "https://via.placeholder.com/400x300?text=Gerbera+Bouquet",
      },
    ],
    "birthday-decor": [
      {
        id: "bday-1",
        name: "Classic Birthday Setup",
        price: 2999,
        category: "birthday-decor",
        description: "Perfect birthday decoration",
        image: "https://via.placeholder.com/400x300?text=Classic+Birthday+Setup",
      },
      {
        id: "bday-2",
        name: "Kids Birthday Special",
        price: 3499,
        category: "birthday-decor",
        description: "Colorful kids party setup",
        image: "https://via.placeholder.com/400x300?text=Kids+Birthday+Special",
      },
      {
        id: "bday-3",
        name: "Premium Birthday Theme",
        price: 3999,
        category: "birthday-decor",
        description: "Luxury birthday decoration",
        image: "https://via.placeholder.com/400x300?text=Premium+Birthday+Theme",
      },
      {
        id: "bday-4",
        name: "Adult Birthday Decor",
        price: 3199,
        category: "birthday-decor",
        description: "Elegant adult party",
        image: "https://via.placeholder.com/400x300?text=Adult+Birthday+Decor",
      },
    ],
    "anniversary-decor": [
      {
        id: "anni-1",
        name: "Romantic Anniversary",
        price: 3799,
        category: "anniversary-decor",
        description: "Rose petals & candles",
        image: "https://via.placeholder.com/400x300?text=Romantic+Anniversary",
      },
      {
        id: "anni-2",
        name: "Golden Anniversary",
        price: 4899,
        category: "anniversary-decor",
        description: "Elegant gold theme",
        image: "https://via.placeholder.com/400x300?text=Golden+Anniversary",
      },
      {
        id: "anni-3",
        name: "Premium Anniversary",
        price: 4299,
        category: "anniversary-decor",
        description: "Luxury celebration setup",
        image: "https://via.placeholder.com/400x300?text=Premium+Anniversary",
      },
    ],
    "baby-celebration": [
      {
        id: "baby-1",
        name: "Baby Shower Blue",
        price: 3499,
        category: "baby-celebration",
        description: "Beautiful blue theme",
        image: "https://via.placeholder.com/400x300?text=Baby+Shower+Blue",
      },
      {
        id: "baby-2",
        name: "Baby Shower Pink",
        price: 3499,
        category: "baby-celebration",
        description: "Lovely pink theme",
        image: "https://via.placeholder.com/400x300?text=Baby+Shower+Pink",
      },
      {
        id: "baby-3",
        name: "Baby Welcome Home",
        price: 2999,
        category: "baby-celebration",
        description: "Welcome decoration",
        image: "https://via.placeholder.com/400x300?text=Baby+Welcome+Home",
      },
      {
        id: "baby-4",
        name: "Gender Neutral Theme",
        price: 3299,
        category: "baby-celebration",
        description: "Yellow & white setup",
        image: "https://via.placeholder.com/400x300?text=Gender+Neutral+Theme",
      },
    ],
    "romantic-decor": [
      {
        id: "romantic-1",
        name: "Proposal Setup",
        price: 3999,
        category: "romantic-decor",
        description: "Perfect proposal decoration",
        image: "https://via.placeholder.com/400x300?text=Proposal+Setup",
      },
      {
        id: "romantic-2",
        name: "Romantic Room Decor",
        price: 2999,
        category: "romantic-decor",
        description: "Romantic room setup",
        image: "https://via.placeholder.com/400x300?text=Romantic+Room+Decor",
      },
      {
        id: "romantic-3",
        name: "Premium Proposal",
        price: 4999,
        category: "romantic-decor",
        description: "Luxury proposal with lights",
        image: "https://via.placeholder.com/400x300?text=Premium+Proposal",
      },
      {
        id: "romantic-4",
        name: "Surprise Room Setup",
        price: 2499,
        category: "romantic-decor",
        description: "Beautiful surprise room",
        image: "https://via.placeholder.com/400x300?text=Surprise+Room+Setup",
      },
    ],
    "party-decor": [
      {
        id: "party-1",
        name: "Simple Party Hall",
        price: 2999,
        category: "party-decor",
        description: "Clean party setup",
        image: "https://via.placeholder.com/400x300?text=Simple+Party+Hall",
      },
      {
        id: "party-2",
        name: "Premium Party Theme",
        price: 3999,
        category: "party-decor",
        description: "Luxury party decoration",
        image: "https://via.placeholder.com/400x300?text=Premium+Party+Theme",
      },
      {
        id: "party-3",
        name: "Balloon Decoration",
        price: 1999,
        category: "party-decor",
        description: "Colorful balloon setup",
        image: "https://via.placeholder.com/400x300?text=Balloon+Decoration",
      },
      {
        id: "party-4",
        name: "Event Hall Decor",
        price: 4999,
        category: "party-decor",
        description: "Complete hall decoration",
        image: "https://via.placeholder.com/400x300?text=Event+Hall+Decor",
      },
    ],
  };

  // Get all products
  const allProducts = Object.values(productsByCategory).flat();

  // Featured carousel items
  const featuredItems = [
    {
      title: "Beautiful Flower Bouquets",
      subtitle: "Fresh flowers delivered to your door",
      image: "/services/flowers/bouquet.webp",
      gradient: "from-pink-500 to-rose-500",
      categoryId: "roses",
    },
    {
      title: "Stunning Decorations",
      subtitle: "Make every celebration memorable",
      image: "/services/flowers/decoration.avif",
      gradient: "from-purple-500 to-indigo-500",
      categoryId: "birthday-decor",
    },
    {
      title: "Gift Combos",
      subtitle: "Perfect gifts for loved ones",
      image: "/services/flowers/gift-box.png",
      gradient: "from-amber-500 to-orange-500",
      categoryId: "roses",
    },
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

    const product = allProducts.find((p) => p.id === selectedItem);
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
    setCurrentSlide(
      (prev) => (prev - 1 + featuredItems.length) % featuredItems.length,
    );
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
    window.scrollTo({ top: PRODUCTS_SECTION_OFFSET, behavior: "smooth" });
  };

  const getCategoryName = () => {
    if (activeCategory === "all") return "All Products";
    const flowerCat = flowerCategories.find((c) => c.id === activeCategory);
    if (flowerCat) return flowerCat.name;
    const decorCat = decorationCategories.find((c) => c.id === activeCategory);
    if (decorCat) return decorCat.name;
    return "Products";
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
                    onClick={() =>
                      window.scrollTo({
                        top: PRODUCTS_SECTION_OFFSET,
                        behavior: "smooth",
                      })
                    }
                    className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
                  >
                    Shop Now
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
                      e.target.style.display = "none";
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

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
        {/* Flowers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Flower2 className="w-8 h-8 text-pink-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Flower Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            {flowerCategories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group relative overflow-hidden rounded-2xl transition-all ${
                  activeCategory === cat.id
                    ? "ring-4 ring-pink-500 shadow-2xl"
                    : "hover:shadow-xl"
                }`}
              >
                <div className="aspect-square relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML += `<div class="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-6xl">${cat.icon}</div>`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                    <p className="text-xs opacity-90">{cat.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Decorations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <PartyPopper className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Decoration Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            {decorationCategories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group relative overflow-hidden rounded-2xl transition-all ${
                  activeCategory === cat.id
                    ? "ring-4 ring-purple-500 shadow-2xl"
                    : "hover:shadow-xl"
                }`}
              >
                <div className="aspect-square relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML += `<div class="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center text-6xl">${cat.icon}</div>`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                    <p className="text-xs opacity-90">{cat.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* View All Button */}
        {activeCategory !== "all" && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => handleCategoryClick("all")}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {getCategoryName()}
            <span className="text-gray-500 text-lg ml-2">
              ({filteredProducts.length} items)
            </span>
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
                  <div className="aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : null}
                    <div className="text-center p-4 absolute">
                      <div className="text-4xl md:text-6xl mb-2">
                        {getProductEmoji(product.category)}
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        {product.name}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h4 className="font-bold text-gray-900 mb-1 text-sm md:text-base line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-pink-600 font-bold text-base md:text-lg">
                        ₹{product.price}
                      </p>
                      {selectedItem === product.id && (
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-pink-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
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
              <p className="text-gray-500 text-lg">No products available</p>
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
                      {getProductEmoji(
                        allProducts.find((p) => p.id === selectedItem)
                          ?.category || "",
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg">
                        {allProducts.find((p) => p.id === selectedItem)?.name}
                      </h3>
                      <p className="text-pink-600 font-bold text-lg md:text-xl">
                        ₹
                        {quantity *
                          (allProducts.find((p) => p.id === selectedItem)
                            ?.price || 0)}
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
          transition={{ delay: 0.6 }}
          className="text-center bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl md:rounded-3xl p-8 md:p-12 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Need Help Choosing?
          </h3>
          <p className="text-lg md:text-xl mb-6 md:mb-8 text-white/90">
            Our team is ready to assist you!
          </p>
          <a
            href="https://wa.me/919591572775"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-green-600 transition-all shadow-xl"
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5" />
            WhatsApp Us
          </a>
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
