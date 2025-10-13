const API = import.meta.env.VITE_API_URL || window.location.origin;

/**
 * Green & Clean API Client
 */
export const greenAPI = {
  // Services
  getServices: async (category = null) => {
    const url = category 
      ? `${API}/api/green/services?category=${category}`
      : `${API}/api/green/services`;
    
    const response = await fetch(url);
    return response.json();
  },

  getServiceById: async (id) => {
    const response = await fetch(`${API}/api/green/services/${id}`);
    return response.json();
  },

  // Bookings
  createBooking: async (bookingData) => {
    const response = await fetch(`${API}/api/green/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  },

  verifyPayment: async (bookingId, paymentData) => {
    const response = await fetch(`${API}/api/green/booking/${bookingId}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },

  getBooking: async (bookingId) => {
    const response = await fetch(`${API}/api/green/booking/${bookingId}`);
    return response.json();
  },

  getBookingsByPhone: async (phone) => {
    const response = await fetch(`${API}/api/green/booking/phone/${phone}`);
    return response.json();
  },

  // Admin
  getAllBookings: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API}/api/green/admin/bookings?${params}`, {
      credentials: 'include'
    });
    return response.json();
  },

  assignProvider: async (bookingId, providerId) => {
    const response = await fetch(`${API}/api/green/admin/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ bookingId, providerId })
    });
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API}/api/green/admin/stats`, {
      credentials: 'include'
    });
    return response.json();
  }
};
