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
          icon: "/helmet/commuter & midsize/aiease_1755850674727.jpg",
        },
        {
          value: "midsize",
          label: "Mid-Size Helmets",
          icon: "/helmet/midsize/midsize1.jpg",
        },
        {
          value: "sports-touring",
          label: "Sports / Touring Helmets",
          icon: "/helmet/sports/aiease_1755850623823.jpg",
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

  const categories = ["Car Wash", "Bike Wash", "Laundry Service", "Helmet"];
  const locations = [fullAddress || "", ""];

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
                      .getElementById("service-categories")
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
            {/* Hero Content - Left Side */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white space-y-6 max-w-2xl lg:text-left text-center flex-1"
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
                  Trusted by 2000+ customers
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold leading-tight"
              >
                Branded & Professional
                <span className="block text-[#FFB400]">Cleaning Services</span>
                <span className="block text-2xl md:text-4xl font-normal text-gray-200 mt-2">
                  for Cars, Bikes & More
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg md:text-xl text-gray-200 leading-relaxed"
              >
                Experience top-tier car wash, bike detailing, and laundry care –
                all under one roof in Bengaluru. Quality service, every time.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex justify-center lg:justify-start gap-8 md:gap-16 pt-4"
              >
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-[#FFB400]">2000+</div>
                  <div className="text-xs md:text-sm text-gray-300">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-[#FFB400]">100%</div>
                  <div className="text-xs md:text-sm text-gray-300">Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-[#FFB400]">15+</div>
                  <div className="text-xs md:text-sm text-gray-300">Services</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex-1 max-w-lg hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1632823469820-3c7cfea4b94f?w=600&h=600&fit=crop"
                alt="Professional Car Cleaning Service"
                className="rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </motion.div>
          </div>

          {/* Service Categories - Full Width Below */}
          <div className="mt-16">
            <div id="service-categories" className="w-full">

            {/* Service Categories - Integrated in first section */}
            <div id="service-categories" className="w-full">
              <ServiceCategories />
            </div>
          </div>
        </div>

      {/* About Us Section with Light Theme */}
      <div className="bg-gray-50">
        <section id="aboutus" className="py-20">
          {/* AboutPage content start */}
          <div className="min-h-screen pb-8 md:pb-4 lg:pb-8 xl:pb-16">
            <div className="max-w-6xl mx-auto pt-12 px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row gap-8 items-start"
              >
                <motion.video
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  src="/car/home.mp4"
                  className="rounded-xl w-full md:w-[350px] h-[260px] object-cover shadow-lg"
                  controls
                  autoPlay
                  loop
                  muted
                />
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
                {/* Step 1 */}
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
                {/* Step 2 */}
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
                {/* Step 3 */}
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
                {/* Step 4 */}
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
              <motion.div
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
              </motion.div>
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
        id="services"
        className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden"
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

        {/* ServicesPage content start */}
        <div className="relative mx-auto pt-12 px-4 flex flex-col md:flex-row gap-8">
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
        <div className="py-16 relative bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
            {/* Quick shine car */}
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
              {/* Floating Elements */}
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
            {/* Bike wash */}
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
              {/* Floating Elements */}
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
            {/* Laundry wash */}
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
              {/* Floating Elements */}
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
            {/* Helmet Deals */}
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
              {/* Floating Elements */}
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
        </div>
        {/* What client says - true carousel */}
        <div className="mt-20 mb-8 py-12">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
            What client says
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
                    className="bg-white rounded-xl border shadow-sm p-4 sm:p-5 md:p-6 min-w-[220px] sm:min-w-[280px] md:min-w-[340px] max-w-[380px] flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold ${color}`}
                      >
                        {getInitial(t.name)}
                      </div>
                      <div>
                        <div
                          className="font-serif font-bold leading-snug max-w-[180px] truncate"
                          title={t.name}
                        >
                          {t.name}
                        </div>
                        <div className="text-xs font-serif text-gray-500">
                          Verified Customer
                        </div>
                      </div>
                      <div className="flex ml-auto gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-gray-700 text-sm sm:text-base mt-2 leading-relaxed line-clamp-5">
                      “{t.text}”
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* FAQ Section */}
        <div className="mt-16 py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              id="faq-section"
              className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#6B2C91]"
            >
              FAQs
            </motion.h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-100">
                {FAQS.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                  >
                    <button
                      className="w-full flex justify-between items-center px-8 py-6 text-left focus:outline-none hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                    >
                      <span className="text-gray-800 font-medium text-lg pr-6">
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center">
                          <svg
                            className={`w-5 h-5 text-pink-500 transition-transform duration-300 ${
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
                        className="px-8 pb-6 text-gray-600 text-base leading-relaxed"
                      >
                        <div className="pt-4 border-t border-gray-100">
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
      <section id="contact" className="relative overflow-hidden">
        {/* ContactPage content start */}
        <div className="bg-gradient-to-br from-[#1F3C88] via-blue-900 to-slate-900 py-20 px-4 md:px-16">
          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-[#FFB400]/20 to-yellow-300/20 rounded-full blur-3xl"
            ></motion.div>
            <motion.div
              animate={{
                rotate: -360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl"
            ></motion.div>
            <motion.div
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/15 to-pink-300/15 rounded-full blur-2xl"
            ></motion.div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#FFB400] to-yellow-300 rounded-full mb-6 mx-auto"
              >
                <svg
                  className="w-10 h-10 text-[#1F3C88]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold text-white mb-6"
              >
                Let's Connect
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
              >
                Your premium car care experience is just one call away. We're
                here to make your vehicle shine like never before!
              </motion.p>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Contact Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ),
                    title: "Visit Our Premium Facility",
                    main: "Bangalore, India",
                    sub: "State-of-the-art equipment & expert technicians",
                    color: "from-emerald-400 to-teal-500",
                    delay: 0.1,
                    action: () => {
                      window.open(
                        "https://maps.google.com/?q=Bangalore,India",
                        "_blank"
                      );
                    },
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    ),
                    title: "Call for Instant Booking",
                    main: "+91 9591572775",
                    sub: "Available 7 days a week for your convenience",
                    color: "from-blue-400 to-indigo-500",
                    delay: 0.2,
                    action: () => {
                      window.open("tel:+919591572775", "_self");
                    },
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    title: "Email for Inquiries",
                    main: "Info@bubbleflashservices.in",
                    sub: "Quick response within 2 hours guaranteed",
                    color: "from-purple-400 to-pink-500",
                    delay: 0.3,
                    action: () => {
                      window.open(
                        "https://outlook.live.com/mail/0/deeplink/compose?to=web_bfsnow@oulook.com&subject=Service%20Inquiry&body=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20services.",
                        "_blank"
                      );
                    },
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    title: "Flexible Service Hours",
                    main: "Mon-Sat: 9AM-8PM",
                    sub: "Sunday: 10AM-6PM | Extended hours available",
                    color: "from-orange-400 to-red-500",
                    delay: 0.4,
                    action: null, // No action for this card
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: item.delay }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      transition: { duration: 0.3 },
                    }}
                    onClick={item.action}
                    className={`group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:shadow-2xl hover:border-white/40 ${
                      item.action ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className="text-center">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-r from-[#FFB400] to-yellow-300 rounded-full flex items-center justify-center text-[#1F3C88] mb-4 mx-auto"
                      >
                        {item.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFB400] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-2xl font-semibold text-[#FFB400] mb-2">
                        {item.main}
                      </p>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        {item.sub}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Section */}
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="lg:row-span-2"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 h-full hover:bg-white/15 transition-all duration-500 hover:shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Find Us Here
                  </h3>
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.178643044415!2d77.54821629999999!3d12.8962318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3fcbc3f34bfd%3A0xec982eb2135f8719!2sBubble%20Flash%20Services!5e0!3m2!1sen!2sin!4v1750524476198!5m2!1sen!2sin"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Bubble Flash Services Location"
                      ></iframe>
                    </motion.div>
                  </div>
                  <motion.a
                    href="https://maps.app.goo.gl/mqVWff6HjLuDCcrD9"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-[#FFB400] to-yellow-300 text-[#1F3C88] font-bold py-4 px-6 rounded-xl hover:from-yellow-300 hover:to-[#FFB400] transition-all duration-300 hover:shadow-2xl flex items-center justify-center gap-3 group"
                  >
                    <svg
                      className="w-6 h-6 group-hover:animate-bounce"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Open in Google Maps
                  </motion.a>
                </div>
              </motion.div>
            </div>

            {/* Call to Action Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/30 max-w-5xl mx-auto">
                <motion.h3
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                >
                  Ready for the Ultimate Car Care?
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed"
                >
                  Join over 10,000+ satisfied customers who trust Bubble Flash
                  Services for premium car care. Book now and experience the
                  difference!
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.a
                    href="tel:+919591572775"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(255, 180, 0, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-[#FFB400] to-yellow-300 text-[#1F3C88] font-bold py-5 px-10 rounded-2xl hover:from-yellow-300 hover:to-[#FFB400] transition-all duration-500 inline-flex items-center justify-center gap-4 text-lg"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Call Now: +91 9591572775
                  </motion.a>
                  <motion.button
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      window.open(
                        "https://wa.me/919591572775?text=Hello! I'm interested in your services and would like to know more.",
                        "_blank"
                      );
                    }}
                    className="group bg-white/20 text-white font-bold py-5 px-10 rounded-2xl border border-white/40 hover:bg-white/30 hover:border-white/60 transition-all duration-500 inline-flex items-center justify-center gap-4 text-lg"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515" />
                    </svg>
                    WhatsApp Us
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* ContactPage content end */}
      </section>
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
