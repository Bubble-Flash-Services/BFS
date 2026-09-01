import React from "react";
import { useCart } from "../components/CartContext";
import toast from "react-hot-toast";
import servicesData from "../data/services.json";

const getImage = (service) =>
  Array.isArray(service.images) && service.images.length > 0
    ? service.images[0]
    : "/clean-home.jpg";

const toCartItem = (service) => ({
  id: `green-clean-${service._id}`,
  serviceId: `green-clean-${service._id}`,
  name: service.title,
  serviceName: service.title,
  price: service.basePrice,
  quantity: 1,
  image: getImage(service),
  type: "green-clean",
  category: "Green & Clean",
  includedFeatures: service.features || [],
});

export default function GreenCleanPage() {
  const { addToCart } = useCart();
  const instantServices = servicesData.instantServices || [];
  const deepCleanServices =
    servicesData.deepCleanServices?.flatMap((section) => section.services || []) ||
    [];

  const handleAddToCart = async (service) => {
    const response = await addToCart(toCartItem(service));
    if (!response?.success) {
      toast.error(response?.message || "Could not add service to cart");
    }
  };

  const renderCards = (services) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div
          key={service._id}
          className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden"
        >
          <img
            src={getImage(service)}
            alt={service.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
              <span className="text-green-700 font-bold whitespace-nowrap">
                ₹{service.basePrice}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
            {service.features?.length > 0 && (
              <ul className="text-xs text-gray-600 space-y-1 mb-4 list-disc pl-4">
                {service.features.slice(0, 4).map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            )}
            <button
              onClick={() => handleAddToCart(service)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-12 bg-gradient-to-br from-green-50 via-white to-emerald-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Green &amp; Clean Services
        </h1>
        <p className="text-gray-600 mb-10">
          Book home and office cleaning services at your doorstep.
        </p>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            Instant Cleaning Services
          </h2>
          {renderCards(instantServices)}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            Deep Cleaning Packages
          </h2>
          {renderCards(deepCleanServices)}
        </div>
      </div>
    </section>
  );
}
