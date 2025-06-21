import React, { useState, useEffect } from 'react';
import { Phone, Menu } from 'lucide-react';
import SignupModal from '../pages/Homepage/signup/SignupModal';
import SuccessModal from '../pages/Homepage/signup/SuccessModal';
import SigninModal from '../pages/Homepage/signin/SigninModal';
import AboutPage from '../pages/aboutus/AboutPage';

export default function Header() {
  const [openSignup, setOpenSignup] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleSuccessFromSignup = () => {
    setOpenSignup(false);
    setOpenSuccess(true);
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
              <img src="/logo.png" alt="BFS Logo" className="w-8 h-8 object-contain mr-2" />
              <h1 className="text-2xl font-bold capitalize bg-gradient-to-r from-yellow-400 via-yellow-300 to-blue-700 bg-clip-text text-transparent">bubble flash</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">
                Home
              </a>
              <a href="/about" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">
                About us
              </a>
              <a href="/services" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">
                Services
              </a>
              <a href="/contact" className="text-gray-700 hover:text-blue-500 font-medium transition-colors flex items-center gap-1">
                <Phone size={16} />
                Contact
              </a>
            </nav>
            <div className="flex items-center gap-2">
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
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('user');
                          setUser(null);
                          setDropdownOpen(false);
                          window.location.reload();
                        }}
                      >
                        Logout
                      </button>
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
            <a href="/" className="block text-gray-700 hover:text-blue-500 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Home
            </a>
            <a href="/about" className="block text-gray-700 hover:text-blue-500 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
              About us
            </a>
            <a href="/services" className="block text-gray-700 hover:text-blue-500 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Services
            </a>
            <a href="/contact" className="block text-gray-700 hover:text-blue-500 font-medium transition-colors flex items-center gap-1" onClick={() => setMobileMenuOpen(false)}>
              <Phone size={16} />
              Contact
            </a>
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
    </>
  );
}