import React from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { CartProvider } from "./components/CartContext";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import GlobalBackButton from "./components/GlobalBackButton";
import HeroSection from "./pages/Homepage/HeroSection.jsx";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
// Placeholder imports for new pages
import CarsPage from "./pages/Homepage/services/CarsPage";
import BikesPage from "./pages/Homepage/services/BikesPage";
import LaundryPage from "./pages/Homepage/services/LaundryPageNew";
import HelmetPage from "./pages/Homepage/services/HelmetPage";
import CarWashDeals from "./pages/Homepage/services/CarWashDeals";
import BikeWashDeals from "./pages/Homepage/services/BikeWashDeals";
import LaundryDeals from "./pages/Homepage/services/LaundryDeals";
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
import GreenCleanCart from "./pages/GreenCleanCart";
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
import MoversPackersManagement from "./pages/admin/MoversPackersManagement";
import GreenCleanManagement from "./pages/admin/GreenCleanManagement";
import VehicleCheckupManagement from "./pages/admin/VehicleCheckupManagement";
import VehicleAccessoriesManagement from "./pages/admin/VehicleAccessoriesManagement";
import KeyServicesManagement from "./pages/admin/KeyServicesManagement";
import LaundryManagement from "./pages/admin/LaundryManagement";
import PaintingServicesManagement from "./pages/admin/PaintingServicesManagement";
import AutoFixManagement from "./pages/admin/AutoFixManagement";
import FlowerServicesManagement from "./pages/admin/FlowerServicesManagement";
import MobileFixManagement from "./pages/admin/MobileFixManagement";
import MobilePricingManagement from "./pages/admin/MobilePricingManagement";
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
import { CartProviderForGreenandClean } from "./context/CartContext";
import GreenandClean from "./pages/green&clean/Green&Clean";
import ServicePage from "./pages/green&clean/ServicePage";
import ServiceByCategory from "./pages/green&clean/ServiceByCategory";
import MoversPackersPage from "./pages/MoversPackersPage";
import PUCCertificatePage from "./pages/PUCCertificate/PUCCertificatePage";
import InsuranceAssistancePage from "./pages/InsuranceAssistance/InsuranceAssistancePage";
import VehicleCheckupPage from "./pages/VehicleCheckup/VehicleCheckupPage";
import VehicleAccessoriesPage from "./pages/VehicleAccessories/VehicleAccessoriesPage";
import PaintingServicesPage from "./pages/PaintingServices/PaintingServicesPage";
import KeyServicesPage from "./pages/KeyServices/KeyServicesPage";
import AutoFixPage from "./pages/AutoFix/AutoFixPage";
import FlowerServicesPage from "./pages/FlowerServices/FlowerServicesPage";
import MobileFixPage from "./pages/MobileFix/MobileFixPage";
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isEmployeeRoute = location.pathname.startsWith("/employee");

  return (
    <div>
      <ScrollToTop />
      <GlobalBackButton />
      {!isAdminRoute && !isEmployeeRoute && <Header />}
      <CartProviderForGreenandClean>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
              </>
            }
          />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/bikes" element={<BikesPage />} />
          <Route
            path="/laundry"
            element={
              // <ComingSoon
              //   title="Laundry Service Coming Soon"
              //   message="We’re working hard to bring laundry services to you. Stay tuned!"
              // />
              <LaundryPage />
            }
          />
          <Route path="/helmets" element={<HelmetPage />} />
          <Route path="/car-wash-deals/:category" element={<CarWashDeals />} />
          <Route
            path="/bike-wash-deals/:category"
            element={<BikeWashDeals />}
          />
          {/* <Route
            path="/laundry-deals/:category"
            element={
              <ComingSoon
                title="Laundry Service Coming Soon"
                message="We’re working hard to bring laundry services to you. Stay tuned!"
              />
            }
          /> */}

          <Route path="/laundry-deals/:category" element={<LaundryDeals />} />
          <Route
            path="/helmet-wash-deals/:category"
            element={<HelmetWashDeals />}
          />
          <Route
            path="/services/puc-certificate"
            element={<PUCCertificatePage />}
          />
          <Route
            path="/services/insurance-assistance"
            element={<InsuranceAssistancePage />}
          />
          <Route
            path="/services/vehicle-checkup"
            element={<VehicleCheckupPage />}
          />
          <Route
            path="/vehicle-accessories"
            element={<VehicleAccessoriesPage />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services-browser" element={<ServicesBrowser />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/license" element={<License />} />
          <Route path="/security" element={<Security />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/impersonate" element={<Impersonate />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/green&clean" element={<GreenCleanCart />} />
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
          <Route path="green" element={<GreenandClean />} />
          <Route path="/services/:categoryName" element={<ServicePage />} />
          <Route
            path="/services/category/:categoryName"
            element={<ServiceByCategory />}
          />
          <Route path="/movers-packers" element={<MoversPackersPage />} />
          <Route path="/key-services" element={<KeyServicesPage />} />
          <Route path="/painting-services" element={<PaintingServicesPage />} />
          <Route path="/autofix" element={<AutoFixPage />} />
          <Route path="/flower-services" element={<FlowerServicesPage />} />
          <Route path="/mobilefix" element={<MobileFixPage />} />
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
            path="/admin/movers-packers"
            element={
              <ProtectedAdminRoute>
                <MoversPackersManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/key-services"
            element={
              <ProtectedAdminRoute>
                <KeyServicesManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/laundry"
            element={
              <ProtectedAdminRoute>
                <LaundryManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/green-clean"
            element={
              <ProtectedAdminRoute>
                <GreenCleanManagement />
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
            path="/admin/painting-services"
            element={
              <ProtectedAdminRoute>
                <PaintingServicesManagement />
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
          <Route
            path="/admin/flower-services"
            element={
              <ProtectedAdminRoute>
                <FlowerServicesManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/mobilefix"
            element={
              <ProtectedAdminRoute>
                <MobileFixManagement />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/mobile-pricing"
            element={
              <ProtectedAdminRoute>
                <MobilePricingManagement />
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
      </CartProviderForGreenandClean>

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
