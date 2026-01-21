import React, { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || window.location.origin;

const FAQS = [
  {
    question: "How do I request a laundry pickup?",
    answer:
      "You can request a laundry pickup by filling out the callback form on this page or by contacting us via WhatsApp. Our team will schedule a convenient pickup time for you.",
  },
  {
    question: "What services does Bubble Flash offer?",
    answer:
      "Bubble Flash offers laundry, car cleaning, and bike cleaning services. You can book any of these services online or by contacting our support team.",
  },
  {
    question: "What are your operating hours?",
    answer:
      "We operate between 9 AM and 8 PM from Monday to Saturday, and 10 AM to 6 PM on Sundays.",
  },
];

const testimonials = [
  {
    name: "Michael brown",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    stars: 5,
    text: "Really impressed with the car wash service at Bubble Flash Car Wash! The team was professional, friendly, and incredibly detailed in their work. My car looked absolutely spotless afterward, and they even cleaned areas I didn't expect. The pricing is fair and the convenience of doorstep service is unbeatable. Highly recommend!",
  },
  {
    name: "Meera goyal",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    stars: 5,
    text: "Tried Bubble Flash Laundry for the first time and was genuinely impressed! My clothes came back fresh, neatly folded, and smelled amazing. The pickup and delivery were smooth and right on time. The staff was courteous and professional throughout. The quality of cleaning exceeded my expectations and I'll definitely be a regular customer now!",
  },
  {
    name: "Rahul Sharma",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    stars: 5,
    text: "Excellent bike cleaning service! My bike looks brand new after their thorough wash and detailing. The service was fast, efficient, and very convenient with doorstep availability. The team took great care of my bike and paid attention to every detail. For the price point, this is exceptional value. Will definitely use this service regularly!",
  },
  {
    name: "Priya Singh",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    stars: 5,
    text: "The laundry service is absolutely top-notch and exceeded all my expectations! Pickup and delivery were perfectly on time, and the clothes were professionally cleaned and pressed. Every item came back in pristine condition. The staff is friendly, reliable, and takes great care of your garments. This service has made my life so much easier!",
  },
  {
    name: "Amit Verma",
    img: "https://randomuser.me/api/portraits/men/77.jpg",
    stars: 5,
    text: "Very happy with the car wash service! The staff is incredibly polite and professional, and the entire process is completely hassle-free. They arrived on time, worked efficiently, and left my car sparkling clean. The eco-friendly products they use are a great bonus. I appreciate their attention to detail and commitment to quality service!",
  },
  {
    name: "Sneha Patel",
    img: "https://randomuser.me/api/portraits/women/32.jpg",
    stars: 5,
    text: "Affordable and reliable laundry service that I highly recommend to everyone! The quality of cleaning is outstanding, the pickup and delivery system works flawlessly, and the prices are very reasonable. My clothes always come back fresh, clean, and properly folded. This service has saved me so much time and effort. Truly excellent!",
  },
];

export default function ServicesPage() {
  const [openIdx, setOpenIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [carousel, setCarousel] = useState(testimonials);

  // Callback form state
  const [cbName, setCbName] = useState("");
  const [cbPhone, setCbPhone] = useState("");
  const [cbEmail, setCbEmail] = useState("");
  const [cbMessage, setCbMessage] = useState("");
  const [cbSending, setCbSending] = useState(false);

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    if (!cbName.trim() || !cbPhone.trim()) {
      alert("Please enter your name and phone number");
      return;
    }
    try {
      setCbSending(true);
      const res = await fetch(`${API}/api/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cbName,
          phone: cbPhone,
          email: cbEmail,
          message: cbMessage,
          source: "services",
        }),
      });
      const result = await res.json().catch(() => ({ success: false }));
      if (res.ok && result?.success) {
        alert("Thanks! We'll call you back shortly.");
        setCbName("");
        setCbPhone("");
        setCbEmail("");
        setCbMessage("");
      } else {
        alert(
          result?.message || "Failed to send request. Please try WhatsApp."
        );
      }
    } catch (err) {
      console.error("callback submit failed:", err);
      alert("Network error. Please try again.");
    } finally {
      setCbSending(false);
    }
  };

  // Responsive visibleCount
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarousel((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 min-h-screen pb-16 relative">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: "url(/cleaning-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto pt-12 px-4 flex flex-col md:flex-row gap-8">
        {/* Left: Callback Form */}
        <div className="bg-gradient-to-br from-white via-orange-50 to-amber-50 rounded-xl border-2 border-amber-300 p-8 w-full md:w-[350px] flex flex-col items-center shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <img
              src="/services/callback.svg"
              alt="Callback"
              className="w-4 h-4"
            />
            <span className="text-lg font-semibold">Request a callback</span>
          </div>
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleCallbackSubmit}
          >
            <div className="flex items-center gap-2 border-2 border-amber-400 rounded-xl px-3 py-2 bg-white/80 hover:bg-white transition-colors">
              <span className="text-lg">
                <img
                  src="/services/name.svg"
                  alt="Callback"
                  className="w-4 h-4"
                />
              </span>
              <input
                className="bg-transparent outline-none flex-1"
                placeholder="Enter your name"
                value={cbName}
                onChange={(e) => setCbName(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-2 border-2 border-amber-400 rounded-xl px-3 py-2 bg-white/80 hover:bg-white transition-colors">
              <span className="text-lg">
                <img
                  src="/services/phoneno.svg"
                  alt="Callback"
                  className="w-4 h-4"
                />
              </span>
              <input
                className="bg-transparent outline-none flex-1"
                placeholder="Enter your mobile no"
                value={cbPhone}
                onChange={(e) => setCbPhone(e.target.value)}
                pattern="[0-9+\-\s]{8,15}"
                required
              />
            </div>
            <div className="flex items-center gap-2 border-2 border-amber-400 rounded-xl px-3 py-2 bg-white/80 hover:bg-white transition-colors">
              <span className="text-lg">
                <img
                  src="/services/envelope.svg"
                  alt="Callback"
                  className="w-4 h-4"
                />
              </span>
              <input
                className="bg-transparent outline-none flex-1"
                placeholder="Enter your email"
                type="email"
                value={cbEmail}
                onChange={(e) => setCbEmail(e.target.value)}
              />
            </div>
            <textarea
              className="border-2 border-amber-400 rounded-xl px-3 py-2 bg-white/80 min-h-[60px] outline-none hover:bg-white transition-colors"
              placeholder="Enter your message......"
              value={cbMessage}
              onChange={(e) => setCbMessage(e.target.value)}
            />
            <div className="text-pink-600 text-sm">
              We are operating between 9 AM - 8 PM
            </div>
            <button
              type="submit"
              className="bg-[#d14fff] text-white rounded-xl px-2 py-2 font-semibold mt-2 disabled:opacity-60"
              disabled={cbSending}
            >
              {cbSending ? "Sending..." : "Call me"}
            </button>
          </form>
        </div>
        {/* Right: Info Cards */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-xl p-6 flex flex-col gap-2 shadow-lg cursor-pointer border-2 border-green-300 transition-all duration-200 hover:shadow-2xl hover:border-green-400 hover:-translate-y-1"
              onClick={() => {
                window.open("https://wa.me/919591572775", "_blank");
              }}
            >
              <div className="flex items-center gap-2 font-bold text-lg">
                <span className="text-lg">
                  <img
                    src="/services/whatsapp.svg"
                    alt="Callback"
                    className="w-4 h-4"
                  />
                </span>{" "}
                Ask us on Whatsapp
              </div>
              <div className="text-gray-500 text-sm">
                Get instant support and updates in whatsapp for our service
              </div>
              <div className="flex justify-end">
                <span className="text-2xl">&gt;</span>
              </div>
            </div>
            <div
              className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-xl p-6 flex flex-col gap-2 shadow-lg cursor-pointer border-2 border-blue-300 transition-all duration-200 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1"
              onClick={() => {
                const faqSection = document.getElementById("faq-section");
                if (faqSection)
                  faqSection.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="flex items-center gap-2 font-bold text-lg">
                <span className="text-lg">
                  <img
                    src="/services/faq.svg"
                    alt="Callback"
                    className="w-4 h-4"
                  />
                </span>{" "}
                FAQ
              </div>
              <div className="text-gray-500 text-sm">
                Get instant support for our service via our FAQ section
              </div>
              <div className="flex justify-end">
                <span className="text-2xl">&gt;</span>
              </div>
            </div>
            <div
              className="bg-gradient-to-br from-white via-purple-50 to-violet-50 rounded-xl p-6 flex flex-col gap-2 shadow-lg col-span-1 md:col-span-2 cursor-pointer border-2 border-purple-300 transition-all duration-200 hover:shadow-2xl hover:border-purple-400 hover:-translate-y-1"
              onClick={() => {
                window.open(
                  "https://maps.app.goo.gl/mqVWff6HjLuDCcrD9",
                  "_blank"
                );
              }}
            >
              <div className="flex items-center gap-2 font-bold text-lg">
                <span className="text-lg">
                  <img
                    src="/services/name.svg"
                    alt="Callback"
                    className="w-4 h-4"
                  />
                </span>{" "}
                Contact Information
              </div>
              <div className="flex flex-wrap gap-8 text-xs text-gray-700 mt-2">
                <div>
                  <div className="font-semibold">Address</div>
                  <div>Bangalore, India</div>
                </div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <div>+91 9980123452</div>
                </div>
                <div>
                  <div className="font-semibold">Email</div>
                  <div
                    className="underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        "https://outlook.live.com/mail/0/deeplink/compose?to=web_bfsnow@oulook.com&subject=Inquiry%20from%20Bubble%20Flash%20Website",
                        "_blank"
                      );
                    }}
                  >
                    Info@bubbleflashservices.in
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Business Hours</div>
                  <div>
                    Monday - Saturday: 9:00 AM - 8:00 PM
                    <br />
                    Sunday: 10:00 AM - 6:00 PM
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-2xl">&gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Choose your package Section */}
      <div className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative">
        {/* Background overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: "url(/home-bg.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
        <h2 className="relative text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
          Choose your package
        </h2>
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Quick shine car */}
          <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl border-2 border-blue-300 shadow-lg p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-200 hover:shadow-2xl hover:scale-105 hover:border-blue-400 relative">
            <div className="w-full flex-1 flex flex-col items-center gap-6">
              <div className="text-4xl font-serif font-bold mb-2 text-center">
                Quick shine car
              </div>
              <div className="text-3xl font-serif font-bold mb-6 text-center">
                ₹199
              </div>
              <ul className="text-gray-700 text-xl font-serif mb-6 flex flex-col gap-2 text-center list-none p-0">
                <li>Exterior wash with high-pressure watergun</li>
                <li>Soft-touch mild soap</li>
                <li>Swirl-free clean</li>
                <li>Deep-cleaning of car mats</li>
              </ul>
            </div>
            <button className="bg-[#FFD600] text-black rounded-xl border border-black px-8 py-3 font-semibold text-lg font-mono shadow transition-colors duration-200 hover:bg-yellow-300 mx-auto mt-6">
              Get Services
            </button>
          </div>
          {/* Bike wash */}
          <div className="bg-gradient-to-br from-white via-green-50 to-green-100 rounded-xl border-2 border-green-300 shadow-lg p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-200 hover:shadow-2xl hover:scale-105 hover:border-green-400 relative">
            <div className="w-full flex-1 flex flex-col items-center gap-6">
              <div className="text-4xl font-serif font-bold mb-2 text-center">
                Shine Bike wash
              </div>
              <div className="text-3xl font-serif font-bold mb-6 text-center">
                ₹99
              </div>
              <ul className="text-gray-700 text-xl font-serif mb-6 flex flex-col gap-2 text-center list-none p-0">
                <li>Gentle exterior water wash</li>
                <li>Wheel cleaning with specialized wheel cleaner</li>
                <li>High-pressure tyre wash for spotless finish</li>
              </ul>
            </div>
            <button className="bg-[#FFD600] text-black rounded-xl border border-black px-8 py-3 font-semibold text-lg font-mono shadow transition-colors duration-200 hover:bg-yellow-300 mx-auto mt-6">
              Get Services
            </button>
          </div>
          {/* Laundry wash */}
          <div className="bg-gradient-to-br from-white via-purple-50 to-purple-100 rounded-xl border-2 border-purple-300 shadow-lg p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-200 hover:shadow-2xl hover:scale-105 hover:border-purple-400 relative">
            <div className="w-full flex-1 flex flex-col items-center gap-6">
              <div className="text-4xl font-serif font-bold mb-2 text-center">
                Laundry wash
              </div>
              <div className="text-3xl font-serif font-bold mb-6 text-center">
                ₹99
              </div>
              <ul className="text-gray-700 text-xl font-serif mb-6 flex flex-col gap-2 text-center list-none p-0">
                <li>Gentle exterior water wash</li>
                <li>Wheel cleaning with specialized wheel cleaner</li>
                <li>High-pressure tyre wash for spotless finish</li>
              </ul>
            </div>
            <button className="bg-[#FFD600] text-black rounded-xl border border-black px-8 py-3 font-semibold text-lg font-mono shadow transition-colors duration-200 hover:bg-yellow-300 mx-auto mt-6">
              Get Services
            </button>
          </div>
        </div>
      </div>
      {/* What client says - true carousel */}
      <div className="mt-20 mb-8 py-8 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative">
        {/* Background overlay */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: "url(/cleaning-bg.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
        <h2 className="relative text-3xl md:text-4xl font-serif font-bold text-center mb-10">
          What client says
        </h2>
        <div className="relative overflow-hidden w-full flex justify-center">
          <div
            className="flex gap-4 sm:gap-6 md:gap-8 transition-all duration-700"
            style={{ width: "max-content" }}
          >
            {carousel.slice(0, visibleCount).map((t, idx) => {
              const gradients = [
                "from-blue-50 via-blue-100 to-blue-50",
                "from-purple-50 via-purple-100 to-purple-50",
                "from-pink-50 via-pink-100 to-pink-50",
                "from-green-50 via-green-100 to-green-50",
                "from-rose-50 via-rose-100 to-rose-50",
                "from-cyan-50 via-cyan-100 to-cyan-50",
              ];
              const gradient = gradients[idx % gradients.length];
              return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${gradient} rounded-2xl border-2 border-white shadow-xl p-5 sm:p-6 md:p-7 min-w-[240px] sm:min-w-[300px] md:min-w-[360px] max-w-[400px] flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-base text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-600 font-medium">Verified Customer</div>
                  </div>
                  <div className="flex ml-auto gap-1">
                    {[...Array(t.stars)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-lg drop-shadow-sm">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-gray-700 text-base mt-2">“{t.text}”</div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* FAQ Section */}
      {/* FAQ Section */}
      <div className="mt-16 bg-white py-12">
        <h2
          id="faq-section"
          className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8"
        >
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto flex flex-col gap-6 px-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border rounded-xl shadow-sm">
              <button
                className="w-full flex justify-between items-center px-6 py-6 text-lg font-medium focus:outline-none"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              >
                <span>{faq.question}</span>
                <span className="text-2xl">
                  <img
                    src="/services/triangle-down.svg"
                    alt="Toggle"
                    className={
                      openIdx === i
                        ? "w-6 h-6 transform rotate-180 transition-transform duration-200 inline"
                        : "w-6 h-6 transition-transform duration-200 inline"
                    }
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  />
                </span>
              </button>
              {openIdx === i && (
                <div className="px-6 pb-6 text-gray-600 text-base animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
