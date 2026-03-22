import {get, post, patch} from './api';

export const createBooking = async (bookingData) => {
  try {
    const response = await post('/bookings', bookingData);
    return {success: true, data: response.data};
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create booking.',
    };
  }
};

export const getBookings = async (status = null) => {
  try {
    const params = status ? {status} : {};
    const response = await get('/bookings', params);
    return {success: true, data: response.data};
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch bookings.',
      data: [],
    };
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const response = await get(`/bookings/${bookingId}`);
    return {success: true, data: response.data};
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch booking details.',
    };
  }
};

export const cancelBooking = async (bookingId, reason = '') => {
  try {
    const response = await patch(`/bookings/${bookingId}/cancel`, {reason});
    return {success: true, data: response.data};
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to cancel booking.',
    };
  }
};

export const getAvailableSlots = async (serviceId, date) => {
  try {
    const response = await get(`/services/${serviceId}/slots`, {date});
    return {success: true, data: response.data};
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch available slots.',
      data: [],
    };
  }
};
