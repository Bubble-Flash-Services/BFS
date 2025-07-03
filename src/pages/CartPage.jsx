import React, { useState } from 'react';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, X, MapPin, Phone, Calendar, CreditCard } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Cart Items ({cartItems.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.id} className="p-6 flex items-center space-x-4">
                <img
                  src={item.img || item.image || '/public/car/car1.png'}
                  alt={item.title || item.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title || item.name}
                  </h3>
                  
                  {/* Service category display */}
                  {item.category && (
                    <p className="text-sm text-blue-600 font-medium mb-2">
                      {item.category}
                      {item.type === 'car-wash' && ' - Car Wash Service'}
                      {item.type === 'bike-wash' && ' - Bike Wash Service'}
                      {item.type === 'laundry-service' && ' - Laundry Service'}
                    </p>
                  )}
                  
                  {/* Package details section for car and bike wash */}
                  {item.packageDetails && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">Package Breakdown:</span>
                        <span className="text-xs text-gray-500">
                          {item.type === 'car-wash' ? 'Car Wash' : 'Bike Wash'} Service
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Base Package:</span>
                          <span className="font-medium">₹{item.packageDetails.basePrice}</span>
                        </div>
                        
                        {item.packageDetails.addons && item.packageDetails.addons.length > 0 && (
                          <>
                            <div className="border-t pt-2 mt-2">
                              <p className="font-medium text-gray-700 mb-1">Selected Add-ons:</p>
                              <div className="space-y-1">
                                {item.packageDetails.addons.map((addon, index) => (
                                  <div key={index} className="flex justify-between text-xs pl-2">
                                    <span>• {addon.name}</span>
                                    <span>₹{addon.price}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between font-medium text-gray-700 mt-2 pt-1 border-t">
                                <span>Add-ons Total:</span>
                                <span>₹{item.packageDetails.addonsTotal}</span>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {item.packageDetails.features && (
                          <div className="border-t pt-2 mt-2">
                            <p className="font-medium text-gray-700 mb-1">Package Features:</p>
                            <ul className="text-xs space-y-1 pl-2">
                              {item.packageDetails.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="text-gray-600">• {feature}</li>
                              ))}
                              {item.packageDetails.features.length > 3 && (
                                <li className="text-gray-500 italic">+ {item.packageDetails.features.length - 3} more features</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Laundry service details */}
                  {item.laundryDetails && (
                    <div className="mt-2 p-3 bg-purple-50 rounded-lg text-sm text-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">Laundry Service Details:</span>
                        <span className="text-xs text-purple-600 font-medium">
                          {item.laundryDetails.totalItems} items
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="max-h-32 overflow-y-auto">
                          {item.laundryDetails.items.map((laundryItem, index) => (
                            <div key={index} className="flex justify-between text-xs py-1 border-b border-purple-100 last:border-b-0">
                              <span className="flex-1">
                                {laundryItem.name} × {laundryItem.quantity}
                              </span>
                              <span className="font-medium">₹{laundryItem.totalPrice}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between font-medium text-gray-700 mt-2 pt-2 border-t border-purple-200">
                          <span>Service Total:</span>
                          <span>₹{item.laundryDetails.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Legacy display for other item types */}
                  {!item.packageDetails && (
                    <>
                      <div className="flex items-center mt-2">
                        {item.stars && [...Array(item.stars)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                      {item.oldPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          MRP: ₹{item.oldPrice}
                        </p>
                      )}
                      {item.offer && (
                        <span className="inline-block bg-red-400 text-white px-2 py-1 rounded text-xs font-semibold mt-1">
                          {item.offer}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  
                  <span className="text-lg font-semibold w-8 text-center">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{item.price * item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} each
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-700">Subtotal:</span>
                <span className="text-lg text-gray-900">₹{getCartTotal()}</span>
              </div>
              {calculateDiscount() > 0 && (
                <div className="flex justify-between items-center text-green-600">
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
