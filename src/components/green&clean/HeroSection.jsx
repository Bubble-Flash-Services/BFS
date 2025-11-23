import { motion } from "framer-motion";
import {
  Sparkles,
  Shield,
  Clock,
  Star,
  Phone,
  Home,
  ChevronRight,
} from "lucide-react";

export default function HeroSection({ onSelectCategory }) {
  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: 'url("/cleaning-bg.jpg")' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Animated Background Circles */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-80 h-80 bg-[#FFB400] rounded-full opacity-10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-[#FFB400] rounded-full opacity-5 blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column - Text + Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-white flex flex-col justify-center items-start"
        >
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
          >
            Trusted Cleaning <br />
            <span className="text-[#FFB400]">We reach you in 10 minutes</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-xl"
          >
            Quick and convenient home or office cleaning at your doorstep.
            Eco-friendly products, trained staff, and hourly-based pricing for
            ultimate flexibility.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap gap-6 mb-8 text-sm sm:text-base"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#FFB400]" />
              <span>No Hidden Charges</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FFB400]" />
              <span>Quick Arrival</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#FFB400]" />
              <span>Eco-Friendly Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-[#FFB400]" />
              <span>Hourly Charges</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-[#FFB400] text-[#1F3C88] hover:brightness-110 transition-all shadow-lg"
            >
              Book Now
              <ChevronRight className="w-5 h-5" />
            </a>
            <a
              href="tel:+919591572775"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border-2 border-white/70 text-white hover:bg-white/10 transition-all"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
