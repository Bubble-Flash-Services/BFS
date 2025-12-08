import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Bike,
  ClipboardCheck,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Wrench,
  Droplet,
  Battery,
  Gauge,
  Camera,
  Shield,
  Star,
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Clock,
  Award,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CartContext } from '../../context/CartContext';

const VehicleCheckupPage = () => {
  const { addToCart } = useContext(CartContext);
  
  const [vehicleType, setVehicleType] = useState('bike'); // 'bike' or 'car'
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Reduced pricing
  const pricing = {
    bike: {
      basic: { price: 199, originalPrice: 299, name: 'Two-Wheeler Basic' },
      comprehensive: { price: 399, originalPrice: 599, name: 'Two-Wheeler Comprehensive' }
    },
    car: {
      basic: { price: 499, originalPrice: 699, name: 'Four-Wheeler Basic' },
      comprehensive: { price: 999, originalPrice: 1299, name: 'Four-Wheeler Comprehensive' }
    }
  };

  // Service checklists
  const bikeChecklist = [
    { id: 1, item: 'Engine oil level check', status: 'good', category: 'Engine' },
    { id: 2, item: 'Brake system inspection', status: 'good', category: 'Safety' },
    { id: 3, item: 'Chain lubrication and tension check', status: 'attention', category: 'Drivetrain' },
    { id: 4, item: 'Tyre pressure and tread depth', status: 'good', category: 'Tyres' },
    { id: 5, item: 'Battery health check', status: 'good', category: 'Electrical' },
    { id: 6, item: 'Light and horn functionality', status: 'good', category: 'Electrical' },
    { id: 7, item: 'Suspension check', status: 'good', category: 'Suspension' },
    { id: 8, item: 'Coolant level (if applicable)', status: 'good', category: 'Engine' },
    { id: 9, item: 'Clutch and throttle play', status: 'attention', category: 'Controls' },
    { id: 10, item: 'Digital inspection report with photos', status: 'good', category: 'Documentation' },
  ];

  const carChecklist = [
    { id: 1, item: 'Engine oil and filter check', status: 'good', category: 'Engine' },
    { id: 2, item: 'Brake system (pads, fluid, performance)', status: 'good', category: 'Safety' },
    { id: 3, item: 'Tyre pressure, rotation, alignment', status: 'attention', category: 'Tyres' },
    { id: 4, item: 'Battery health and terminals', status: 'good', category: 'Electrical' },
    { id: 5, item: 'All lights and signals', status: 'good', category: 'Electrical' },
    { id: 6, item: 'AC system check', status: 'good', category: 'Comfort' },
    { id: 7, item: 'Suspension and steering', status: 'good', category: 'Handling' },
    { id: 8, item: 'Coolant and radiator', status: 'attention', category: 'Engine' },
    { id: 9, item: 'Windshield wipers and washer', status: 'good', category: 'Safety' },
    { id: 10, item: 'Digital inspection report with 50+ point checklist', status: 'good', category: 'Documentation' },
  ];

  const accessories = [
    { name: 'Chain Lubricant', icon: Droplet, applicableFor: 'bike' },
    { name: 'Battery Tester', icon: Battery },
    { name: 'Tyre Pressure Gauge (Digital)', icon: Gauge },
    { name: 'Coolant Tester', icon: Droplet },
    { name: 'OBD Scanner', icon: Camera },
    { name: 'Brake Fluid Tester', icon: Wrench },
    { name: 'Inspection Camera', icon: Camera },
  ];

  const addOns = [
    {
      id: 'addon-chain-lube',
      name: 'Chain Lubrication (Bike)',
      description: 'Clean and lubricate bike chain',
      price: 99,
      applicableFor: 'bike'
    },
    {
      id: 'addon-coolant-topup',
      name: 'Coolant Top-up',
      description: 'Top up coolant level if needed',
      price: 149,
      applicableFor: 'both'
    }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const reviews = [
    { name: 'Rajesh Kumar', rating: 5, text: 'Thorough inspection! Found issues I didn\'t know existed.' },
    { name: 'Priya Sharma', rating: 5, text: 'Professional service at doorstep. Very convenient!' },
    { name: 'Amit Patel', rating: 5, text: 'Detailed report with photos. Highly recommended!' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'attention':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-50 border-green-200';
      case 'attention':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleAddToCart = () => {
    if (!selectedPackage) {
      toast.error('Please select a package');
      return;
    }

    const packageData = pricing[vehicleType][selectedPackage];
    const addOnTotal = selectedAddOns.reduce((sum, id) => {
      const addon = addOns.find(a => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);

    const cartItem = {
      serviceId: `checkup-${vehicleType}-${selectedPackage}`,
      title: `Full Body Vehicle Check-up - ${packageData.name}`,
      price: packageData.price + addOnTotal,
      quantity: 1,
      vehicleType,
      packageType: selectedPackage,
      addOns: selectedAddOns.map(id => addOns.find(a => a.id === id)),
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
    };

    addToCart(cartItem);
    toast.success('Added to cart successfully!');
  };

  const handleToggleAddOn = (addonId) => {
    setSelectedAddOns(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const checklist = vehicleType === 'bike' ? bikeChecklist : carChecklist;
  const currentPricing = pricing[vehicleType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Fixed Add to Cart Button */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-20 right-4 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </motion.button>
      </motion.div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#FFB400] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#FFB400] rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-[#FFB400] text-[#1F3C88] px-6 py-2 rounded-full font-semibold mb-6"
            >
              <ClipboardCheck className="w-5 h-5" />
              Full Body Vehicle Check-up
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Complete Health Inspection
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              50+ Point Checklist | Certified Mechanics | Digital Report with Photos
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#FFB400]" />
                <span>45-60 mins</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#FFB400]" />
                <span>7-day report validity</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#FFB400]" />
                <span>4.9 ★ (891 reviews)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vehicle Type Toggle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-[#1F3C88]">
            Select Vehicle Type
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setVehicleType('bike')}
              className={`p-6 rounded-xl border-2 transition-all ${
                vehicleType === 'bike'
                  ? 'border-[#1F3C88] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Bike className={`w-12 h-12 mx-auto mb-3 ${
                vehicleType === 'bike' ? 'text-[#1F3C88]' : 'text-gray-400'
              }`} />
              <h3 className="text-xl font-bold text-center">Two-Wheeler</h3>
              <p className="text-center text-gray-600 mt-2">Bikes & Scooters</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setVehicleType('car')}
              className={`p-6 rounded-xl border-2 transition-all ${
                vehicleType === 'car'
                  ? 'border-[#1F3C88] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Car className={`w-12 h-12 mx-auto mb-3 ${
                vehicleType === 'car' ? 'text-[#1F3C88]' : 'text-gray-400'
              }`} />
              <h3 className="text-xl font-bold text-center">Four-Wheeler</h3>
              <p className="text-center text-gray-600 mt-2">Cars & SUVs</p>
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Package Selection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1F3C88]">
          Choose Your Package
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Basic Package */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedPackage('basic')}
            className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer border-2 transition-all ${
              selectedPackage === 'basic'
                ? 'border-[#1F3C88] ring-4 ring-blue-100'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-[#1F3C88] mb-2">Basic Check-up</h3>
                <p className="text-gray-600">30-point inspection</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 line-through">
                  ₹{currentPricing.basic.originalPrice}
                </div>
                <div className="text-3xl font-bold text-green-600">
                  ₹{currentPricing.basic.price}
                </div>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                Essential safety checks
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                Basic fluid level checks
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                Digital report with photos
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                Priority issue identification
              </li>
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Select Basic
            </motion.button>
          </motion.div>

          {/* Comprehensive Package */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedPackage('comprehensive')}
            className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 cursor-pointer border-2 transition-all relative overflow-hidden ${
              selectedPackage === 'comprehensive'
                ? 'border-[#FFB400] ring-4 ring-yellow-100'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="absolute top-4 right-4">
              <span className="bg-[#FFB400] text-[#1F3C88] px-3 py-1 rounded-full text-sm font-bold">
                POPULAR
              </span>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-[#1F3C88] mb-2">
                  Comprehensive Check-up
                </h3>
                <p className="text-gray-600">50+ point inspection</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 line-through">
                  ₹{currentPricing.comprehensive.originalPrice}
                </div>
                <div className="text-3xl font-bold text-green-600">
                  ₹{currentPricing.comprehensive.price}
                </div>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                Complete 50+ point inspection
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                All fluids & filters check
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                Detailed digital report
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                Expert recommendations
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                Follow-up consultation
              </li>
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#FFB400] to-[#e0a000] text-[#1F3C88] py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Select Comprehensive
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Detailed Checklist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white rounded-3xl shadow-xl mb-16">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#1F3C88]">
          What We Inspect
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our certified mechanics perform a thorough inspection of your {vehicleType === 'bike' ? 'bike' : 'car'} with detailed documentation
        </p>

        <div className="grid gap-4">
          {checklist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border-2 ${getStatusColor(item.status)} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {getStatusIcon(item.status)}
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.item}</h4>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'good' ? 'bg-green-100 text-green-700' :
                  item.status === 'attention' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools & Accessories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1F3C88]">
          Professional Tools & Equipment
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {accessories
            .filter(acc => !acc.applicableFor || acc.applicableFor === vehicleType || acc.applicableFor === 'both')
            .map((accessory, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <accessory.icon className="w-8 h-8 text-[#1F3C88]" />
                </div>
                <p className="text-sm font-semibold text-gray-700">{accessory.name}</p>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Add-ons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1F3C88]">
          Add-on Services
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {addOns
            .filter(addon => addon.applicableFor === 'both' || addon.applicableFor === vehicleType)
            .map((addon) => (
              <motion.div
                key={addon.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleToggleAddOn(addon.id)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer border-2 transition-all ${
                  selectedAddOns.includes(addon.id)
                    ? 'border-[#1F3C88] ring-4 ring-blue-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#1F3C88] mb-2">{addon.name}</h3>
                    <p className="text-gray-600 mb-3">{addon.description}</p>
                    <span className="text-2xl font-bold text-green-600">₹{addon.price}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAddOns.includes(addon.id)
                      ? 'bg-[#1F3C88] border-[#1F3C88]'
                      : 'border-gray-300'
                  }`}>
                    {selectedAddOns.includes(addon.id) && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1F3C88]">
          What Our Customers Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FFB400] text-[#FFB400]" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">{review.text}</p>
              <p className="font-semibold text-[#1F3C88]">{review.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[#1F3C88] to-[#2952A3] rounded-3xl shadow-2xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Book Your Check-up?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Get your vehicle inspected by certified professionals today
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="bg-[#FFB400] text-[#1F3C88] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e0a000] transition-all shadow-lg flex items-center gap-3 mx-auto"
          >
            <ShoppingCart className="w-6 h-6" />
            Add to Cart & Book Now
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default VehicleCheckupPage;
