import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Key,
  Lock,
  Shield,
  Clock,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  User
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import MapboxLocationPicker from "../../components/MapboxLocationPicker";
import KeyServiceCard from "../../components/KeyServiceCard";
import EmergencyKeyService from "../../components/EmergencyKeyService";

const API = import.meta.env.VITE_API_URL || window.location.origin;

const KeyServicesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [serviceType, setServiceType] = useState("");
  const [specificService, setSpecificService] = useState("");
  const [keyType, setKeyType] = useState({ name: "", description: "" });
  const [quantity, setQuantity] = useState(1);
  const [isEmergency, setIsEmergency] = useState(false);
  const [nightService, setNightService] = useState(false);
  const [serviceLocation, setServiceLocation] = useState(null);
  const [contactPhone, setContactPhone] = useState("");
  const [alternateContact, setAlternateContact] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [idProof, setIdProof] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [priceQuote, setPriceQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Service categories data
  const serviceCategories = {
    "key-duplication": {
      title: "Key Duplication",
      services: [
        { id: "house-key", name: "House/Door Key", price: 99, icon: "🏠" },
        { id: "bike-key", name: "Bike Key (Non-Digital)", price: 149, icon: "🏍️" },
        { id: "car-key", name: "Car Key (Non-Remote)", price: 299, icon: "🚗" },
        { id: "cupboard-key", name: "Cupboard/Drawer Key", price: 79, icon: "🗄️" },
        { id: "mailbox-key", name: "Mailbox Key", price: 69, icon: "📬" },
        { id: "padlock-key", name: "Padlock Key", price: 49, icon: "🔐" }
      ]
    },
    "lock-services": {
      title: "Lock Services",
      services: [
        { id: "emergency-lock-opening", name: "Emergency Lock Opening", price: "₹499 (day) / ₹799 (night)", icon: "🚨" },
        { id: "lock-repair", name: "Lock Repair", price: 299, icon: "🔧" },
        { id: "lock-replacement", name: "Lock Replacement", price: "₹599 + lock cost", icon: "🔄" },
        { id: "lock-installation", name: "Lock Installation", price: "₹399 + lock cost", icon: "🔨" }
      ]
    },
    "advanced-services": {
      title: "Advanced Services",
      services: [
        { id: "safe-key-services", name: "Safe Key Services", price: "Starting ₹1,999", icon: "🏦" },
        { id: "digital-lock-programming", name: "Digital Lock Programming", price: 799, icon: "🔢" },
        { id: "master-key-system", name: "Master Key System Setup", price: "Starting ₹2,999", icon: "👑" },
        { id: "lock-rekeying", name: "Lock Rekeying", price: 399, icon: "🔑" }
      ]
    },
    "specialized-keys": {
      title: "Specialized Keys",
      services: [
        { id: "car-remote-key", name: "Car Remote Key Programming", price: 1499, icon: "📡" },
        { id: "transponder-key", name: "Transponder Key", price: 2499, icon: "🔐" },
        { id: "smart-key-fob", name: "Smart Key Fob", price: 3499, icon: "📱" }
      ]
    }
  };

  useEffect(() => {
    if (user?.phone) setContactPhone(user.phone);
  }, [user]);

  useEffect(() => {
    if (serviceType && specificService) {
      fetchPriceQuote();
    }
  }, [serviceType, specificService, quantity, nightService]);

  const fetchPriceQuote = async () => {
    setLoadingQuote(true);
    try {
      const response = await fetch(`${API}/api/key-services/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          specificService,
          quantity,
          nightService
        })
      });
      const data = await response.json();
      if (data.success) setPriceQuote(data.data);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to book a service");
      return;
    }
    if (!serviceType || !specificService || !serviceLocation || !contactPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/key-services/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceType,
          specificService,
          keyType,
          quantity,
          isEmergency,
          nightService,
          serviceLocation,
          contactPhone,
          alternateContact,
          preferredTime: !isEmergency ? preferredTime : null,
          specialInstructions,
          idProof,
          user
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        if (isEmergency) {
          toast.success(`Verification Code: ${data.data.verificationCode}`, { duration: 10000 });
        }
        setTimeout(() => navigate("/orders"), 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const handleServiceSelect = (type, serviceId) => {
    setServiceType(type);
    setSpecificService(serviceId);
    const category = serviceCategories[type];
    const service = category.services.find(s => s.id === serviceId);
    if (service) {
      setKeyType({ name: service.name, description: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Key className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Doorstep Key Services
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Professional key duplication and lock services at your doorstep
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Police Verified</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium">30-Min Response</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">3-Month Warranty</span>
            </div>
          </div>
        </motion.div>

        {!isEmergency && (
          <EmergencyKeyService onEmergencyClick={() => setIsEmergency(true)} />
        )}

        <div className="grid lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                Select Your Service
              </h2>

              <div className="space-y-8">
                {Object.entries(serviceCategories).map(([type, category]) => (
                  <div key={type}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {category.title}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {category.services.map((service) => (
                        <KeyServiceCard
                          key={service.id}
                          service={service}
                          isSelected={specificService === service.id}
                          onSelect={() => handleServiceSelect(type, service.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {specificService && serviceType === "key-duplication" && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {specificService === "emergency-lock-opening" && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nightService}
                      onChange={(e) => setNightService(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Night Service (10PM - 6AM) - Additional ₹300
                    </span>
                  </label>
                </div>
              )}
            </motion.div>

            {specificService && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-lg p-6 mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isEmergency ? "Emergency Booking" : "Booking Details"}
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Service Location *
                  </label>
                  <MapboxLocationPicker
                    onLocationSelect={(location) => {
                      setServiceLocation(location);
                      setAddressInput(location.fullAddress);
                    }}
                    placeholder="Enter your service location"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternate Contact
                    </label>
                    <input
                      type="tel"
                      value={alternateContact}
                      onChange={(e) => setAlternateContact(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {!isEmergency && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Preferred Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    ID Proof Type
                  </label>
                  <select
                    value={idProof}
                    onChange={(e) => setIdProof(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select ID Proof</option>
                    <option value="aadhar">Aadhar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="driving-license">Driving License</option>
                    <option value="passport">Passport</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Any specific requirements..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Security Notice:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>ID verification required before service</li>
                        <li>Ownership proof mandatory for lock opening</li>
                        <li>All technicians are police-verified</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !serviceLocation}
                  className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                    submitting || !serviceLocation
                      ? "bg-gray-400 cursor-not-allowed"
                      : isEmergency
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {submitting
                    ? "Booking..."
                    : isEmergency
                    ? "🚨 Book Emergency Service"
                    : "Book Service"}
                </button>
              </motion.form>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Price Quote
              </h3>

              {loadingQuote ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
                  <p className="text-sm text-gray-600 mt-2">Calculating...</p>
                </div>
              ) : priceQuote ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">₹{priceQuote.basePrice}</span>
                  </div>
                  {priceQuote.nightSurcharge > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Night Surcharge:</span>
                      <span className="font-semibold text-orange-600">
                        +₹{priceQuote.nightSurcharge}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{priceQuote.totalPrice}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>On-site service</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Quality tested keys</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>3-month warranty</span>
                      </div>
                      {isEmergency && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>30-min response</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Key className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a service to see pricing</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Need immediate help?
                </p>
                <a
                  href="tel:+919591572775"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Call: 9591572775
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How We Do It
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: "1", title: "Book Service", desc: "Online or call", icon: "📱" },
              { step: "2", title: "Technician Arrives", desc: "With mobile key machine", icon: "🚐" },
              { step: "3", title: "Verify Ownership", desc: "ID verification", icon: "🆔" },
              { step: "4", title: "Create Keys", desc: "On-site key making", icon: "🔑" },
              { step: "5", title: "Test & Pay", desc: "Test all keys", icon: "✅" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.icon}
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KeyServicesPage;
