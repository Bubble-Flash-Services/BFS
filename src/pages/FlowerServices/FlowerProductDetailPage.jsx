import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Gift,
  Phone,
  MessageCircle,
  Share2,
  Plus,
  Minus,
  ChevronLeft,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";

// Mock product data
const productData = {
  1: {
    id: 1,
    name: "Red Roses Bouquet",
    description: "Fresh red roses beautifully arranged in elegant wrapping",
    longDescription:
      "Express your love with this stunning bouquet of fresh red roses. Each rose is hand-picked and expertly arranged to create a timeless symbol of love and passion. Perfect for anniversaries, Valentine's Day, or any romantic occasion.",
    image: "/services/flowers/bouquet.webp",
    images: [
      "/services/flowers/bouquet.webp",
      "/services/flowers/bouquet.webp",
      "/services/flowers/bouquet.webp",
    ],
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviews: 234,
    occasion: ["Love & Romance", "Anniversary", "Valentine's Day"],
    flowerType: "Roses",
    deliveryTime: "Same Day",
    inStock: true,
    features: [
      "Fresh red roses",
      "Premium quality stems",
      "Elegant wrapping",
      "Free greeting card",
      "Same-day delivery available",
    ],
    care: [
      "Cut stems at an angle",
      "Change water daily",
      "Keep away from direct sunlight",
      "Remove wilted flowers",
    ],
  },
  // Add more products as needed
};

const FlowerProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Get product or use default
  const product = productData[id] || {
    id: parseInt(id),
    name: "Beautiful Flower Bouquet",
    description: "Fresh flowers beautifully arranged",
    longDescription:
      "This stunning bouquet features the finest selection of fresh flowers, expertly arranged to create a memorable gift for any occasion.",
    image: "/services/flowers/bouquet.webp",
    images: ["/services/flowers/bouquet.webp"],
    price: 799,
    originalPrice: 999,
    rating: 4.7,
    reviews: 150,
    occasion: ["Birthday", "Anniversary"],
    flowerType: "Mixed Flowers",
    deliveryTime: "Same Day",
    inStock: true,
    features: [
      "Fresh flowers",
      "Premium quality",
      "Beautiful arrangement",
      "Free greeting card",
      "Same-day delivery",
    ],
    care: [
      "Cut stems at an angle",
      "Change water daily",
      "Keep in cool place",
      "Remove wilted flowers",
    ],
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/");
      return;
    }

    setAddingToCart(true);

    const cartItem = {
      id: `flower-${product.id}-${Date.now()}`,
      type: "flower-product",
      name: product.name,
      serviceName: "flowers",
      image: product.image,
      price: product.price,
      basePrice: product.price,
      originalPrice: product.originalPrice,
      quantity: quantity,
      features: product.features,
      metadata: {
        productId: product.id,
        flowerType: product.flowerType,
        deliveryTime: product.deliveryTime,
      },
    };

    addToCart(cartItem);

    toast.success(`${product.name} added to cart! 🌸`, {
      duration: 3000,
    });

    setTimeout(() => {
      setAddingToCart(false);
      navigate("/cart");
    }, 500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            Home
          </button>
          <span className="text-gray-400">/</span>
          <button
            onClick={() => navigate("/flower-products")}
            className="text-gray-600 hover:text-gray-900"
          >
            Flowers
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/flower-products")}
          className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden mb-4"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400?text=Flower";
                }}
              />
            </motion.div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-4 transition-all ${
                      selectedImage === index
                        ? "border-pink-600"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200x150?text=Flower";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Title and Rating */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">
                    {product.rating}
                  </span>
                  <span className="text-gray-600">({product.reviews} reviews)</span>
                </div>

                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-pink-600">
                    ₹{product.price}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {discount}% OFF
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.longDescription}
                </p>
              </div>

              {/* Occasions */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Perfect For:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.occasion.map((occ, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Truck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Delivery Options
                    </p>
                    <p className="text-gray-700">
                      {product.deliveryTime} delivery available in Bangalore
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Free delivery for distances less than 2 kms
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
                  >
                    <Minus className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="w-16 text-center font-bold text-2xl">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full flex items-center justify-center transition-all"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addingToCart}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>

                <a
                  href="https://wa.me/919591572775"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center justify-center"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
              </div>

              {/* Stock Status */}
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600 mb-6">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">In Stock</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 mb-6">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">Out of Stock</span>
                </div>
              )}

              {/* Features */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  What's Included:
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Care Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🌸 Care Instructions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.care.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700 mt-1">{instruction}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🚚 Delivery Information
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Fast Delivery
                </h3>
                <p className="text-gray-600 text-sm">
                  Same-day and express delivery options available
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Safe Packaging
                </h3>
                <p className="text-gray-600 text-sm">
                  Flowers are carefully packed for safe delivery
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Gift className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Free Message Card
                </h3>
                <p className="text-gray-600 text-sm">
                  Add a personalized message for free
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-xl mb-6 opacity-90">
            Our team is here to help you select the perfect flowers
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919591572775"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition-all text-lg font-semibold flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              WhatsApp Us
            </a>
            <a
              href="tel:+919591572775"
              className="bg-white text-pink-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all text-lg font-semibold flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>
        </motion.div>
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

export default FlowerProductDetailPage;
