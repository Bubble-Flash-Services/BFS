import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Homepage/Header';
import HeroSection from './components/Homepage/HeroSection';
import ServiceCategories from './components/Homepage/services/ServiceCategories';
import Footer from './components/Footer';
// Placeholder imports for new pages
import CarsPage from './components/Homepage/services/CarsPage';
import BikesPage from './components/Homepage/services/BikesPage';
import LaundryPage from './components/Homepage/services/LaundryPage';
import ServicesPage from './components/ServicesPage/ServicesPage';
import AboutPage from './components/AboutPage';

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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;