import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Modal } from "antd";
import { useCart } from "../../components/CartContext";
import { useAuth } from "../../components/AuthContext";
import { Sparkles, Info, Clock, ShoppingCart, CheckCircle } from "lucide-react";
import servicesData from "../../data/services.json";

export default function ServiceByCategory() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [instant, setInstant] = useState([]);
  const [deep, setDeep] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // 🔹 Load data
  useEffect(() => {
    try {
      const { instantServices, deepCleanServices } = servicesData;

      const clickedService =
        instantServices.find((s) => s.subcategory === categoryName) ||
        deepCleanServices
          .flatMap((d) => d.services)
          .find((s) => s.subcategory === categoryName);

      if (!clickedService) return;

      const keyword = clickedService._id.split("-")[1].toLowerCase();

      const filteredInstant = instantServices.filter((s) =>
        s._id.toLowerCase().includes(keyword)
      );

      const filteredDeep = deepCleanServices
        .flatMap((d) => d.services)
        .filter((s) => s._id.toLowerCase().includes(keyword));

      setInstant(filteredInstant);
      setDeep(filteredDeep);
    } catch (err) {
      console.error(err);
    }
  }, [categoryName]);

  // 🔹 Auth check
  const checkAuth = (callback) => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
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
      setSelectedAddons([]);
    });
  };

  // Commercial add-ons for deep cleaning services
  const commercialAddons = [
    { id: 1, name: "Glass cleaner refills", price: 299, description: "Professional glass cleaner refill pack" },
    { id: 2, name: "Vacuum bags", price: 199, description: "High-quality vacuum cleaner bags" },
    { id: 3, name: "Floor polish", price: 399, description: "Premium floor polish solution" },
    { id: 4, name: "Disinfectant fogging", price: 599, description: "Complete disinfectant fogging service" },
    { id: 5, name: "Sanitizer refills", price: 249, description: "Antibacterial sanitizer refills" },
    { id: 6, name: "Toilet consumables", price: 179, description: "Essential toilet cleaning supplies" }
  ];

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

  const buyNow = (item) => {
    addCart(item);
    navigate("/cart");
  };

  const openModal = (item) => {
    setSelectedService(item);
    setSelectedAddons([]);
    setIsModalOpen(true);
  };

  const renderCard = (item, key) => (
    <motion.div
      key={key}
      whileHover={{ scale: 1.02 }}
      onClick={() => openModal(item)}
      className="bg-white p-4 rounded-2xl shadow-lg border hover:border-[#FFB400] transition-all cursor-pointer"
    >
      {/* 🔹 Image */}
      {item.images?.length > 0 && (
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
      )}

      {/* 🔹 Title */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-[#1F3C88] truncate">
          {item.title}
        </h3>
        <Info className="text-[#FFB400]" />
      </div>

      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
        {item.description}
      </p>

      <div className="text-gray-800 font-semibold mb-1">
        ⏱ {item.durationMinutes} mins
      </div>
      <div className="text-[#1F3C88] font-bold">₹{item.basePrice}</div>
    </motion.div>
  );

  return (
    <section className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-[#1F3C88]"
          >
            {categoryName} Services
          </motion.h1>
          <p className="text-gray-600">
            Quick Instant or Full Deep Cleaning — pick your plan!
          </p>
        </div>

        {/* 🔹 Instant Services */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="text-[#FFB400]" />
            <h2 className="text-2xl font-bold text-[#1F3C88]">
              Instant Services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {instant.length > 0 ? (
              instant.map(renderCard)
            ) : (
              <p>No instant services available.</p>
            )}
          </div>
        </div>

        {/* 🔹 Deep Cleaning Services */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="text-[#FFB400]" />
            <h2 className="text-2xl font-bold text-[#1F3C88]">Deep Cleaning</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deep.length > 0 ? (
              deep.map(renderCard)
            ) : (
              <p>No deep cleaning services available.</p>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Modal */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedAddons([]);
        }}
        centered
        width={700}
      >
        {selectedService && (
          <div className="p-2">
            <h2 className="text-2xl font-bold text-[#1F3C88] mb-4">
              {selectedService.title}
            </h2>

            {/* 🔹 Image gallery */}
            {selectedService.images?.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {selectedService.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={selectedService.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            <p className="text-gray-600 mb-3">{selectedService.description}</p>

            <div className="text-gray-800 font-semibold mb-3">
              ⏱ Duration: {selectedService.durationMinutes} mins | 💰 ₹
              {selectedService.basePrice}
            </div>

            {selectedService.features?.length > 0 && (
              <>
                <h4 className="font-semibold text-[#1F3C88] mb-2">Features:</h4>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                  {selectedService.features.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </>
            )}

            {/* Add-ons Section - Show only for deep cleaning services */}
            {deep.some(s => s._id === selectedService._id) && (
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

            {/* 🔹 Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => addCart(selectedService)}
                className="flex-1 py-2 rounded-xl bg-[#1F3C88] text-[#FFB400] font-semibold hover:brightness-110 transition"
              >
                <ShoppingCart className="inline w-4 h-4 mr-1" /> Add to Cart
              </button>
              <button
                onClick={() => buyNow(selectedService)}
                className="flex-1 py-2 rounded-xl bg-[#FFB400] text-[#1F3C88] font-semibold hover:brightness-110 transition"
              >
                <CheckCircle className="inline w-4 h-4 mr-1" /> Book Now
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
