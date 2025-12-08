import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Car,
  Bike,
  Shirt,
  Shield,
  Truck,
  ShieldCheck,
} from "lucide-react";

export default function ServiceCategories() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-slide functionality for mobile
  useEffect(() => {
    if (!isMobile) return;

    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide >= categories.length ? 0 : nextSlide;
      });
    }, 3000);

    return () => clearInterval(autoSlide);
  }, [isMobile]);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX;
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !isDragging.current) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !isDragging.current) return;
    isDragging.current = false;

    const endX = e.changedTouches[0].pageX;
    const diffX = startX.current - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && currentSlide < categories.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else if (diffX < 0 && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  const handleCategoryClick = (category) => {
    if (category === "laundry") {
      // Show coming soon page instead of navigating to old Laundry content
      navigate("/laundry");
      return;
    }
    navigate(`/${category}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.3,
      },
    },
  };

  const categories = [
    {
      name: "Car Wash",
      image: "/car/home.png",
      category: "cars",
      description: "Professional car cleaning & detailing services",
      fallbackIcon: Car,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
    {
      name: "Bike Wash",
      image: "/bike/home.png",
      category: "bikes",
      description: "Expert bike cleaning & maintenance",
      fallbackIcon: Bike,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
    },
    {
      name: "Helmet Care",
      image: "/helmet/helmethome.png",
      category: "helmets",
      description: "Premium helmet cleaning & care",
      fallbackIcon: Shield,
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
    },
    {
      name: "Laundry Service",
      image: "/laundry/home.png",
      category: "laundry",
      description: "Fresh & clean laundry solutions",
      fallbackIcon: Shirt,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
    },
    {
      name: "PUC Certificate",
      image: "/services/puc/puc-testing.jpg",
      category: "services/puc-certificate",
      description: "Government-approved emission testing at your doorstep",
      fallbackIcon: ShieldCheck,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      price: "From ₹149",
      isNew: true,
    },
    {
      name: "Insurance Assistance",
      image: "/services/insurance/insurance-main.jpg",
      category: "services/insurance-assistance",
      description: "Compare & buy vehicle insurance from 10+ insurers",
      fallbackIcon: Shield,
      gradient: "from-blue-600 to-green-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      price: "From ₹199",
      isNew: true,
      isPopular: true,
    },
    {
      name: "Movers & Packers",
      image: "/movers/truck.png",
      category: "movers-packers",
      description: "Professional relocation services",
      fallbackIcon: Truck,
      gradient: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-50",
      hoverColor: "hover:bg-yellow-100",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#1F3C88] via-[#2952A3] to-[#1F3C88] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-[#FFB400] rounded-full opacity-5 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#FFB400] rounded-full opacity-3 blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-[#FFB400] bg-opacity-20 backdrop-blur-sm rounded-full border border-[#FFB400] border-opacity-30 mb-6"
          >
            <span className="text-[#FFB400] font-semibold text-sm">
              Our Services
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Choose Your <span className="text-[#FFB400]">Service</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Premium cleaning services delivered with care and precision
          </motion.p>
        </motion.div>

        {/* Desktop Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => handleCategoryClick(category.category)}
              className="relative bg-white rounded-3xl p-8 cursor-pointer shadow-xl backdrop-blur-sm border border-gray-200 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCard === index ? 0.1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} rounded-3xl`}
              />

              {/* New Badge */}
              {category.isNew && (
                <div className="absolute top-4 right-4 z-20">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                  >
                    NEW
                  </motion.div>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10">
                {/* Icon/Image Container */}
                <motion.div
                  variants={iconVariants}
                  className="relative w-28 h-28 mx-auto mb-6"
                >
                  <div
                    className={`w-full h-full ${category.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-20 h-20 object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="w-20 h-20 items-center justify-center hidden">
                      <category.fallbackIcon className="w-16 h-16 text-[#1F3C88]" />
                    </div>
                  </div>

                  {/* Floating Animation Ring */}
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: hoveredCard === index ? 1.2 : 1,
                    }}
                    transition={{
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                      scale: { duration: 0.3 },
                    }}
                    className="absolute inset-0 border-2 border-dashed border-[#FFB400] border-opacity-30 rounded-2xl"
                  />
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-xl font-bold text-[#1F3C88] mb-3 text-center group-hover:text-[#FFB400] transition-colors duration-300"
                >
                  {category.name}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-gray-600 text-center mb-6 leading-relaxed"
                >
                  {category.description}
                </motion.p>

                {/* Price Display for PUC Certificate */}
                {category.price && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + index * 0.1 }}
                    className="text-center mb-4"
                  >
                    <span className="text-lg font-bold text-green-600">
                      {category.price}
                    </span>
                  </motion.div>
                )}

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#FFB400] hover:to-[#e0a000] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Book Now
                    <motion.div
                      animate={{ x: hoveredCard === index ? 5 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </motion.div>

                {/* Hover Effect Background */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: hoveredCard === index ? 1 : 0,
                    opacity: hoveredCard === index ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} rounded-3xl -z-10`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Carousel Layout */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-3xl">
            <motion.div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-full px-4"
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(category.category)}
                    className="bg-white rounded-3xl p-8 mx-2 cursor-pointer shadow-xl border border-gray-200 relative overflow-hidden"
                  >
                    {/* Mobile Card Content */}
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                          delay: 0.3,
                        }}
                        className="relative w-32 h-32 mx-auto mb-6"
                      >
                        <div
                          className={`w-full h-full ${category.bgColor} rounded-2xl flex items-center justify-center`}
                        >
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-24 h-24 object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div className="w-24 h-24 items-center justify-center hidden">
                            <category.fallbackIcon className="w-16 h-16 text-[#1F3C88]" />
                          </div>
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-bold text-[#1F3C88] mb-3">
                        {category.name}
                      </h3>

                      <p className="text-gray-600 mb-6 text-lg">
                        {category.description}
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#FFB400] hover:to-[#e0a000] transition-all duration-300 shadow-lg text-lg"
                      >
                        Book Now
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {categories.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-[#FFB400] shadow-lg scale-125"
                    : "bg-white bg-opacity-50 hover:bg-opacity-70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
