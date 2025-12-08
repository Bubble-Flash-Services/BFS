import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  ShoppingBag,
  CheckCircle,
  ChevronDown,
  Clock,
  TrendingDown,
  Award,
} from "lucide-react";
import { useCart } from "../../components/CartContext";
import { useNavigate } from "react-router-dom";

export default function InsuranceAssistancePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState("ins-renewal");
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Service data
  const serviceData = {
    title: "Vehicle Insurance Assistance",
    description:
      "Complete assistance for vehicle insurance including policy comparison, renewal, new policy purchase, and claim support from 10+ leading insurers.",
    variants: [
      {
        _id: "ins-renewal",
        name: "Renewal Assistance",
        priceModifier: 299,
        description: "Help with insurance renewal + insurance premium",
      },
      {
        _id: "ins-new",
        name: "New Policy Purchase",
        priceModifier: 499,
        description: "Complete new policy assistance + insurance premium",
      },
      {
        _id: "ins-claim",
        name: "Claim Assistance",
        priceModifier: 199,
        description: "Help with claim filing and follow-up",
      },
    ],
    features: [
      "Compare 10+ insurers",
      "Best quote identification",
      "Documentation assistance",
      "Policy purchase support",
      "Claim filing assistance",
      "Renewal reminders",
      "Digital policy storage",
    ],
    includes: [
      "Policy comparison service",
      "Documentation help",
      "Best quote analysis",
      "Paperwork assistance",
      "Digital policy copy",
    ],
    notIncludes: [
      "Insurance premium amount",
      "Vehicle inspection charges",
      "Traffic penalties or fines",
    ],
    process: [
      {
        step: 1,
        title: "Submit Details",
        description: "Provide vehicle and current insurance details",
      },
      {
        step: 2,
        title: "Compare Quotes",
        description: "We compare quotes from 10+ insurers",
      },
      {
        step: 3,
        title: "Select Policy",
        description: "Choose your preferred insurer and coverage",
      },
      {
        step: 4,
        title: "Documentation",
        description: "We help with all paperwork",
      },
      {
        step: 5,
        title: "Policy Issued",
        description: "Get your policy within 24-48 hours",
      },
    ],
    faqs: [
      {
        question: "Do you charge anything extra apart from service fee?",
        answer:
          "No, we only charge the service fee. The insurance premium is paid directly to the insurer.",
      },
      {
        question: "Which insurance companies do you work with?",
        answer:
          "We work with all major insurers including HDFC ERGO, ICICI Lombard, Bajaj Allianz, TATA AIG, and more.",
      },
      {
        question: "How long does it take to get a policy?",
        answer:
          "Once you select a policy and submit documents, the policy is issued within 24-48 hours.",
      },
      {
        question: "Can I switch insurers when renewing?",
        answer:
          "Yes, you can switch to any insurer. We'll help you compare quotes and make the best choice.",
      },
    ],
    insurancePartners: [
      "HDFC ERGO",
      "ICICI Lombard",
      "Bajaj Allianz",
      "TATA AIG",
      "National Insurance",
      "Oriental Insurance",
      "Royal Sundaram",
      "Reliance General",
      "Digit Insurance",
      "Acko",
    ],
  };

  const benefits = [
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: "Best Price Guarantee",
      description: "Compare quotes from 10+ insurers to get the best deal",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Processing",
      description: "Policy issued within 24-48 hours of document submission",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Hassle-free Documentation",
      description: "We handle all the paperwork and documentation",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Claim Support",
      description: "Dedicated assistance for claim filing and follow-up",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      comment:
        "Excellent service! They helped me save ₹3000 on my car insurance renewal.",
      service: "Renewal Assistance",
    },
    {
      name: "Priya Sharma",
      rating: 5,
      comment:
        "Very smooth process. Got my new bike insurance within 2 days with the best quote.",
      service: "New Policy Purchase",
    },
    {
      name: "Amit Patel",
      rating: 4,
      comment:
        "Great claim assistance. They handled everything professionally.",
      service: "Claim Assistance",
    },
  ];

  const handleVariantChange = (variantId) => {
    setSelectedVariant(variantId);
  };

  const handleAddToCart = () => {
    const selectedVariantData = serviceData.variants.find(
      (v) => v._id === selectedVariant
    );

    const cartItem = {
      id: `ins-${Date.now()}`,
      name: serviceData.title,
      serviceName: serviceData.title,
      packageName: selectedVariantData.name,
      variant: selectedVariantData.name,
      price: selectedVariantData.priceModifier,
      quantity: 1,
      category: "Insurance",
      type: "insurance",
      image: "/car/car1.png",
      img: "/car/car1.png",
      description: selectedVariantData.description,
    };

    addToCart(cartItem);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Shield className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">{serviceData.title}</h1>
            <p className="text-xl mb-8 text-blue-100">
              {serviceData.description}
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>10+ Insurers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Best Quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>24-48 Hours</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Service Type Selector */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Choose Your Service
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {serviceData.variants.map((variant) => (
            <motion.div
              key={variant._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVariantChange(variant._id)}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                selectedVariant === variant._id
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {variant.name}
              </h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">
                ₹{variant.priceModifier}
              </p>
              <p className="text-sm text-gray-600">{variant.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simple Add to Cart Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-6">
              Select your insurance service type above and add it to your cart
            </p>

            <div className="bg-white p-6 rounded-xl mb-6 border-2 border-blue-200">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Selected Service
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {
                  serviceData.variants.find((v) => v._id === selectedVariant)
                    ?.name
                }
              </p>
              <p className="text-gray-600 mb-3">
                {
                  serviceData.variants.find((v) => v._id === selectedVariant)
                    ?.description
                }
              </p>
              <div className="text-3xl font-bold text-green-600">
                ₹
                {
                  serviceData.variants.find((v) => v._id === selectedVariant)
                    ?.priceModifier
                }
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Service fee only - Insurance premium paid separately to insurer
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto space-x-2"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>Add to Cart</span>
            </button>

            <p className="text-sm text-gray-500 mt-4">
              Complete your details at checkout
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose Our Service?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Insurance Partners */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Our Insurance Partners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {serviceData.insurancePartners.map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="bg-white p-4 rounded-lg shadow-md text-center font-semibold text-gray-700"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Flow */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto">
          {serviceData.process.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-6 mb-8"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {step.step}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-800">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.service}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {serviceData.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === index ? null : index)
                }
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    expandedFaq === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFaq === index && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Get the Best Insurance Deal?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Compare quotes from 10+ insurers and save on your vehicle insurance
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}
