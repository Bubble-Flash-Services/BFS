import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const laundryCategories = [
  {
    name: 'Dry Cleaning',
    image: '/laundry/laundry1.png',
    category: 'dry-cleaning'
  },
  {
    name: 'Wash & Fold',
    image: '/laundry/laundry2.png',
    category: 'wash-fold'
  },
  {
    name: 'Ironing & Pressing',
    image: '/laundry/laundry3.png',
    category: 'ironing'
  },
];

export default function LaundryPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleCategoryClick = (category) => {
    navigate(`/laundry-deals/${category}`);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!isMobile) return;
    
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide >= laundryCategories.length ? 0 : nextSlide;
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
      if (diffX > 0 && currentSlide < laundryCategories.length - 1) {
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
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Select by laundry</h2>
        
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {laundryCategories.map((cat) => (
            <div 
              key={cat.name} 
              className="group cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleCategoryClick(cat.category)}
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
            {laundryCategories.map((cat, index) => (
              <div
                key={cat.name}
                className="flex-shrink-0 w-full px-4"
              >
                <div className="group cursor-pointer transition-transform active:scale-95">
                  <div 
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => handleCategoryClick(cat.category)}
                  >
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
            {laundryCategories.map((_, index) => (
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