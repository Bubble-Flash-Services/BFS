import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { MapPin, Clock, Shield, Star, Phone, ChevronRight, Sparkles, Home, Sofa, Wrench, Building, ShoppingCart } from 'lucide-react';
import { greenAPI } from '../api/greenClean';
import toast from 'react-hot-toast';

// Service categories with packages
const SERVICE_CATEGORIES = [
  {
    id: 'home-cleaning',
    title: 'Home Cleaning',
    icon: Home,
    description: 'Deep cleaning for your entire home',
    image: '/clean-home.jpg',
    packages: [
      {
        id: 'basic-home',
        name: '1BHK Basic Clean',
        bullets: ['Living room & bedroom', 'Kitchen counters', 'Bathroom sanitization'],
        duration: 120,
        basePrice: 599
      },
      {
        id: 'deep-home',
        name: '2BHK Deep Clean',
        bullets: ['All rooms deep cleaned', 'Kitchen appliances', 'Balcony & windows'],
        duration: 180,
        basePrice: 999
      },
      {
        id: 'premium-home',
        name: '3BHK Premium Clean',
        bullets: ['Complete home deep clean', 'Eco-friendly products', 'Free kitchen degreasing'],
        duration: 240,
        basePrice: 1499
      }
    ]
  },
  {
    id: 'sofa-carpet',
    title: 'Sofa & Carpet',
    icon: Sofa,
    description: 'Professional upholstery cleaning',
    image: '/clean-home.jpg',
    packages: [
      {
        id: 'sofa-basic',
        name: '3-Seater Sofa Clean',
        bullets: ['Stain removal', 'Fabric protection', 'Odor treatment'],
        duration: 90,
        basePrice: 499
      },
      {
        id: 'carpet-medium',
        name: 'Medium Carpet Clean (6x9 ft)',
        bullets: ['Deep vacuum', 'Stain treatment', 'Quick dry process'],
        duration: 60,
        basePrice: 699
      },
      {
        id: 'combo-sofa-carpet',
        name: 'Sofa + Carpet Combo',
        bullets: ['3-seater sofa + carpet', 'Fabric protection spray', 'Anti-bacterial treatment'],
        duration: 150,
        basePrice: 999
      }
    ]
  },
  {
    id: 'bathroom-kitchen',
    title: 'Bathroom & Kitchen',
    icon: Wrench,
    description: 'Specialized deep cleaning',
    image: '/clean-home.jpg',
    packages: [
      {
        id: 'bathroom-basic',
        name: '1 Bathroom Deep Clean',
        bullets: ['Tiles & grout scrubbing', 'Sanitization', 'Drain cleaning'],
        duration: 60,
        basePrice: 399
      },
      {
        id: 'kitchen-deep',
        name: 'Kitchen Deep Clean',
        bullets: ['Chimney & stove', 'Cabinet cleaning', 'Platform degreasing'],
        duration: 90,
        basePrice: 599
      },
      {
        id: 'bath-kitchen-combo',
        name: '2 Bathrooms + Kitchen',
        bullets: ['Complete bathroom cleaning', 'Kitchen appliances', 'Anti-bacterial treatment'],
        duration: 150,
        basePrice: 899
      }
    ]
  },
  {
    id: 'office-cleaning',
    title: 'Office Cleaning',
    icon: Building,
    description: 'Professional office maintenance',
    image: '/clean-home.jpg',
    packages: [
      {
        id: 'office-small',
        name: 'Small Office (up to 500 sq ft)',
        bullets: ['Workstations & desks', 'Meeting room', 'Pantry cleaning'],
        duration: 120,
        basePrice: 799
      },
      {
        id: 'office-medium',
        name: 'Medium Office (500-1000 sq ft)',
        bullets: ['Complete office cleaning', 'Conference rooms', 'Washroom sanitization'],
        duration: 180,
        basePrice: 1299
      },
      {
        id: 'office-large',
        name: 'Large Office (1000+ sq ft)',
        bullets: ['Full office deep clean', 'All amenities', 'Post-clean report'],
        duration: 240,
        basePrice: 2499
      }
    ]
  }
];

export default function GreenCleanCart() {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load services from API
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await greenAPI.getServices();
      if (response.success) {
        setServices(response.data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (pkg, category) => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    // Create cart item matching the existing cart structure
    const cartItem = {
      id: `green-${pkg.id}-${Date.now()}`,
      type: 'green-clean',
      category: category.title,
      name: pkg.name,
      image: category.image,
      price: pkg.basePrice,
      basePrice: pkg.basePrice,
      quantity: 1,
      duration: pkg.duration,
      features: pkg.bullets,
      serviceCategory: category.title,
      // Store additional metadata for order creation
      metadata: {
        categoryId: category.id,
        packageId: pkg.id,
        description: category.description
      }
    };

    addToCart(cartItem);
    toast.success(`${pkg.name} added to cart!`, {
      icon: '🧹',
      duration: 2000
    });
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-[#FFB400]" />
                <span className="text-[#FFB400] font-semibold">BFS Green & Clean</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Book Trusted Cleaning Services in Bengaluru
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Professional deep cleaning for homes, offices & more. Same-day service available!
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-4 py-2">
                  <Shield className="w-5 h-5 text-[#FFB400]" />
                  <span className="text-sm">Verified Cleaners</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-4 py-2">
                  <Star className="w-5 h-5 text-[#FFB400]" />
                  <span className="text-sm">Eco-Friendly</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg px-4 py-2">
                  <Clock className="w-5 h-5 text-[#FFB400]" />
                  <span className="text-sm">Same Day Service</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Quick Select (2 Steps) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-2">Quick Book in 2 Steps</h3>
              <p className="text-white/80 text-sm mb-6">Choose your service category</p>
              
              <div className="grid grid-cols-2 gap-4">
                {SERVICE_CATEGORIES.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl p-4 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <category.icon className="w-6 h-6 text-[#FFB400]" />
                      <span className="text-xs font-semibold text-[#FFB400]">STEP 1</span>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{category.title}</h4>
                    <p className="text-xs text-white/70">{category.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shopping Cart Badge */}
      {getCartItemCount() > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => navigate('/cart')}
          className="fixed bottom-8 right-8 z-50 bg-[#FFB400] text-[#1F3C88] rounded-full p-4 shadow-2xl hover:scale-110 transition-transform"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-[#1F3C88] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {getCartItemCount()}
            </span>
          </div>
        </motion.button>
      )}

      {/* Service Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F3C88] mb-4">
              Our Cleaning Services
            </h2>
            <p className="text-gray-600 text-lg">
              Professional cleaning solutions for every need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-[#FFB400]"
              >
                <div className="bg-gradient-to-br from-[#1F3C88] to-[#2952A3] rounded-xl p-4 mb-4 inline-block">
                  <category.icon className="w-8 h-8 text-[#FFB400]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F3C88] mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-[#FFB400] font-semibold text-sm group-hover:gap-2 transition-all">
                  View Packages
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Packages Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white p-6 rounded-t-3xl z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <selectedCategory.icon className="w-8 h-8 text-[#FFB400]" />
                    <div>
                      <h3 className="text-2xl font-bold">{selectedCategory.title}</h3>
                      <p className="text-white/80 text-sm">{selectedCategory.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-white hover:text-[#FFB400] text-3xl leading-none transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCategory.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#FFB400] hover:shadow-lg transition-all flex flex-col"
                  >
                    <div className="mb-4">
                      <h4 className="text-xl font-bold text-[#1F3C88] mb-2">{pkg.name}</h4>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-3xl font-bold text-[#FFB400]">₹{pkg.basePrice}</span>
                        <span className="text-gray-500 text-sm">base price</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{pkg.duration} minutes</span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6 flex-grow">
                      {pkg.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-[#FFB400] mt-1">✓</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleAddToCart(pkg, selectedCategory)}
                      className="w-full px-4 py-3 rounded-xl font-semibold bg-[#1F3C88] text-[#FFB400] hover:brightness-110 transition-all mt-auto flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {user ? 'Add to Cart' : 'Login to Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F3C88] mb-4">
              Why Choose BFS Green & Clean?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verified Professionals',
                description: 'All our cleaners are background-verified and trained'
              },
              {
                icon: Star,
                title: 'Eco-Friendly Products',
                description: 'Safe, non-toxic cleaning solutions for your family'
              },
              {
                icon: Clock,
                title: 'On-Time Service',
                description: 'Same-day service available across Bengaluru'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-[#1F3C88] to-[#2952A3] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-[#FFB400]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F3C88] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for a Sparkling Clean Space?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Add services to cart and proceed to checkout
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/cart')}
              className="px-8 py-4 bg-[#FFB400] text-[#1F3C88] rounded-xl font-semibold hover:brightness-110 transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              View Cart ({getCartItemCount()})
            </button>
            <a
              href="tel:+918660290303"
              className="px-8 py-4 bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call: 8660290303
            </a>
          </div>
        </div>
      </section>

      {/* Coverage Area */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5 text-[#1F3C88]" />
            <span className="font-medium">
              Serving: Koramangala, Indiranagar, Whitefield, Jayanagar, HSR Layout & more across Bengaluru
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
