import React, { useState } from 'react';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, X, MapPin, Phone, Calendar, CreditCard, Star, Clock, Sparkles, ArrowRight, CheckCircle, Heart } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user, loading } = useAuth();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [alternateLocation, setAlternateLocation] = useState('');
  const [useAlternateLocation, setUseAlternateLocation] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
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
      setPhoneNumber(data.phoneNumber || user?.phone || '');
    }
    
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = () => {
    // Validate required fields
    if (!pickupDate) {
      alert('Please select a pickup date');
      return;
    }
    if (!phoneNumber) {
      alert('Please enter your phone number');
      return;
    }
    if (!useAlternateLocation && !selectedLocation) {
      alert('Please enter your location');
      return;
    }
    if (useAlternateLocation && !alternateLocation) {
      alert('Please enter alternate location');
      return;
    }
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    // Process order
    const orderData = {
      items: cartItems,
      total: getFinalTotal(),
      discount: calculateDiscount(),
      location: useAlternateLocation ? alternateLocation : selectedLocation,
      pickupDate,
      phoneNumber,
      paymentMethod: selectedPayment,
      userId: user?.id,
      timestamp: Date.now()
    };

    // Here you would typically send the order to your backend
    console.log('Order placed:', orderData);
    
    // Clear cart and close modal
    clearCart();
    setShowCheckoutModal(false);
    localStorage.removeItem('pendingBooking');
    
    alert('Order placed successfully! You will receive a confirmation shortly.');
  };

  const paymentMethods = [
    { id: 'gpay', name: 'Google Pay', icon: '💳' },
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'paytm', name: 'Paytm', icon: '💰' },
    { id: 'upi', name: 'UPI', icon: '🏦' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' }
  ];

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please login to view your cart</h2>
          <p className="text-gray-600">You need to be logged in to add items to cart</p>
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
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Service charge</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  
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
                  <span className="text-sm">Discount (10% on orders above ₹500):</span>
                  <span className="text-sm font-medium">-₹{calculateDiscount()}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{getFinalTotal()}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={handleProceedToCheckout}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Order Items Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Items in your order ({cartItems.length})</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="flex-1">{item.title || item.name} × {item.quantity}</span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold text-gray-800">Service Location</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useAlternate"
                      checked={useAlternateLocation}
                      onChange={(e) => setUseAlternateLocation(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="useAlternate" className="text-sm text-gray-600">
                      Use alternate location
                    </label>
                  </div>
                </div>
                
                {!useAlternateLocation ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      placeholder="Enter your address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                    />
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={alternateLocation}
                      onChange={(e) => setAlternateLocation(e.target.value)}
                      placeholder="Enter alternate address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                    />
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  </div>
                )}
              </div>

              {/* Pickup Date and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                    />
                    <Calendar className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                    />
                    <Phone className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Select Payment Method</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                        selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-2xl">{method.icon}</span>
                        <span>{method.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-800">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10% on orders above ₹500):</span>
                      <span>-₹{calculateDiscount()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{getFinalTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
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
      )}
    </div>
  );
}
