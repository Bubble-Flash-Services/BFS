import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const carCategories = [
  {
    name: 'Hatchbacks',
    image: '/car/car1.png',
    route: '/car-wash-deals/hatchbacks'
  },
  {
    name: 'SUV',
    image: '/car/car2.png',
    route: '/car-wash-deals/suv'
  },
  {
    name: 'Sedans',
    image: '/car/car3.png',
    route: '/car-wash-deals/sedans'
  },
  {
    name: 'Luxuries',
    image: '/car/suv/luxury_suv.png',
    route: '/car-wash-deals/luxuries'
  },
];

export default function CarsPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

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

  // Auto-slide functionality
  useEffect(() => {
    if (!isMobile) return;
    
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide >= carCategories.length ? 0 : nextSlide;
      });
    }, 2000);

    return () => clearInterval(autoSlide);
  }, [isMobile]);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX;
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !isDragging.current) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !isDragging.current) return;
    isDragging.current = false;
    
    const endX = e.changedTouches[0].pageX;
    const diffX = startX.current - endX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && currentSlide < carCategories.length - 1) {
        // Swipe left - go to next slide
        setCurrentSlide(currentSlide + 1);
      } else if (diffX < 0 && currentSlide > 0) {
        // Swipe right - go to previous slide
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  const goToSlide = (index) => {
    if (!isMobile) return;
    setCurrentSlide(index);
  };

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

        {/* Mobile Slider Layout */}
        <div className="md:hidden relative overflow-hidden">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {carCategories.map((cat, index) => (
              <div
                key={cat.name}
                className="flex-shrink-0 w-full px-4"
              >
                <div 
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
              </div>
            ))}
          </div>

          {/* Mobile Slide Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {carCategories.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}