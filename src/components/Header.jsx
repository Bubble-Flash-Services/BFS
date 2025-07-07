import React, { useState, useEffect } from 'react';
import { Phone, Menu, ShoppingCart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import SignupModal from '../pages/Homepage/signup/SignupModal';
import SuccessModal from '../pages/Homepage/signup/SuccessModal';
import SigninModal from '../pages/Homepage/signin/SigninModal';
import ProfileModal from './ProfileModal';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsCount } = useCart();
  const { user, loading, logout, setUser } = useAuth();
  const [openSignup, setOpenSignup] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle navigation from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      const timer = setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        // Clear the state after scrolling
        window.history.replaceState(null, '');
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
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } });
    } else {
      // If we're on homepage, just scroll to the section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const getAvatar = () => {
    if (user?.image) {
      return <img src={user.image} alt="avatar" className="rounded-full w-8 h-8" />;
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
              <img src="/logo.jpg" alt="BFS Logo" className="w-16 h-16 object-contain mr-4" />
              <h1 className="text-2xl font-bold capitalize bg-gradient-to-r from-yellow-400 via-yellow-300 to-blue-700 bg-clip-text text-transparent">bubble flash</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => handleNavigation('home')} 
                className="text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation('aboutus')} 
                className="text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
              >
                About us
              </button>
              <button 
                onClick={() => handleNavigation('services')} 
                className="text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
              >
                Services
              </button>
              <button 
                onClick={() => handleNavigation('contact')} 
                className="text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1"
              >
                <Phone size={16} />
                Contact
              </button>
            </nav>
            <div className="flex items-center gap-4">
              {/* Cart Icon - only show if user is logged in */}
              {user && (
                <button
                  onClick={() => navigate('/cart')}
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
              
              <div className="relative">
                {user ? (
                  <div onClick={() => setDropdownOpen((v) => !v)}>{getAvatar()}</div>
                ) : (
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    onClick={() => setDropdownOpen((v) => !v)}
                  >
                    Login
                  </button>
                )}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {user ? (
                      <>
                        <button
                          className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                          onClick={() => {
                            navigate('/profile');
                            setDropdownOpen(false);
                          }}
                        >
                          <User size={16} />
                          View Profile
                        </button>
                        <button
                          className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                          onClick={() => {
                            setOpenProfile(true);
                            setDropdownOpen(false);
                          }}
                        >
                          <User size={16} />
                          Edit Profile
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                            navigate('/');
                          }}
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                          onClick={() => { setOpenSignin(true); setDropdownOpen(false); }}
                        >
                          Sign In
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                          onClick={() => { setOpenSignup(true); setDropdownOpen(false); }}
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button className="md:hidden ml-2 p-2 rounded hover:bg-gray-100" onClick={() => setMobileMenuOpen((v) => !v)}>
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg px-4 py-4 space-y-4">
            <button 
              onClick={() => handleNavigation('home')} 
              className="block w-full text-left text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('aboutus')} 
              className="block w-full text-left text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              About us
            </button>
            <button 
              onClick={() => handleNavigation('services')} 
              className="block w-full text-left text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavigation('contact')} 
              className="w-full text-left text-gray-700 hover:text-blue-500 font-medium transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1"
            >
              <Phone size={16} />
              Contact
            </button>
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
              const token = localStorage.getItem('token');
              const { updateProfile } = await import('../api/auth');
              const res = await updateProfile(token, data);
              if (res && !res.error) {
                setUser(res);
                setOpenProfile(false);
              } else {
                console.error('Profile update failed:', res.error);
              }
            } catch (error) {
              console.error('Profile update error:', error);
            }
          }} 
          onClose={() => setOpenProfile(false)} 
        />
      )}
    </>
  );
}