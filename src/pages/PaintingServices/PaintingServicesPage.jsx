import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  PaintBucket,
  Home,
  CheckCircle2,
  Star,
  Award,
  Shield,
  Clock,
  Users,
  Palette,
  Brush,
  Sparkles,
  ChevronRight,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import PaintingCalculator from "./PaintingCalculator";
import PaintingQuote from "../../components/PaintingQuote";

const PaintingServicesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("calculator");
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  // Service types with pricing
  const serviceTypes = [
    {
      title: "Wall Painting",
      icon: PaintBucket,
      gradient: "from-blue-500 to-cyan-500",
      services: [
        { name: "New Wall Painting", price: "₹18/sq.ft" },
        { name: "Repainting", price: "₹14/sq.ft" },
        { name: "Texture Painting", price: "₹35/sq.ft" },
        { name: "Designer Paint", price: "₹45/sq.ft" },
      ],
    },
    {
      title: "Touch-up Painting",
      icon: Brush,
      gradient: "from-purple-500 to-pink-500",
      services: [
        { name: "Minor Touch-ups", price: "₹499", detail: "(up to 50 sq.ft)" },
        { name: "Major Touch-ups", price: "₹999", detail: "(50-150 sq.ft)" },
      ],
    },
    {
      title: "Door & Window Painting",
      icon: Home,
      gradient: "from-green-500 to-emerald-500",
      services: [
        { name: "Standard Door", price: "₹599" },
        { name: "Designer Door", price: "₹999" },
        { name: "Window Frame", price: "₹299" },
      ],
    },
    {
      title: "Full Home Painting",
      icon: Home,
      gradient: "from-orange-500 to-red-500",
      services: [
        { name: "1 BHK", price: "Starting ₹15,999" },
        { name: "2 BHK", price: "Starting ₹28,999" },
        { name: "3 BHK", price: "Starting ₹42,999" },
        { name: "Villa/Independent House", price: "₹55/sq.ft" },
      ],
    },
  ];

  // What's included
  const included = [
    "Surface preparation (cleaning, filling cracks)",
    "Primer application (1 coat)",
    "Paint application (2 coats)",
    "Furniture covering/protection",
    "Floor protection",
    "Post-painting cleanup",
    "Quality inspection",
    "1-year warranty on workmanship",
  ];

  // What's NOT included
  const notIncluded = [
    "Paint material cost (quoted separately)",
    "Major wall repairs/plastering",
    "Furniture moving (can be added)",
    "Exterior painting (separate service)",
  ];

  // Process steps
  const processSteps = [
    {
      step: 1,
      title: "Book Inspection",
      description: "Schedule free on-site inspection",
      icon: Calendar,
    },
    {
      step: 2,
      title: "Get Quote",
      description: "Receive detailed cost estimate",
      icon: PaintBucket,
    },
    {
      step: 3,
      title: "Color Selection",
      description: "Choose colors with expert guidance",
      icon: Palette,
    },
    {
      step: 4,
      title: "Painting Work",
      description: "Professional painting execution",
      icon: Brush,
    },
    {
      step: 5,
      title: "Quality Check",
      description: "Final inspection & handover",
      icon: CheckCircle2,
    },
  ];

  // Paint finish types
  const paintFinishes = [
    {
      name: "Matte",
      description: "Non-reflective, elegant finish",
      bestFor: "Living rooms, bedrooms",
    },
    {
      name: "Satin",
      description: "Slight sheen, easy to clean",
      bestFor: "Hallways, kids' rooms",
    },
    {
      name: "Gloss",
      description: "High shine, very durable",
      bestFor: "Doors, windows, trim",
    },
    {
      name: "Eggshell",
      description: "Subtle luster, washable",
      bestFor: "Living areas, dining rooms",
    },
  ];

  // Customer reviews
  const reviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      text: "Excellent work! The team was professional and completed our 2 BHK painting in just 4 days. Highly recommend!",
      project: "2 BHK Repainting",
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      text: "Very satisfied with the quality. They helped us choose the perfect colors and the finish is flawless.",
      project: "3 BHK Full Painting",
    },
    {
      name: "Anita Desai",
      rating: 5,
      text: "Great service! The painters were punctual and did a neat job. No mess left behind.",
      project: "Living Room Touch-up",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white/20 p-4 rounded-full backdrop-blur-sm"
              >
                <PaintBucket className="w-16 h-16" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Painting Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Transform Your Space with Expert Painters
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Shield className="w-5 h-5" />
                <span>1-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Award className="w-5 h-5" />
                <span>Professional Team</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Clock className="w-5 h-5" />
                <span>On-Time Delivery</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowQuoteForm(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Get Free Quote
              </button>
              <button
                onClick={() => {
                  document.getElementById("calculator")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Calculate Cost
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services & Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the service that fits your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceTypes.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`bg-gradient-to-br ${service.gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}
                >
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <ul className="space-y-3">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-start">
                      <span className="text-gray-600 text-sm">
                        {item.name}
                        {item.detail && (
                          <span className="text-xs text-gray-400 block">
                            {item.detail}
                          </span>
                        )}
                      </span>
                      <span className="text-blue-600 font-semibold text-sm whitespace-nowrap ml-2">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Project Cost
            </h2>
            <p className="text-xl text-gray-600">
              Get instant estimate for your painting project
            </p>
          </motion.div>
          <PaintingCalculator />
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Included */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-green-50 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-500 p-3 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  What's Included
                </h3>
              </div>
              <ul className="space-y-3">
                {included.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Not Included */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-orange-50 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-500 p-3 rounded-xl">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Not Included
                </h3>
              </div>
              <ul className="space-y-3">
                {notIncluded.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-orange-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple 5-step process to transform your space
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Paint Finishes Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Paint Finish Types
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect finish for each room
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paintFinishes.map((finish, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <div className="bg-white p-3 rounded-xl w-fit mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {finish.name}
                </h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {finish.description}
                </p>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs inline-block">
                  Best for: {finish.bestFor}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from satisfied clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                <div className="border-t pt-4">
                  <div className="font-bold text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-500">{review.project}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Get a free consultation and quote today!
            </p>
            <button
              onClick={() => setShowQuoteForm(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
            >
              Book Free Inspection
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <PaintingQuote onClose={() => setShowQuoteForm(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PaintingServicesPage;
