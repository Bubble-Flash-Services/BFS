import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../components/AuthContext";
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

export default function ServiceCategories({ onLoginRequired }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCategoryClick = (category) => {
    // Check if user is logged in
    if (!user) {
      // Store the intended destination for post-login redirect
      const destination = category === "laundry" ? "/laundry" : `/${category}`;
      localStorage.setItem("postLoginRedirect", JSON.stringify({ path: destination, ts: Date.now() }));
      
      // Trigger login modal
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    // User is logged in, proceed with navigation
    if (category === "laundry") {
      navigate("/laundry");
      return;
    }
    navigate(`/${category}`);
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
      // price: "From ₹599",
      isNew: true,
      isPopular: true,
    },
    {
      name: "Doorstep Key Services",
      image: "https://miro.medium.com/0*CfTIR5Aba91zLR9b.",
      category: "key-services",
      description: "Professional key duplication & lock services at doorstep",
      fallbackIcon: Shield,
      gradient: "from-amber-500 to-yellow-500",
      bgColor: "bg-amber-50",
      hoverColor: "hover:bg-amber-100",
      // price: "From ₹49",
      isNew: true,
      isPopular: true,
    },
    {
      name: "Vehicle Check-up",
      image:
        "https://media.istockphoto.com/id/1165665234/photo/car-maintenance-and-repair-mechanic-writing-checklist-paper-on-clipboard.jpg?s=612x612&w=0&k=20&c=yjR4V79WTKf6rO00v0ZqCzAoM8AZTdIlA4lP7T_dctg=",
      category: "services/vehicle-checkup",
      description: "Complete health inspection with 50+ point checklist",
      fallbackIcon: ShieldCheck,
      gradient: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
      // price: "From ₹199",
      isNew: true,
      isPopular: true,
    },
    {
      name: "PUC Certificate",
      image:
        "https://static-cdn.cars24.com/prod/auto-news24-cms/CARS24-Blog-Images/2024/10/30/9a10ae67-cc18-49cf-ac7e-7839736c1889-How-to-renew-a-PUC-certificate-online-%26-offline_-2024-guide.jpg",
      category: "services/puc-certificate",
      description: "Government-approved emission testing at your doorstep",
      fallbackIcon: ShieldCheck,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      // price: "From ₹149",
      isNew: true,
    },
    {
      name: "Insurance Assistance",
      image:
        "https://www.hdfcergo.com/images/default-source/car-insurance/benefits-of-roadside-assistance-cover-in-car-insurance.jpg",
      category: "services/insurance-assistance",
      description: "Compare & buy vehicle insurance from 10+ insurers",
      fallbackIcon: Shield,
      gradient: "from-blue-600 to-green-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      // price: "From ₹199",
      isNew: true,
      isPopular: true,
    },
    {
      name: "Painting Services",
      image: "https://5.imimg.com/data5/TR/QI/MY-4746650/painting-services.jpg",
      category: "painting-services",
      description: "Professional painting services for home & office",
      fallbackIcon: PaintBucket,
      gradient: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
      // price: "From ₹14/sq.ft",
      isNew: true,
      isPopular: true,
    },
    {
      name: "Movers & Packers",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrf-d-jS-tvWNRw5c3qUW51ArKXgFmFXZqpw&s",
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
      // price: "From ₹149",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      isNew: true,
      isPopular: true,
    },
    {
      name: "BFS AutoFix Pro",
      image:
        "https://t4.ftcdn.net/jpg/05/21/93/17/360_F_521931702_TXOHZBa3tLVISome894Zc061ceab4Txm.jpg",
      category: "autofix",
      description: "Doorstep Car Denting, Painting & Polishing",
      fallbackIcon: Wrench,
      gradient: "from-orange-500 to-red-500",
      // price: "From ₹799",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      isNew: true,
      isPopular: true,
    },
    {
      name: "Doorstep Mobile Repair",
      image:
        "https://www.fixma.in/storage/phonfix/img/blog/VQoN7ihOmvQldxdEqsVulqSCVQBJz254uF2j7Iwv.jpg",
      category: "mobilefix",
      description: "Professional mobile repair at your doorstep",
      fallbackIcon: Smartphone,
      gradient: "from-purple-500 to-indigo-500",
      // price: "From ₹299",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      isNew: true,
      isPopular: true,
    },
    {
      name: "BFS Flowers",
      image:
        "https://monsoonflowers.com/cdn/shop/articles/feature_image_1417065f-302c-49d7-8922-b7f884e3d8f5.webp?v=1735856265",
      category: "flowers",
      description: "Fresh flowers & bouquets for every occasion",
      fallbackIcon: Flower,
      gradient: "from-pink-500 to-rose-500",
      // price: "From ₹199",
      bgColor: "bg-pink-50",
      hoverColor: "hover:bg-pink-100",
      isNew: true,
      isPopular: true,
    },
  ];

  return (
    <section className="py-12 relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
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

        {/* Grid Layout - 5 per row on mobile, responsive for larger screens */}
        <div className="grid grid-cols-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.fallbackIcon;
            return (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.category)}
                className={`relative rounded-lg md:rounded-2xl cursor-pointer shadow-lg backdrop-blur-sm border border-white border-opacity-20 hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col bg-white bg-opacity-5 ${
                  isMobile ? 'h-28' : 'h-52 sm:h-60 md:h-72'
                }`}
              >
                {/* Background Image with Overlay - hide on mobile, show icon instead */}
                {!isMobile && (
                  <>
                    <div
                      className="absolute inset-0 z-0 opacity-40 group-hover:opacity-90 transition-opacity duration-300"
                      style={{
                        backgroundImage: `url('${category.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 z-0" />
                  </>
                )}
                
                {/* Mobile: Show icon with gradient background */}
                {isMobile && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 z-0`} />
                )}
                
                {/* New Badge */}
                {category.isNew && !isMobile && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold shadow-lg">
                      NEW
                    </div>
                  </div>
                )}

                {/* Popular Badge */}
                {category.isPopular && !category.isNew && !isMobile && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold shadow-lg">
                      POPULAR
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className={`relative z-10 flex flex-col h-full ${isMobile ? 'justify-center items-center p-1' : 'justify-end p-2.5 sm:p-3 md:p-4'}`}>
                  {/* Mobile: Icon-based layout */}
                  {isMobile ? (
                    <>
                      <div className={`w-8 h-8 rounded-full ${category.bgColor} flex items-center justify-center mb-1`}>
                        <IconComponent className={`w-5 h-5 bg-gradient-to-r ${category.gradient} bg-clip-text`} style={{ color: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
                      </div>
                      <h3 className="text-[9px] font-bold text-white text-center line-clamp-2 leading-tight px-0.5">
                        {category.name}
                      </h3>
                    </>
                  ) : (
                    <>
                      {/* Desktop: Original layout */}
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-white mb-1 md:mb-1.5 group-hover:text-[#FFB400] transition-colors duration-300 line-clamp-2">
                        {category.name}
                      </h3>

                      <p className="text-gray-200 mb-2 md:mb-3 leading-tight text-[10px] sm:text-xs line-clamp-2">
                        {category.description}
                      </p>

                      {category.price && (
                        <div className="mb-1.5 md:mb-2">
                          <span className="text-xs md:text-sm font-bold text-[#FFB400]">
                            {category.price}
                          </span>
                        </div>
                      )}

                      <div>
                        <button className="inline-flex items-center gap-1 md:gap-1.5 bg-gradient-to-r from-[#FFB400] to-[#e0a000] text-[#1F3C88] px-2.5 py-1.5 md:px-4 md:py-2 rounded-md md:rounded-lg font-semibold hover:from-[#e0a000] hover:to-[#FFB400] transition-all duration-300 shadow-lg hover:shadow-xl text-[10px] sm:text-xs">
                          Book Now
                          <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
