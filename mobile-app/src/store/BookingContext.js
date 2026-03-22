import React, {createContext, useContext, useState, useCallback} from 'react';
import {
  getBookings,
  createBooking as createBookingService,
  cancelBooking as cancelBookingService,
} from '../services/bookingService';

const BookingContext = createContext(null);

export const BookingProvider = ({children}) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async (status = null) => {
    setIsLoading(true);
    setError(null);
    const result = await getBookings(status);
    if (result.success) {
      setBookings(result.data || []);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
    return result;
  }, []);

  const addBooking = useCallback(async (bookingData) => {
    setIsLoading(true);
    setError(null);
    const result = await createBookingService(bookingData);
    if (result.success) {
      setBookings(prev => [result.data, ...prev]);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
    return result;
  }, []);

  const cancelBooking = useCallback(async (bookingId, reason) => {
    setIsLoading(true);
    setError(null);
    const result = await cancelBookingService(bookingId, reason);
    if (result.success) {
      setBookings(prev =>
        prev.map(b => (b._id === bookingId ? {...b, status: 'cancelled'} : b)),
      );
    } else {
      setError(result.message);
    }
    setIsLoading(false);
    return result;
  }, []);

  return (
    <BookingContext.Provider
      value={{bookings, isLoading, error, fetchBookings, addBooking, cancelBooking}}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBookingContext must be used within BookingProvider');
  }
  return ctx;
};

export default BookingContext;
