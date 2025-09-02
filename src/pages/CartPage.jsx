import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, X, MapPin, Phone, Calendar, CreditCard, Sparkles, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import AddressAutocomplete from '../components/AddressAutocomplete';
import RazorpayPayment from '../components/RazorpayPayment';
import { createOrder } from '../api/orders';
import toast from 'react-hot-toast';

// API base for all requests in this module
const API = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, loading: cartLoading } = useCart();
  const { user, loading } = useAuth();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [alternateLocation, setAlternateLocation] = useState('');
  const [useAlternateLocation, setUseAlternateLocation] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [addressData, setAddressData] = useState(null); // Store complete address data
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
  // Coupon state
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponSection, setShowCouponSection] = useState(false);

  // Auto-populate user data when component mounts
  useEffect(() => {
    if (user && !loading) {
      if (user.phone && !phoneNumber) {
        setPhoneNumber(user.phone);
      }
      if (user.address && !selectedLocation) {
        setSelectedLocation(user.address);
      }
    }
  }, [user, loading]);

  // Fetch available coupons
  useEffect(() => {
    if (cartItems.length > 0) {
      fetchAvailableCoupons();
    }
  }, [cartItems]);

  const fetchAvailableCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const cartTotal = getCartTotal();
  const response = await fetch(`${API}/api/coupons?orderAmount=${cartTotal}&userId=${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAvailableCoupons(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const applyCoupon = async (coupon) => {
    try {
      setCouponLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to apply a coupon');
        setCouponLoading(false);
        return;
      }
      const cartTotal = getCartTotal();

      console.log('🎫 Applying coupon:', {
        code: coupon.code,
        orderAmount: cartTotal,
        userId: user?.id
      });

      const response = await fetch(`${API}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: coupon.code,
          orderAmount: Number(cartTotal) || 0,
          userId: user?.id
        })
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please log in again to use coupons');
        } else {
          toast.error(result.message || 'Failed to validate coupon');
        }
        return;
      }
      console.log('🎫 Coupon validation response:', result);

      if (result.success && result.data.isValid) {
        setAppliedCoupon({
          ...coupon,
          discountAmount: result.data.discountAmount
        });
        setCouponCode(coupon.code);
        setShowCouponSection(false);
  console.log('✅ Coupon applied successfully:', {
          code: coupon.code,
          discountAmount: result.data.discountAmount
        });
        toast.success(`Coupon ${coupon.code} applied! You saved ₹${result.data.discountAmount}`);
      } else {
        console.error('❌ Coupon validation failed:', result);
        toast.error(result.message || 'Invalid coupon');
      }
    } catch (error) {
      console.error('💥 Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const applyCouponByCode = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      setCouponLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to apply a coupon');
        setCouponLoading(false);
        return;
      }
      const cartTotal = getCartTotal();

      console.log('🎫 Applying coupon by code:', {
        code: couponCode.toUpperCase(),
        orderAmount: cartTotal,
        userId: user?.id
      });

      const response = await fetch(`${API}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          orderAmount: Number(cartTotal) || 0,
          userId: user?.id
        })
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please log in again to use coupons');
        } else {
          toast.error(result.message || 'Failed to validate coupon');
        }
        return;
      }
      console.log('🎫 Coupon by code validation response:', result);

      if (result.success && result.data.isValid) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          name: result.data.coupon?.name || 'Coupon',
          discountAmount: result.data.discountAmount,
          discountType: result.data.coupon?.discountType || 'fixed'
        });
        setShowCouponSection(false);
        console.log('✅ Coupon by code applied successfully:', {
          code: couponCode.toUpperCase(),
          discountAmount: result.data.discountAmount
        });
        toast.success(`Coupon ${couponCode.toUpperCase()} applied! You saved ₹${result.data.discountAmount}`);
      } else {
        console.error('❌ Coupon by code validation failed:', result);
        toast.error(result.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('💥 Error applying coupon by code:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  toast('Coupon removed');
  };

  // Handle start shopping - navigate to home and scroll to service categories
  const handleStartShopping = () => {
    navigate('/', { state: { scrollTo: 'service-categories' } });
  };

  // Calculate final total with coupon discount
  const getFinalTotal = () => {
    const subtotal = getCartTotal();
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const finalTotal = Math.max(subtotal - discount, 0);
    
    console.log('💰 Final total calculation:', {
      subtotal,
      appliedCoupon: appliedCoupon ? {
        code: appliedCoupon.code,
        discountAmount: appliedCoupon.discountAmount
      } : null,
      discount,
      finalTotal
    });
    
    return finalTotal;
  };

  const getDiscountAmount = () => {
    return appliedCoupon ? appliedCoupon.discountAmount : 0;
  };

  // Normalize item into high-level group for cart sections
  const getItemGroup = (item) => {
    const type = (item.type || '').toLowerCase();
    const categoryText = ((item.category || item.serviceName || '') + ' ' + (item.vehicleType || '')).toLowerCase();
    if (type.includes('car')) return 'Car';
    if (type.includes('bike')) return 'Bike';
    if (type.includes('helmet')) return 'Helmet';
    if (type.includes('laundry') || item.laundryDetails) return 'Laundry';
    if (/hatch|sedan|suv|mid\s*-\s*suv|luxur/.test(categoryText)) return 'Car';
    if (/scooter|motorbike|cruiser|bike/.test(categoryText)) return 'Bike';
    if (/helmet/.test(categoryText)) return 'Helmet';
    return 'Others';
  };

  const groupOrder = ['Car', 'Bike', 'Helmet', 'Laundry', 'Others'];
  const groupedCart = React.useMemo(() => {
    const groups = {};
    (cartItems || []).forEach((it) => {
      const g = getItemGroup(it);
      if (!groups[g]) groups[g] = [];
      groups[g].push(it);
    });
    return groupOrder.filter((g) => groups[g]?.length).map((g) => ({ key: g, items: groups[g] }));
  }, [cartItems]);

  // Handle address selection from autocomplete
  const handleAddressSelect = (selectedAddress) => {
    setSelectedLocation(selectedAddress.fullAddress);
    setAddressData(selectedAddress);
  };

  const handleProceedToCheckout = () => {
    // Pre-fill with user data if available
    if (user) {
      setPhoneNumber(user.phone || '');
      // Auto-populate address from user profile if available
      if (user.address && !selectedLocation) {
        setSelectedLocation(user.address);
      }
    }
    
    // Check for pending booking data
    const storedBooking = localStorage.getItem('pendingBooking');
    if (storedBooking) {
      const data = JSON.parse(storedBooking);
      setSelectedLocation(data.address || user?.address || '');
      setPickupDate(data.pickupDate || '');
      setPhoneNumber(data.phoneNumber || user?.phone || '');
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
    if (!selectedLocation || selectedLocation.trim().length < 5) missing.push('Service address');
    if (!pickupDate) missing.push('Pickup date');
    if (!selectedTimeSlot) missing.push('Preferred time slot');
    if (!phoneNumber || !/^\d{10}$/.test((phoneNumber || '').trim())) missing.push('Valid 10-digit phone number');
    if (!selectedPayment) missing.push('Payment method');
    if (!cartItems || cartItems.length === 0) missing.push('At least one item in cart');

    if (missing.length) {
      toast.error(`Please provide: ${missing.join(', ')}`);
      return;
    }

    setPlacingOrder(true);

    try {
      // Prepare order data for backend
      const orderData = {
        items: cartItems.map(item => ({
          serviceId: item.serviceId || item.id,
          packageId: item.packageId,
          serviceName: item.serviceName || item.title || item.name,
          packageName: item.packageName || item.plan,
          quantity: item.quantity || 1,
          price: item.packageDetails?.basePrice || item.basePrice || item.price,
          addOns: (item.addOns || item.packageDetails?.addons || []).map(addon => ({
            ...addon,
            quantity: addon.quantity || 1
          })),
          laundryItems: item.laundryItems || [],
          vehicleType: item.vehicleType || item.category,
          specialInstructions: item.specialInstructions || item.notes,
          includedFeatures: item.packageDetails?.features || item.includedFeatures || [],
          planDetails: {
            washIncludes: item.packageDetails?.washIncludes || [],
            weeklyIncludes: item.packageDetails?.weeklyIncludes || [],
            biWeeklyIncludes: item.packageDetails?.biWeeklyIncludes || [],
            monthlyBonuses: item.packageDetails?.monthlyBonuses || [],
            platinumExtras: item.packageDetails?.platinumExtras || []
          }
        })),
        serviceAddress: {
          fullAddress: selectedLocation,
          latitude: addressData?.latitude,
          longitude: addressData?.longitude,
          city: addressData?.city,
          state: addressData?.state,
          pincode: addressData?.pincode,
          landmark: addressData?.landmark
        },
  scheduledDate: pickupDate,
  scheduledTimeSlot: selectedTimeSlot,
        paymentMethod: selectedPayment === 'cod' ? 'cash' : selectedPayment,
        customerNotes: `Phone: ${phoneNumber}`,
        subtotal: getCartTotal(),
        discountAmount: getDiscountAmount(),
        couponCode: appliedCoupon?.code || null,
        totalAmount: getFinalTotal()
      };

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to place order');
        return;
      }

      // Make API call to create order
      const result = await createOrder(token, orderData);

      if (result.success) {
        setCreatedOrder(result.data);
        
        // If payment method is UPI, don't close modal yet - show payment component
        if (selectedPayment === 'upi') {
          // Order created, now show payment component
          console.log('Order created, showing payment options:', result.data);
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
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
      setPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
  toast.success(`Payment successful! #${createdOrder.orderNumber}`);
    clearCart();
    setShowCheckoutModal(false);
    setPlacingOrder(false);
    setCreatedOrder(null);
    // Navigate to orders
    navigate('/orders');
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
  const reason = error?.description || error?.message || 'Payment failed.';
  toast.error(`${reason} Please try again or contact support.`);
    setPlacingOrder(false);
    // Order is created but payment failed - user can retry payment
  };

  const paymentOptions = [
    { id: 'upi', name: 'UPI (PhonePe/GooglePay)', icon: '📱' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' }
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
    const period = hour24 >= 12 ? 'PM' : 'AM';
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <X className="text-red-500 h-5 w-5" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Please login to view your cart</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You need to be logged in to add items to cart
          </p>
          
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Login Now
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while cart is being loaded
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-spin">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-4">Loading your cart...</h2>
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
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart feels lonely</h2>
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
      {/* Header Section with Glassmorphism */}
      <div className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{cartItems.length}</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Your Cart
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500 text-sm">{cartItems.length} items • ₹{getCartTotal()}</p>
                  {appliedCoupon && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      <Sparkles className="h-3 w-3" />
                      <span>Coupon: {appliedCoupon.code}</span>
                    </div>
                  )}
                  {availableCoupons.length > 0 && !appliedCoupon && (
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {availableCoupons.length} coupons available
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-200"
            >
              Clear All
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
                  <h3 className="text-xl font-bold text-gray-800">{group.key}</h3>
                  <span className="text-xs text-gray-500">{group.items.length} item{group.items.length > 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-4">
            {group.items.map((item, index) => (
              <div 
                key={item.id || `${item.serviceId}-${item.packageId}-${index}`}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Item Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">
                          {item.title || item.name || item.serviceName}
                        </h3>
                        {(item.packageName || item.category) && (
                          <span className="text-blue-100 text-sm">
                            {item.packageName || item.category}
                          </span>
                        )}
                        {item.vehicleType && (
                          <span className="text-blue-200 text-xs block mt-1">
                            Vehicle: {item.vehicleType}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id || item.serviceId, item.packageId)}
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white hover:text-red-200 transition-all duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Item Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* Image */}
                      {(item.img || item.image) && (
                        <img
                          src={item.img || item.image}
                          alt={item.title || item.name}
                          className="w-16 h-16 object-cover rounded-xl border-2 border-gray-100"
                        />
                      )}
                      <div className="flex flex-col space-y-2">
                        {/* Removed rating and duration display */}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{(item.price * item.quantity)}
                      </div>
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
                          <span className="text-gray-600">Base Service:</span>
                          <span className="font-medium">₹{item.packageDetails.basePrice}</span>
                        </div>
            {Array.isArray(item.packageDetails.features) && item.packageDetails.features.length > 0 && (
                          <div className="mt-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">{item.type === 'monthly_plan' ? 'Plan Features:' : 'Included Features:'}</p>
                            <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                              {item.packageDetails.features.map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Monthly plan details if available */}
                        {Array.isArray(item.packageDetails.washIncludes) && item.packageDetails.washIncludes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Each Wash Includes:</p>
                            <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                              {item.packageDetails.washIncludes.map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {Array.isArray(item.packageDetails.weeklyIncludes) && item.packageDetails.weeklyIncludes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Weekly Includes:</p>
                            <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                              {item.packageDetails.weeklyIncludes.map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {Array.isArray(item.packageDetails.biWeeklyIncludes) && item.packageDetails.biWeeklyIncludes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Bi-Weekly Includes:</p>
                            <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                              {item.packageDetails.biWeeklyIncludes.map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {Array.isArray(item.packageDetails.monthlyBonuses) && item.packageDetails.monthlyBonuses.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Monthly Bonuses:</p>
                            <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                              {item.packageDetails.monthlyBonuses.map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {Array.isArray(item.packageDetails.platinumExtras) && item.packageDetails.platinumExtras.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Premium Extras:</p>
                            <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                              {item.packageDetails.platinumExtras.map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {item.packageDetails.addons && item.packageDetails.addons.length > 0 && (
                          <div className="space-y-1">
                            {item.packageDetails.addons.map((addon, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-gray-600">+ {addon.name}</span>
                                <span className="text-green-600 font-medium">₹{addon.price}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add-ons Details */}
                  {item.addOns && item.addOns.length > 0 && !item.packageDetails && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Selected Add-ons
                      </h4>
                      <div className="space-y-1">
                        {item.addOns.map((addon, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-gray-600">+ {addon.name}</span>
                            <span className="text-green-600 font-medium">₹{addon.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Laundry Details */}
                  {item.laundryDetails && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                        Laundry Items ({item.laundryDetails.totalItems})
                      </h4>
                      <div className="max-h-24 overflow-y-auto space-y-1">
                        {item.laundryDetails.items.map((laundryItem, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-gray-600">
                              {laundryItem.name} × {laundryItem.quantity}
                            </span>
                            <span className="font-medium">₹{laundryItem.totalPrice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Offer Badge */}
                  {item.offer && (
                    <div className="mt-3 inline-block">
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        🔥 {item.offer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Right Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                {/* Summary Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                  <h2 className="text-xl font-bold mb-2">Order Summary</h2>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-green-100">Ready to checkout</span>
                  </div>
                </div>

                {/* Summary Content */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Service charge</span>
                    <span className="text-green-600">FREE</span>
                  </div>

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    {!appliedCoupon ? (
                      <div>
                        <button
                          onClick={() => setShowCouponSection(!showCouponSection)}
                          className="w-full flex items-center justify-between p-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <span className="text-gray-700 font-medium">Apply Coupon Code</span>
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
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              />
                              <button
                                onClick={applyCouponByCode}
                                disabled={couponLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                              >
                                {couponLoading ? 'Applying...' : 'Apply'}
                              </button>
                            </div>

                            {/* Available Coupons */}
                            {availableCoupons.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Available Coupons:</p>
                                <div className="max-h-40 overflow-y-auto space-y-2">
                                  {availableCoupons.map((coupon) => {
                                    const eligible = (getCartTotal() >= (coupon.minimumOrderAmount || 0));
                                    const handleClick = () => {
                                      if (!eligible) {
                                        toast.error(`Add ₹${Math.max(0, (coupon.minimumOrderAmount || 0) - getCartTotal())} more to use ${coupon.code}`);
                                        return;
                                      }
                                      applyCoupon(coupon);
                                    };
                                    return (
                                    <div
                                      key={coupon._id}
                                      className={
                                        "p-3 border rounded-lg transition-colors " +
                                        (eligible ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer" : "border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed")
                                      }
                                      onClick={eligible ? handleClick : undefined}
                                      aria-disabled={!eligible}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-bold text-blue-600">{coupon.code}</span>
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                              {coupon.couponTypeLabel || 'Special Offer'}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Min order: ₹{coupon.minimumOrderAmount}
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-bold text-green-600">
                                            {coupon.discountType === 'percentage' 
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
                                  )})}
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
                              <span className="font-bold text-green-800">{appliedCoupon.code}</span>
                              <p className="text-sm text-green-600">{appliedCoupon.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-green-700">-₹{appliedCoupon.discountAmount}</span>
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
                  
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{getFinalTotal()}</span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  {/* Trust Signals */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600">Secure Payment</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-blue-600" />
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

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 relative">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center rounded-t-3xl z-[110]">
              <h2 className="text-2xl font-bold text-white">Complete Your Order</h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Items Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {groupedCart.map((group) => (
                    <div key={group.key}>
                      <div className="text-sm font-semibold text-gray-800 mb-1">{group.key}</div>
                      <div className="space-y-2">
                        {group.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-800 font-medium">
                                {item.title || item.name || item.serviceName}{item.packageName ? ` - ${item.packageName}` : ''}
                              </span>
                              <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                            {Array.isArray(item.packageDetails?.features) && item.packageDetails.features.length > 0 && (
                              <ul className="list-disc ml-5 text-xs text-gray-600 mt-1">
                                {item.packageDetails.features.slice(0, 3).map((f, i) => (
                                  <li key={i}>{f}</li>
                                ))}
                                {item.packageDetails.features.length > 3 && (
                                  <li>+ {item.packageDetails.features.length - 3} more</li>
                                )}
                              </ul>
                            )}
                            {Array.isArray(item.packageDetails?.addons) && item.packageDetails.addons.length > 0 && (
                              <div className="mt-1 text-xs text-gray-700">
                                Add-ons: {item.packageDetails.addons.map(a => `${a.name} (₹${a.price})`).join(', ')}
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
                  <AddressAutocomplete
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    onSelect={handleAddressSelect}
                    placeholder="Enter your service address"
                    className="w-full"
                    showCurrentLocation={true}
                  />
                  
                  {/* Service Availability Warning */}
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-700 text-sm">
                      <p className="font-semibold mb-2">⚠️ Service Availability:</p>
                      <div className="space-y-1">
                        <p>• <span className="font-medium">Free service</span> within 5 km radius</p>
                        <p>• <span className="font-medium">Extra charges:</span> 5-10 km → ₹50, 10-15 km → ₹100</p>
                        <p>• <span className="font-medium">Requirement:</span> Please ensure 2 buckets of water and a power supply are available at your address.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Time Slot
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {generateTimeSlots().map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          selectedTimeSlot === slot
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {!selectedTimeSlot && (
                    <p className="text-xs text-red-600 mt-1">Please select a time slot.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="inline w-4 h-4 mr-1" />
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {paymentOptions.map((option) => (
                      <label key={option.id} className="flex items-center p-3 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          value={option.id}
                          checked={selectedPayment === option.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="mr-3"
                        />
                        <span className="mr-2">{option.icon}</span>
                        <span>{option.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="space-y-3">
                {!createdOrder ? (
                  // Show place order button if no order created yet
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${
                      placingOrder 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>{placingOrder ? 'Creating Order...' : `Place Order - ₹${getFinalTotal()}`}</span>
                  </button>
                ) : selectedPayment === 'upi' ? (
                  // Show Razorpay payment component for UPI payments
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Order Created Successfully!</h3>
                      <p className="text-blue-700 text-sm">Order Number: {createdOrder.orderNumber}</p>
                      <p className="text-blue-600 text-sm">Please complete the payment to confirm your order.</p>
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
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-900">Order Placed Successfully!</h3>
                    <p className="text-green-700 text-sm">Order Number: {createdOrder.orderNumber}</p>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
