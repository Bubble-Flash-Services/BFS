import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const flowerCategories = [
  {
    name: "Flower Bouquets",
    image: "/services/flowers/bouquet.webp",
    category: "bouquets",
    description: "Beautiful flower arrangements for every occasion",
  },
  {
    name: "Gift Boxes & Surprise Combos",
    image: "/services/flowers/gift-box.png",
    category: "gifts",
    description: "Thoughtful gift combinations with flowers",
  },
  {
    name: "Decoration Services",
    image: "/services/flowers/decoration.avif",
    category: "decorations",
    description: "Professional decoration for special moments",
  },
];

export default function FlowerCategoriesPage() {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/flower-services/${category}`);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🌸 BFS Flowers & Surprises
          </h1>
          <p className="text-xl md:text-2xl text-pink-600 mb-4">
            Beautiful Bouquets. Thoughtful Gifts. Perfect Moments.
          </p>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Doorstep delivery across Bangalore. Choose your category below to
            explore our services.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Select a Service Category
        </h2>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {flowerCategories.map((cat) => (
            <div
              key={cat.name}
              className="group cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleCategoryClick(cat.category)}
            >
              <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=" +
                        encodeURIComponent(cat.name);
                    }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{cat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Vertical Grid Layout */}
        <div className="md:hidden grid grid-cols-1 gap-6">
          {flowerCategories.map((cat) => (
            <div
              key={cat.name}
              className="group cursor-pointer transition-transform active:scale-95"
              onClick={() => handleCategoryClick(cat.category)}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=" +
                        encodeURIComponent(cat.name);
                    }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{cat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose BFS Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 Why Choose BFS
          </h3>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: "🌺", text: "Fresh Flowers", color: "pink" },
              { icon: "✨", text: "Beautiful Presentation", color: "purple" },
              { icon: "⏰", text: "Fast Delivery", color: "blue" },
              { icon: "❤️", text: "Custom Surprises", color: "red" },
              { icon: "✓", text: "Trusted BFS Service", color: "green" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="font-semibold text-gray-800">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Specialise In */}
        <div className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎉 What We Specialise In
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "🎂", title: "Birthday Surprises" },
              { emoji: "💕", title: "Love & Anniversary Bouquets" },
              { emoji: "🌸", title: "Party & Function Flowers" },
              { emoji: "🏠", title: "Room Decorations" },
              { emoji: "🎁", title: "Customized Gift Boxes" },
              { emoji: "⚠️", title: "Cakes NOT Provided" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-white border-2 border-pink-200"
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="font-medium text-gray-800">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
