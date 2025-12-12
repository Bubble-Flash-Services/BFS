import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const KeyServiceCard = ({ service, isSelected, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-600 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className="text-3xl">{service.icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            {service.name}
          </h4>
          <p className="text-sm font-bold text-blue-600">
            {typeof service.price === 'number' ? `₹${service.price}` : service.price}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default KeyServiceCard;
