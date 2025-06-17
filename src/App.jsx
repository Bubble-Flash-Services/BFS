import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServiceCategories from './components/ServiceCategories';
import Footer from './components/Footer';
// Placeholder imports for new pages
import CarsPage from './components/CarsPage';
import BikesPage from './components/BikesPage';
import LaundryPage from './components/LaundryPage';

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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;