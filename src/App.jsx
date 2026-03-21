import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { CartProvider } from "./components/CartContext";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { StatusBar, Style } from '@capacitor/status-bar';
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import GlobalBackButton from "./components/GlobalBackButton";
import HeroSection from "./pages/Homepage/HeroSection.jsx";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
// Placeholder imports for new pages
import CarsPage from "./pages/Homepage/services/CarsPage";
import BikesPage from "./pages/Homepage/services/BikesPage";
import HelmetPage from "./pages/Homepage/services/HelmetPage";
import CarWashDeals from "./pages/Homepage/services/CarWashDeals";
import BikeWashDeals from "./pages/Homepage/services/BikeWashDeals";
import ComingSoon from "./pages/ComingSoon";
import HelmetWashDeals from "./pages/Homepage/services/HelmetWashDeals";
import CartPage from "./pages/CartPage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import ServicesBrowser from "./pages/ServicesBrowser";
import AboutPage from "./pages/aboutus/AboutPage";
import Privacy from "./pages/policies/Privacy";
import Terms from "./pages/policies/Terms";
import License from "./pages/policies/License";
import Security from "./pages/policies/Security";
import Shipping from "./pages/policies/Shipping";
import Refund from "./pages/policies/Refund";
import GoogleSuccess from "./pages/GoogleSuccess";
import Impersonate from "./pages/Impersonate";
import ContactPage from "./pages/contact/ContactPage";
import TeamPage from "./pages/team/TeamPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import AddressesPage from "./pages/AddressesPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import BookingHistory from "./pages/admin/BookingHistory";
import OrdersManagement from "./pages/admin/OrdersManagement";
import PUCBookingManagement from "./pages/admin/PUCBookingManagement";
import InsuranceBookingManagement from "./pages/admin/InsuranceBookingManagement";
import CouponManagement from "./pages/admin/CouponManagement";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import VehicleCheckupManagement from "./pages/admin/VehicleCheckupManagement";
import VehicleAccessoriesManagement from "./pages/admin/VehicleAccessoriesManagement";
import AutoFixManagement from "./pages/admin/AutoFixManagement";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeAssignments from "./pages/employee/EmployeeAssignments";
import EmployeeCompleted from "./pages/employee/EmployeeCompleted";
import EmployeeSchedule from "./pages/employee/EmployeeSchedule";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import EmployeeAttendance from "./pages/employee/EmployeeAttendance";
import AdminLogin from "./pages/admin/AdminLogin";
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedEmployeeRoute from "./components/ProtectedEmployeeRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import PUCCertificatePage from "./pages/PUCCertificate/PUCCertificatePage";
import InsuranceAssistancePage from "./pages/InsuranceAssistance/InsuranceAssistancePage";
import VehicleCheckupPage from "./pages/VehicleCheckup/VehicleCheckupPage";
import VehicleAccessoriesPage from "./pages/VehicleAccessories/VehicleAccessoriesPage";
import AutoFixPage from "./pages/AutoFix/AutoFixPage";
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isEmployeeRoute = location.pathname.startsWith("/employee");

  // Configure StatusBar on native platforms to avoid overlap with the device status bar
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: false }).catch((e) => console.warn('StatusBar.setOverlaysWebView failed:', e));
      StatusBar.setStyle({ style: Style.Light }).catch((e) => console.warn('StatusBar.setStyle failed:', e));
      StatusBar.setBackgroundColor({ color: '#ffffff' }).catch((e) => console.warn('StatusBar.setBackgroundColor failed:', e));
    }
  }, []);

  // Handle deep links for OAuth callbacks (native platforms)
  useEffect(() => {
    // Only set up listener on native platforms
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let initialUrlHandled = false;

    // Handle cold start (app opened via deep link when not running)
    const checkInitialUrl = async () => {
      if (initialUrlHandled) return;
      
      try {
        const result = await CapacitorApp.getLaunchUrl();
        if (result?.url) {
          console.log('App launched with deep link:', result.url);
          initialUrlHandled = true;
          handleDeepLink(result.url);
        }
      } catch (error) {
        console.error('Error getting launch URL:', error);
      }
    };

    // Validate path against allowed routes
    const isValidPath = (path) => {
      const allowedPaths = [
        '/google-success',
        '/apple-success', // For future Apple Sign-In
        '/',
      ];
      return allowedPaths.some(allowed => path.startsWith(allowed));
    };

    // Handle deep link URL
    const handleDeepLink = (urlString) => {
      console.log('Deep link received:', urlString);
      
      try {
        const url = new URL(urlString);
        
        // Handle both custom scheme and HTTPS URLs
        // Custom scheme: com.bubbleflashservices.bfsapp://google-success?token=...
        // HTTPS: https://bubbleflashservices.in/google-success?...
        let path = url.pathname;
        let search = url.search;
        
        // For custom scheme URLs, the path might be in the host or pathname
        if (url.protocol === 'com.bubbleflashservices.bfsapp:') {
          // Parse custom scheme URL
          // Format: com.bubbleflashservices.bfsapp://google-success?token=...
          path = url.host || url.pathname || '';
          
          // Remove leading // if present
          if (path.startsWith('//')) {
            path = path.substring(2);
          }
          
          // Get search params from custom scheme URL
          if (url.search) {
            search = url.search;
          } else if (urlString.includes('?')) {
            // Fallback: extract query string manually if URL parser doesn't catch it
            const queryStart = urlString.indexOf('?');
            search = urlString.substring(queryStart);
          }
        }
        
        // Ensure path starts with /
        if (path && !path.startsWith('/')) {
          path = '/' + path;
        }
        
        // Default to home if no valid path
        if (!path) {
          path = '/';
        }
        
        // Validate path for security
        if (!isValidPath(path)) {
          console.warn('Invalid deep link path:', path, '- redirecting to home');
          path = '/';
          search = ''; // Clear potentially malicious query params
        }
        
        // Construct the full path with query params
        const fullPath = path + search;
        console.log('Navigating to:', fullPath);
        
        // Navigate to the path within the app
        navigate(fullPath, { replace: true });

        // Close the in-app browser if it is open (after OAuth redirect)
        Browser.close().catch(() => {});
      } catch (error) {
        console.error('Error handling deep link:', error);
        // On error, navigate to home safely
        navigate('/', { replace: true });
      }
    };

    // Handle warm start (app in background)
    const handleAppUrlOpen = (event) => {
      handleDeepLink(event.url);
    };

    // Check for initial URL on mount
    checkInitialUrl();

    // Listen for app URL open events
    const listener = CapacitorApp.addListener('appUrlOpen', handleAppUrlOpen);

    // Cleanup listener on unmount
    return () => {
      listener.remove();
    };
  }, [navigate]);

  return (
    <div>
      <ScrollToTop />
      <GlobalBackButton />
      {!isAdminRoute && !isEmployeeRoute && <Header />}
      <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
              </>
            }
          />
          <Route
            path="/cars"
            element={
              <ProtectedRoute>
                <CarsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bikes"
            element={
              <ProtectedRoute>
                <BikesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/helmets"
            element={
              <ProtectedRoute>
                <HelmetPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/car-wash-deals/:category"
            element={
              <ProtectedRoute>
                <CarWashDeals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bike-wash-deals/:category"
            element={
              <ProtectedRoute>
                <BikeWashDeals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/helmet-wash-deals/:category"
            element={
              <ProtectedRoute>
                <HelmetWashDeals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services/puc-certificate"
            element={
              <ProtectedRoute>
                <PUCCertificatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services/insurance-assistance"
            element={
              <ProtectedRoute>
                <InsuranceAssistancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services/vehicle-checkup"
            element={
              <ProtectedRoute>
                <VehicleCheckupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle-accessories"
            element={
              <ProtectedRoute>
                <VehicleAccessoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services-browser" element={<ServicesBrowser />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/license" element={<License />} />
          <Route path="/security" element={<Security />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/refund" element={<Refund />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <AddressesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/impersonate" element={<Impersonate />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/team" element={<TeamPage />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />



          <Route
            path="/autofix"
            element={
              <ProtectedRoute>
                <AutoFixPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedAdminRoute>
                <UserManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedAdminRoute>
                <BookingHistory />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedAdminRoute>
                <OrdersManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/puc-bookings"
            element={
              <ProtectedAdminRoute>
                <PUCBookingManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/insurance-bookings"
            element={
              <ProtectedAdminRoute>
                <InsuranceBookingManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/vehicle-checkup"
            element={
              <ProtectedAdminRoute>
                <VehicleCheckupManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedAdminRoute>
                <EmployeeManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedAdminRoute>
                <CouponManagement />
              </ProtectedAdminRoute>
            }
          />



          <Route
            path="/admin/vehicle-accessories"
            element={
              <ProtectedAdminRoute>
                <VehicleAccessoriesManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/autofix"
            element={
              <ProtectedAdminRoute>
                <AutoFixManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route
            path="/employee"
            element={<Navigate to="/employee/dashboard" replace />}
          />
          <Route
            path="/employee/attendance"
            element={
              <ProtectedEmployeeRoute>
                <EmployeeAttendance />
              </ProtectedEmployeeRoute>
            }
          />
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedEmployeeRoute>
                <EmployeeDashboard />
              </ProtectedEmployeeRoute>
            }
          />
          <Route
            path="/employee/assignments"
            element={
              <ProtectedEmployeeRoute>
                <EmployeeAssignments />
              </ProtectedEmployeeRoute>
            }
          />
          <Route
            path="/employee/completed"
            element={
              <ProtectedEmployeeRoute>
                <EmployeeCompleted />
              </ProtectedEmployeeRoute>
            }
          />
          <Route
            path="/employee/schedule"
            element={
              <ProtectedEmployeeRoute>
                <EmployeeSchedule />
              </ProtectedEmployeeRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedEmployeeRoute>
                <EmployeeProfile />
              </ProtectedEmployeeRoute>
            }
          />
      </Routes>

      {!isAdminRoute && !isEmployeeRoute && <Footer />}
      {!isAdminRoute && !isEmployeeRoute && <FloatingWhatsApp />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProviderWrapper>
        <AppContent />
      </CartProviderWrapper>
    </AuthProvider>
  );
}

function CartProviderWrapper({ children }) {
  const { user } = useAuth();

  // Force CartProvider to remount when user changes by using user email as key
  // This ensures complete cart state isolation between users
  const cartKey = user?.email || user?._id || "guest";

  return <CartProvider key={cartKey}>{children}</CartProvider>;
}
