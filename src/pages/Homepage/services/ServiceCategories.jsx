import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ServiceCategories() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

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
        return nextSlide >= categories.length ? 0 : nextSlide;
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
      if (diffX > 0 && currentSlide < categories.length - 1) {
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
  const categories = [
    {
      name: 'Cars',
      image: '/car/home.png',
      description: 'Professional car washing and detailing',
      route: '/cars',
    },
    {
      name: 'Bikes',
      image: '/bike/home.png',
      description: 'Expert bike cleaning and maintenance',
      route: '/bikes',
    },
    {
      name: 'Laundry',
      image: '/laundry/home.png',
      description: 'Premium laundry and dry cleaning',
      route: '/laundry',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Select by category</h2>
        
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {categories.map((category) => {
            return (
              <div
                key={category.name}
                className="group cursor-pointer transition-transform hover:scale-105"
                onClick={() => navigate(category.route)}
              >
                <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-contain mx-auto"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="flex-shrink-0 w-full px-4"
              >
                <div
                  className="group cursor-pointer transition-transform active:scale-95"
                  onClick={() => navigate(category.route)}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div className="aspect-w-16 aspect-h-12">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-contain mx-auto"
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Slide Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {categories.map((_, index) => (
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