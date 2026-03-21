import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";

export default function CategoryModal({ category, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  if (!category) return null;

  // 🧩 Utility to check auth
  const checkAuthAndExecute = (callback) => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    callback();
  };

  // 🧺 Create cart item from category
  const createCartItem = () => {
    return {
      id: `clean-${category._id}-${Date.now()}`,
      serviceId: category._id,
      serviceName: category.title,
      packageName: category.category,
      price: category.basePrice,
      quantity: 1,
      type: "cleaning",
      category: category.category,
      image: category.images?.[0] || "/cleaning-placeholder.jpg",
      packageDetails: {
        basePrice: category.basePrice,
        duration: category.durationMinutes,
        description: category.description,
        features: category.features || [],
      },
    };
  };

  // ➕ Add to cart
  const handleAddToCart = () => {
    checkAuthAndExecute(() => {
      const cartItem = createCartItem();
      addToCart(cartItem);
      toast.success(`${category.title} added to cart! 🧺`, { duration: 2000 });
      onClose();
    });
  };

  // ⚡ Buy now → add to cart + go to checkout
  const handleBuyNow = () => {
    checkAuthAndExecute(() => {
      const cartItem = createCartItem();
      addToCart(cartItem);
      toast.success(`Proceeding to checkout for ${category.title} 💳`, {
        duration: 1500,
      });
      onClose();
      navigate("/cart");
    });
  };

  return (
    <AnimatePresence>
      {category && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white p-6 rounded-t-3xl z-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-[#FFB400]" />
                <div>
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                  <p className="text-white/80 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-[#FFB400] text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-6">
              {/* Image */}
              {category.images?.length > 0 && (
                <div className="w-full">
                  <img
                    src={category.images[0]}
                    alt={category.title}
                    className="w-full rounded-2xl object-cover max-h-64"
                  />
                </div>
              )}

              {/* Duration & Price */}
              <div className="bg-[#1F3C88] rounded-2xl p-6 text-white text-center shadow-lg">
                <h4 className="text-xl font-bold mb-2">Duration & Price</h4>
                <p className="text-lg">
                  {category.durationMinutes} minutes – ₹{category.basePrice}
                </p>
              </div>

              {/* Features */}
              {category.features?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h4 className="text-xl font-bold text-[#1F3C88] mb-4 text-center">
                    Features
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {category.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#FFB400] mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-4 rounded-xl font-semibold bg-[#1F3C88] text-[#FFB400] hover:brightness-110 transition-all"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-4 rounded-xl font-semibold bg-[#FFB400] text-[#1F3C88] hover:brightness-110 transition-all"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
