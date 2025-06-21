import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './pages/Homepage/HeroSection';
import ServiceCategories from './pages/Homepage/services/ServiceCategories';
import Footer from './components/Footer';
// Placeholder imports for new pages
import CarsPage from './pages/Homepage/services/CarsPage';
import BikesPage from './pages/Homepage/services/BikesPage';
import LaundryPage from './pages/Homepage/services/LaundryPage';
import ServicesPage from './pages/ServicesPage/ServicesPage';
import AboutPage from './pages/aboutus/AboutPage';
import GoogleSuccess from './pages/GoogleSuccess';
import ContactPage from './pages/contact/ContactPage';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <ServiceCategories />
          </>
        } />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/bikes" element={<BikesPage />} />
        <Route path="/laundry" element={<LaundryPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;