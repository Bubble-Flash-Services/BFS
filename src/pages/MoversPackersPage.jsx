import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Truck, 
  Home, 
  MapPin, 
  Calendar, 
  Car, 
  Bike, 
  Package,
  PaintBucket,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../components/AuthContext';
import AddressAutocomplete from '../../components/AddressAutocomplete';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const MoversPackersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [moveType, setMoveType] = useState('within-city');
  const [homeSize, setHomeSize] = useState('');
  const [sourceCity, setSourceCity] = useState(null);
  const [destinationCity, setDestinationCity] = useState(null);
  const [movingDate, setMovingDate] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Vehicle shifting state
  const [needVehicleShifting, setNeedVehicleShifting] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  // Extra services state
  const [needPainting, setNeedPainting] = useState(false);
  const [paintingServices, setPaintingServices] = useState({
    interiorPainting: false,
    exteriorPainting: false,
    woodPolishing: false
  });

  // Price quote state
  const [priceQuote, setPriceQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      if (user.phone) setContactPhone(user.phone);
      if (user.email) setContactEmail(user.email);
    }
  }, [user]);

  // Get price quote when relevant fields change
  useEffect(() => {
    if (homeSize && moveType) {
      fetchPriceQuote();
    }
  }, [homeSize, moveType, needVehicleShifting, vehicles, needPainting, paintingServices]);

  const fetchPriceQuote = async () => {
    setLoadingQuote(true);
    try {
      const vehicleShifting = needVehicleShifting ? { required: true, vehicles } : { required: false };
      const extraServices = needPainting 
        ? { painting: { required: true, services: paintingServices } }
        : { painting: { required: false } };

      const response = await fetch(`${API}/api/movers-packers/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moveType,
          homeSize,
          vehicleShifting,
          extraServices
        })
      });

      const result = await response.json();
      if (result.success) {
        setPriceQuote(result.data);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoadingQuote(false);
    }
  };

  const addVehicle = (type) => {
    const existingVehicle = vehicles.find(v => v.type === type);
    if (existingVehicle) {
      setVehicles(vehicles.map(v => 
        v.type === type ? { ...v, count: v.count + 1 } : v
      ));
    } else {
      setVehicles([...vehicles, { type, count: 1 }]);
    }
  };

  const removeVehicle = (type) => {
    const existingVehicle = vehicles.find(v => v.type === type);
    if (existingVehicle && existingVehicle.count > 1) {
      setVehicles(vehicles.map(v => 
        v.type === type ? { ...v, count: v.count - 1 } : v
      ));
    } else {
      setVehicles(vehicles.filter(v => v.type !== type));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to book our services');
      navigate('/');
      return;
    }

    // Validation
    if (!homeSize) {
      toast.error('Please select home size');
      return;
    }

    if (!sourceCity?.fullAddress) {
      toast.error('Please enter source address');
      return;
    }

    if (!destinationCity?.fullAddress) {
      toast.error('Please enter destination address');
      return;
    }

    if (!movingDate) {
      toast.error('Please select moving date');
      return;
    }

    if (!contactPhone) {
      toast.error('Please enter contact phone');
      return;
    }

    // Validate date is in future
    const selectedDate = new Date(movingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Moving date must be in the future');
      return;
    }

    setSubmitting(true);

    try {
      const vehicleShifting = needVehicleShifting && vehicles.length > 0
        ? { required: true, vehicles }
        : { required: false };

      const extraServices = needPainting
        ? { painting: { required: true, services: paintingServices } }
        : { painting: { required: false } };

      const response = await fetch(`${API}/api/movers-packers/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          moveType,
          homeSize,
          sourceCity,
          destinationCity,
          movingDate,
          vehicleShifting,
          extraServices,
          contactPhone,
          contactEmail,
          customerNotes
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Booking created successfully! We will contact you soon.');
        // Redirect to orders page or show confirmation
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        toast.error(result.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const homeSizeOptions = [
    { value: '1BHK', label: '1 BHK', icon: Home },
    { value: '2BHK', label: '2 BHK', icon: Home },
    { value: '3BHK', label: '3 BHK', icon: Home },
    { value: '4BHK', label: '4 BHK', icon: Home },
    { value: 'Villa', label: 'Villa', icon: Home }
  ];

  const vehicleOptions = [
    { type: 'Car', label: 'Car', icon: Car },
    { type: 'Bike', label: 'Bike', icon: Bike },
    { type: 'Scooter', label: 'Scooter', icon: Bike },
    { type: 'Others', label: 'Others', icon: Package }
  ];

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F3C88] via-[#2952A3] to-[#1F3C88] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFB400] rounded-full mb-6">
            <Truck className="w-10 h-10 text-[#1F3C88]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Movers & Packers Service
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Professional moving services with care and reliability. 
            Get instant quotes and book your move today!
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Move Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Select Move Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMoveType('within-city')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    moveType === 'within-city'
                      ? 'border-[#FFB400] bg-[#FFF6DB] text-[#1F3C88]'
                      : 'border-gray-200 hover:border-[#FFB400]'
                  }`}
                >
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Within City</div>
                  <div className="text-sm text-gray-600">Local relocation</div>
                </button>
                <button
                  type="button"
                  onClick={() => setMoveType('intercity')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    moveType === 'intercity'
                      ? 'border-[#FFB400] bg-[#FFF6DB] text-[#1F3C88]'
                      : 'border-gray-200 hover:border-[#FFB400]'
                  }`}
                >
                  <Truck className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">Intercity</div>
                  <div className="text-sm text-gray-600">Long distance move</div>
                </button>
              </div>
            </div>

            {/* Home Size Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Select Home Size
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {homeSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setHomeSize(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      homeSize === option.value
                        ? 'border-[#FFB400] bg-[#FFF6DB] text-[#1F3C88]'
                        : 'border-gray-200 hover:border-[#FFB400]'
                    }`}
                  >
                    <option.icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-semibold text-sm">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Address Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Source Address
                </label>
                <AddressAutocomplete
                  onAddressSelect={(address) => setSourceCity(address)}
                  placeholder="Enter pickup address"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FFB400] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Destination Address
                </label>
                <AddressAutocomplete
                  onAddressSelect={(address) => setDestinationCity(address)}
                  placeholder="Enter destination address"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FFB400] focus:outline-none"
                />
              </div>
            </div>

            {/* Moving Date */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Moving Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={movingDate}
                  onChange={(e) => setMovingDate(e.target.value)}
                  min={minDate}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FFB400] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Vehicle Shifting Section */}
            <div className="border-t-2 border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-gray-800">
                  Need Vehicle Shifting?
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNeedVehicleShifting(!needVehicleShifting);
                    if (needVehicleShifting) setVehicles([]);
                  }}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    needVehicleShifting
                      ? 'bg-[#FFB400] text-[#1F3C88]'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {needVehicleShifting ? 'Yes' : 'No'}
                </button>
              </div>

              {needVehicleShifting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {vehicleOptions.map((option) => {
                      const vehicle = vehicles.find(v => v.type === option.type);
                      const count = vehicle?.count || 0;
                      return (
                        <div
                          key={option.type}
                          className="p-4 border-2 border-gray-200 rounded-xl"
                        >
                          <option.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                          <div className="text-center font-medium mb-3">{option.label}</div>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => removeVehicle(option.type)}
                              disabled={count === 0}
                              className="w-8 h-8 rounded-full bg-gray-200 disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">{count}</span>
                            <button
                              type="button"
                              onClick={() => addVehicle(option.type)}
                              className="w-8 h-8 rounded-full bg-[#FFB400]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Painting Services Section */}
            <div className="border-t-2 border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-gray-800">
                  Need Painting Services?
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNeedPainting(!needPainting);
                    if (needPainting) {
                      setPaintingServices({
                        interiorPainting: false,
                        exteriorPainting: false,
                        woodPolishing: false
                      });
                    }
                  }}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    needPainting
                      ? 'bg-[#FFB400] text-[#1F3C88]'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {needPainting ? 'Yes' : 'No'}
                </button>
              </div>

              {needPainting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  {[
                    { key: 'interiorPainting', label: 'Interior Painting' },
                    { key: 'exteriorPainting', label: 'Exterior Painting' },
                    { key: 'woodPolishing', label: 'Wood Polishing' }
                  ].map((service) => (
                    <label
                      key={service.key}
                      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#FFB400] transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={paintingServices[service.key]}
                        onChange={(e) => setPaintingServices({
                          ...paintingServices,
                          [service.key]: e.target.checked
                        })}
                        className="w-5 h-5 text-[#FFB400] rounded focus:ring-[#FFB400]"
                      />
                      <PaintBucket className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{service.label}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Contact Information */}
            <div className="border-t-2 border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FFB400] focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FFB400] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Any special requirements or instructions..."
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FFB400] focus:outline-none resize-none"
              />
            </div>

            {/* Price Quote Display */}
            {priceQuote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-4">Estimated Price</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price ({homeSize}):</span>
                    <span className="font-semibold">₹{priceQuote.basePrice?.toLocaleString()}</span>
                  </div>
                  {priceQuote.vehicleShiftingCost > 0 && (
                    <div className="flex justify-between">
                      <span>Vehicle Shifting:</span>
                      <span className="font-semibold">₹{priceQuote.vehicleShiftingCost?.toLocaleString()}</span>
                    </div>
                  )}
                  {priceQuote.paintingCost > 0 && (
                    <div className="flex justify-between">
                      <span>Painting Services:</span>
                      <span className="font-semibold">₹{priceQuote.paintingCost?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total Estimate:</span>
                      <span className="text-[#FFB400]">₹{priceQuote.totalPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-200 mt-4">
                  * Final price may vary based on actual requirements and distance
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[#FFB400] to-[#e0a000] text-[#1F3C88] font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                'Creating Booking...'
              ) : (
                <>
                  Book Now
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: CheckCircle2,
              title: 'Professional Team',
              description: 'Trained and verified moving experts'
            },
            {
              icon: Package,
              title: 'Safe Packaging',
              description: 'Premium quality packing materials'
            },
            {
              icon: Truck,
              title: 'Timely Delivery',
              description: 'On-time pickup and delivery guaranteed'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white text-center"
            >
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-[#FFB400]" />
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-200">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MoversPackersPage;
