import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Shield, 
  Star, 
  Phone, 
  ChevronRight, 
  Sparkles, 
  Package,
  Check,
  X,
  Calculator,
  TrendingUp
} from 'lucide-react';
import { getMoversPackersServices, calculatePrice } from '../api/moversPackers';
import toast from 'react-hot-toast';

const MoversPackersPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [distance, setDistance] = useState(5);
  const [priceCalculation, setPriceCalculation] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);

  // Distance charge constants
  const DISTANCE_CHARGE_20_30KM = 350;
  const DISTANCE_CHARGE_PER_KM_ABOVE_30 = 10;

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await getMoversPackersServices();
      if (response.success) {
        setServices(response.data);
      } else {
        toast.error('Failed to load services');
        loadMockData();
      }
    } catch (error) {
      console.error('Error loading services:', error);
      // Load mock data for demo when API is unavailable
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    // Mock data for demonstration
    const mockServices = [
      {
        _id: '1',
        itemType: 'bike',
        name: 'Bike Shifting',
        icon: '🏍️',
        description: 'Professional bike shifting service with complete protection and safe transport',
        basePrice: 1299,
        baseDistance: 5,
        includes: [
          'Foam sheet packing',
          'Bubble wrap',
          'Tank & handle protection',
          'Rope lock inside vehicle',
          'Loading + transport + unloading'
        ],
        notIncludes: ['Bike repair', 'Fuel refill', 'Mechanical issues'],
        howItsDone: 'Wrap → Load → Tie → Transport → Unload → Handover',
        sortOrder: 1
      },
      {
        _id: '2',
        itemType: 'scooty',
        name: 'Scooty Shifting',
        icon: '🛵',
        description: 'Safe and secure scooty transportation with proper packing',
        basePrice: 1199,
        baseDistance: 5,
        includes: [
          'Full wrap packing',
          'Side panel protection',
          'Loading + unloading',
          'Mini-truck transport'
        ],
        notIncludes: ['Dent removal', 'Electrical issues'],
        howItsDone: 'Scooty is padded, loaded, tied using straps, and delivered safely.',
        sortOrder: 2
      },
      {
        _id: '3',
        itemType: 'fridge',
        name: 'Fridge Shifting',
        icon: '🧊',
        description: 'Single/Double Door fridge shifting with upright transport',
        basePrice: 1899,
        baseDistance: 5,
        includes: [
          'Bubble + stretch wrap',
          'Upright transport only',
          '2–3 helpers',
          'Placement in kitchen'
        ],
        notIncludes: ['Gas refill', 'Cooling repair'],
        howItsDone: 'Wrap → Carry with 2 helpers → Load upright → Transport → Place properly.',
        sortOrder: 3
      },
      {
        _id: '4',
        itemType: 'washing-machine',
        name: 'Washing Machine Shifting',
        icon: '🧼',
        description: 'Safe washing machine transportation with proper packaging',
        basePrice: 1299,
        baseDistance: 5,
        includes: ['Foam wrap', 'Drum lock', 'Transport', 'Loading + unloading'],
        notIncludes: ['Pipe installation', 'Machine repair'],
        howItsDone: 'Secure → Wrap → Load → Transport → Unload.',
        sortOrder: 4
      },
      {
        _id: '5',
        itemType: 'sofa',
        name: 'Sofa Shifting',
        icon: '🛋️',
        description: '3–5 Seater sofa shifting with complete protection',
        basePrice: 2299,
        baseDistance: 5,
        includes: [
          'Bubble wrap + foam',
          'Corner protection',
          'Manual lifting',
          'Door-to-door transport'
        ],
        notIncludes: ['Sofa repair', 'Dismantling (extra)'],
        howItsDone: 'Wrap → Protect corners → Lift carefully → Load → Deliver.',
        sortOrder: 5
      },
      {
        _id: '6',
        itemType: 'tv',
        name: 'TV Shifting',
        icon: '📺',
        description: 'LED/Smart TV shifting with screen protection',
        basePrice: 899,
        baseDistance: 5,
        includes: [
          'Bubble wrap',
          'Screen protection sheet',
          'Cardboard frame',
          'Transport'
        ],
        notIncludes: ['Wall mounting', 'Screen replacement'],
        howItsDone: 'TV wrapped like a sandwich panel → Cardboard edges → Load → Deliver.',
        sortOrder: 6
      },
      {
        _id: '7',
        itemType: 'mattress',
        name: 'Mattress Shifting',
        icon: '🛏',
        description: 'Single/Double/Queen/King mattress shifting',
        basePrice: 699,
        baseDistance: 5,
        includes: ['Mattress cover / plastic wrap', 'Transport', 'Loading + unloading'],
        notIncludes: ['Mattress cleaning', 'Mold treatment'],
        howItsDone: 'Cover → Roll/flat carry → Transport → Deliver.',
        sortOrder: 7
      },
      {
        _id: '8',
        itemType: 'cupboard',
        name: 'Cupboard Shifting',
        icon: '🚪',
        description: 'Steel/Wooden cupboard shifting service',
        basePrice: 1499,
        baseDistance: 5,
        includes: ['Full wrap', 'Shelf taping', 'Lifting & loading', 'Transport', 'Unloading'],
        notIncludes: ['Inside item packing', 'Door repair'],
        howItsDone: 'Empty → Wrap → Tie → Load → Deliver safely.',
        sortOrder: 8
      },
      {
        _id: '9',
        itemType: 'table',
        name: 'Table Shifting',
        icon: '🪑',
        description: 'Office / Dining / Study table shifting',
        basePrice: 799,
        baseDistance: 5,
        includes: ['Table wrap', 'Edge protection', 'Transport', 'Loading + unloading'],
        notIncludes: ['Table repair', 'Disassembling (extra)'],
        howItsDone: 'Wrap → Lift → Load → Transport → Unload carefully.',
        sortOrder: 9
      }
    ];
    setServices(mockServices);
  };

  const handleCalculatePrice = async (service) => {
    try {
      const response = await calculatePrice(service._id, distance);
      if (response.success) {
        setPriceCalculation(response.data);
        setSelectedService(service);
        setShowCalculator(true);
      } else {
        // Fallback to manual calculation
        calculatePriceManually(service);
      }
    } catch (error) {
      console.error('Error calculating price:', error);
      // Fallback to manual calculation when API is unavailable
      calculatePriceManually(service);
    }
  };

  const calculatePriceManually = (service) => {
    let totalPrice = service.basePrice;
    let distanceCharge = 0;

    if (distance > service.baseDistance) {
      if (distance <= 10) {
        distanceCharge = 150;
      } else if (distance <= 20) {
        distanceCharge = 250;
      } else if (distance <= 30) {
        distanceCharge = DISTANCE_CHARGE_20_30KM;
      } else {
        distanceCharge = DISTANCE_CHARGE_20_30KM + (distance - 30) * DISTANCE_CHARGE_PER_KM_ABOVE_30;
      }
      totalPrice += distanceCharge;
    }

    setPriceCalculation({
      serviceId: service._id,
      serviceName: service.name,
      basePrice: service.basePrice,
      distance,
      distanceCharge,
      totalPrice
    });
    setSelectedService(service);
    setShowCalculator(true);
  };

  const getDistanceChargeDisplay = () => {
    if (distance <= 5) return 'Base price (0-5 km)';
    if (distance <= 10) return '+₹150 (5-10 km)';
    if (distance <= 20) return '+₹250 (10-20 km)';
    if (distance <= 30) return `+₹${DISTANCE_CHARGE_20_30KM} (20-30 km)`;
    return `+₹${DISTANCE_CHARGE_20_30KM + (distance - 30) * DISTANCE_CHARGE_PER_KM_ABOVE_30} (30+ km @ ₹${DISTANCE_CHARGE_PER_KM_ABOVE_30}/km)`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative z-10 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Package className="h-12 w-12 text-white mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              BFS Item Shifting Services
            </h1>
          </div>
          <p className="text-xl text-white/90 mb-2">
            Category B – All Items
          </p>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Bike, Scooty, Fridge, Washing Machine, Sofa, TV, Mattress, Cupboard, Table
          </p>
          <p className="text-2xl text-white font-semibold mt-4">
            📍 Local Bangalore
          </p>
        </motion.div>
      </section>

      {/* Distance Charges Info */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            🛣️ Distance Charges (All Items)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">5-10 km</p>
              <p className="text-xl font-bold text-blue-600">+₹150</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">10-20 km</p>
              <p className="text-xl font-bold text-blue-600">+₹250</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">20-30 km</p>
              <p className="text-xl font-bold text-blue-600">+₹350</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">30+ km</p>
              <p className="text-xl font-bold text-blue-600">₹10/km</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Service Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-5xl">{service.icon}</span>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                      {service.sortOrder}. {service.itemType.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                  <p className="text-white/90 text-sm">{service.description}</p>
                </div>

                {/* Pricing */}
                <div className="p-6 border-b">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">₹{service.basePrice}</span>
                      <span className="text-gray-600 ml-2">(0-{service.baseDistance} km)</span>
                    </div>
                  </div>
                </div>

                {/* Includes */}
                <div className="p-6 border-b">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Includes
                  </h4>
                  <ul className="space-y-2">
                    {service.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="text-green-500 mr-2">✔</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not Includes */}
                <div className="p-6 border-b">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    Not Includes
                  </h4>
                  <ul className="space-y-2">
                    {service.notIncludes.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="text-red-500 mr-2">❌</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How It's Done */}
                <div className="p-6 border-b bg-blue-50">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    How It's Done
                  </h4>
                  <p className="text-sm text-gray-700">{service.howItsDone}</p>
                </div>

                {/* Action Button */}
                <div className="p-6">
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setShowCalculator(true);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center"
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate Price
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Calculator Modal */}
      <AnimatePresence>
        {showCalculator && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCalculator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Price Calculator</h3>
                <button
                  onClick={() => setShowCalculator(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{selectedService.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedService.name}</h4>
                    <p className="text-sm text-gray-600">Base: ₹{selectedService.basePrice}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {getDistanceChargeDisplay()}
                </p>
              </div>

              <button
                onClick={() => handleCalculatePrice(selectedService)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center mb-4"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Calculate Total
              </button>

              {priceCalculation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="font-semibold">₹{priceCalculation.basePrice}</span>
                    </div>
                    {priceCalculation.distanceCharge > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Distance Charge:</span>
                        <span className="font-semibold">+₹{priceCalculation.distanceCharge}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-semibold">{priceCalculation.distance} km</span>
                    </div>
                    <div className="border-t border-green-300 pt-2 flex justify-between">
                      <span className="font-bold text-gray-900">Total Price:</span>
                      <span className="font-bold text-green-600 text-xl">
                        ₹{priceCalculation.totalPrice}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Indicators */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Safe & Secure</h3>
              <p className="text-sm text-gray-600">Insured transport</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900">On Time</h3>
              <p className="text-sm text-gray-600">Punctual service</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-12 w-12 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Professional</h3>
              <p className="text-sm text-gray-600">Trained staff</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-12 w-12 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MoversPackersPage;
