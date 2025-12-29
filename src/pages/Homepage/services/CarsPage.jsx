import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullBodyCheckup from '../../../components/FullBodyCheckup';

const carCategories = [
  {
    name: 'Hatchbacks',
    image: '/car/car1.png',
    route: '/car-wash-deals/hatchbacks'
  },
  
  {
    name: 'Sedans',
    image: '/car/sedan/sedansimage.jpg',
    route: '/car-wash-deals/sedans'
  },
  {
   name: 'MID-SUV',
    image: '/car/hatchback/aiease_1755725602539.png',
    route: '/car-wash-deals/midsuv'
  },
  {
    name: 'SUV',
    image: '/car/suv/suvimages.png',
    route: '/car-wash-deals/suv'
  },
  {
    name: 'Luxuries',
    image: '/car/suv/luxury_suv.png',
    route: '/car-wash-deals/luxuries'
  },
];

export default function CarsPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check for booking data from HeroSection
  useEffect(() => {
    const storedBooking = localStorage.getItem('pendingBooking');
    if (storedBooking) {
      const data = JSON.parse(storedBooking);
      // Only show booking data if it's for car wash and within 10 minutes
      if (data.category === 'Car Wash' && (Date.now() - data.timestamp) < 600000) {
        setBookingData(data);
      }
    }
  }, []);

  const clearBookingData = () => {
    setBookingData(null);
    localStorage.removeItem('pendingBooking');
  };

  // Auto-slide functionality removed - display vertically instead

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Booking Data Banner */}
        {bookingData && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  🚗 Your Car Wash Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-700">Service:</span> {bookingData.category}
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Pickup Date:</span> {new Date(bookingData.pickupDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Phone:</span> {bookingData.phoneNumber}
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Location:</span> {bookingData.address.substring(0, 50)}...
                  </div>
                </div>
                <p className="text-blue-600 text-sm mt-2">
                  Please select your car category below to complete your booking.
                </p>
              </div>
              <button
                onClick={clearBookingData}
                className="text-blue-500 hover:text-blue-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Select by cars</h2>
        
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {carCategories.map((cat) => (
            <div 
              key={cat.name} 
              className="group cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate(cat.route)}
            >
              <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-12">
                  <img src={cat.image} alt={cat.name} className="w-full h-48 object-contain mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Vertical Grid Layout */}
        <div className="md:hidden grid grid-cols-1 gap-6">
          {carCategories.map((cat) => (
            <div 
              key={cat.name} 
              className="group cursor-pointer transition-transform active:scale-95"
              onClick={() => navigate(cat.route)}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-12">
                  <img src={cat.image} alt={cat.name} className="w-full h-48 object-contain mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Full Body Car Checkup Section */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-blue-50 py-16 px-4 md:px-10 mt-20 rounded-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-serif bg-gradient-to-r from-blue-700 to-amber-500 bg-clip-text text-transparent mb-4">BFS Full Body Car Checkup</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">Complimentary visual inspection performed during selected premium car wash bookings. Helps you stay ahead on safety &amp; maintenance.</p>
          </div>
          <FullBodyCheckup type="car" />
          <div className="mt-10 text-center text-xs text-gray-500">Disclaimer: Visual inspection only. For mechanical faults please consult an authorized service center.</div>
        </div>
      </section>
    </section>
  );
}