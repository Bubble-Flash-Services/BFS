import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Car,
  Bike,
  Shirt,
  Shield,
  Truck,
  ShieldCheck,
  PaintBucket,
  ShoppingBag,
  Wrench,
  Smartphone,
  Flower,
} from "lucide-react";

export default function ServiceCategories() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCategoryClick = (category) => {
    if (category === "laundry") {
      navigate("/laundry");
      return;
    }
    navigate(`/${category}`);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : categories.length - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < categories.length - 1 ? prev + 1 : 0));
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
      name: "Green and Clean Service",
      image: "/clean-home.jpg",
      category: "green",
      description: "Eco-friendly home & office cleaning services",
      fallbackIcon: Shirt,
      gradient: "from-green-600 to-teal-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      price: "From ₹599",
      isNew: true,
      isPopular: true,
    },
    {
      name: "Doorstep Key Services",
      image: "/services/keys/key-duplication.jpg",
      category: "key-services",
      description: "Professional key duplication & lock services at doorstep",
      fallbackIcon: Shield,
      gradient: "from-amber-500 to-yellow-500",
      bgColor: "bg-amber-50",
      hoverColor: "hover:bg-amber-100",
      price: "From ₹49",
      isNew: true,
      isPopular: true,
    },
    {
      name: "Vehicle Check-up",
      image: "/services/checkup/vehicle-inspection.jpg",
      category: "services/vehicle-checkup",
      description: "Complete health inspection with 50+ point checklist",
      fallbackIcon: ShieldCheck,
      gradient: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
      price: "From ₹199",
      isNew: true,
      isPopular: true,
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
      name: "Painting Services",
      image: "/services/painting/painting-main.jpg",
      category: "painting-services",
      description: "Professional painting services for home & office",
      fallbackIcon: PaintBucket,
      gradient: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
      price: "From ₹14/sq.ft",
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
      isNew: true,
    },
    {
      name: "Vehicle Accessories Store",
      image: "/car accessories/car cover.jpg",
      category: "vehicle-accessories",
      description: "Quality accessories for cars & bikes",
      fallbackIcon: ShoppingBag,
      gradient: "from-teal-500 to-cyan-500",
      price: "From ₹149",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      isNew: true,
      isPopular: true,
    },
    {
      name: "BFS AutoFix Pro",
      image: "/services/autofix/car-repair.jpg",
      category: "autofix",
      description: "Doorstep Car Denting, Painting & Polishing",
      fallbackIcon: Wrench,
      gradient: "from-orange-500 to-red-500",
      price: "From ₹799",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      isNew: true,
      isPopular: true,
    },
    {
      name: "Doorstep Mobile Repair",
      image: "/services/mobile/mobile-repair.jpg",
      category: "mobilefix",
      description: "Professional mobile repair at your doorstep",
      fallbackIcon: Smartphone,
      gradient: "from-purple-500 to-indigo-500",
      price: "From ₹299",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      isNew: true,
      isPopular: true,
    },
    {
      name: "BFS Flowers",
      image: "/services/flowers/flowers-main.jpg",
      category: "flower-services",
      description: "Fresh flowers & bouquets for every occasion",
      fallbackIcon: Flower,
      gradient: "from-pink-500 to-rose-500",
      price: "From ₹199",
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
      isNew: true,
      isPopular: true,
    },
  ];

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-[#FFB400] bg-opacity-20 backdrop-blur-sm rounded-full border border-[#FFB400] border-opacity-30 mb-6">
            <span className="text-[#FFB400] font-semibold text-sm">
              Our Services
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your <span className="text-[#FFB400]">Service</span>
          </h2>

          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Premium cleaning services delivered with care and precision
          </p>
        </div>

        {/* Desktop Grid Layout - 3 per row */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            return (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.category)}
                className="relative rounded-3xl cursor-pointer shadow-xl backdrop-blur-sm border border-gray-200 hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col h-80"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${category.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* New Badge */}
                {category.isNew && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      NEW
                    </div>
                  </div>
                )}

                {/* Popular Badge */}
                {category.isPopular && !category.isNew && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      POPULAR
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-end p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFB400] transition-colors duration-300">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-200 mb-4 leading-relaxed text-sm">
                    {category.description}
                  </p>

                  {/* Price Display */}
                  {category.price && (
                    <div className="mb-3">
                      <span className="text-base font-bold text-[#FFB400]">
                        {category.price}
                      </span>
                    </div>
                  )}

                  {/* CTA Button */}
                  <div>
                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFB400] to-[#e0a000] text-[#1F3C88] px-5 py-2.5 rounded-xl font-semibold hover:from-[#e0a000] hover:to-[#FFB400] transition-all duration-300 shadow-lg hover:shadow-xl text-sm">
                      Book Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Carousel Layout */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className="min-w-full px-4"
                >
                  <div
                    onClick={() => handleCategoryClick(category.category)}
                    className="rounded-3xl mx-2 cursor-pointer shadow-xl border border-gray-200 relative overflow-hidden h-96 flex flex-col justify-end p-8"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${category.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Mobile Card Content */}
                    <div className="text-center">
                      {category.isNew && (
                        <div className="absolute top-4 right-4 z-20">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            NEW
                          </div>
                        </div>
                      )}

                      {category.isPopular && !category.isNew && (
                        <div className="absolute top-4 right-4 z-20">
                          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            POPULAR
                          </div>
                        </div>
                      )}

                      <h3 className="text-2xl font-bold text-white mb-3">
                        {category.name}
                      </h3>

                      <p className="text-gray-200 mb-6 text-lg">
                        {category.description}
                      </p>

                      {category.price && (
                        <div className="mb-4">
                          <span className="text-lg font-bold text-[#FFB400]">
                            {category.price}
                          </span>
                        </div>
                      )}

                      <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFB400] to-[#e0a000] text-[#1F3C88] px-8 py-4 rounded-xl font-semibold hover:from-[#e0a000] hover:to-[#FFB400] transition-all duration-300 shadow-lg text-lg">
                        Book Now
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={handlePrevSlide}
              className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition-all duration-300"
            >
              <ArrowRight className="w-5 h-5 transform rotate-180" />
            </button>
            
            {/* Mobile Slide Indicators */}
            <div className="flex justify-center space-x-3">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-[#FFB400] shadow-lg scale-125"
                      : "bg-white bg-opacity-50 hover:bg-opacity-70"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextSlide}
              className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-opacity-30 transition-all duration-300"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
