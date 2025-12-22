import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Phone, MapPin, Clock } from "lucide-react";

const EmergencyKeyService = ({ onEmergencyClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl p-8 text-white mb-8"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-10 h-10 animate-pulse" />
            <h2 className="text-3xl font-bold">Emergency Lockout?</h2>
          </div>
          <p className="text-red-100 mb-4 text-lg">
            Locked out of your home, car, or office? We can help you right now!
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">10-min arrival</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">GPS tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span className="text-sm">24/7 available</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onEmergencyClick}
              className="flex-1 bg-white text-red-600 py-4 px-6 rounded-xl font-bold text-lg hover:bg-red-50 transition-all shadow-lg hover:shadow-xl"
            >
              🚨 Book Emergency Service
            </button>
            <a
              href="tel:+919591572775"
              className="flex-1 bg-red-800 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-red-900 transition-all shadow-lg hover:shadow-xl text-center"
            >
              <Phone className="w-5 h-5 inline mr-2" />
              Call Now
            </a>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="text-7xl">🔐</div>
          </div>
        </div>
      </div>

      {/* Emergency Tips */}
      <div className="mt-6 pt-6 border-t border-red-500/30">
        <p className="text-sm text-red-100 mb-2 font-medium">
          💡 While waiting for our technician:
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-xs text-red-100">
          <div>• Keep your phone charged</div>
          <div>• Stay in a safe location</div>
          <div>• Have your ID ready for verification</div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyKeyService;
