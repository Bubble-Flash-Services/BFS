import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  X,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Key,
  Package,
} from "lucide-react";
import MapboxLocationPicker from "../components/MapboxLocationPicker";
import RazorpayPayment from "../components/RazorpayPayment";
import { addressAPI } from "../api/address";
import { createOrder } from "../api/orders";
import toast from "react-hot-toast";
import { convertSelectedItemsToArray } from "../data/laundryData";

// API base for all requests in this module
const API =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    loading: cartLoading,
  } = useCart();
  const { user, loading } = useAuth();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hasLiveLocation, setHasLiveLocation] = useState(false);
  const [alternateLocation, setAlternateLocation] = useState("");
  const [useAlternateLocation, setUseAlternateLocation] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [addressData, setAddressData] = useState(null); // Store complete address data
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Coupon state
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponSection, setShowCouponSection] = useState(false);

  // Track failed image loads for cart items
  const [failedImages, setFailedImages] = useState(new Set());

  // Try to get live location first; fallback to profile address if unavailable
  useEffect(() => {
    const getLiveLocation = async () => {
      try {
        if (!navigator.geolocation)
          throw new Error("Geolocation not supported");
        if (location.protocol !== "https:" && location.hostname !== "localhost")
          throw new Error("HTTPS required");

        const result = await addressAPI.getCurrentAddress();
        if (result.success && !selectedLocation) {
          setSelectedLocation(result.data.fullAddress);
          setAddressData(result.data);
          setHasLiveLocation(true);
        }
      } catch (_) {
        // ignore and fallback in next effect
      }
    };
    getLiveLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-populate from profile only if we don't already have a live/user-selected address
  useEffect(() => {
    if (user && !loading) {
      if (user.phone && !phoneNumber) setPhoneNumber(user.phone);
      if (user.address && !selectedLocation && !hasLiveLocation) {
        setSelectedLocation(user.address);
      }
    }
  }, [user, loading, phoneNumber, selectedLocation, hasLiveLocation]);

  // Fetch available coupons
  useEffect(() => {
    if (cartItems.length > 0) {
      fetchAvailableCoupons();
    }
  }, [cartItems]);
  console.log(cartItems);
  const fetchAvailableCoupons = async () => {
    try {
      const token = localStorage.getItem("token");
      const cartTotal = getCartTotal();
      const response = await fetch(
        `${API}/api/coupons?orderAmount=${cartTotal}&userId=${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAvailableCoupons(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const applyCoupon = async (coupon) => {
    try {
      setCouponLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to apply a coupon");
        setCouponLoading(false);
        return;
      }
      const cartTotal = getCartTotal();

      console.log("🎫 Applying coupon:", {
        code: coupon.code,
        orderAmount: cartTotal,
        userId: user?.id,
      });

      const response = await fetch(`${API}/api/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: coupon.code,
          orderAmount: Number(cartTotal) || 0,
          userId: user?.id,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please log in again to use coupons");
        } else {
          toast.error(result.message || "Failed to validate coupon");
        }
        return;
      }
      console.log("🎫 Coupon validation response:", result);

      if (result.success && result.data.isValid) {
        setAppliedCoupon({
          ...coupon,
          discountAmount: result.data.discountAmount,
        });
        setCouponCode(coupon.code);
        setShowCouponSection(false);
        console.log("✅ Coupon applied successfully:", {
          code: coupon.code,
          discountAmount: result.data.discountAmount,
        });
        toast.success(
          `Coupon ${coupon.code} applied! You saved ₹${result.data.discountAmount}`
        );
      } else {
        console.error("❌ Coupon validation failed:", result);
        toast.error(result.message || "Invalid coupon");
      }
    } catch (error) {
      console.error("💥 Error applying coupon:", error);
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const applyCouponByCode = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      setCouponLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to apply a coupon");
        setCouponLoading(false);
        return;
      }
      const cartTotal = getCartTotal();

      console.log("🎫 Applying coupon by code:", {
        code: couponCode.toUpperCase(),
        orderAmount: cartTotal,
        userId: user?.id,
      });

      const response = await fetch(`${API}/api/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          orderAmount: Number(cartTotal) || 0,
          userId: user?.id,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please log in again to use coupons");
        } else {
          toast.error(result.message || "Failed to validate coupon");
        }
        return;
      }
      console.log("🎫 Coupon by code validation response:", result);

      if (result.success && result.data.isValid) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          name: result.data.coupon?.name || "Coupon",
          discountAmount: result.data.discountAmount,
          discountType: result.data.coupon?.discountType || "fixed",
        });
        setShowCouponSection(false);
        console.log("✅ Coupon by code applied successfully:", {
          code: couponCode.toUpperCase(),
          discountAmount: result.data.discountAmount,
        });
        toast.success(
          `Coupon ${couponCode.toUpperCase()} applied! You saved ₹${
            result.data.discountAmount
          }`
        );
      } else {
        console.error("❌ Coupon by code validation failed:", result);
        toast.error(result.message || "Invalid coupon code");
      }
    } catch (error) {
      console.error("💥 Error applying coupon by code:", error);
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast("Coupon removed");
  };

  // Handle start shopping - navigate to home and scroll to service categories
  const handleStartShopping = () => {
    navigate("/", { state: { scrollTo: "service-categories" } });
  };

  // Calculate final total with coupon discount and GST split (CGST/SGST for intra-state, IGST for inter-state)
  const GST_RATE = 0.18;
  const CGST_RATE = 0.09;
  const SGST_RATE = 0.09;
  const IGST_RATE = 0.18;
  const getTaxableSubtotal = () => {
    const subtotal = getCartTotal();
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    return Math.max(subtotal - discount, 0);
  };

  const isIntraState = () => {
    try {
      const stateText = (
        (addressData?.state || selectedLocation || "") + ""
      ).toLowerCase();
      if (/karnataka/.test(stateText)) return true;
      // Default to intra-state for Bangalore service area when not explicitly outside
      return true;
    } catch {
      return true;
    }
  };

  const getCGSTAmount = () =>
    parseFloat((getTaxableSubtotal() * CGST_RATE).toFixed(2));
  const getSGSTAmount = () =>
    parseFloat((getTaxableSubtotal() * SGST_RATE).toFixed(2));
  const getIGSTAmount = () =>
    parseFloat((getTaxableSubtotal() * IGST_RATE).toFixed(2));
  const getGstAmount = () => {
    return isIntraState()
      ? parseFloat((getCGSTAmount() + getSGSTAmount()).toFixed(2))
      : getIGSTAmount();
  };

  const getFinalTotal = () => {
    const total = getTaxableSubtotal() + getGstAmount();
    console.log("💰 Final total calculation with GST:", {
      subtotal: getCartTotal(),
      discount: appliedCoupon ? appliedCoupon.discountAmount : 0,
      taxable: getTaxableSubtotal(),
      gst: getGstAmount(),
      total,
    });
    return total.toFixed(2);
  };

  const getDiscountAmount = () => {
    return appliedCoupon ? appliedCoupon.discountAmount : 0;
  };

  // Normalize item into high-level group for cart sections
  const getItemGroup = (item) => {
    const type = (item.type || "").toLowerCase();
    const categoryField = (item.category || "").toLowerCase();
    const nameField = (
      (item.serviceName || item.name || "") +
      " " +
      (item.vehicleType || "")
    ).toLowerCase();

    // Prefer explicit type classification (fastest check, most reliable)
    if (type.includes("autofix") || categoryField.includes("autofix"))
      return "AutoFix";
    if (type.includes("green") || categoryField.includes("green"))
      return "Green & Clean";
    if (type.includes("car") || type.includes("monthly")) return "Car";
    if (type.includes("bike")) return "Bike";
    if (type.includes("helmet")) return "Helmet";
    if (type.includes("laundry") || item.laundryDetails) return "Laundry";

    // Then use category derived on server/client (catches items with incomplete type field)
    // Note: Including various AutoFix service keywords as safety fallback
    if (/(autofix|auto.*fix|dent|scratch|bumper|(rubbing.*)?polish)/.test(categoryField))
      return "AutoFix";
    if (
      /(green.*clean|home.*clean|sofa.*clean|carpet.*clean|bathroom.*clean|kitchen.*clean|office.*clean)/.test(
        categoryField
      )
    )
      return "Green & Clean";
    if (/(car|car wash|hatch|sedan|suv|luxur)/.test(categoryField))
      return "Car";
    if (/(bike|bike wash|scooter|motorbike|cruiser)/.test(categoryField))
      return "Bike";
    if (/helmet/.test(categoryField)) return "Helmet";
    if (/(laundry|wash & fold|dry clean|ironing)/.test(categoryField))
      return "Laundry";

    // Fallback to combined name + vehicleType keywords (last resort for legacy items)
    if (/helmet/.test(nameField)) return "Helmet";
    if (/scooter|motorbike|cruiser|bike/.test(nameField)) return "Bike";
    if (/hatch|sedan|suv|mid\s*-\s*suv|luxur|car/.test(nameField)) return "Car";
    return "Others";
  };

  const groupOrder = [
    "Car",
    "Bike",
    "Helmet",
    "AutoFix",
    "Laundry",
    "Green & Clean",
    "Others",
  ];
  const groupedCart = React.useMemo(() => {
    const groups = {};
    (cartItems || []).forEach((it) => {
      const g = getItemGroup(it);
      if (!groups[g]) groups[g] = [];
      groups[g].push(it);
    });
    return groupOrder
      .filter((g) => groups[g]?.length)
      .map((g) => ({ key: g, items: groups[g] }));
  }, [cartItems]);

  // Handle address selection from autocomplete
  const handleAddressSelect = (selectedAddress) => {
    setSelectedLocation(selectedAddress.fullAddress);
    setAddressData(selectedAddress);
  };

  const handleProceedToCheckout = () => {
    // Pre-fill with user data if available
    if (user) {
      setPhoneNumber(user.phone || "");
      // Auto-populate address from user profile if available
      if (user.address && !selectedLocation && !hasLiveLocation) {
        setSelectedLocation(user.address);
      }
    }

    // Check for pending booking data
    const storedBooking = localStorage.getItem("pendingBooking");
    if (storedBooking) {
      const data = JSON.parse(storedBooking);
      // Respect an already chosen/live address; only fill if empty
      if (!selectedLocation) {
        if (data.address) {
          setSelectedLocation(data.address);
        } else if (user?.address && !hasLiveLocation) {
          setSelectedLocation(user.address);
        }
      }
      setPickupDate(data.pickupDate || "");
      setPhoneNumber(data.phoneNumber || user?.phone || "");
    }

    // Preselect first available time slot if not set
    const slots = generateTimeSlots();
    if (!selectedTimeSlot && slots.length > 0) setSelectedTimeSlot(slots[0]);
    setShowCheckoutModal(true);
  };

  // State for order placement
  const [placingOrder, setPlacingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const handlePlaceOrder = async () => {
    // Validate required fields with specific messages
    const missing = [];
    if (!selectedLocation || selectedLocation.trim().length < 5)
      missing.push("Service address");
    if (!pickupDate) missing.push("Pickup date");
    if (!selectedTimeSlot) missing.push("Preferred time slot");
    if (!phoneNumber || !/^\d{10}$/.test((phoneNumber || "").trim()))
      missing.push("Valid 10-digit phone number");
    if (!selectedPayment) missing.push("Payment method");
    if (!cartItems || cartItems.length === 0)
      missing.push("At least one item in cart");

    if (missing.length) {
      toast.error(`Please provide: ${missing.join(", ")}`);
      return;
    }

    setPlacingOrder(true);

    try {
      // Check service availability by pincode before creating order
      const pinToCheck = (addressData?.pincode || "").trim();
      if (pinToCheck && /^\d{6}$/.test(pinToCheck)) {
        const availability = await addressAPI.checkServiceAvailability(
          pinToCheck
        );
        if (!availability?.success || availability.available === false) {
          toast.error(
            availability?.message ||
              "We currently serve only Bangalore areas — coming soon to your area!"
          );
          setPlacingOrder(false);
          return;
        }
      }

      // Prepare order data for backend
      const orderData = {
        items: cartItems.map((item) => ({
          serviceId: item.serviceId || item.id,
          packageId: item.packageId,
          serviceName: item.serviceName || item.title || item.name,
          image: item.image || item.img,
          type: item.type,
          category: item.category,
          packageName: item.packageName || item.plan,
          quantity: item.quantity || 1,
          price: item.packageDetails?.basePrice || item.basePrice || item.price,
          addOns: (item.addOns || item.packageDetails?.addons || []).map(
            (addon) => ({
              ...addon,
              quantity: addon.quantity || 1,
            })
          ),
          laundryItems: item.laundryItems || [],
          vehicleType: item.vehicleType || item.category,
          specialInstructions: item.specialInstructions || item.notes,
          includedFeatures:
            item.packageDetails?.features || item.includedFeatures || [],
          planDetails: {
            washIncludes: item.packageDetails?.washIncludes || [],
            weeklyIncludes: item.packageDetails?.weeklyIncludes || [],
            biWeeklyIncludes: item.packageDetails?.biWeeklyIncludes || [],
            monthlyBonuses: item.packageDetails?.monthlyBonuses || [],
            platinumExtras: item.packageDetails?.platinumExtras || [],
          },
        })),
        serviceAddress: {
          fullAddress: selectedLocation,
          latitude: addressData?.latitude,
          longitude: addressData?.longitude,
          city: addressData?.city,
          state: addressData?.state,
          pincode: addressData?.pincode,
          landmark: addressData?.landmark,
        },
        scheduledDate: pickupDate,
        scheduledTimeSlot: selectedTimeSlot,
        paymentMethod: selectedPayment === "cod" ? "cash" : selectedPayment,
        customerNotes: `Phone: ${phoneNumber}`,
        subtotal: getCartTotal(),
        taxRate: 0.18,
        taxAmount: getGstAmount(),
        discountAmount: getDiscountAmount(),
        couponCode: appliedCoupon?.code || null,
        totalAmount: getFinalTotal(),
      };

      // Get auth token
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to place order");
        return;
      }

      // Make API call to create order
      const result = await createOrder(token, orderData);

      if (result.success) {
        setCreatedOrder(result.data);

        // If payment method is UPI, don't close modal yet - show payment component
        if (selectedPayment === "upi") {
          // Order created, now show payment component
          console.log("Order created, showing payment options:", result.data);
        } else {
          // COD order - complete immediately
          toast.success(`Order placed! #${result.data.orderNumber}`);
          clearCart();
          setShowCheckoutModal(false);
          setPlacingOrder(false);
        }
      } else {
        toast.error(`Order failed: ${result.message}`);
        setPlacingOrder(false);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order. Please try again.");
      setPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log("Payment successful:", paymentData);
    toast.success(`Payment successful! #${createdOrder.orderNumber}`);
    clearCart();
    setShowCheckoutModal(false);
    setPlacingOrder(false);
    setCreatedOrder(null);
    // Navigate to orders
    navigate("/orders");
  };

  const handlePaymentFailure = (error) => {
    console.error("Payment failed:", error);
    const reason = error?.description || error?.message || "Payment failed.";
    toast.error(`${reason} Please try again or contact support.`);
    setPlacingOrder(false);
    // Order is created but payment failed - user can retry payment
  };

  const paymentOptions = [
    { id: "upi", name: "UPI (PhonePe/GooglePay)", icon: "📱" },
    { id: "cod", name: "Cash on Delivery", icon: "💵" },
  ];

  // Generate 1-hour time slots between 9 AM and 8 PM (inclusive of 7-8 PM; ending at 8 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 20; hour++) {
      const start = formatHour(hour);
      const end = formatHour(hour + 1);
      slots.push(`${start} - ${end}`);
    }
    return slots;
  };

  const formatHour = (hour24) => {
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = ((hour24 + 11) % 12) + 1;
    return `${hour12}:00 ${period}`;
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Guest users can view cart but need to login before checkout
  // Removed the check: if (!user) { ... }

  // Show loading state while cart is being loaded
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-spin">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-4">
            Loading your cart...
          </h2>
          <p className="text-gray-600">Please wait while we fetch your items</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          {/* Animated Empty Cart Illustration */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-pulse">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-xs font-bold">0</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Your cart feels lonely
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Add some amazing services to make it happy! ✨
          </p>

          <button
            onClick={handleStartShopping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section with Glassmorphism - Mobile Responsive */}
      <div className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {cartItems.length}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                  Your Cart
                </h1>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <p className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                    {cartItems.length} items • ₹{getCartTotal()}
                  </p>
                  {appliedCoupon && (
                    <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span className="hidden xs:inline">{appliedCoupon.code}</span>
                      <span className="xs:hidden">Coupon</span>
                    </div>
                  )}
                  {availableCoupons.length > 0 && !appliedCoupon && (
                    <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap">
                      {availableCoupons.length} coupons
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (cartItems.length > 0 && window.confirm(`Remove all ${cartItems.length} items from cart?`)) {
                  clearCart();
                }
              }}
              className="text-red-500 hover:text-red-700 font-medium px-2 sm:px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 text-xs sm:text-sm flex-shrink-0"
            >
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden"><Trash2 className="h-4 w-4" /></span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Section (grouped) */}
          <div className="lg:col-span-2 space-y-6">
            {groupedCart.map((group) => (
              <div key={group.key}>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {group.key}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {group.items.length} item{group.items.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-4">
                  {group.items.map((item, index) => {
                    // Determine what to show for the item visual
                    const itemKey = item.id || `${item.serviceId}-${item.packageId}-${index}`;
                    const hasImage = Boolean(item.img || item.image);
                    const hasIcon = Boolean(item.icon);
                    
                    // Check if this item's image has failed to load
                    const imageLoadFailed = failedImages.has(itemKey);
                    
                    // Show icon if: no image available, OR image failed to load
                    const shouldShowIcon = !hasImage || imageLoadFailed;
                    
                    // Handle image error
                    const handleImageError = () => {
                      setFailedImages(prev => new Set(prev).add(itemKey));
                    };
                    
                    return (
                    <div
                      key={itemKey}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Item Header with Gradient - Mobile Responsive */}
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-white text-sm sm:text-lg truncate">
                                {item.title || item.name || item.serviceName}
                              </h3>
                              {(item.packageName || item.category) && (
                                <span className="text-blue-100 text-xs sm:text-sm block truncate">
                                  {item.packageName || item.category}
                                </span>
                              )}
                              {item.vehicleType && (
                                <span className="text-blue-200 text-xs block mt-1 truncate">
                                  Vehicle: {item.vehicleType}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              removeFromCart(
                                item.id || item.serviceId,
                                item.packageId
                              )
                            }
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white hover:text-red-200 transition-all duration-200 flex-shrink-0"
                          >
                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Content - Mobile Responsive */}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-4 gap-3">
                          <div className="flex items-center space-x-4">
                            {/* Image or Icon Fallback */}
                            {hasImage && !imageLoadFailed ? (
                              <img
                                src={item.img || item.image}
                                alt={item.title || item.name}
                                className="w-16 h-16 object-cover rounded-xl border-2 border-gray-100"
                                onError={handleImageError}
                              />
                            ) : null}
                            
                            {/* Icon Fallback - Show if no image, image failed, or has icon */}
                            {shouldShowIcon && (
                              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl border-2 border-gray-100">
                                {item.icon ? (
                                  <span className="text-3xl">{item.icon}</span>
                                ) : item.type === "key-services" ? (
                                  <Key className="w-8 h-8 text-blue-600" />
                                ) : (
                                  <Package className="w-8 h-8 text-purple-600" />
                                )}
                              </div>
                            )}
                            <div className="flex flex-col space-y-2">
                              {/* Removed rating and duration display */}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ₹{item.price * item.quantity}
                            </div>
                            {/* Show original price with strikethrough if there's a discount */}
                            {item.originalPrice && item.originalPrice > item.price && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{item.originalPrice * item.quantity}
                              </div>
                            )}
                            {/* Show first-time booking discount badge */}
                            {item.isFirstTimeBooking && item.discount > 0 && (
                              <div className="text-xs text-green-600 font-semibold mt-1">
                                🎉 15% First-Time Discount: -₹{item.discount * item.quantity}
                              </div>
                            )}
                            {item.oldPrice && item.oldPrice > item.price && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{item.oldPrice * item.quantity}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              ₹{item.price} each
                            </div>
                          </div>
                        </div>

                        {/* Package Details */}
                        {item.packageDetails && (
                          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Package Includes
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Base Service:
                                </span>
                                <span className="font-medium">
                                  ₹{item.packageDetails.basePrice}
                                </span>
                              </div>
                              {Array.isArray(item.packageDetails.features) &&
                                item.packageDetails.features.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      {item.type === "monthly_plan"
                                        ? "Plan Features:"
                                        : "Included Features:"}
                                    </p>
                                    <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                      {item.packageDetails.features.map(
                                        (f, i) => (
                                          <li key={i}>{f}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              {/* Monthly plan details if available */}
                              {Array.isArray(
                                item.packageDetails.washIncludes
                              ) &&
                                item.packageDetails.washIncludes.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Each Wash Includes:
                                    </p>
                                    <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                      {item.packageDetails.washIncludes.map(
                                        (f, i) => (
                                          <li key={i}>{f}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              {Array.isArray(
                                item.packageDetails.weeklyIncludes
                              ) &&
                                item.packageDetails.weeklyIncludes.length >
                                  0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Weekly Includes:
                                    </p>
                                    <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                      {item.packageDetails.weeklyIncludes.map(
                                        (f, i) => (
                                          <li key={i}>{f}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              {Array.isArray(
                                item.packageDetails.biWeeklyIncludes
                              ) &&
                                item.packageDetails.biWeeklyIncludes.length >
                                  0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Bi-Weekly Includes:
                                    </p>
                                    <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                      {item.packageDetails.biWeeklyIncludes.map(
                                        (f, i) => (
                                          <li key={i}>{f}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              {Array.isArray(
                                item.packageDetails.monthlyBonuses
                              ) &&
                                item.packageDetails.monthlyBonuses.length >
                                  0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Monthly Bonuses:
                                    </p>
                                    <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                      {item.packageDetails.monthlyBonuses.map(
                                        (f, i) => (
                                          <li key={i}>{f}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              {Array.isArray(
                                item.packageDetails.platinumExtras
                              ) &&
                                item.packageDetails.platinumExtras.length >
                                  0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">
                                      Premium Extras:
                                    </p>
                                    <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                      {item.packageDetails.platinumExtras.map(
                                        (f, i) => (
                                          <li key={i}>{f}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                              {item.packageDetails.addons &&
                                item.packageDetails.addons.length > 0 && (
                                  <div className="space-y-1">
                                    {item.packageDetails.addons.map(
                                      (addon, idx) => (
                                        <div
                                          key={idx}
                                          className="flex justify-between text-xs"
                                        >
                                          <span className="text-gray-600">
                                            + {addon.name}
                                          </span>
                                          <span className="text-green-600 font-medium">
                                            ₹{addon.price}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        )}

                        {/* Add-ons Details */}
                        {(item.addOns &&
                          item.addOns.length > 0 &&
                          !item.packageDetails) ||
                        (item.uiAddOns &&
                          item.uiAddOns.length > 0 &&
                          !item.packageDetails) ? (
                          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              Selected Add-ons
                            </h4>
                            <div className="space-y-1">
                              {(item.addOns || []).map((addon, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between text-xs"
                                >
                                  <span className="text-gray-600">
                                    + {addon.name}
                                  </span>
                                  <span className="text-green-600 font-medium">
                                    ₹{addon.price}
                                  </span>
                                </div>
                              ))}
                              {(item.uiAddOns || []).map((addon, idx) => (
                                <div
                                  key={`ui-${idx}`}
                                  className="flex justify-between text-xs"
                                >
                                  <span className="text-gray-600">
                                    + {addon.name}
                                  </span>
                                  <span className="text-green-600 font-medium">
                                    ₹{addon.price}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* Laundry Details */}
                        {item.laundryDetails && (
                          <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                              <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                              Laundry Items ({item.laundryDetails.totalItems})
                            </h4>
                            <div className="max-h-24 overflow-y-auto space-y-1">
                              {item.laundryDetails.selectedItems ? (
                                // Handle selectedItems format (from LaundryPageNew)
                                convertSelectedItemsToArray(item.laundryDetails.selectedItems).map(
                                (laundryItem, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-xs"
                                  >
                                    <span className="text-gray-600">
                                      {laundryItem.name} ×{" "}
                                      {laundryItem.quantity}
                                    </span>
                                    <span className="font-medium">
                                      ₹{laundryItem.totalPrice}
                                    </span>
                                  </div>
                                )
                              )) : item.laundryDetails.items ? (
                                // Handle items array format (from LaundryDeals)
                                item.laundryDetails.items.map(
                                (laundryItem, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-xs"
                                  >
                                    <span className="text-gray-600">
                                      {laundryItem.name} ×{" "}
                                      {laundryItem.quantity}
                                    </span>
                                    <span className="font-medium">
                                      ₹{laundryItem.totalPrice}
                                    </span>
                                  </div>
                                )
                              )) : null}
                            </div>
                          </div>
                        )}

                        {/* Quantity Controls - Mobile Responsive, Touch-Friendly */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 touch-manipulation"
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="w-10 sm:w-12 text-center font-semibold text-base sm:text-lg">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:from-blue-700 active:to-purple-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 touch-manipulation"
                            >
                              <Plus className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Offer Badge */}
                        {item.offer && (
                          <div className="mt-3 inline-block">
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold">
                              🔥 {item.offer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Right Section - Mobile Responsive */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 sm:top-24">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                {/* Summary Header - Mobile Responsive */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 text-white">
                  <h2 className="text-lg sm:text-xl font-bold mb-2">Order Summary</h2>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-green-100 text-sm sm:text-base">Ready to checkout</span>
                  </div>
                </div>

                {/* Summary Content - Mobile Responsive */}
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">₹{getCartTotal()}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                      <span>Coupon Discount</span>
                      <span className="text-green-600 font-medium">
                        -₹{appliedCoupon.discountAmount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Taxable Amount</span>
                    <span className="font-medium">₹{getTaxableSubtotal()}</span>
                  </div>
                  {isIntraState() ? (
                    <>
                      <div className="flex justify-between text-gray-600 text-xs sm:text-sm">
                        <span>CGST (9%)</span>
                        <span>₹{getCGSTAmount()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-xs sm:text-sm">
                        <span>SGST (9%)</span>
                        <span>₹{getSGSTAmount()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-gray-600">
                      <span>IGST (18%)</span>
                      <span>₹{getIGSTAmount()}</span>
                    </div>
                  )}

                  {/* Service charge removed as per request */}

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    {!appliedCoupon ? (
                      <div>
                        <button
                          onClick={() =>
                            setShowCouponSection(!showCouponSection)
                          }
                          className="w-full flex items-center justify-between p-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <span className="text-gray-700 font-medium">
                              Apply Coupon Code
                            </span>
                          </div>
                          <span className="text-blue-600 text-sm">
                            {availableCoupons.length} available
                          </span>
                        </button>

                        {showCouponSection && (
                          <div className="mt-3 space-y-3">
                            {/* Manual Coupon Code Entry */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter coupon code"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={couponCode}
                                onChange={(e) =>
                                  setCouponCode(e.target.value.toUpperCase())
                                }
                              />
                              <button
                                onClick={applyCouponByCode}
                                disabled={couponLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                              >
                                {couponLoading ? "Applying..." : "Apply"}
                              </button>
                            </div>

                            {/* Available Coupons */}
                            {availableCoupons.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">
                                  Available Coupons:
                                </p>
                                <div className="max-h-40 overflow-y-auto space-y-2">
                                  {availableCoupons.map((coupon) => {
                                    const eligible =
                                      getCartTotal() >=
                                      (coupon.minimumOrderAmount || 0);
                                    const handleClick = () => {
                                      if (!eligible) {
                                        toast.error(
                                          `Add ₹${Math.max(
                                            0,
                                            (coupon.minimumOrderAmount || 0) -
                                              getCartTotal()
                                          )} more to use ${coupon.code}`
                                        );
                                        return;
                                      }
                                      applyCoupon(coupon);
                                    };
                                    return (
                                      <div
                                        key={coupon._id}
                                        className={
                                          "p-3 border rounded-lg transition-colors " +
                                          (eligible
                                            ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                            : "border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed")
                                        }
                                        onClick={
                                          eligible ? handleClick : undefined
                                        }
                                        aria-disabled={!eligible}
                                      >
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <span className="font-bold text-blue-600">
                                                {coupon.code}
                                              </span>
                                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                {coupon.couponTypeLabel ||
                                                  "Special Offer"}
                                              </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                              {coupon.description}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                              Min order: ₹
                                              {coupon.minimumOrderAmount}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <div className="font-bold text-green-600">
                                              {coupon.discountType ===
                                              "percentage"
                                                ? `${coupon.discountValue}% OFF`
                                                : `₹${coupon.discountValue} OFF`}
                                            </div>
                                            {coupon.potentialDiscount > 0 && (
                                              <div className="text-xs text-gray-600">
                                                Save ₹{coupon.potentialDiscount}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="h-5 w-5 text-green-600" />
                            <div>
                              <span className="font-bold text-green-800">
                                {appliedCoupon.code}
                              </span>
                              <p className="text-sm text-green-600">
                                {appliedCoupon.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-green-700">
                              -₹{appliedCoupon.discountAmount}
                            </span>
                            <button
                              onClick={removeCoupon}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Show discount in summary */}
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon discount ({appliedCoupon.code})</span>
                      <span>-₹{appliedCoupon.discountAmount}</span>
                    </div>
                  )}

                  <hr className="border-gray-200" />

                  <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-600">₹{getFinalTotal()}</span>
                  </div>

                  {/* Checkout Button - Mobile Responsive, Touch-Friendly */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center space-x-2 touch-manipulation min-h-[44px]"
                  >
                    <span className="text-sm sm:text-base">Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Trust Signals - Mobile Responsive */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <div className="text-center">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600">Secure Payment</p>
                    </div>
                    <div className="text-center">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600">Quality Service</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal - Mobile Responsive */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-2 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-100 relative transform transition-all">
            {/* Modal Header - Mobile Responsive */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-4 sm:p-8 flex justify-between items-center rounded-t-2xl sm:rounded-t-3xl z-[110] shadow-lg gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-1 truncate">
                  Complete Your Order
                </h2>
                <p className="text-emerald-100 text-xs sm:text-sm">
                  Just a few more details to get started!
                </p>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-2 sm:p-3 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90 flex-shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            {/* Modal Content - Mobile Responsive */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 bg-gradient-to-b from-gray-50 to-white">
              {/* Order Items Summary - Mobile Responsive */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border-2 border-gray-100">
                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                  <h3 className="font-bold text-base sm:text-xl text-gray-800 flex items-center">
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
                    Your Order
                  </h3>
                  <span className="px-2 py-1 sm:px-3 sm:py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {groupedCart.map((group) => (
                    <div key={group.key}>
                      <div className="text-sm font-semibold text-gray-800 mb-1">
                        {group.key}
                      </div>
                      <div className="space-y-2">
                        {group.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-800 font-medium">
                                {item.title || item.name || item.serviceName}
                                {item.packageName
                                  ? ` - ${item.packageName}`
                                  : ""}
                              </span>
                              <span className="font-medium">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                            {Array.isArray(item.packageDetails?.features) &&
                              item.packageDetails.features.length > 0 && (
                                <ul className="list-disc ml-5 text-xs text-gray-600 mt-1">
                                  {item.packageDetails.features
                                    .slice(0, 3)
                                    .map((f, i) => (
                                      <li key={i}>{f}</li>
                                    ))}
                                  {item.packageDetails.features.length > 3 && (
                                    <li>
                                      +{" "}
                                      {item.packageDetails.features.length - 3}{" "}
                                      more
                                    </li>
                                  )}
                                </ul>
                              )}
                            {Array.isArray(item.packageDetails?.addons) &&
                              item.packageDetails.addons.length > 0 && (
                                <div className="mt-1 text-xs text-gray-700">
                                  Add-ons:{" "}
                                  {item.packageDetails.addons
                                    .map((a) => `${a.name} (₹${a.price})`)
                                    .join(", ")}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="my-3 border-gray-300" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">₹{getFinalTotal()}</span>
                </div>
              </div>

              {/* Service Details Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Service Address
                  </label>
                  <MapboxLocationPicker
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    onSelect={handleAddressSelect}
                    placeholder="Search or drag pin to select your location"
                    className="w-full"
                    initialCoords={
                      addressData?.latitude && addressData?.longitude
                        ? {
                            latitude: addressData.latitude,
                            longitude: addressData.longitude,
                          }
                        : null
                    }
                  />

                  {/* Service Availability Warning */}
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-700 text-sm">
                      <p className="font-semibold mb-2">
                        📍 Service Availability:
                      </p>
                      <div className="space-y-1">
                        <p>
                          • <span className="font-medium">Free service</span>{" "}
                          within 5 km radius
                        </p>
                        <p>
                          • <span className="font-medium">Extra charges:</span>{" "}
                          5-10 km → ₹50, 10-15 km → ₹100
                        </p>
                        <p>
                          • <span className="font-medium">Requirement:</span>{" "}
                          Please ensure 2 buckets of water and a power supply
                          are available at your address.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <Calendar className="inline w-5 h-5 mr-2 text-emerald-600" />
                    Service Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <Clock className="inline w-5 h-5 mr-2 text-emerald-600" />
                    Preferred Time Slot
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {generateTimeSlots().map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          selectedTimeSlot === slot
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md transform scale-105"
                            : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {!selectedTimeSlot && (
                    <p className="text-xs text-red-600 mt-2 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Please select a time slot
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <Phone className="inline w-5 h-5 mr-2 text-emerald-600" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Enter 10-digit mobile number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <CreditCard className="inline w-5 h-5 mr-2 text-emerald-600" />
                    Payment Method
                  </label>
                  <div className="space-y-3">
                    {paymentOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedPayment === option.id
                            ? "border-emerald-600 bg-emerald-50 shadow-md"
                            : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={option.id}
                          checked={selectedPayment === option.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-5 h-5 text-emerald-600"
                        />
                        <span className="text-2xl mr-3">{option.icon}</span>
                        <span className="font-medium">{option.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="space-y-4 pt-2">
                {!createdOrder ? (
                  // Show place order button if no order created yet
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className={`w-full font-bold py-5 px-6 rounded-2xl transition-all duration-300 transform shadow-xl flex items-center justify-center space-x-3 text-lg ${
                      placingOrder
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white hover:scale-105 hover:shadow-2xl"
                    }`}
                  >
                    {placingOrder ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span>Confirm Order - ₹{getFinalTotal()}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                ) : selectedPayment === "upi" ? (
                  // Show Razorpay payment component for UPI payments
                  <div className="space-y-4">
                    <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl">
                      <div className="flex items-center mb-3">
                        <CheckCircle className="w-6 h-6 text-emerald-600 mr-2" />
                        <h3 className="font-bold text-emerald-900 text-lg">
                          Order Created Successfully!
                        </h3>
                      </div>
                      <p className="text-emerald-700 font-semibold">
                        Order Number: {createdOrder.orderNumber}
                      </p>
                      <p className="text-emerald-600 text-sm mt-2">
                        Please complete the payment to confirm your order.
                      </p>
                    </div>

                    <RazorpayPayment
                      amount={getFinalTotal()}
                      orderId={createdOrder._id}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                      buttonText={`Pay ₹${getFinalTotal()} with UPI`}
                    />
                  </div>
                ) : (
                  // COD order completed
                  <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl text-center">
                    <div className="flex justify-center mb-3">
                      <div className="bg-emerald-100 rounded-full p-3">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                      </div>
                    </div>
                    <h3 className="font-bold text-emerald-900 text-xl mb-2">
                      Order Placed Successfully! 🎉
                    </h3>
                    <p className="text-emerald-700 font-semibold text-lg mb-1">
                      Order #{createdOrder.orderNumber}
                    </p>
                    <p className="text-emerald-600 text-sm">
                      We'll contact you shortly to confirm the details
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms of Service and
                  Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
