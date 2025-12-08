import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle,
  Mail,
  FileText,
  AlertCircle,
  ChevronDown,
  Award,
  Truck,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { useCart } from "../../components/CartContext";
import { useNavigate } from "react-router-dom";

export default function PUCCertificatePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState("puc-2w");
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "Two-Wheeler",
    email: "",
  });
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Service data
  const serviceData = {
    title: "PUC Certificate Service",
    description:
      "Government-approved Pollution Under Control (PUC) certificate issuance at your doorstep with certified technicians and equipment.",
    duration: "15-20 minutes",
    variants: [
      {
        _id: "puc-2w",
        name: "Two-Wheeler",
        priceModifier: 149,
        description: "For all two-wheelers",
      },
      {
        _id: "puc-4w-petrol",
        name: "Four-Wheeler (Petrol)",
        priceModifier: 199,
        description: "For petrol cars",
      },
      {
        _id: "puc-4w-diesel",
        name: "Four-Wheeler (Diesel)",
        priceModifier: 199,
        description: "For diesel cars",
      },
    ],
    features: [
      "Doorstep emission testing",
      "Government-approved certificate",
      "Digital copy via email/WhatsApp",
      "Hard copy provided",
      "Valid for 6 months",
      "Instant certificate if passed",
    ],
    includes: [
      "Emission testing",
      "Certificate issuance",
      "Digital and physical copy",
      "SMS and email notification",
    ],
    notIncludes: [
      "Vehicle repairs",
      "Pollution control system upgrades",
      "Re-testing if vehicle fails",
    ],
    process: [
      {
        step: 1,
        title: "Book Appointment",
        description: "Select date, time, and location online",
      },
      {
        step: 2,
        title: "Technician Visit",
        description: "Certified technician comes to your location",
      },
      {
        step: 3,
        title: "Testing",
        description: "Emission test completed in 10-15 minutes",
      },
      {
        step: 4,
        title: "Certificate",
        description: "Certificate issued immediately if passed",
      },
    ],
    faqs: [
      {
        question: "How long is the PUC certificate valid?",
        answer: "PUC certificate is valid for 6 months from the date of issue.",
      },
      {
        question: "What if my vehicle fails the test?",
        answer:
          "If your vehicle fails, we'll provide a detailed report. You'll need to get repairs done and schedule a re-test.",
      },
      {
        question: "What documents do I need?",
        answer:
          "You need your vehicle registration documents and previous PUC certificate if available.",
      },
      {
        question: "How quickly will I receive the certificate?",
        answer:
          "If your vehicle passes the test, the certificate is issued immediately. Digital copy is sent within 5 minutes, and hard copy is provided on the spot.",
      },
      {
        question: "Do you cover my area?",
        answer:
          "We currently operate in Bangalore. Service availability in other cities coming soon.",
      },
    ],
  };

  const accessories = [
    {
      name: "Portable Emission Testing Device",
      description: "Government-approved portable emission analyzer",
      icon: BadgeCheck,
    },
    {
      name: "Digital Printer",
      description: "On-site certificate printing capability",
      icon: FileText,
    },
    {
      name: "Certification Authority Tie-up",
      description: "Government-authorized certification partnership",
      icon: Award,
    },
  ];

  const getSelectedPrice = () => {
    const variant = serviceData.variants.find((v) => v._id === selectedVariant);
    return variant ? variant.priceModifier : 149;
  };

  const getSelectedVariantName = () => {
    const variant = serviceData.variants.find((v) => v._id === selectedVariant);
    return variant ? variant.name : "Two-Wheeler";
  };

  const handleBooking = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.vehicleNumber) {
      alert("Please enter vehicle number");
      return;
    }
    if (!formData.email) {
      alert("Please enter email");
      return;
    }
    // Add to cart
    const bookingDetails = {
      serviceId: "vc-puc-001",
      name: `PUC Certificate - ${getSelectedVariantName()}`,
      price: getSelectedPrice(),
      quantity: 1,
      vehicleType: formData.vehicleType,
      vehicleNumber: formData.vehicleNumber,
      email: formData.email,
      category: "PUC Certificate",
      type: "puc-certificate",
    };

    addToCart(bookingDetails);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="bg-white bg-opacity-20 p-6 rounded-full"
              >
                <ShieldCheck className="w-20 h-20" />
              </motion.div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              PUC Certificate Service
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Government-approved emission testing at your doorstep
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>15-20 minutes</span>
              </div>
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full flex items-center gap-2">
                <BadgeCheck className="w-5 h-5" />
                <span>Government Approved</span>
              </div>
              <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <span>Doorstep Service</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBookingForm(true)}
              className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300"
            >
              Book Now - From ₹149
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Choose Your Vehicle Type
            </h2>
            <p className="text-gray-600 text-lg">
              Select the appropriate package for your vehicle
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceData.variants.map((variant, index) => (
              <motion.div
                key={variant._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedVariant(variant._id);
                  setFormData((prev) => ({
                    ...prev,
                    vehicleType: variant.name,
                  }));
                }}
                className={`relative bg-gradient-to-br ${
                  selectedVariant === variant._id
                    ? "from-green-50 to-emerald-50 border-green-500 shadow-2xl scale-105"
                    : "from-gray-50 to-white border-gray-200 hover:shadow-xl"
                } border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300`}
              >
                {selectedVariant === variant._id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">
                    {variant.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{variant.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-green-600">
                      ₹{variant.priceModifier}
                    </span>
                  </div>
                  <button
                    className={`w-full py-3 rounded-full font-semibold transition-all ${
                      selectedVariant === variant._id
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {selectedVariant === variant._id ? "Selected" : "Select"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Book Now CTA - Placed near service selection */}
          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowBookingForm(true);
                // Scroll to booking form
                setTimeout(() => {
                  document.getElementById("booking-form")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 100);
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300"
            >
              Book Now - ₹{getSelectedPrice()}
            </motion.button>
            <p className="mt-4 text-gray-600">
              Complete your booking details below
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Simple 4-step process to get your PUC certificate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {serviceData.process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.2, type: "spring" }}
                      className="bg-gradient-to-br from-green-500 to-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4"
                    >
                      {step.step}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              What's Included
            </h2>
            <p className="text-gray-600 text-lg">
              Complete PUC certification service at your doorstep
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Includes */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Service Includes
                </h3>
              </div>
              <ul className="space-y-4">
                {serviceData.includes.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Not Includes */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Not Included
                </h3>
              </div>
              <ul className="space-y-4">
                {serviceData.notIncludes.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
            {serviceData.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Accessories Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Our Equipment
            </h2>
            <p className="text-gray-600 text-lg">
              Professional-grade equipment for accurate testing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {accessories.map((accessory, index) => {
              const Icon = accessory.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-full">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {accessory.name}
                  </h3>
                  <p className="text-gray-600">{accessory.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Everything you need to know about PUC certification
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {serviceData.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full p-6 text-left flex justify-between items-center gap-4"
                >
                  <span className="font-semibold text-gray-800 text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-600 transition-transform duration-300 flex-shrink-0 ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      {showBookingForm && (
        <section
          id="booking-form"
          className="py-16 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
            >
              <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                Book Your PUC Certificate
              </h2>

              <form onSubmit={handleBooking} className="space-y-6">
                {/* Vehicle Type Selection */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => {
                      setSelectedVariant(e.target.value);
                      const variant = serviceData.variants.find(
                        (v) => v._id === e.target.value
                      );
                      setFormData((prev) => ({
                        ...prev,
                        vehicleType: variant.name,
                      }));
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  >
                    {serviceData.variants.map((variant) => (
                      <option key={variant._id} value={variant._id}>
                        {variant.name} - ₹{variant.priceModifier}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Number */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vehicleNumber: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="KA01AB1234"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors uppercase"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email (for e-document) *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="your@email.com"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">
                      Service Price:
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{getSelectedPrice()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    * Date, time, and location will be requested during checkout
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-300"
                >
                  Add to Cart & Proceed
                </motion.button>

                <p className="text-center text-sm text-gray-600">
                  By booking, you agree to our terms and conditions
                </p>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!showBookingForm && (
        <section className="py-16 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Get Your PUC Certificate?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Book now and get certified at your doorstep!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBookingForm(true)}
                className="bg-white text-green-600 px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300"
              >
                Book Your Service Now
              </motion.button>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
