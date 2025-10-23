import { Phone } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#1F3C88] to-[#2952A3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready for a Sparkling Clean Home?
        </h2>
        <p className="text-lg mb-8 text-white/90">
          Book now or call us for instant service across Bengaluru
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-[#FFB400] text-[#1F3C88] hover:brightness-110 transition-all"
          >
            Book a Service
          </a>
          <a
            href="tel:+919591572775"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white/10 transition-all"
          >
            <Phone className="w-5 h-5" />
            +91 95915 72775
          </a>
        </div>
      </div>
    </section>
  );
}
