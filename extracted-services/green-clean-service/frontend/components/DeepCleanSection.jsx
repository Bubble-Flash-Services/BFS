import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function DeepCleanSection({
  deepCategories = [],
  onSelectCategory,
}) {
  const [expanded, setExpanded] = useState(null);

  return (
    <section id="deep-cleaning" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1F3C88] mb-4">
            Deep Cleaning Services
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive cleaning solutions for homes, offices, and industries.
          </p>
        </div>

        {/* Category Accordion */}
        <div className="space-y-6">
          {deepCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden border border-gray-200"
            >
              {/* Category Header */}
              <div
                className="flex justify-between items-center p-6 bg-gradient-to-r from-[#1F3C88] to-[#2A4FA5] text-white cursor-pointer"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <h3 className="text-2xl font-semibold">{cat.title}</h3>
                <ChevronDown
                  className={`w-6 h-6 transform transition-transform ${
                    expanded === i ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Sub-Services */}
              {expanded === i && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-white">
                  {cat.services.map((service, j) => (
                    <motion.div
                      key={service._id}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 20px rgba(31, 60, 136, 0.15)",
                      }}
                      className="bg-white border rounded-xl overflow-hidden hover:border-[#FFB400] transition-all cursor-pointer"
                      onClick={() => onSelectCategory(service)}
                    >
                      <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-full h-44 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-[#1F3C88] mb-2">
                          {service.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {service.description}
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1 mb-3 list-disc list-inside">
                          {service.features.slice(0, 3).map((f, k) => (
                            <li key={k}>{f}</li>
                          ))}
                        </ul>
                        <p className="text-[#FFB400] font-semibold">
                          ₹{service.basePrice}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
