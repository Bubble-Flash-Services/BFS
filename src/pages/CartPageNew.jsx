import React, { useState } from 'react';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, X, MapPin, Phone, Calendar, CreditCard, Star, Clock, Sparkles, ArrowRight, CheckCircle, Heart } from 'lucide-react';
import { convertSelectedItemsToArray } from '../data/laundryData';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user, loading } = useAuth();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [alternateLocation, setAlternateLocation] = useState('');
  const [useAlternateLocation, setUseAlternateLocation] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');

  // Calculate discount (example: 10% for orders above ₹500)
  const calculateDiscount = () => {
    const total = getCartTotal();
    if (total > 500) {
      return Math.floor(total * 0.1); // 10% discount
    }
    return 0;
  };

  const getFinalTotal = () => {
    return getCartTotal() - calculateDiscount();
  };

  const handleProceedToCheckout = () => {
    // Pre-fill with user data if available
    if (user) {
      setPhoneNumber(user.phone || '');
    }
    
    // Check for pending booking data
    const storedBooking = localStorage.getItem('pendingBooking');
    if (storedBooking) {
      const data = JSON.parse(storedBooking);
      setSelectedLocation(data.address || '');
      setPickupDate(data.pickupDate || '');
      setPickupTime(data.pickupTime || '');
      setPhoneNumber(data.phoneNumber || user?.phone || '');
    }
    
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = () => {
    // Validate required fields
    if (!pickupDate || !pickupTime || !phoneNumber || !selectedLocation || !selectedPayment) {
      alert('Please fill in all required fields');
      return;
    }

    // Create order data
    const orderData = {
      items: cartItems,
      total: getFinalTotal(),
      address: selectedLocation,
      alternateAddress: useAlternateLocation ? alternateLocation : null,
      pickupDate,
      pickupTime,
      phone: phoneNumber,
      paymentMethod: selectedPayment,
      userId: user?.id
    };

    // Store order data and navigate
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
    
    // Simulate order placement
    alert(`Order placed successfully! Total: ₹${getFinalTotal()}`);
    clearCart();
    setShowCheckoutModal(false);
  };

  const paymentOptions = [
    { id: 'upi', name: 'UPI (PhonePe/GooglePay)', icon: '📱' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' }
  ];

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
          
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
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
                <p className="text-gray-500 text-sm">{cartItems.length} items • ₹{getCartTotal()}</p>
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
          {/* Cart Items - Left Section */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
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
                        <div className="flex items-center space-x-2 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">
                            {item.stars ? item.stars + '.0' : '4.8'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">45 mins</span>
                        </div>
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

                  {/* Laundry Details */}
                  {item.laundryDetails && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                        Laundry Items ({item.laundryDetails.totalItems})
                      </h4>
                      <div className="max-h-24 overflow-y-auto space-y-1">
                        {item.laundryDetails.selectedItems && 
                          convertSelectedItemsToArray(item.laundryDetails.selectedItems).map((laundryItem, idx) => (
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
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors duration-200">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">Save for later</span>
                    </button>
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
                  
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-₹{calculateDiscount()}</span>
                    </div>
                  )}
                  
                  {/* Service charge removed as per request */}
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{getFinalTotal()}</span>
                  </div>

                  {/* Savings Badge */}
                  {calculateDiscount() > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-700 text-sm font-medium">
                        🎉 You're saving ₹{calculateDiscount()} on this order!
                      </p>
                    </div>
                  )}

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
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600">On-time Service</p>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center rounded-t-3xl">
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
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.title || item.name || item.serviceName} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
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
                  <input
                    type="text"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your service address"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Service Date
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
                      Service Time
                    </label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
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
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Place Order - ₹{getFinalTotal()}</span>
                </button>
                
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
