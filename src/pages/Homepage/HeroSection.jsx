import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  Phone,
  MapPin,
  ChevronDown,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import ServiceCategories from "./services/ServiceCategories";
import SigninModal from "./signin/SigninModal";
import SignupModal from "./signup/SignupModal";
import AddressAutocomplete from "../../components/AddressAutocomplete";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";
import { addressAPI } from "../../api/address";

const API = import.meta.env.VITE_API_URL || window.location.origin;

const FAQS = [
  {
    question: "How do I request a laundry pickup?",
    answer:
      "You can request a laundry pickup by filling out the callback form on this page or by contacting us via WhatsApp. Our team will schedule a convenient pickup time for you.",
  },
  {
    question: "What services does Bubble Flash offer?",
    answer:
      "Bubble Flash offers laundry, car cleaning, and bike cleaning services. You can book any of these services online or by contacting our support team.",
  },
  {
    question: "What are your operating hours?",
    answer:
      "We operate between 9 AM and 8 PM from Monday to Saturday, and 10 AM to 6 PM on Sundays.",
  },
];

// Updated real client reviews (all 5 stars) – avatar shows first letter of name
const testimonials = [
  {
    name: "Keerthana N M",
    text: "I recently had my bike washed at my doorstep and was thoroughly impressed! Quick, efficient and sparkling clean. Friendly staff made the whole experience smooth.",
  },
  {
    name: "Ankitha N Raj",
    text: "Deluxe Car Wash + Bike Wash – both done meticulously. Sparkling results and very reasonable pricing.",
  },
  {
    name: "Anusha HG",
    text: "Took the ₹249 Basic Car Wash – great experience, clean finish and super value for money.",
  },
  {
    name: "Nurayne Raja",
    text: "Fantastic bike wash! Quick, efficient and spotless for just ₹99. Great value.",
  },
  {
    name: "Mehta Vidhan",
    text: "These guys cleaned my car just like new. Very affordable car & bike washing in Bangalore.",
  },
  {
    name: "Raghu Narasimhan",
    text: "Excellent and neat work by the staff. I book them regularly every 2 months.",
  },
  {
    name: "Ali Yawar Hayat",
    text: "Very good and professional doorstep service.",
  },
  {
    name: "Chhotu Kumar",
    text: "Mind‑blowing car wash! Convenient, affordable (₹199) and my car looks brand new.",
  },
  {
    name: "Sudhir S Kamath",
    text: "Excellent wash. Neat, clean and very cooperative staff (special mention: Chetan).",
  },
  {
    name: "Mohammed Parveez",
    text: "Chetan cleaned the vehicle professionally and was very polite.",
  },
  {
    name: "Jyothika Reddy",
    text: "Great job on my car wash. Definitely give them a chance.",
  },
  {
    name: "Shankar Shani",
    text: "Excellent service. Just ₹199 and my car looks new. Already referred friends.",
  },
  {
    name: "Nathalia Helen Lobo",
    text: "Wonderful, simple service – sparkling car. Very satisfied.",
  },
  {
    name: "Imran Pasha",
    text: "Best doorstep service. Very reasonable and they covered every part. Got 3 bikes serviced.",
  },
  {
    name: "Global Traders",
    text: "Just ₹99 for bike wash at home – unbelievable. Highly recommend. Friendly staff.",
  },
  {
    name: "Zabeeulla Baig",
    text: "Tried twice – excellent service, loved it.",
  },
  {
    name: "H B",
    text: "Excellent service. Polite staff & reasonable charges.",
  },
  {
    name: "Srinidhi",
    text: "Mind‑blowing bike wash! Affordable (₹89) and results are amazing.",
  },
  {
    name: "Kiran Kumar K",
    text: "Very good experience. They arrived on time and did excellent work.",
  },
  { name: "S Wazarat Ali", text: "Very good." },
  { name: "Parsu Nadhan", text: "Wonderful service." },
  { name: "Karthik C", text: "Best service." },
  { name: "Sivasankar Sankar", text: "Best service." },
  {
    name: "Kutti Reddy",
    text: "Highly recommend. Excellent work. Fully satisfied.",
  },
  { name: "Muralidharan Reddy", text: "Excellent work. Value for money." },
].map((r) => ({ ...r, stars: 5 }));

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-rose-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-purple-600",
  "bg-cyan-600",
];

const getInitial = (name = "?") => name.trim()[0]?.toUpperCase() || "?";

// Helper: Category options per service for the 2-step booking
function getCategoriesForService(service) {
  switch (service) {
    case "Car":
      return [
        { value: "hatchbacks", label: "Hatchback", icon: "/car/car1.png" },
        { value: "sedans", label: "Sedan", icon: "/car/car2.png" },
        {
          value: "midsuv",
          label: "Mid-SUV",
          icon: "/car/suv/pexels-eng_hk-2153621871-33018219.png",
        },
        { value: "suv", label: "SUV", icon: "/car/car3.png" },
        { value: "luxuries", label: "Luxury", icon: "/car/suv/luxury_suv.png" },
      ];
    case "Bike":
      return [
        {
          value: "commuter",
          label: "Commuter",
          icon: "/bike/commuter/tvs-ntorq-125-race-edition-matte-white-175501476-vc4uk (1).png",
        },
        {
          value: "cruiser",
          label: "Cruiser",
          icon: "/bike/cruiser/pexels-sahil-dethe-590388386-17266142.png",
        },
        {
          value: "sports",
          label: "Sports",
          icon: "/bike/sports/pexels-shrinidhi-holla-30444780.png",
        },
      ];
    case "Helmet":
      return [
        {
          value: "commuter",
          label: "Commuter Helmets",
          icon: "/helmet/commuter & midsize/DeWatermark.ai_1755851377971.jpeg",
        },
        {
          value: "midsize",
          label: "Mid-Size Helmets",
          icon: "/helmet/midsize/midsize2.jpg",
        },
        {
          value: "sports-touring",
          label: "Sports / Touring Helmets",
          icon: "/helmet/sports/DeWatermark.ai_1755851442324.jpeg",
        },
        {
          value: "premium",
          label: "Premium Helmets",
          icon: "/helmet/helmethome.png",
        },
      ];
    default:
      return [];
  }
}

export default function HeroSection() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  // New minimal 2-step booking state
  const [bookingService, setBookingService] = useState(""); // Car | Bike | Laundry | Helmet
  const [bookingCategory, setBookingCategory] = useState(""); // e.g., Sedan, SUV, etc.
  const [selectedLocation, setSelectedLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [addressData, setAddressData] = useState(null); // Store complete address data

  // Auth modals control
  const [openSignin, setOpenSignin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

  // Callback form state
  const [cbName, setCbName] = useState("");
  const [cbPhone, setCbPhone] = useState("");
  const [cbEmail, setCbEmail] = useState("");
  const [cbMessage, setCbMessage] = useState("");
  const [cbSending, setCbSending] = useState(false);

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    if (!cbName.trim() || !cbPhone.trim()) {
      alert("Please enter your name and phone number");
      return;
    }
    try {
      setCbSending(true);
      const res = await fetch(`${API}/api/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cbName,
          phone: cbPhone,
          email: cbEmail,
          message: cbMessage,
          source: "homepage",
        }),
      });
      const result = await res.json().catch(() => ({ success: false }));
      if (res.ok && result?.success) {
        alert("Thanks! We'll call you back shortly.");
        setCbName("");
        setCbPhone("");
        setCbEmail("");
        setCbMessage("");
      } else {
        alert(
          result?.message || "Failed to send request. Please try WhatsApp."
        );
      }
    } catch (err) {
      console.error("callback submit failed:", err);
      alert("Network error. Please try again.");
    } finally {
      setCbSending(false);
    }
  };

  // Auto-populate form fields from user profile
  useEffect(() => {
    if (user) {
      // Set phone number from user profile if available
      if (user.phone && !phoneNumber) {
        setPhoneNumber(user.phone);
      }
      // Set address from user profile if available and no current location is set
      if (user.address && !fullAddress) {
        setFullAddress(user.address);
      }
    }
  }, [user, phoneNumber, fullAddress]);

  // Add state for FAQ and testimonials carousel
  const [openIdx, setOpenIdx] = useState(-1); // Changed from 0 to -1 so no FAQ is open by default
  const [visibleCount, setVisibleCount] = useState(4);
  const [carousel, setCarousel] = useState(testimonials);
  const [accessorySlide, setAccessorySlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const accessorySliderRef = useRef(null);
  const [heroSlide, setHeroSlide] = useState(0);

  // Launch Advertisement Modal State
  const [showLaunchAd, setShowLaunchAd] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show launch advertisement on component mount
  useEffect(() => {
    // Check if user has already seen the ad today
    const lastAdShown = localStorage.getItem("launchAdShown");
    const today = new Date().toDateString();

    if (lastAdShown !== today) {
      // Show ad after a short delay
      const timer = setTimeout(() => {
        setShowLaunchAd(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  // If user just logged in and we have a stored redirect, navigate there
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem("postLoginRedirect");
      if (!raw) return;
      const data = JSON.parse(raw);
      // Optional: Expire after 15 minutes
      if (data?.path && (!data.ts || Date.now() - data.ts < 15 * 60 * 1000)) {
        navigate(data.path, { replace: true });
        localStorage.removeItem("postLoginRedirect");
      }
    } catch {}
  }, [user, navigate]);

  // Close launch ad and remember user has seen it
  const closeLaunchAd = () => {
    setShowLaunchAd(false);
    localStorage.setItem("launchAdShown", new Date().toDateString());
  };
  const startX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    // Get current location using the new address API
    const getCurrentLocation = async () => {
      try {
        // Check if geolocation is available
        if (!navigator.geolocation) {
          console.warn("Geolocation is not supported by this browser");
          // Don't prefill any default address
          return;
        }

        // Check if we're on HTTPS (required for geolocation in production)
        if (
          location.protocol !== "https:" &&
          location.hostname !== "localhost"
        ) {
          console.warn("Geolocation requires HTTPS");
          // Don't prefill any default address
          return;
        }

        const result = await addressAPI.getCurrentAddress();
        if (result.success) {
          setFullAddress(result.data.fullAddress);
          setSelectedLocation(result.data.fullAddress);
          setAddressData(result.data);
        } else {
          // Silently handle location errors and do not set a default address
        }
      } catch (error) {
        // Silently handle errors and do not set a default address
      }
    };

    getCurrentLocation();
  }, []);

  // Responsive visibleCount for testimonials
  useEffect(() => {
    function handleResize() {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide functionality for accessories slider

  useEffect(() => {
    const interval = setInterval(() => {
      setCarousel((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hero carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 3); // 3 hero slides
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = ["Car Wash", "Bike Wash", "Laundry Service", "Helmet"];
  const locations = [fullAddress || "", ""];

  // Hero carousel slides data
  const heroSlides = [
    {
      badge: "Trusted by 2000+ customers",
      title: "Branded & Professional",
      highlight: "Cleaning Services",
      subtitle: "for Cars, Bikes & More",
      description: "Experience top-tier car wash, bike detailing, and laundry care – all under one roof in Bengaluru. Quality service, every time.",
      stats: [
        { value: "2000+", label: "Happy Customers" },
        { value: "100%", label: "Satisfaction" },
        { value: "15+", label: "Services" },
      ],
    },
    {
      badge: "Premium Quality Services",
      title: "Doorstep Service",
      highlight: "At Your Convenience",
      subtitle: "Anywhere in Bangalore",
      description: "We bring professional cleaning services right to your doorstep. Save time and enjoy hassle-free, premium quality service.",
      stats: [
        { value: "24/7", label: "Available" },
        { value: "30Min", label: "Response Time" },
        { value: "5★", label: "Rated" },
      ],
    },
    {
      badge: "Eco-Friendly Products",
      title: "Safe & Effective",
      highlight: "Cleaning Solutions",
      subtitle: "for Your Vehicles",
      description: "Using only premium, eco-friendly products that are gentle on your vehicles and safe for the environment.",
      stats: [
        { value: "100%", label: "Eco-Safe" },
        { value: "50+", label: "Products" },
        { value: "10+", label: "Years Experience" },
      ],
    },
  ];

  // Car wash accessories data
  const accessories = [
    {
      img: "/car accessories/air freshner.jpg",
      title: "Air Freshener",
      price: 149,
      oldPrice: 199,
      offer: "25%off",
      stars: 4,
      tag: "₹ 149 only",
    },
    // Car Cover split into three variants (same image)
    {
      img: "/car accessories/car cover.jpg",
      title: "Car Cover (Basic)",
      price: 999,
      oldPrice: 1299,
      offer: "23%off",
      stars: 4,
      tag: "₹ 999 only",
    },
    {
      img: "/car accessories/car cover.jpg",
      title: "Car Cover (Premium)",
      price: 1699,
      oldPrice: 1999,
      offer: "15%off",
      stars: 4,
      tag: "₹ 1699 only",
    },
    {
      img: "/car accessories/car cover.jpg",
      title: "Car Cover (Luxury)",
      price: 2229,
      oldPrice: 2599,
      offer: "14%off",
      stars: 4,
      tag: "₹ 2229 only",
    },
    {
      img: "/car accessories/car washing gloves.jpg",
      title: "Washing Gloves",
      price: 199,
      oldPrice: 299,
      offer: "33%off",
      stars: 4,
      tag: "₹ 199 only",
    },
    {
      img: "/car accessories/degreasers.jpg",
      title: "Degreaser",
      price: 249,
      oldPrice: 349,
      offer: "28%off",
      stars: 4,
      tag: "₹ 249 only",
    },
    {
      img: "/car accessories/drying towel.jpg",
      title: "Drying Towels",
      price: 1399,
      oldPrice: 1599,
      offer: "13%off",
      stars: 4,
      tag: "₹ 1399 only",
    },
    {
      img: "/car accessories/foot paper.jpg",
      title: "Paper Mat (each)",
      price: 5,
      oldPrice: 10,
      offer: "50%off",
      stars: 3,
      tag: "₹ 5 only",
    },
    // Mobile Holder split (same image)
    {
      img: "/car accessories/mobile stand.jpg",
      title: "Mobile Holder (Basic)",
      price: 249,
      oldPrice: 299,
      offer: "17%off",
      stars: 4,
      tag: "₹ 249 only",
    },
    {
      img: "/car accessories/mobile stand.jpg",
      title: "Mobile Holder (Premium)",
      price: 369,
      oldPrice: 449,
      offer: "18%off",
      stars: 4,
      tag: "₹ 369 only",
    },
    {
      img: "/car accessories/Sprays.jpg",
      title: "Spray Bottle",
      price: 129,
      oldPrice: 199,
      offer: "35%off",
      stars: 4,
      tag: "₹ 129 only",
    },
    {
      img: "/car accessories/tissue box.jpg",
      title: "Tissue Box",
      price: 159,
      oldPrice: 220,
      offer: "28%off",
      stars: 4,
      tag: "₹ 159 only",
    },
    // Add Microfiber Cloth
    {
      img: "/car accessories/towels.jpg",
      title: "Microfiber Cloth",
      price: 120,
      oldPrice: 149,
      offer: "19%off",
      stars: 4,
      tag: "₹ 120 only",
    },
    // Bike Cover split into three variants (same image)
    {
      img: "/car accessories/bike cover.jpg",
      title: "Bike Cover (Basic)",
      price: 299,
      oldPrice: 349,
      offer: "14%off",
      stars: 4,
      tag: "₹ 299 only",
    },
    {
      img: "/car accessories/bike cover.jpg",
      title: "Bike Cover (Premium)",
      price: 399,
      oldPrice: 469,
      offer: "15%off",
      stars: 4,
      tag: "₹ 399 only",
    },
    {
      img: "/car accessories/bike cover.jpg",
      title: "Bike Cover (Luxury)",
      price: 699,
      oldPrice: 799,
      offer: "13%off",
      stars: 4,
      tag: "₹ 699 only",
    },
  ];

  // Navigation for accessories slider: use car-wash style sliding
  // Desktop shows 3 products per slide; Mobile shows 1 per slide
  const cardsPerSlide = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(accessories.length / cardsPerSlide); // number of slide groups

  const handleDotClick = (idx) =>
    setAccessorySlide(Math.max(0, Math.min(totalSlides - 1, idx)));
  const handlePrev = () => setAccessorySlide((s) => Math.max(0, s - 1));
  const handleNext = () =>
    setAccessorySlide((s) => Math.min(totalSlides - 1, s + 1));

  // Touch handlers for mobile dragging (match BikeWashDeals mobile behavior)
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX;
  };

  // Helper to build stable IDs for accessories (prevents merging into first item on some devices)
  const accessorySlug = (title = "") =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

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
      if (diffX > 0 && accessorySlide < totalSlides - 1) {
        setAccessorySlide((s) => Math.min(totalSlides - 1, s + 1));
      } else if (diffX < 0 && accessorySlide > 0) {
        setAccessorySlide((s) => Math.max(0, s - 1));
      }
    }
  };

  const handleAddToCart = (itemOrEvent) => {
    // Support being called with event (from delegated click) or direct item
    let item = itemOrEvent;
    if (itemOrEvent?.currentTarget && !itemOrEvent.title) {
      const el = itemOrEvent.currentTarget;
      const slugAttr = el.getAttribute("data-slug");
      if (slugAttr) {
        item =
          accessories.find((a) => accessorySlug(a.title) === slugAttr) ||
          accessories[0];
      }
    }
    if (!item) return;
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    const slug = accessorySlug(item.title);
    const baseId = `accessory-${slug}`;
    const cartItem = {
      id: `${baseId}-${Date.now()}`,
      serviceId: baseId,
      name: item.title,
      serviceName: `Accessory: ${item.title}`,
      price: item.price,
      oldPrice: item.oldPrice,
      offer: item.offer,
      img: item.img,
      image: item.img,
      type: "accessory",
      category: "Car Accessories",
      // UI display fields so cart shows details
      packageName: item.title,
      packageDetails: { basePrice: item.price, addons: [], features: [] },
      includedFeatures: [],
      uiAddOns: [],
    };
    addToCart(cartItem);
    toast.success(`${item.title} added to cart`);
  };

  // Handle address selection from autocomplete
  const handleAddressSelect = (selectedAddress) => {
    setFullAddress(selectedAddress.fullAddress);
    setSelectedLocation(selectedAddress.fullAddress);
    setAddressData(selectedAddress);
  };

  const handleBookService = async () => {
    // Validate all required fields
    if (!selectedCategory) {
      alert("Please select a service category");
      return;
    }
    if (!pickupDate) {
      alert("Please select a pickup date");
      return;
    }
    if (!phoneNumber) {
      alert("Please enter your phone number");
      return;
    }
    if (!fullAddress || !selectedLocation) {
      alert("Please enter your location");
      return;
    }

    // Optional: Check Bangalore service availability using pincode when possible
    try {
      let pinToCheck = null;
      if (addressData?.pincode) {
        pinToCheck = addressData.pincode;
      } else if (typeof fullAddress === "string") {
        const match = fullAddress.match(/\b\d{6}\b/);
        if (match) pinToCheck = match[0];
      }

      if (pinToCheck && /^\d{6}$/.test(pinToCheck)) {
        const availability = await addressAPI.checkServiceAvailability(
          pinToCheck
        );
        if (
          availability &&
          availability.success &&
          availability.available === false
        ) {
          alert(
            availability.message ||
              "We currently serve only Bangalore pincodes — coming soon to your area!"
          );
          return;
        }
      }
    } catch (err) {
      console.error("Availability check failed:", err);
      // Fail open to not block booking UI — server validates again during order/address
    }

    // Store booking data in localStorage for the service page to use
    const bookingData = {
      category: selectedCategory,
      pickupDate,
      phoneNumber,
      address: fullAddress,
      location: selectedLocation,
      addressData: addressData, // Include complete address data
      timestamp: Date.now(),
    };
    localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

    // Navigate based on selected category
    switch (selectedCategory) {
      case "Car Wash":
        navigate("/cars");
        break;
      case "Bike Wash":
        navigate("/bikes");
        break;
      case "Laundry Service":
        navigate("/laundry");
        break;
      case "Helmet":
        navigate("/helmets");
        break;
      default:
        alert("Please select a valid service category");
    }
  };

  return (
    <>
      {/* Launch Advertisement Modal */}
      <AnimatePresence>
        {showLaunchAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeLaunchAd}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 max-w-lg mx-4 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLaunchAd}
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold z-10"
              >
                ×
              </button>

              {/* Animated Background Pattern */}
              <div className="absolute inset-0">
                {/* Continuous Confetti Animation */}
                <Confetti
                  width={Math.min(500, windowDimensions.width * 0.9)}
                  height={Math.min(600, windowDimensions.height * 0.8)}
                  numberOfPieces={isMobile ? 100 : 150}
                  recycle={true}
                  colors={[
                    "#FFD700",
                    "#FF6B6B",
                    "#4ECDC4",
                    "#45B7D1",
                    "#96CEB4",
                    "#FFEAA7",
                    "#DDA0DD",
                    "#98D8C8",
                  ]}
                  gravity={0.1}
                  wind={0.02}
                  opacity={0.8}
                  className="absolute inset-0"
                />
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -top-20 -right-20 w-40 h-40 border-4 border-white border-opacity-20 rounded-full"
                />
                <motion.div
                  animate={{
                    rotate: [360, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -bottom-16 -left-16 w-32 h-32 border-4 border-white border-opacity-10 rounded-full"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 text-center text-white">
                {/* Launch Badge */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
                >
                  <span className="text-sm font-semibold">
                    🚀 WEBSITE LAUNCH
                  </span>
                </motion.div>

                {/* Main Heading */}
                <h2 className="text-3xl font-bold mb-2">Grand Opening</h2>
                <h3 className="text-xl font-semibold mb-4">
                  Special Launch Offers!
                </h3>

                {/* Offers Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-2xl font-bold text-yellow-300">
                      10%
                    </div>
                    <div className="text-sm">OFF First Order</div>
                  </div>
                  <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-2xl font-bold text-green-300">
                      FREE
                    </div>
                    <div className="text-sm">Pickup & Delivery</div>
                  </div>
                </div>

                {/* Service Icons */}
                <div className="flex justify-center space-x-4 mb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                      🚗
                    </div>
                    <div className="text-xs">Car Wash</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                      🏍️
                    </div>
                    <div className="text-xs">Bike Wash</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2 mx-auto">
                      👕
                    </div>
                    <div className="text-xs">Laundry</div>
                  </div>
                </div>

                {/* Call to Action */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    closeLaunchAd();
                    document
                      .getElementById("services")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors duration-200 mb-4"
                >
                  Book Now & Save 10%!
                </motion.button>

                {/* Validity */}
                <p className="text-sm text-white text-opacity-80">
                  • Limited time offer
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Modern Design - Now includes services */}
      <section
        id="home"
        className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden"
      >
        {/* Launch Offer Top Banner */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-20 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white py-3 px-4 overflow-hidden"
        >
          {/* Subtle Confetti for Banner */}
          <Confetti
            width={windowDimensions.width}
            height={100}
            numberOfPieces={30}
            recycle={true}
            colors={["#FFD700", "#FFA500", "#FF4500", "#FFFFFF"]}
            gravity={0.05}
            wind={0.01}
            opacity={0.6}
            className="absolute inset-0 pointer-events-none"
          />
          <div className="container mx-auto text-center relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center space-x-2"
              >
                <span className="text-lg">🎉</span>
                <span className="font-bold text-sm sm:text-base">
                  WEBSITE LAUNCH SPECIAL
                </span>
                <span className="text-lg">🎉</span>
              </motion.div>
              <div className="flex items-center space-x-4 text-sm sm:text-base">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full font-semibold">
                  10% OFF First Order
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full font-semibold">
                  FREE Delivery
                </span>
                <button
                  onClick={() =>
                    document
                      .getElementById("services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-white text-orange-600 px-4 py-1 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  Book Now!
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-10 w-72 h-72 bg-[#FFB400] rounded-full opacity-10 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 left-10 w-96 h-96 bg-[#FFB400] rounded-full opacity-5 blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Hero Content - Left Side with Carousel */}
            <div className="text-white space-y-6 max-w-2xl lg:text-left text-center flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-flex items-center px-4 py-2 bg-[#FFB400] bg-opacity-20 backdrop-blur-sm rounded-full border border-[#FFB400] border-opacity-30"
                  >
                    <Star className="w-4 h-4 text-[#FFB400] mr-2" />
                    <span className="text-sm font-medium text-[#FFB400]">
                      {heroSlides[heroSlide].badge}
                    </span>
                  </motion.div>

                  {/* Main Heading */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold leading-tight"
                  >
                    {heroSlides[heroSlide].title}
                    <span className="block text-[#FFB400]">{heroSlides[heroSlide].highlight}</span>
                    <span className="block text-2xl md:text-4xl font-normal text-gray-200 mt-2">
                      {heroSlides[heroSlide].subtitle}
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-200 leading-relaxed"
                  >
                    {heroSlides[heroSlide].description}
                  </motion.p>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex justify-center lg:justify-start gap-8 md:gap-16 pt-6"
                  >
                    {heroSlides[heroSlide].stats.map((stat, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.1 }}
                        className="text-center"
                      >
                        <div className="text-3xl md:text-5xl font-bold text-[#FFB400]">
                          {stat.value}
                        </div>
                        <div className="text-sm md:text-base text-gray-200 font-medium mt-1">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Navigation Dots */}
              <div className="flex justify-center lg:justify-start gap-2 mt-8">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroSlide(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      heroSlide === idx
                        ? 'w-8 h-2 bg-[#FFB400]'
                        : 'w-2 h-2 bg-white bg-opacity-40 hover:bg-opacity-60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Hero Image and Video - COMMENTED OUT AS PER REQUIREMENT
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex-1 lg:flex-[1.5] w-full"
            >
              <video
                src="/car/home.mp4"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
                controls
                autoPlay
                loop
                muted
                playsInline
              />
            </motion.div>
            <motion.img
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              src="/bfsHero.jpeg"
              alt="About Bubble Flash Services"
              className="w-full h-auto max-h-[540px] lg:flex-1 object-cover shadow-2xl rounded-3xl"
            />
            END OF COMMENTED OUT SECTION */}
          </div>

          {/* Service Categories - Moved after Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-20"
          >
            <div id="services" className="w-full">
              <ServiceCategories onLoginRequired={() => setOpenSignin(true)} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section with Light Theme */}
      <div className="bg-gray-50">
        <section id="aboutus" className="py-16">
          {/* AboutPage content start */}
          <div>
            <div className="max-w-6xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row gap-8 items-start"
              >
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="flex-1 lg:flex-[1.5]" // give more flex space
                >
                  <video
                    src="/car/home.mp4"
                    className="rounded-2xl shadow-2xl w-full h-[400px] object-cover" // larger height
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="flex-1"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-2xl font-bold text-[#1F3C88] mb-2"
                  >
                    About us
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-lg text-gray-600 mb-4 leading-relaxed"
                  >
                    At Bubble Flash, we’re passionate about making your vehicles
                    and wardrobe shine! Based in the heart of Bengaluru, we
                    provide top-tier car washing, bike detailing, and laundry
                    care services, all under one roof – because we believe
                    convenience should never compromise quality.
                  </motion.p>
                  <motion.ul
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="text-base text-gray-600 mb-2 space-y-2"
                  >
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.2, duration: 0.4 }}
                      className="flex items-center"
                    >
                      <img
                        src="/aboutus/circle-check.png"
                        alt="check"
                        className="inline w-4 h-4 mr-3 align-middle"
                      />
                      Over 2,000 cleans
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.4, duration: 0.4 }}
                      className="flex items-center"
                    >
                      <img
                        src="/aboutus/circle-check.png"
                        alt="check"
                        className="inline w-4 h-4 mr-3 align-middle"
                      />
                      Combo plans & special program plans offered
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.6, duration: 0.4 }}
                      className="flex items-center"
                    >
                      <img
                        src="/aboutus/circle-check.png"
                        alt="check"
                        className="inline w-4 h-4 mr-3 align-middle"
                      />
                      100 % Customer satisfaction
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.8, duration: 0.4 }}
                      className="flex items-center"
                    >
                      <img
                        src="/aboutus/circle-check.png"
                        alt="check"
                        className="inline w-4 h-4 mr-3 align-middle"
                      />
                      Doorstep services available
                    </motion.li>
                  </motion.ul>
                </motion.div>
              </motion.div>
              {/* HOW IT WORKS SECTION - COMMENTED OUT AS PER REQUIREMENT
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex justify-center mt-8 mb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#FFB400] bg-opacity-20 backdrop-blur-sm border border-[#FFB400] border-opacity-30 text-xs text-[#FFB400] px-6 py-2 rounded-full font-semibold tracking-wide hover:bg-opacity-30 transition-all"
                >
                  HOW IT WORK
                </motion.button>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-2xl font-bold text-[#1F3C88] text-center mb-8"
              >
                Book with following 3 working steps
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-row w-full mb-12"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3 shadow-lg"
                  >
                    <img
                      src="/aboutus/location.png"
                      alt="Choose location"
                      className="w-7 h-7 md:w-10 md:h-10"
                    />
                  </motion.div>
                  <div className="font-semibold text-xs md:text-base text-center text-[#1F3C88]">
                    Choose location
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-600 text-center">
                    Choose your and find your best car
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3 shadow-lg"
                  >
                    <img
                      src="/aboutus/pickup-date.png"
                      alt="Pick-up date"
                      className="w-7 h-7 md:w-10 md:h-10"
                    />
                  </motion.div>
                  <div className="font-semibold text-xs md:text-base text-center text-[#1F3C88]">
                    Pick-up date
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-600 text-center">
                    Select your pick up date and time to book your car
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3 shadow-lg"
                  >
                    <img
                      src="/aboutus/bookyourwash.png"
                      alt="Book your wash"
                      className="w-7 h-7 md:w-10 md:h-10"
                    />
                  </motion.div>
                  <div className="font-semibold text-xs md:text-base text-center text-[#1F3C88]">
                    Book your wash
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-600 text-center">
                    Book your car for doorstep service
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3 shadow-lg"
                  >
                    <img
                      src="/aboutus/expierencewash.png"
                      alt="Experience wash"
                      className="w-7 h-7 md:w-10 md:h-10"
                    />
                  </motion.div>
                  <div className="font-semibold text-xs md:text-base text-center text-[#1F3C88]">
                    Experience wash
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-600 text-center">
                    Don't worry, we have many experienced professionals
                  </div>
                </motion.div>
              </motion.div>
              END OF HOW IT WORKS SECTION */}
              {/* <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="flex flex-col items-center"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src="/laundry/laundry.gif"
                    alt="Laundry"
                    className="rounded-xl w-full h-[170px] object-cover mb-4 shadow-lg"
                  />
                  <div className="text-xl font-bold text-center text-[#1F3C88]">
                    Wash & Fold
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="flex flex-col items-center"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src="/bike/bikewash.gif"
                    alt="Bike"
                    className="rounded-xl w-full h-[170px] object-cover mb-4 shadow-lg"
                  />
                  <div className="text-xl font-bold text-center text-[#1F3C88]">
                    Bring Back the Shine
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="flex flex-col items-center"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src="/car/carwash.gif"
                    alt="Car"
                    className="rounded-xl w-full h-[170px] object-cover mb-4 shadow-lg"
                  />
                  <div className="text-xl font-bold text-center text-[#1F3C88]">
                    Car Clean
                  </div>
                </motion.div>
              </motion.div> */}
            </div>
          </div>
          {/* AboutPage content end */}
        </section>
      </div>
      {/* Car wash Accessories Section - Matching ServiceCategories Style */}
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
                Our Products
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Car wash <span className="text-[#FFB400]">Accessories</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-200 max-w-2xl mx-auto"
            >
              Premium car care accessories for the perfect wash
            </motion.p>
          </motion.div>

          {/* Desktop and Mobile Slider Layout with Arrows */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
              },
            }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Slider Container */}
            <div className="relative flex items-center justify-center gap-4 max-w-7xl mx-auto">
              {/* Left Arrow (car-wash style) */}
              <button
                onClick={handlePrev}
                disabled={accessorySlide === 0}
                className={`absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                  accessorySlide === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 hover:shadow-xl"
                }`}
                aria-label="Previous"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Cards Container */}
              <div className="overflow-hidden flex-1 max-w-5xl">
                <motion.div
                  className={`flex slider-container transition-transform duration-300 ease-in-out`}
                  style={{
                    transform: `translateX(-${
                      accessorySlide * (isMobile ? 85 : 100)
                    }%)`,
                    touchAction: "pan-y pinch-zoom",
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {Array.from({ length: totalSlides }, (_, slideIndex) => {
                    const group = accessories.slice(
                      slideIndex * cardsPerSlide,
                      slideIndex * cardsPerSlide + cardsPerSlide
                    );
                    return (
                      <div
                        key={`slide-${slideIndex}`}
                        className="flex-shrink-0 w-[85%] md:w-full"
                      >
                        <div className="flex gap-0 md:gap-4">
                          {group.map((item, idx) => {
                            const globalIdx = slideIndex * cardsPerSlide + idx;
                            return (
                              <motion.div
                                key={`${slideIndex}-${idx}`}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                whileInView={{
                                  opacity: 1,
                                  y: 0,
                                  scale: 1,
                                  transition: {
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 15,
                                    delay: globalIdx * 0.05,
                                  },
                                }}
                                viewport={{ once: true }}
                                whileHover={{
                                  scale: 1.05,
                                  y: -10,
                                  transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                  },
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="relative bg-white rounded-2xl p-4 md:p-6 cursor-pointer shadow-lg backdrop-blur-sm border border-gray-200 hover:shadow-xl transition-all duration-300 group overflow-hidden w-full md:w-1/3 lg:w-1/3"
                              >
                                {/* Gradient Overlay on Hover */}
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  whileHover={{ opacity: 0.1 }}
                                  transition={{ duration: 0.3 }}
                                  className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl"
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                  {/* Icon/Image Container - Smaller */}
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    whileInView={{
                                      scale: 1,
                                      rotate: 0,
                                      transition: {
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 10,
                                        delay: 0.3 + globalIdx * 0.05,
                                      },
                                    }}
                                    viewport={{ once: true }}
                                    className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4"
                                  >
                                    <div className="w-full h-full bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                      <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                      />
                                    </div>

                                    {/* Floating Animation Ring */}
                                    <motion.div
                                      animate={{
                                        rotate: 360,
                                      }}
                                      whileHover={{ scale: 1.2 }}
                                      transition={{
                                        rotate: {
                                          duration: 8,
                                          repeat: Infinity,
                                          ease: "linear",
                                        },
                                        scale: { duration: 0.3 },
                                      }}
                                      className="absolute inset-0 border-2 border-dashed border-[#FFB400] border-opacity-30 rounded-xl"
                                    />
                                  </motion.div>

                                  {/* Title */}
                                  <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: 0.4 + globalIdx * 0.05,
                                    }}
                                    className="text-base md:text-lg font-bold text-[#1F3C88] mb-2 text-center group-hover:text-[#FFB400] transition-colors duration-300"
                                  >
                                    {item.title}
                                  </motion.h3>

                                  {/* Price */}
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: 0.5 + globalIdx * 0.05,
                                    }}
                                    className="text-center mb-4"
                                  >
                                    <div className="text-gray-400 line-through text-xs mb-1">
                                      MRP: ₹{item.oldPrice}
                                    </div>
                                    <div className="text-red-600 text-base md:text-lg font-bold mb-2">
                                      {item.tag}
                                    </div>
                                    <div className="bg-red-400 text-white px-2 py-1 rounded-full text-xs font-semibold inline-block">
                                      {item.offer}
                                    </div>
                                  </motion.div>

                                  {/* CTA Button */}
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: 0.6 + globalIdx * 0.05,
                                    }}
                                    className="text-center"
                                  >
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      data-slug={accessorySlug(item.title)}
                                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white px-3 md:px-4 py-2 md:py-3 rounded-lg font-semibold hover:from-[#FFB400] hover:to-[#e0a000] transition-all duration-300 shadow-md hover:shadow-lg text-xs md:text-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(e);
                                      }}
                                    >
                                      Add to Cart
                                      <motion.div
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                                      </motion.div>
                                    </motion.button>
                                  </motion.div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Right Arrow (car-wash style) */}
              <button
                onClick={handleNext}
                disabled={accessorySlide === totalSlides - 1}
                className={`absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                  accessorySlide === totalSlides - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 hover:shadow-xl"
                }`}
                aria-label="Next"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      <section
        id="callback-services"
        className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden py-16"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-10 w-72 h-72 bg-[#FFB400] rounded-full opacity-5 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 left-10 w-96 h-96  rounded-full opacity-3 blur-3xl"
          />
        </div>

        {/* Contact Us Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-[#FFB400] bg-opacity-20 backdrop-blur-sm rounded-full border border-[#FFB400] border-opacity-30 mb-4"
          >
            <span className="text-[#FFB400] font-semibold text-sm">
              Get In Touch
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Contact <span className="text-[#FFB400]">Us</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Have questions or need assistance? We're here to help you with all your service needs.
          </motion.p>
        </motion.div>

        {/* ServicesPage content start */}
        <div className="relative mx-auto px-4 flex flex-col md:flex-row gap-8 max-w-6xl">
          {/* Left: Callback Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl border-2 border-[#FFB400] border-opacity-30 p-8 w-full md:w-[350px] flex flex-col items-center shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-2 mb-4"
            >
              <motion.img
                whileHover={{ scale: 1.1, rotate: 5 }}
                src="/services/callback.svg"
                alt="Callback"
                className="w-4 h-4"
              />
              <span className="text-lg font-semibold bg-gradient-to-r from-[#1F3C88] to-[#FFB400] bg-clip-text text-transparent">
                Request a callback
              </span>
            </motion.div>
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={handleCallbackSubmit}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center gap-2 border-2 border-[#FFB400] border-opacity-30 rounded-xl px-3 py-2 bg-white hover:border-opacity-60 focus-within:border-opacity-80 transition-all duration-300"
              >
                <span className="text-lg">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src="/services/name.svg"
                    alt="Name"
                    className="w-4 h-4"
                  />
                </span>
                <input
                  className="bg-transparent outline-none flex-1 placeholder:text-gray-400"
                  placeholder="Enter your name"
                  value={cbName}
                  onChange={(e) => setCbName(e.target.value)}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-2 border-2 border-[#FFB400] border-opacity-30 rounded-xl px-3 py-2 bg-white hover:border-opacity-60 focus-within:border-opacity-80 transition-all duration-300"
              >
                <span className="text-lg">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src="/services/phoneno.svg"
                    alt="Phone"
                    className="w-4 h-4"
                  />
                </span>
                <input
                  className="bg-transparent outline-none flex-1 placeholder:text-gray-400"
                  placeholder="Enter your mobile no"
                  value={cbPhone}
                  onChange={(e) => setCbPhone(e.target.value)}
                  pattern="[0-9+\-\s]{8,15}"
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center gap-2 border-2 border-[#FFB400] border-opacity-30 rounded-xl px-3 py-2 bg-white hover:border-opacity-60 focus-within:border-opacity-80 transition-all duration-300"
              >
                <span className="text-lg">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src="/services/envelope.svg"
                    alt="Email"
                    className="w-4 h-4"
                  />
                </span>
                <input
                  className="bg-transparent outline-none flex-1 placeholder:text-gray-400"
                  placeholder="Enter your email"
                  type="email"
                  value={cbEmail}
                  onChange={(e) => setCbEmail(e.target.value)}
                />
              </motion.div>
              <motion.textarea
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="border-2 border-[#FFB400] border-opacity-30 rounded-xl px-3 py-2 bg-white min-h-[60px] outline-none placeholder:text-gray-400 hover:border-opacity-60 focus:border-opacity-80 transition-all duration-300"
                placeholder="Enter your message......"
                value={cbMessage}
                onChange={(e) => setCbMessage(e.target.value)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-pink-600 text-sm"
              >
                We are operating between 9 AM - 8 PM
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(209, 79, 255, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-[#d14fff] to-[#9333ea] text-white rounded-xl px-2 py-2 font-semibold mt-2 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60"
                disabled={cbSending}
              >
                {cbSending ? "Sending..." : "Call me"}
              </motion.button>
            </form>
          </motion.div>
          {/* Right: Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(37, 211, 102, 0.2)",
                }}
                className="bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-2xl p-6 flex flex-col gap-2 shadow-lg cursor-pointer border-2 border-green-200 border-opacity-50 transition-all duration-300 hover:border-opacity-80"
                onClick={() => {
                  window.open(
                    "https://wa.me/919591572775?text=Hello! I would like to know more about your services.",
                    "_blank"
                  );
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex items-center gap-2 font-serif font-bold text-lg"
                >
                  <span className="text-lg">
                    <motion.img
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      src="/services/whatsapp.svg"
                      alt="WhatsApp"
                      className="w-4 h-4"
                    />
                  </span>
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Ask us on Whatsapp
                  </span>
                </motion.div>
                <div className="text-gray-600 text-sm">
                  Get instant support and updates in whatsapp for our service
                </div>
                <div className="flex justify-end">
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="text-2xl text-green-600"
                  >
                    &gt;
                  </motion.span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
                }}
                className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl p-6 flex flex-col gap-2 shadow-lg cursor-pointer border-2 border-blue-200 border-opacity-50 transition-all duration-300 hover:border-opacity-80"
                onClick={() => {
                  const faqSection = document.getElementById("faq-section");
                  if (faqSection)
                    faqSection.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex items-center gap-2 font-bold text-lg"
                >
                  <span className="text-lg">
                    <motion.img
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      src="/services/faq.svg"
                      alt="FAQ"
                      className="w-4 h-4"
                    />
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    FAQ
                  </span>
                </motion.div>
                <div className="text-gray-600 text-sm">
                  Get instant support for our service via our FAQ section
                </div>
                <div className="flex justify-end">
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="text-2xl text-blue-600"
                  >
                    &gt;
                  </motion.span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)",
                }}
                className="bg-gradient-to-br from-white via-purple-50 to-violet-50 rounded-2xl p-6 flex flex-col gap-2 shadow-lg col-span-1 md:col-span-2 cursor-pointer border-2 border-purple-200 border-opacity-50 transition-all duration-300 hover:border-opacity-80"
                onClick={() => {
                  window.open(
                    "https://maps.app.goo.gl/mqVWff6HjLuDCcrD9",
                    "_blank"
                  );
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex items-center gap-2 font-bold text-lg"
                >
                  <span className="text-lg">
                    <motion.img
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      src="/services/name.svg"
                      alt="Contact"
                      className="w-4 h-4"
                    />
                  </span>
                  <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Contact Information
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex flex-wrap gap-8 text-xs text-gray-700 mt-2"
                >
                  <div>
                    <div className="font-semibold text-purple-700">Address</div>
                    <div>Bangalore, India</div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-700">Phone</div>
                    <div>+91 9591572775</div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-700">Email</div>
                    <div
                      className="underline cursor-pointer"
                      onClick={() =>
                        window.open(
                          "https://outlook.live.com/mail/0/deeplink/compose?to=web_bfsnow@oulook.com&subject=Inquiry%20from%20Bubble%20Flash%20Website",
                          "_blank"
                        )
                      }
                    >
                      Info@bubbleflashservices.in
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-700">
                      Business Hours
                    </div>
                    <div>
                      Monday - Saturday: 9:00 AM - 8:00 PM
                      <br />
                      Sunday: 10:00 AM - 6:00 PM
                    </div>
                  </div>
                </motion.div>
                <div className="flex justify-end mt-2">
                  <motion.span
                    whileHover={{ x: 5 }}
                    className="text-2xl text-purple-600"
                  >
                    &gt;
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        {/* Choose your package Section */}
        {/* <div className="py-16 relative bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#1F3C88] to-[#FFB400] bg-clip-text text-transparent"
          >
            Choose your package
          </motion.h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              whileHover={{
                y: -15,
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)",
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 rounded-2xl border-2 border-blue-300 border-opacity-50 shadow-xl p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-300 hover:border-opacity-80 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-4 right-4 w-12 h-12 bg-blue-400 bg-opacity-20 rounded-full blur-sm"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-4 left-4 w-8 h-8 bg-indigo-400 bg-opacity-20 rounded-full blur-sm"
              />

              <div className="w-full flex-1 flex flex-col items-center gap-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-4xl font-bold mb-2 text-center text-gray-800"
                >
                  Quick shine car
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-3xl font-bold mb-6 text-center text-green-600"
                >
                  ₹249
                </motion.div>
                <motion.ul
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-gray-700 text-xl mb-6 flex flex-col gap-2 text-center list-none p-0"
                >
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    Exterior wash with high-pressure watergun
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                  >
                    Soft-touch mild soap
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  >
                    Swirl-free clean
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    Deep-cleaning of car mats
                  </motion.li>
                </motion.ul>
              </div>
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(255, 214, 0, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/cars")}
                className="bg-gradient-to-r from-[#FFD600] to-[#FFA000] text-black rounded-xl border-2 border-yellow-500 px-8 py-3 font-serif font-semibold text-lg shadow-lg transition-all duration-300 hover:border-yellow-600 mx-auto mt-6"
              >
                Get Services
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              whileHover={{
                y: -15,
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(34, 197, 94, 0.3)",
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 rounded-2xl border-2 border-green-300 border-opacity-50 shadow-xl p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-300 hover:border-opacity-80 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-4 right-4 w-12 h-12 bg-green-400 bg-opacity-20 rounded-full blur-sm"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-4 left-4 w-8 h-8 bg-emerald-400 bg-opacity-20 rounded-full blur-sm"
              />

              <div className="w-full flex-1 flex flex-col items-center gap-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-4xl font-bold mb-2 text-center text-gray-800"
                >
                  Shine Bike wash
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-3xl font-bold mb-6 text-center text-green-600"
                >
                  ₹99
                </motion.div>
                <motion.ul
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-gray-700 text-xl mb-6 flex flex-col gap-2 text-center list-none p-0"
                >
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                  >
                    Gentle exterior water wash
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  >
                    Wheel cleaning with specialized wheel cleaner
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    High-pressure tyre wash for spotless finish
                  </motion.li>
                </motion.ul>
              </div>
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/bikes")}
                className="bg-gradient-to-r from-[#FFD600] to-[#FFA000] text-black rounded-xl border-2 border-green-500 px-8 py-3 font-serif font-semibold text-lg shadow-lg transition-all duration-300 hover:border-green-600 mx-auto mt-6"
              >
                Get Services
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              whileHover={{
                y: -15,
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(168, 85, 247, 0.3)",
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100 rounded-2xl border-2 border-purple-300 border-opacity-50 shadow-xl p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-300 hover:border-opacity-80 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-4 right-4 w-12 h-12 bg-purple-400 bg-opacity-20 rounded-full blur-sm"
              />
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-4 left-4 w-8 h-8 bg-violet-400 bg-opacity-20 rounded-full blur-sm"
              />

              <div className="w-full flex-1 flex flex-col items-center gap-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-4xl font-bold mb-2 text-center text-gray-800"
                >
                  Laundry wash
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-3xl font-bold mb-6 text-center text-purple-600"
                >
                  ₹99
                </motion.div>
                <motion.ul
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-gray-700 text-xl mb-6 flex flex-col gap-2 text-center list-none p-0"
                >
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  >
                    Professional wash & fold service
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    Eco-friendly detergents
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                  >
                    Same-day pickup & delivery
                  </motion.li>
                </motion.ul>
              </div>
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(168, 85, 247, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/laundry")}
                className="bg-gradient-to-r from-[#FFD600] to-[#FFA000] text-black rounded-xl border-2 border-purple-500 px-8 py-3 font-serif font-semibold text-lg shadow-lg transition-all duration-300 hover:border-purple-600 mx-auto mt-6"
              >
                Get Services
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              whileHover={{
                y: -15,
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(239, 68, 68, 0.3)",
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="bg-gradient-to-br from-red-100 via-red-50 to-orange-100 rounded-2xl border-2 border-red-300 border-opacity-50 shadow-xl p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-300 hover:border-opacity-80 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute top-4 right-4 w-12 h-12 bg-red-400 bg-opacity-20 rounded-full blur-sm"
              />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-4 left-4 w-8 h-8 bg-orange-400 bg-opacity-20 rounded-full blur-sm"
              />

              <div className="w-full flex-1 flex flex-col items-center gap-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-4xl font-bold mb-2 text-center text-gray-800"
                >
                  Helmet Deals
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-3xl font-bold mb-6 text-center text-red-600"
                >
                  ₹99
                </motion.div>
                <motion.ul
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-gray-700 text-xl mb-6 flex flex-col gap-2 text-center list-none p-0"
                >
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    Premium quality helmets
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                  >
                    ISI certified safety standards
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                  >
                    Multiple styles and sizes available
                  </motion.li>
                </motion.ul>
              </div>
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(239, 68, 68, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/helmets")}
                className="bg-gradient-to-r from-[#FFD600] to-[#FFA000] text-black rounded-xl border-2 border-red-500 px-8 py-3 font-semibold text-lg shadow-lg transition-all duration-300 hover:border-red-600 mx-auto mt-6"
              >
                Get services
              </motion.button>
            </motion.div>
          </div>
        </div> */}
        {/* What client says - true carousel */}
        <div className="mt-12 mb-8 py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            What Our Clients Say
          </h2>
          <div className="overflow-hidden w-full flex justify-center">
            <div
              className="flex gap-4 sm:gap-6 md:gap-8 transition-all duration-700"
              style={{ width: "max-content" }}
            >
              {carousel.slice(0, visibleCount).map((t, idx) => {
                const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border shadow-sm p-4 sm:p-5 min-w-[220px] sm:min-w-[260px] md:min-w-[300px] max-w-[340px] flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${color}`}
                      >
                        {getInitial(t.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-bold text-sm leading-snug truncate"
                          title={t.name}
                        >
                          {t.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Verified Customer
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-base">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-gray-700 text-sm mt-2 leading-relaxed line-clamp-4">
                      “{t.text}”
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* FAQ Section - Optimized and Compact */}
        <div className="mt-12 py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              id="faq-section"
              className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#6B2C91]"
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="divide-y divide-gray-100">
                {FAQS.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <button
                      className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                    >
                      <span className="text-gray-800 font-medium text-base pr-4">
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center">
                          <svg
                            className={`w-4 h-4 text-pink-500 transition-transform duration-300 ${
                              openIdx === i ? "rotate-180" : "rotate-0"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                    {openIdx === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4 text-gray-600 text-sm leading-relaxed"
                      >
                        <div className="pt-2 border-t border-gray-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* ServicesPage content end */}
      </section>
      {/* Contact section removed - keeping only callback-services section as per requirement */}
      {/* Auth Modals */}
      <SignupModal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        onSignup={() => setOpenSignup(false)}
        onLoginNow={() => {
          setOpenSignup(false);
          setOpenSignin(true);
        }}
      />
      <SigninModal
        open={openSignin}
        onClose={() => setOpenSignin(false)}
        onSignupNow={() => {
          setOpenSignin(false);
          setOpenSignup(true);
        }}
        onLogin={() => {
          // After a successful login from modal, perform the stored redirect if exists
          try {
            const raw = localStorage.getItem("postLoginRedirect");
            if (raw) {
              const data = JSON.parse(raw);
              if (data?.path) {
                navigate(data.path, { replace: true });
                localStorage.removeItem("postLoginRedirect");
              }
            }
          } catch {}
        }}
      />
    </>
  );
}
