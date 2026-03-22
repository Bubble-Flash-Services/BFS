import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullBodyCheckup from "../../../components/FullBodyCheckup";

const bikeCategories = [
  {
    name: "Commuter Bikes",
    image: "/bike/commuter/Yamaha-Commuter-Motorcycles.jpg",
    category: "commuter",
  },

  {
    name: "Touring Bikes",
    image: "/bike/cruiser/Touring.jpg",
    category: "cruiser",
  },
  {
    name: "Sports Bikes",
    image: "/bike/cruiser/Sports.avif",
    category: "sports",
  },
];

export default function BikesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();

  // Check for booking data from HeroSection
  useEffect(() => {
    const storedBooking = localStorage.getItem("pendingBooking");
    if (storedBooking) {
      const data = JSON.parse(storedBooking);
      // Only show booking data if it's for bike wash and within 10 minutes
      if (
        data.category === "Bike Wash" &&
        Date.now() - data.timestamp < 600000
      ) {
        setBookingData(data);
      }
    }
  }, []);

  const clearBookingData = () => {
    setBookingData(null);
    localStorage.removeItem("pendingBooking");
  };

  const handleCategoryClick = (category) => {
    navigate(`/bike-wash-deals/${category}`);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-slide functionality removed - display vertically instead

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Booking Data Banner */}
        {bookingData && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🏍️ Your Bike Wash Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-700">Service:</span>{" "}
                    {bookingData.category}
                  </div>
                  <div>
                    <span className="font-medium text-green-700">
                      Pickup Date:
                    </span>{" "}
                    {new Date(bookingData.pickupDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Phone:</span>{" "}
                    {bookingData.phoneNumber}
                  </div>
                  <div>
                    <span className="font-medium text-green-700">
                      Location:
                    </span>{" "}
                    {bookingData.address.substring(0, 50)}...
                  </div>
                </div>
                <p className="text-green-600 text-sm mt-2">
                  Please select your bike category below to complete your
                  booking.
                </p>
              </div>
              <button
                onClick={clearBookingData}
                className="text-green-500 hover:text-green-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          Select by bikes
        </h2>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {bikeCategories.map((cat) => (
            <div
              key={cat.name}
              className="group cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleCategoryClick(cat.category)}
            >
              <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-48 object-contain mx-auto"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Vertical Grid Layout */}
        <div className="md:hidden grid grid-cols-1 gap-6">
          {bikeCategories.map((cat) => (
            <div
              key={cat.name}
              className="group cursor-pointer transition-transform active:scale-95"
              onClick={() => handleCategoryClick(cat.category)}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-48 object-contain mx-auto"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Full Body Bike Checkup Section - Teaser Mode */}
      <section className="py-16 px-4 md:px-10 mt-20">
        <div className="max-w-7xl mx-auto">
          <FullBodyCheckup type="bike" teaser={true} />
        </div>
      </section>
    </section>
  );
}
