import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { CartProvider } from './components/CartContext';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './pages/Homepage/HeroSection';
import ServiceCategories from './pages/Homepage/services/ServiceCategories';
import Footer from './components/Footer';
// Placeholder imports for new pages
import CarsPage from './pages/Homepage/services/CarsPage';
import BikesPage from './pages/Homepage/services/BikesPage';
import LaundryPage from './pages/Homepage/services/LaundryPage';
import CarWashDeals from './pages/Homepage/services/CarWashDeals';
import BikeWashDeals from './pages/Homepage/services/BikeWashDeals';
import LaundryDeals from './pages/Homepage/services/LaundryDeals';
import CartPage from './pages/CartPage';
import ServicesPage from './pages/ServicesPage/ServicesPage';
import AboutPage from './pages/aboutus/AboutPage';
import GoogleSuccess from './pages/GoogleSuccess';
import ContactPage from './pages/contact/ContactPage';
import SignupModal from './pages/Homepage/signup/SignupModal';
import SigninModal from './pages/Homepage/signin/SigninModal';
import ProfileModal from './components/ProfileModal';

function AppContent() {
  const { user, setUser, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
          </>
        } />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/bikes" element={<BikesPage />} />
        <Route path="/laundry" element={<LaundryPage />} />
        <Route path="/car-wash-deals/:category" element={<CarWashDeals />} />
        <Route path="/bike-wash-deals/:category" element={<BikeWashDeals />} />
        <Route path="/laundry-deals/:category" element={<LaundryDeals />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
      <header className="flex justify-end gap-4 p-4">
        {user ? (
          <>
            <span className="font-bold">Hello, {user.name || user.email || user.phone}</span>
            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={()=>setShowProfile(true)}>Profile</button>
            <button className="bg-gray-300 px-3 py-1 rounded" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <button className="bg-yellow-400 px-3 py-1 rounded" onClick={()=>setShowSignin(true)}>Login</button>
            <button className="bg-green-400 px-3 py-1 rounded" onClick={()=>setShowSignup(true)}>Sign Up</button>
          </>
        )}
      </header>
      {/* Main content here */}
      {showSignup && <SignupModal open={showSignup} onClose={()=>setShowSignup(false)} onSignup={setUser} onLoginNow={()=>{setShowSignup(false);setShowSignin(true);}} />}
      {showSignin && <SigninModal open={showSignin} onClose={()=>setShowSignin(false)} onSignupNow={()=>{setShowSignin(false);setShowSignup(true);}} onLogin={setUser} />}
      {showProfile && <ProfileModal user={user} onSave={async (data)=>{
        // Call updateProfile API
        const token = localStorage.getItem('token');
        const res = await import('./api/auth').then(api => api.updateProfile(token, data));
        if (res && !res.error) setUser(res);
        setShowProfile(false);
      }} onClose={()=>setShowProfile(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}