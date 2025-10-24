import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Modal } from "antd";
import { Sparkles, Clock, ShoppingCart, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCart } from "../../components/CartContext";
import { useAuth } from "../../components/AuthContext";
import servicesData from "../../data/services.json";

export default function ServicePage() {
  const { categoryName, type } = useParams(); // type could be "instant" or "deep"
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [instant, setInstant] = useState([]);
  const [deep, setDeep] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
        price: item.price || item.basePrice,
        duration: item.durationMinutes,
        image: item.images?.[0] || "/default-service.jpg",

        packageDetails: item.packageDetails || {
          basePrice: item.basePrice,
          features: item.features || [],
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
      };

      addToCart(cartData);
      toast.success(`${cartData.serviceName} added to cart 🧺`);
    });
  };

  const openModal = (item) => {
    console.log(item);
    setSelectedService(item);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedService(null);
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
          width={500}
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
