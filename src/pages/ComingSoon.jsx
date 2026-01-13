import React from "react";
import { useNavigate } from "react-router-dom";

export default function ComingSoon({
  title = "Coming Soon",
  message = "This service will be available shortly.",
}) {
  const navigate = useNavigate();
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-16">
      <div className="max-w-xl w-full bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
          <span className="text-3xl">🧺</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {title}
        </h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Go to Home
        </button>
      </div>
    </section>
  );
}

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Clock, Mail, Phone, ArrowRight } from "lucide-react";
// import { motion } from "framer-motion";

// export default function ComingSoon() {
//   const navigate = useNavigate();

//   return (
//     <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 px-4 py-16 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-10 left-10 w-72 h-72 bg-[#FFB400] opacity-10 rounded-full blur-3xl animate-pulse" />
//         <div
//           className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 opacity-10 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "1s" }}
//         />
//         <div
//           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300 opacity-5 rounded-full blur-3xl animate-pulse"
//           style={{ animationDelay: "2s" }}
//         />
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="max-w-4xl w-full relative z-10"
//       >
//         <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/50 overflow-hidden">
//           {/* Header Banner */}
//           <div className="bg-gradient-to-r from-[#FFB400] to-amber-500 p-8 text-center">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//               className="mx-auto mb-4 w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
//             >
//               <Clock className="w-10 h-10 text-[#FFB400]" />
//             </motion.div>
//             <motion.h1
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="text-4xl md:text-5xl font-bold text-white mb-3"
//             >
//               Services Temporarily Unavailable
//             </motion.h1>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
//             >
//               <span className="text-white font-medium text-sm">
//                 We'll be back soon!
//               </span>
//             </motion.div>
//           </div>

//           {/* Content */}
//           <div className="p-8 md:p-12 text-center">
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="text-xl text-gray-700 mb-6 leading-relaxed"
//             >
//               We're taking a short break to enhance our services and bring you
//               an even better experience.
//             </motion.p>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.7 }}
//               className="text-lg text-gray-600 mb-8"
//             >
//               Thank you for your patience and continued support!
//             </motion.p>

//             {/* Contact Information */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.8 }}
//               className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 md:p-8 mb-8 border border-amber-200/50"
//             >
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                 Need Assistance?
//               </h2>
//               <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
//                 <a
//                   href="mailto:bubbleflash13@gmail.com"
//                   className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
//                 >
//                   <Mail className="w-5 h-5 text-[#FFB400] group-hover:scale-110 transition-transform" />
//                   <span className="font-medium text-gray-700">
//                     bubbleflash13@gmail.com
//                   </span>
//                 </a>
//                 <a
//                   href="tel:+919108585559"
//                   className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
//                 >
//                   <Phone className="w-5 h-5 text-[#FFB400] group-hover:scale-110 transition-transform" />
//                   <span className="font-medium text-gray-700">
//                     +91 91085 85559
//                   </span>
//                 </a>
//               </div>
//             </motion.div>

//             {/* Action Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.9 }}
//               className="flex flex-col sm:flex-row gap-4 justify-center items-center"
//             >
//               <button
//                 onClick={() => navigate("/")}
//                 className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFB400] to-amber-500 hover:from-amber-500 hover:to-[#FFB400] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//               >
//                 <span>Go to Home</span>
//                 <ArrowRight className="w-5 h-5" />
//               </button>
//               <a
//                 href="https://wa.me/919108585559"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//               >
//                 <Phone className="w-5 h-5 text-[#FFB400]" />
//                 <span>Contact Us</span>
//               </a>
//             </motion.div>
//           </div>

//           {/* Footer Banner */}
//           <div className="bg-gradient-to-r from-gray-50 to-amber-50 p-6 text-center border-t border-amber-200/50">
//             <p className="text-gray-600 font-medium">
//               🌟 <span className="text-[#FFB400] font-bold">Bubble Flash</span>{" "}
//               - Your Trusted Cleaning Service Partner
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </section>
//   );
// }
