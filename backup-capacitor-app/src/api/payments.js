// Payment API functions
const API = import.meta.env.VITE_API_URL || window.location.origin;
const API_BASE_URL = `${API}/api/payments`;

export const createRazorpayOrder = async (token, orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const verifyRazorpayPayment = async (token, paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

export const handlePaymentFailure = async (token, failureData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/failure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(failureData)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
};

export const getPaymentStatus = async (token, orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/status/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};
