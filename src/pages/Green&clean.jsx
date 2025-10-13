import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Shield, Star, Phone, ChevronRight, Sparkles, Home, Sofa, Wrench, Building } from 'lucide-react';
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
        duration: 60,
        basePrice: 499
      },
      {
        id: 'carpet-clean',
        name: 'Carpet Cleaning (Small)',
        bullets: ['Deep vacuum', 'Stain removal', 'Quick dry technology'],
        duration: 90,
        basePrice: 699
      },
      {
        id: 'combo-sofa',
        name: 'Sofa + Carpet Combo',
        bullets: ['3-seater sofa', 'Medium carpet', 'Anti-bacterial treatment'],
        duration: 120,
        basePrice: 999
      }
    ]
  },
  {
    id: 'bathroom-kitchen',
    title: 'Bathroom & Kitchen',
    icon: Wrench,
    description: 'Deep sanitization & degreasing',
    image: '/clean-home.jpg',
    packages: [
      {
        id: 'bathroom-deep',
        name: 'Bathroom Deep Clean',
        bullets: ['Tiles & grout cleaning', 'Sink & fixtures polish', 'Anti-fungal treatment'],
        duration: 60,
        basePrice: 399
      },
      {
        id: 'kitchen-deep',
        name: 'Kitchen Deep Clean',
        bullets: ['Chimney & stove cleaning', 'Counter & cabinets', 'Floor degreasing'],
        duration: 90,
        basePrice: 599
      },
      {
        id: 'both-combo',
        name: 'Kitchen + Bathroom Combo',
        bullets: ['Both rooms deep cleaned', 'Drain cleaning', 'Sanitization included'],
        duration: 150,
        basePrice: 899
      }
    ]
  },
  {
    id: 'office-cleaning',
    title: 'Office Cleaning',
    icon: Building,
    description: 'Professional workspace cleaning',
    image: '/clean-home.jpg',
    packages: [
      {
        id: 'office-basic',
        name: 'Small Office (500 sq ft)',
        bullets: ['Desks & cabinets', 'Floor mopping', 'Washroom cleaning'],
        duration: 120,
        basePrice: 799
      },
      {
        id: 'office-medium',
        name: 'Medium Office (1000 sq ft)',
        bullets: ['Complete workspace', 'Conference room', 'Pantry & washrooms'],
        duration: 180,
        basePrice: 1299
      },
      {
        id: 'office-large',
        name: 'Large Office (2000+ sq ft)',
        bullets: ['All areas', 'Carpet vacuuming', 'Glass & window cleaning'],
        duration: 300,
        basePrice: 2499
      }
    ]
  }
];

export default function GreenCleanPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    address: '', 
    pincode: '',
    scheduledAt: 'immediate',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load services from API on mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await greenAPI.getServices();
      if (response.success) {
        // Group services by category
        const groupedServices = response.data.reduce((acc, service) => {
          if (!acc[service.category]) {
            acc[service.category] = [];
          }
          acc[service.category].push({
            id: service._id,
            name: service.title,
            bullets: service.features || [],
            duration: service.durationMinutes,
            basePrice: service.basePrice
          });
          return acc;
        }, {});
        
        // Update SERVICE_CATEGORIES with real data
        SERVICE_CATEGORIES.forEach(cat => {
          if (groupedServices[cat.id]) {
            cat.packages = groupedServices[cat.id];
          }
        });
        
        setServices(response.data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const openBooking = (pkg, category) => {
    setSelectedPackage({ ...pkg, category: category.title });
    setShowBookingModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare booking data
      const bookingData = {
        serviceName: selectedPackage.name,
        serviceCategory: selectedPackage.category,
        serviceId: selectedPackage.id,
        userName: form.name,
        userPhone: form.phone,
        address: form.address,
        pincode: form.pincode,
        scheduledAt: form.scheduledAt === 'immediate' ? new Date() : null,
        notes: form.notes,
        basePrice: selectedPackage.basePrice
      };

      const response = await greenAPI.createBooking(bookingData);

      if (response.success) {
        // Initialize Razorpay payment
        const options = {
          key: response.data.razorpay.key,
          amount: response.data.razorpay.amount,
          currency: response.data.razorpay.currency,
          order_id: response.data.razorpay.orderId,
          name: 'BFS Green & Clean',
          description: selectedPackage.name,
          image: '/logo.jpg',
          handler: async (razorpayResponse) => {
            // Verify payment
            try {
              const verifyResponse = await greenAPI.verifyPayment(
                response.data.booking.id,
                razorpayResponse
              );

              if (verifyResponse.success) {
                setSubmitted(true);
                toast.success('Booking confirmed! We\'ll call you soon.');
                setTimeout(() => {
                  setShowBookingModal(false);
                  setSubmitted(false);
                  setForm({ name: '', phone: '', address: '', pincode: '', scheduledAt: 'immediate', notes: '' });
                }, 3000);
              } else {
                toast.error('Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: form.name,
            contact: form.phone
          },
          theme: {
            color: '#1F3C88'
          },
          modal: {
            ondismiss: () => {
              setSubmitting(false);
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast.error(response.message || 'Failed to create booking');
      }
    } catch (e) {
      console.error('Booking error:', e);
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1F3C88] via-[#2952A3] to-[#1F3C88] py-16 md:py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 w-96 h-96 bg-[#FFB400] rounded-full opacity-10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -10, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-20 w-80 h-80 bg-[#FFB400] rounded-full opacity-5 blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
            <img src="/logo.jpg" alt="BFS Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg shadow-lg" />
            <div className="text-2xl md:text-3xl font-extrabold leading-tight bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              BFS Green & Clean
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left text-white"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm mb-6">
                <Sparkles className="w-4 h-4 text-[#FFB400]" />
                <span className="font-semibold">Fast, Fresh & Reliable Home Services</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                Book Trusted Cleaning<br />
                <span className="text-[#FFB400]">Services in Bengaluru</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl">
                Professional home and office cleaning at your doorstep. Eco-friendly products, trained staff, instant booking.
              </p>

              <div className="flex flex-wrap gap-4 mb-8 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#FFB400]" />
                  <span>No Hidden Charges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FFB400]" />
                  <span>Same-Day Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FFB400]" />
                  <span>Eco-Friendly Products</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-[#FFB400] text-[#1F3C88] hover:brightness-110 transition-all shadow-lg"
                >
                  Book Now
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a
                  href="tel:+919591572775"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border-2 border-white/70 text-white hover:bg-white/10 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </motion.div>

            {/* Right Side - Quick Book in 2 Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Quick Book in 2 Steps
                </h3>
                <p className="text-white/80 text-sm">
                  Select service → Choose package → Done!
                </p>
              </div>

              <div className="space-y-4">
                {/* Step 1: Select Service Category */}
                <div className="grid grid-cols-2 gap-3">
                  {SERVICE_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className="bg-white/90 hover:bg-white rounded-xl p-4 transition-all group text-left"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <category.icon className="w-5 h-5 text-[#1F3C88]" />
                        <span className="text-xs font-semibold text-[#1F3C88]">STEP 1</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1F3C88] mb-1">
                        {category.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="mt-2 text-[#FFB400] text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Select
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-center text-white/70 text-sm">
                  ✓ Instant pricing • ✓ Same-day service • ✓ Eco-friendly
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F3C88] mb-4">
              Choose Your Service
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select from our range of professional cleaning services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(31, 60, 136, 0.15)" }}
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-2xl p-6 cursor-pointer border border-gray-100 hover:border-[#FFB400] transition-all group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1F3C88] to-[#2952A3] rounded-2xl mb-4 group-hover:scale-110 transition-transform">
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

      {/* Category Packages Modal/Section */}
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
                        <span className="text-gray-500 text-sm">+ distance</span>
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
                      onClick={() => openBooking(pkg, selectedCategory)}
                      className="w-full px-4 py-3 rounded-xl font-semibold bg-[#1F3C88] text-[#FFB400] hover:brightness-110 transition-all mt-auto"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !submitted && setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[95vh] flex flex-col overflow-hidden"
            >
              {submitted ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F3C88] mb-2">Booking Received!</h3>
                  <p className="text-gray-600 mb-4">We'll call you within 30 minutes to confirm your booking.</p>
                  <div className="bg-[#FFB400]/10 rounded-xl p-4 text-sm text-gray-700">
                    <p className="font-semibold mb-1">{selectedPackage.name}</p>
                    <p>Base Price: ₹{selectedPackage.basePrice}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white p-6 flex-shrink-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Complete Booking</h3>
                        <p className="text-sm text-white/80">{selectedPackage.category} - {selectedPackage.name}</p>
                      </div>
                      <button
                        onClick={() => setShowBookingModal(false)}
                        className="text-white hover:text-[#FFB400] text-2xl leading-none"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-4 p-3 bg-white/10 backdrop-blur rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Base Price:</span>
                        <span className="text-xl font-bold text-[#FFB400]">₹{selectedPackage.basePrice}</span>
                      </div>
                      <p className="text-xs text-white/70 mt-1">+ Distance charges (if applicable)</p>
                    </div>
                  </div>

                  <div className="overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFB400] focus:border-transparent outline-none"
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFB400] focus:border-transparent outline-none"
                          placeholder="10-digit mobile"
                          pattern="[0-9]{10}"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                        <textarea
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFB400] focus:border-transparent outline-none"
                          placeholder="House/Flat, Street, Area"
                          rows="2"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                        <input
                          name="pincode"
                          value={form.pincode}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFB400] focus:border-transparent outline-none"
                          placeholder="560001"
                          pattern="[0-9]{6}"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">When do you need service?</label>
                        <select
                          name="scheduledAt"
                          value={form.scheduledAt}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFB400] focus:border-transparent outline-none"
                        >
                          <option value="immediate">Today (Same Day)</option>
                          <option value="tomorrow">Tomorrow</option>
                          <option value="scheduled">Schedule Later</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                        <textarea
                          name="notes"
                          value={form.notes}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFB400] focus:border-transparent outline-none"
                          placeholder="Any specific requirements?"
                          rows="2"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-6 py-4 rounded-xl font-semibold bg-[#1F3C88] text-[#FFB400] hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Submitting...' : 'Confirm Booking'}
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        We'll call to confirm distance charges & final amount before service
                      </p>
                    </form>
                  </div>
                </>
              )}
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
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#1F3C88] to-[#2952A3] text-white rounded-2xl p-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFB400] rounded-2xl mb-4">
                  <feature.icon className="w-8 h-8 text-[#1F3C88]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/90">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1F3C88] to-[#2952A3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for a Sparkling Clean Home?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Book now or call us for instant service across Bengaluru
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-[#FFB400] text-[#1F3C88] hover:brightness-110 transition-all"
            >
              Book a Service
            </a>
            <a
              href="tel:+919591572775"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white/10 transition-all"
            >
              <Phone className="w-5 h-5" />
              +91 95915 72775
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
