import { useState, useEffect } from "react";
import { Input } from "antd";
import HeroSection from "../../components/green&clean/HeroSection";
import ServicesSection from "../../components/green&clean/ServicesSection";
import WhyChooseUs from "../../components/green&clean/WhyChooseUs";
import CTASection from "../../components/green&clean/CTASection";
import servicesData from "../../data/services.json";

const { Search } = Input;

export default function GreenCleanPage() {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(filtered);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = servicesData || {};

        // Prepare instant services with icons
        const instantServices = data.instantServices.map((s) => ({
          ...s,
          type: "instant",
          iconType: s.subcategory?.toLowerCase() || "home-cleaning", // map subcategory to icon
        }));

        // Prepare deep cleaning services with default image
        const deepServices = data.deepCleanServices.map((c) => ({
          ...c,
          type: "deep",
          title: c.category,
          description: `Explore deep cleaning services under ${c.category}`,
          images: c.services?.[0]?.images || ["/default-service.jpg"],
        }));

        const combined = [...instantServices, ...deepServices];
        setCategories(combined);
        setFiltered(combined);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!search) return setFiltered(categories);
    const lower = search.toLowerCase();
    setFiltered(
      categories.filter(
        (c) =>
          c.title?.toLowerCase().includes(lower) ||
          c.description?.toLowerCase().includes(lower)
      )
    );
  }, [search, categories]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <HeroSection />
      <ServicesSection
        categories={filtered}
        loading={loading}
        search={search}
        setSearch={setSearch}
      />
      <WhyChooseUs />
      <CTASection />
    </div>
  );
}
