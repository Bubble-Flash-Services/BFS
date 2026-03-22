import {useBookingContext} from '../store/BookingContext';

const useBookings = () => {
  const {bookings, isLoading, error, fetchBookings, addBooking, cancelBooking} =
    useBookingContext();

  return {bookings, isLoading, error, fetchBookings, addBooking, cancelBooking};
};

export default useBookings;
