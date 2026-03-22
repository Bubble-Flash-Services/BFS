import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { createRazorpayOrder, verifyRazorpayPayment, handlePaymentFailure } from '../api/payments';
import { CheckCircle, AlertCircle, Loader, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const RazorpayPayment = ({ 
  amount, 
  orderId, 
  onSuccess, 
  onFailure, 
  disabled = false,
  buttonText = "Pay with UPI"
}) => {
  const { user, token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user || !token) {
      toast.error('Please login to continue payment');
      return;
    }

    if (!amount || amount <= 0) {
      toast.error('Invalid payment amount');
      return;
    }

    // Optional guard: if host passes invalid orderId, block
    if (!orderId) {
      toast.error('Order was not created correctly. Please try placing the order again.');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create Razorpay order
      const orderResponse = await createRazorpayOrder(token, {
        amount: amount,
        currency: 'INR',
        orderId: orderId
      });

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create payment order');
      }

      const { orderId: razorpayOrderId, key } = orderResponse.data;

      // Razorpay payment options
      const options = {
        key: key,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Bubble Flash Services',
        description: `Payment for Order #${orderId}`,
        order_id: razorpayOrderId,
        prefill: {
          name: user.name || user.email,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#2563eb'
        },
        method: {
          upi: true,
          card: false,
          wallet: true,
          netbanking: false,
          emi: false
        },
        handler: async function (response) {
          // Payment successful, verify with backend
          try {
            setPaymentStatus('verifying');
            
            const verificationResponse = await verifyRazorpayPayment(token, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            });

            if (verificationResponse.success) {
              setPaymentStatus('success');
              onSuccess && onSuccess({
                orderId: orderId,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id
              });
            } else {
              throw new Error(verificationResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
            onFailure && onFailure(error);
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setPaymentStatus('cancelled');
            toast('Payment window closed. Your order is not confirmed until payment is completed.');
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', async function (response) {
        console.error('Payment failed:', response.error);
        
        // Record payment failure
        try {
          await handlePaymentFailure(token, {
            orderId: orderId,
            error: response.error
          });
        } catch (error) {
          console.error('Error recording payment failure:', error);
        }

        setPaymentStatus('failed');
        onFailure && onFailure(response.error);
      });

      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      setPaymentStatus('failed');
      setIsProcessing(false);
      
      // Show user-friendly error message
  const errorMessage = error.message || 'Payment initiation failed. Please try again.';
  toast.error(errorMessage);
      
      onFailure && onFailure(error);
    }
  };

  const getButtonContent = () => {
    if (isProcessing && paymentStatus === 'verifying') {
      return (
        <>
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          Verifying Payment...
        </>
      );
    }

    if (isProcessing) {
      return (
        <>
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      );
    }

    if (paymentStatus === 'success') {
      return (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Payment Successful
        </>
      );
    }

    if (paymentStatus === 'failed') {
      return (
        <>
          <AlertCircle className="w-4 h-4 mr-2" />
          Payment Failed
        </>
      );
    }

    return (
      <>
        <CreditCard className="w-4 h-4 mr-2" />
        {buttonText}
      </>
    );
  };

  const getButtonClass = () => {
    const baseClass = "w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ";
    
    if (paymentStatus === 'success') {
      return baseClass + "bg-green-600 text-white cursor-default";
    }
    
    if (paymentStatus === 'failed') {
      return baseClass + "bg-red-600 text-white hover:bg-red-700";
    }
    
    if (disabled || isProcessing) {
      return baseClass + "bg-gray-400 text-white cursor-not-allowed";
    }
    
    return baseClass + "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105";
  };

  return (
    <div className="w-full">
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing || paymentStatus === 'success'}
        className={getButtonClass()}
      >
        {getButtonContent()}
      </button>
      
      {paymentStatus === 'success' && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Payment completed successfully!</span>
          </div>
          <p className="text-green-600 text-sm mt-1">
            Your order has been confirmed and you will receive a confirmation shortly.
          </p>
        </div>
      )}
      
      {paymentStatus === 'failed' && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Payment failed</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            Please try again or contact support if the issue persists.
          </p>
        </div>
      )}
      
      {paymentStatus === 'cancelled' && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center text-yellow-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Payment cancelled</span>
          </div>
          <p className="text-yellow-600 text-sm mt-1">
            You can try the payment again when ready.
          </p>
        </div>
      )}
    </div>
  );
};

export default RazorpayPayment;
