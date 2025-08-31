import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import advertisementAPI from '../../api/advertisements';

const DynamicAdvertisementSlider = ({ serviceType = 'car_wash', className = '' }) => {
  const [advertisements, setAdvertisements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    fetchAdvertisements();
  }, [serviceType]);

  useEffect(() => {
    if (autoPlay && advertisements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [autoPlay, advertisements.length, currentIndex]);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const response = await advertisementAPI.getAdvertisementsByService(serviceType, 5);
      setAdvertisements(response.data || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      setAdvertisements([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setAutoPlay(false);
    setCurrentIndex(currentIndex === 0 ? advertisements.length - 1 : currentIndex - 1);
    setTimeout(() => setAutoPlay(true), 10000); // Resume auto-play after 10 seconds
  };

  const handleNext = () => {
    setAutoPlay(false);
    setCurrentIndex(currentIndex === advertisements.length - 1 ? 0 : currentIndex + 1);
    setTimeout(() => setAutoPlay(true), 10000); // Resume auto-play after 10 seconds
  };

  const handleDotClick = (index) => {
    setAutoPlay(false);
    setCurrentIndex(index);
    setTimeout(() => setAutoPlay(true), 10000); // Resume auto-play after 10 seconds
  };

  const handleAdClick = async (ad) => {
    // Track click
    await advertisementAPI.trackClick(ad._id);
    
    // Navigate to CTA link if available
    if (ad.ctaLink) {
      window.open(ad.ctaLink, '_blank');
    }
  };

  const trackView = async (ad) => {
    // Track view when ad becomes visible
    await advertisementAPI.trackView(ad._id);
  };

  useEffect(() => {
    // Track view for currently visible ad
    if (advertisements[currentIndex]) {
      trackView(advertisements[currentIndex]);
    }
  }, [currentIndex, advertisements]);

  if (loading) {
    return (
      <div className={`w-full h-48 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center ${className}`}>
        <div className="text-gray-500">Loading advertisements...</div>
      </div>
    );
  }

  if (advertisements.length === 0) {
    return null; // Don't render anything if no ads
  }

  const currentAd = advertisements[currentIndex];

  const getAdBackground = (ad) => {
    if (ad.mediaType === 'image' && ad.imageUrl) {
      return {
        backgroundImage: `url(http://localhost:5000${ad.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else {
      return {
        backgroundColor: ad.colorBackground || '#3B82F6'
      };
    }
  };

  return (
    <div className={`relative w-full h-48 rounded-lg overflow-hidden shadow-lg ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative cursor-pointer"
          style={getAdBackground(currentAd)}
          onClick={() => handleAdClick(currentAd)}
        >
          {/* Content Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-6">
            <div className="text-center text-white max-w-md">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-2"
              >
                {currentAd.title}
              </motion.h3>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm mb-4 opacity-90"
              >
                {currentAd.description}
              </motion.p>
              {currentAd.ctaText && (
                <motion.button 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  {currentAd.ctaText}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Only show if multiple ads */}
      {advertisements.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if multiple ads */}
      {advertisements.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {advertisements.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Service Type Badge */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
        {serviceType.replace('_', ' ').toUpperCase()}
      </div>

      {/* Auto-play indicator */}
      {advertisements.length > 1 && autoPlay && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-black bg-opacity-50 text-white p-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Service-specific advertisement components
export const CarWashDeals = ({ className }) => (
  <DynamicAdvertisementSlider serviceType="car_wash" className={className} />
);

export const BikeWashDeals = ({ className }) => (
  <DynamicAdvertisementSlider serviceType="bike_wash" className={className} />
);

export const HelmetWashDeals = ({ className }) => (
  <DynamicAdvertisementSlider serviceType="helmet_wash" className={className} />
);

export const LaundryDeals = ({ className }) => (
  <DynamicAdvertisementSlider serviceType="laundry" className={className} />
);

export const GeneralDeals = ({ className }) => (
  <DynamicAdvertisementSlider serviceType="general" className={className} />
);

export default DynamicAdvertisementSlider;
