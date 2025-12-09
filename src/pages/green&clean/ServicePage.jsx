import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "antd";
import { Sparkles, Clock, ShoppingCart, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCart } from "../../components/CartContext";
import { useAuth } from "../../components/AuthContext";
import servicesData from "../../data/services.json";
import { commercialAddons } from "../../data/commercialAddons";

export default function ServicePage() {
  const { categoryName, type } = useParams(); // type could be "instant" or "deep"
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [instant, setInstant] = useState([]);
  const [deep, setDeep] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);
  useEffect(() => {
    const instantServices = servicesData.instantServices; // fine
    const deepServices = servicesData.deepCleanServices.flatMap(
      (cat) => cat.services || []
    );

    if (categoryName == "instant") {
      // Show all instant services in a single column
      console.log(instantServices);

      setInstant(instantServices);
      setDeep([]);
      return;
    }

    if (categoryName === "deep") {
      // Show all deep services in a single column
      setInstant([]);
      setDeep(deepServices);
      return;
    }

    // Category page: split into Instant / Deep
    if (categoryName) {
      const keyword = categoryName.toLowerCase();

      const filteredInstant = instantServices.filter(
        (s) =>
          s.subcategory.toLowerCase().includes(keyword) ||
          s.title.toLowerCase().includes(keyword)
      );

      const filteredDeep = deepServices.filter(
        (s) =>
          s.subcategory.toLowerCase().includes(keyword) ||
          s.title.toLowerCase().includes(keyword)
      );

      setInstant(filteredInstant);
      setDeep(filteredDeep);
      return;
    }

    // Default: show everything split by type
    setInstant(instantServices);
    setDeep(deepServices);
  }, [categoryName, type]);

  const checkAuth = (callback) => {
    if (!user) {
      toast.error("Please login to continue");
      return;
    }
    callback();
  };

  const addCart = (item) => {
    checkAuth(() => {
      const cartData = {
        id: `clean-${item._id}-${Date.now()}`,
        serviceId: item._id || item.id,
        serviceName: item.title || item.serviceName || item.name,
        packageName: item.packageName || item.plan,
        packageId: item.packageId,
        quantity: 1,
        price: calculateTotal(),
        duration: item.durationMinutes,
        image: item.images?.[0] || "/default-service.jpg",

        packageDetails: item.packageDetails || {
          basePrice: item.basePrice,
          features: item.features || [],
          addons: selectedAddons,
          addonsTotal: getAddonsTotal(),
        },
        includedFeatures:
          item.includedFeatures ||
          item.packageDetails?.features ||
          item.features ||
          [],
        vehicleType: item.vehicleType,
        specialInstructions: item.specialInstructions,
        type: item.type || "cleaning",
        category: item.subcategory,
        uiAddOns: selectedAddons.map(addon => ({
          name: addon.name,
          price: addon.price,
          quantity: 1
        }))
      };

      addToCart(cartData);
      toast.success(`${cartData.serviceName} added to cart 🧺`);
      setSelectedAddons([]); // Reset addons after adding to cart
    });
  };

  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev => {
      const isSelected = prev.find(item => item.id === addon.id);
      if (isSelected) {
        return prev.filter(item => item.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const calculateTotal = () => {
    const basePrice = selectedService?.basePrice || 0;
    const addonsTotal = selectedAddons.reduce((total, addon) => total + addon.price, 0);
    return basePrice + addonsTotal;
  };

  const getAddonsTotal = () => {
    return selectedAddons.reduce((total, addon) => total + addon.price, 0);
  };

  const openModal = (item) => {
    console.log(item);
    setSelectedService(item);
    setSelectedAddons([]); // Reset addons when opening modal
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedService(null);
    setSelectedAddons([]);
    setIsModalVisible(false);
  };

  const renderCard = (item) => (
    <motion.div
      key={item._id}
      whileHover={{ scale: 1.03 }}
      className="bg-white p-4 rounded-2xl shadow-lg border hover:border-[#FFB400] cursor-pointer"
      onClick={() => openModal(item)}
    >
      <img
        src={item.images?.[0] || "/default-service.jpg"}
        alt={item.title}
        className="w-full h-36 object-cover rounded-xl mb-4"
      />
      <h3 className="text-xl font-bold text-[#1F3C88] mb-2">{item.title}</h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
        {item.description}
      </p>
      <div className="text-gray-800 font-semibold flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#FFB400]" /> ⏱ {item.durationMinutes}{" "}
        mins | ₹{item.basePrice}
      </div>
    </motion.div>
  );

  // Determine if we are showing single-type services
  const showSingleType = instant.length === 0 || deep.length === 0;

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#1F3C88]">
            {type
              ? `${type.charAt(0).toUpperCase() + type.slice(1)} Services`
              : categoryName
              ? `${categoryName} Services`
              : "All Services"}
          </h1>
          <p className="text-gray-600">
            {showSingleType
              ? "Choose from our services below."
              : "Quick Instant or Full Deep Cleaning — pick your plan!"}
          </p>
        </div>

        <div
          className={
            showSingleType
              ? "grid grid-cols-1 gap-10"
              : "grid grid-cols-1 lg:grid-cols-2 gap-10"
          }
        >
          {/* Instant Services */}
          {instant.length > 0 && (
            <div>
              {!showSingleType && (
                <div className="flex items-center gap-3 mb-5">
                  <Sparkles className="text-[#FFB400]" />
                  <h2 className="text-2xl font-bold text-[#1F3C88]">
                    Instant Services
                  </h2>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {instant.map(renderCard)}
              </div>
            </div>
          )}

          {/* Deep Cleaning Services */}
          {deep.length > 0 && (
            <div>
              {!showSingleType && (
                <div className="flex items-center gap-3 mb-5">
                  <Sparkles className="text-[#FFB400]" />
                  <h2 className="text-2xl font-bold text-[#1F3C88]">
                    Deep Cleaning
                  </h2>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {deep.map(renderCard)}
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <Modal
          open={isModalVisible}
          onCancel={closeModal}
          footer={null}
          centered
          width={600}
        >
          {selectedService && (
            <div>
              <img
                src={selectedService.images?.[0] || "/default-service.jpg"}
                alt={selectedService.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold text-[#1F3C88] mb-2">
                {selectedService.title}
              </h2>
              <p className="text-gray-600 mb-2">
                {selectedService.description}
              </p>
              <div className="text-gray-800 font-semibold mb-3">
                ⏱ {selectedService.durationMinutes} mins | ₹
                {selectedService.basePrice}
              </div>
              {selectedService.features?.length > 0 && (
                <ul className="list-disc list-inside text-gray-500 mb-4">
                  {selectedService.features.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              )}

              {/* Add-ons Section - Only show for deep cleaning services */}
              {categoryName === "deep" && (
                <div className="mb-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Commercial Add-ons
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {commercialAddons.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center flex-1">
                          <input
                            type="checkbox"
                            id={`addon-${addon.id}`}
                            checked={Boolean(
                              selectedAddons.find((item) => item.id === addon.id)
                            )}
                            onChange={() => handleAddonToggle(addon)}
                            className="w-4 h-4 text-[#1F3C88] border-gray-300 rounded focus:ring-[#FFB400]"
                          />
                          <label
                            htmlFor={`addon-${addon.id}`}
                            className="ml-3 text-gray-800 font-medium cursor-pointer"
                          >
                            {addon.name}
                            <p className="text-xs text-gray-500 mt-0.5">
                              {addon.description}
                            </p>
                          </label>
                        </div>
                        <span className="font-semibold text-gray-800 ml-2">
                          ₹{addon.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown - Show if addons are selected */}
              {selectedAddons.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Service Price</span>
                    <span className="text-gray-800">
                      ₹{selectedService.basePrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="text-gray-800">₹{getAddonsTotal()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-[#1F3C88]">
                        Total
                      </span>
                      <span className="text-xl font-bold text-[#1F3C88]">
                        ₹{calculateTotal()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => addCart(selectedService)}
                  className="flex-1 py-2 rounded-xl bg-[#1F3C88] text-[#FFB400] font-semibold hover:brightness-110 transition"
                >
                  <ShoppingCart className="inline w-4 h-4 mr-1" /> Add to Cart
                </button>
                <button
                  onClick={() => {
                    addCart(selectedService);
                    closeModal();
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#FFB400] text-[#1F3C88] font-semibold hover:brightness-110 transition"
                >
                  <CheckCircle className="inline w-4 h-4 mr-1" /> Book Now
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
}
