import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Coffee,
  Droplet,
  Layers,
  Building2,
  Factory,
  Hotel,
  School,
} from "lucide-react";
import servicesData from "../../data/services.json";

const icons = {
  "home care": Home,
  "kitchen care": Coffee,
  "bathroom care": Droplet,
  "living room care": Layers,
  "laundry care": Building2,
  "office care": Factory,
  "retail care": Factory,
  "factory care": Factory,
  "warehouse care": Factory,
  "room care": Hotel,
  "banquet care": Hotel,
  "classroom care": School,
  "laboratory care": School,
  "auditorium care": School,
};

export default function ServicesSection() {
  const navigate = useNavigate();

  // 🔹 Top-level cards (Instant & Deep)
  const topLevelCards = [
    {
      id: "instant",
      title: "Instant Services",
      description: "Quick cleaning services for immediate needs",
      icon: Home,
    },
    {
      id: "deep",
      title: "Deep Cleaning",
      description: "Comprehensive deep cleaning solutions",
      icon: Layers,
    },
  ];

  // 🔹 Collect subcategories from Instant services
  const instantSubcategories = servicesData.instantServices
    .map((s) => s.subcategory)
    .filter(Boolean); // removes undefined/null

  // 🔹 Collect subcategories from Deep Cleaning services
  const deepSubcategories = servicesData.deepCleanServices.flatMap((cat) =>
    (cat.services || []).map((srv) => srv.subcategory).filter(Boolean)
  );

  // 🔹 Combine and deduplicate all subcategories
  const allSubcategories = Array.from(
    new Set([...instantSubcategories, ...deepSubcategories])
  );

  // 🔹 Build display cards
  const subcategoryCards = allSubcategories.map((subcat) => {
    const key = subcat.toLowerCase();
    const Icon = icons[key] || Home;
    return {
      name: subcat,
      icon: Icon,
      description: `Explore ${subcat} cleaning services.`,
    };
  });
  console.log(subcategoryCards);
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* 🔹 Instant & Deep Cleaning Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
          {topLevelCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-lg border hover:border-[#FFB400] text-center cursor-pointer"
                onClick={() => navigate(`/services/${card.id}`)}
              >
                <Icon className="mx-auto text-[#FFB400] w-20 h-20 mb-4" />
                <h3 className="text-2xl font-bold text-[#1F3C88]">
                  {card.title}
                </h3>
                <p className="text-gray-600 mt-2">{card.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 🔹 Explore Categories Section */}
        <h2 className="text-3xl font-bold text-[#1F3C88] mb-6">
          Explore Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {subcategoryCards.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-lg border hover:border-[#FFB400] text-center cursor-pointer"
                onClick={() => navigate(`/services/category/${cat.name}`)}
              >
                <Icon className="mx-auto text-[#FFB400] w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold text-[#1F3C88]">{cat.name}</h3>
                <p className="text-gray-600 mt-2 text-sm">{cat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
