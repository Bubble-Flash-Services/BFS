import React, { useState } from "react";
import { motion } from "framer-motion";

const members = [
  {
    roleLabel: "Founder & CEO",
    name: "Nagaraj C",
    shortTagline:
      '"Transforming car & laundry services into a smarter experience."',
    title: "Founder & CEO, Bubble Flash Services",
    profile:
      "The visionary leader driving the mission to make car, bike, and laundry care affordable, convenient, and tech-enabled. Focused on innovation, customer satisfaction, and elevating BFS into a trusted lifestyle brand.",
    core: [
      "Crafting business strategy & vision",
      "Building long-term customer & partner relationships",
      "Overseeing service quality & premium experience",
      "Driving adoption of technology in traditional services",
    ],
    contributions: [
      "Defined unique service packages (Quick Shine, Deluxe, Premium Spa, Laundry, Bike Wash)",
      "Designed customer-first pricing model balancing affordability with luxury",
      "Ensured outlets & teams reflect professionalism and trust",
      "Leads multi-outlet expansion planning across Bangalore",
    ],
    vision:
      "Position BFS as the most trusted premium brand blending convenience with quality.",
    tagline: "Leading with vision, building with trust.",
    placeholder: "CEO",
  },
  {
    roleLabel: "HR - Krithika",
    name: "Krithika",
    shortTagline: '"Building a passionate and customer-driven team."',
    title: "Human Resources & Employee Relations",
    profile:
      "People-centric pillar ensuring employees feel valued, motivated, and aligned with BFS goals. Manages recruitment, training, engagement, and compliance to sustain a strong service culture.",
    core: [
      "Recruitment of talent (wash specialists, delivery, support)",
      "Training for quality, professionalism & safety",
      "Attendance systems & task/work allocation policies",
      "Promoting teamwork & customer satisfaction culture",
    ],
    contributions: [
      "Built attendance & task management system with dev team",
      "Established policies for shifts, rescheduling & damage protection",
      "Introduced performance evaluations for service quality",
      "Acts as bridge between management & employees",
    ],
    vision:
      "Create a motivated, efficient, professional workforce that differentiates BFS.",
    tagline: "People first, quality always.",
    placeholder: "HR",
  },
  {
    roleLabel: "CTO & Full Stack Developer - Hemanth Kumar V",
    name: "Hemanth Kumar V",
    shortTagline:
      '"Engineering seamless digital solutions for Bubble Flash Services."',
    title: "Full Stack Developer",
    image: "/photos/Hemanth.jpeg",
    profile:
      "Technical backbone developing and maintaining BFS digital ecosystem: booking flows, order & employee systems, and robust admin tools.",
    core: [
      "Frontend: React.js, Tailwind, animations, responsive UI/UX",
      "Backend: Node.js, Express.js, REST APIs, JWT auth",
      "Database: MongoDB Atlas schemas & scaling",
      "Payments: Razorpay UPI integration",
      "Hosting: Render, Cloudinary media storage",
    ],
    contributions: [
      "Implemented role-based auth (admin, customer, employee)",
      "Built cart, booking & order flows with Razorpay integration",
      "Developed employee systems: attendance, work images, assignments",
      "Created admin dashboard: coupons, employees, services",
      "Optimized distance-based service charge logic (Google Maps API)",
    ],
    vision:
      "Empower BFS with scalable, modern platform that grows effortlessly.",
    tagline:
      "Engineering seamless digital solutions for modern service businesses.",
    placeholder: "CTO",
  },
];

export default function TeamPage() {
  const TeamImage = ({ src, alt, placeholder }) => (
    <div className="relative w-40 h-40 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-gray-100 via-white to-gray-50 border border-gray-200 shadow-inner select-none">
      {src ? (
        <img
          src={src}
          alt={alt}
          draggable="false"
          className="w-auto h-auto object-cover transition-all duration-300"
          loading="lazy"
        />
      ) : (
        <span className="text-3xl font-bold text-gray-500">{placeholder}</span>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
    </div>
  );
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,215,0,0.18), transparent 60%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.18), transparent 55%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-4 pb-24 pt-16 relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-yellow-500 via-amber-400 to-blue-600 bg-clip-text text-transparent tracking-tight"
        >
          Meet Our Team
        </motion.h1>
        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          The minds and hearts building Bubble Flash Services.
        </p>

        <div className="mt-16 space-y-20">
          {members.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 sm:p-10 border border-white/40 ring-1 ring-black/5 overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-52 h-52 bg-gradient-to-br from-yellow-300 via-amber-200 to-blue-300 rounded-full blur-3xl opacity-30" />
              <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-64 flex flex-col items-center text-center md:text-left">
                  {m.image || m.placeholder ? (
                    <TeamImage
                      src={m.image}
                      alt={m.name}
                      placeholder={m.placeholder}
                    />
                  ) : null}
                  <h2 className="mt-6 text-2xl font-bold text-gray-800 leading-tight">
                    {m.name}
                  </h2>
                  <p className="text-sm uppercase tracking-wide font-semibold text-blue-600 mt-1">
                    {m.roleLabel}
                  </p>
                  <p className="mt-4 text-sm italic text-gray-600">
                    {m.shortTagline}
                  </p>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Title
                    </h3>
                    <p className="text-gray-700 mt-1 leading-relaxed">
                      {m.title}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Profile
                    </h3>
                    <p className="text-gray-700 mt-1 leading-relaxed">
                      {m.profile}
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Core Focus Areas
                      </h4>
                      <ul className="mt-2 space-y-1 text-gray-700 text-sm list-disc list-inside">
                        {m.core.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Key Contributions
                      </h4>
                      <ul className="mt-2 space-y-1 text-gray-700 text-sm list-disc list-inside">
                        {m.contributions.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <h4 className="font-semibold text-gray-900">Vision</h4>
                      <p className="text-gray-700 text-sm mt-1">{m.vision}</p>
                    </div>
                    <div className="flex flex-col gap-3 items-stretch sm:items-end">
                      <div className="bg-gradient-to-r from-yellow-400 to-blue-500 text-white px-4 py-3 rounded-xl shadow font-medium text-sm max-w-xs text-center">
                        {m.tagline}
                      </div>
                      {m.name === "Gowtham J" && (
                        <div className="flex gap-3">
                          <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=jgjg6477@gmail.com&su=Inquiry%20from%20Bubble%20Flash%20Website"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group overflow-hidden px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-amber-500 to-yellow-600 shadow hover:from-amber-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                          >
                            <span className="relative z-10">Gmail</span>
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
