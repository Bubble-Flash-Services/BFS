import React from 'react';
import { AuthProvider } from './components/AuthContext';
import { CartProvider } from './components/CartContext';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './pages/Homepage/HeroSection';
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
import ServicesBrowser from './pages/ServicesBrowser';
import AboutPage from './pages/aboutus/AboutPage';
import GoogleSuccess from './pages/GoogleSuccess';
import ContactPage from './pages/contact/ContactPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AddressesPage from './pages/AddressesPage';
// Admin imports
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminServices from './pages/admin/AdminServices';
import AdminPackages from './pages/admin/AdminPackages';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCoupons from './pages/admin/AdminCoupons';

function AppContent() {
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
        <Route path="/services-browser" element={<ServicesBrowser />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/addresses" element={<AddressesPage />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/packages" element={<AdminPackages />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/coupons" element={<AdminCoupons />} />
        <Route path="/admin/coupons" element={<AdminCoupons />} />
      </Routes>
      <Footer />
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