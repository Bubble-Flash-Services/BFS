import React, { useState, useEffect, useRef } from "react";
import { Phone, Menu, ShoppingCart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import SignupModal from "../pages/Homepage/signup/SignupModal";
import SuccessModal from "../pages/Homepage/signup/SuccessModal";
import SigninModal from "../pages/Homepage/signin/SigninModal";
import ProfileModal from "./ProfileModal";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsCount } = useCart();
  const { user, loading, logout, setUser, updateAuth, refreshUserData } =
    useAuth();
  const [openSignup, setOpenSignup] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset image loading state when user changes
  useEffect(() => {
    if (user?.image) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [user?.image]);

  // Handle navigation from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      const timer = setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        // Clear the state after scrolling
        window.history.replaceState(null, "");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleSuccessFromSignup = () => {
    setOpenSignup(false);
    setOpenSuccess(true);
  };

  const handleNavigation = (section) => {
    // If we're not on the homepage, navigate to homepage first, then scroll to section
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: section } });
    } else {
      // If we're on homepage, just scroll to the section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  const getAvatar = () => {
    if (user?.image && !imageError) {
      return (
        <div className="relative">
          {imageLoading && (
            <div className="absolute inset-0 rounded-full w-8 h-8 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            </div>
          )}
          <img
            src={user.image}
            alt="avatar"
            className={`rounded-full w-8 h-8 object-cover ${
              imageLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-300`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        </div>
      );
    }
    if (user?.email) {
      return (
        <div className="rounded-full w-8 h-8 bg-yellow-400 flex items-center justify-center text-white font-bold">
          {user.email[0].toUpperCase()}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => {
                  navigate("/");
                  // Small delay to ensure navigation completes, then scroll to top
                  setTimeout(() => {
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  }, 100);
                }}
                className="flex items-center hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0"
              >
                <img
                  src="/logo.jpg"
                  alt="BFS Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain mr-2 sm:mr-4"
                />
                <h1 className="text-sm sm:text-xl md:text-2xl font-bold capitalize bg-gradient-to-r from-yellow-400 via-yellow-300 to-blue-700 bg-clip-text text-transparent">
                  bubble flash services
                </h1>
              </button>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => handleNavigation("home")}
                className="text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation("aboutus")}
                className="text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
              >
                About us
              </button>
              <button
                onClick={() => handleNavigation("services")}
                className="text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
              >
                Services
              </button>
              <button
                onClick={() => {
                  navigate("/team");
                  setMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
              >
                Team
              </button>
              <button
                onClick={() => handleNavigation("contact")}
                className="text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1"
              >
                Contact
              </button>
            </nav>
            <div className="flex items-center gap-4">
              {/* Cart Icon - only show if user is logged in */}
              {user && (
                <button
                  onClick={() => navigate("/cart")}
                  className="relative p-2 text-gray-700 hover:text-blue-500 transition-colors"
                >
                  <ShoppingCart size={24} />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              )}

              <div className="relative" ref={dropdownRef}>
                {user ? (
                  <div
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {getAvatar()}
                  </div>
                ) : (
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                    onClick={() => setDropdownOpen((v) => !v)}
                  >
                    Login
                  </button>
                )}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {user ? (
                      <>
                        <button
                          className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm"
                          onClick={() => {
                            navigate("/profile");
                            setDropdownOpen(false);
                          }}
                        >
                          <User size={16} />
                          View Profile
                        </button>
                        <button
                          className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm border-t border-gray-100"
                          onClick={() => {
                            navigate("/orders");
                            setDropdownOpen(false);
                          }}
                        >
                          <User size={16} />
                          My Orders
                        </button>
                        <button
                          className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm border-t border-gray-100"
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                            navigate("/");
                          }}
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm"
                          onClick={() => {
                            setOpenSignin(true);
                            setDropdownOpen(false);
                          }}
                        >
                          Sign In
                        </button>
                        <button
                          className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm border-t border-gray-100"
                          onClick={() => {
                            setOpenSignup(true);
                            setDropdownOpen(false);
                          }}
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button
                className="md:hidden ml-2 p-2 rounded hover:bg-gray-100"
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg px-4 py-4 space-y-4">
            <button
              onClick={() => handleNavigation("home")}
              className="block w-full text-left text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("aboutus")}
              className="block w-full text-left text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              About us
            </button>
            <button
              onClick={() => handleNavigation("services")}
              className="block w-full text-left text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => {
                navigate("/team");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Team
            </button>
            <button
              onClick={() => handleNavigation("contact")}
              className="w-full text-left text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1"
            >
              <Phone size={16} />
              Contact
            </button>

            {/* User Profile Section in Mobile Menu */}
            {user && (
              <>
                <hr className="border-gray-200" />
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-2 py-2">
                    {getAvatar()}
                    <span className="text-gray-700 font-medium truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:text-blue-500 transition-colors bg-transparent border-none cursor-pointer"
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User size={16} />
                    View Profile
                  </button>
                  <button
                    className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:text-blue-500 transition-colors bg-transparent border-none cursor-pointer"
                    onClick={() => {
                      navigate("/orders");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User size={16} />
                    My Orders
                  </button>
                  <button
                    className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:text-blue-500 transition-colors bg-transparent border-none cursor-pointer"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>
      <SignupModal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        onSignup={handleSuccessFromSignup}
        onLoginNow={() => {
          setOpenSignup(false);
          setOpenSignin(true);
        }}
      />
      <SigninModal
        open={openSignin}
        onClose={() => setOpenSignin(false)}
        onSignupNow={() => {
          setOpenSignin(false);
          setOpenSignup(true);
        }}
      />
      <SuccessModal open={openSuccess} onClose={() => setOpenSuccess(false)} />
      {openProfile && (
        <ProfileModal
          user={user}
          onSave={async (data) => {
            try {
              const token = localStorage.getItem("token");
              const { updateProfile } = await import("../api/auth");
              const res = await updateProfile(token, data);
              if (res && !res.error) {
                updateAuth(token, res);
                // Also refresh user data to ensure consistency
                await refreshUserData();
                setOpenProfile(false);
                return { success: true };
              } else {
                console.error("Profile update failed:", res.error);
                return { success: false, error: res.error || "Update failed" };
              }
            } catch (error) {
              console.error("Profile update error:", error);
              return {
                success: false,
                error: "Network error. Please try again.",
              };
            }
          }}
          onClose={() => setOpenProfile(false)}
        />
      )}
    </>
  );
}
