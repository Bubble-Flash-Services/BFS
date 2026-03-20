import { motion } from "framer-motion";
import { Shield, Star, Clock } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All our cleaners are background-verified and trained",
    },
    {
      icon: Star,
      title: "Eco-Friendly Products",
      description: "Safe, non-toxic cleaning solutions for your family",
    },
    {
      icon: Clock,
      title: "On-Time Service",
      description: "Same-day service available across Bengaluru",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F3C88] mb-4">
            Why Choose BFS Green & Clean?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-[#1F3C88] to-[#2952A3] text-white rounded-2xl p-8 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFB400] rounded-2xl mb-4">
                  <Icon className="w-8 h-8 text-[#1F3C88]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-white/90">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
