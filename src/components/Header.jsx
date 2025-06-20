import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import SignupModal from './Homepage/signup/SignupModal';
import SuccessModal from './Homepage/signup/SuccessModal';
import SigninModal from './Homepage/signin/SigninModal';
import AboutPage from './AboutPage';

export default function Header() {
  const [openSignup, setOpenSignup] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handler to open Success modal from SignupModal
  const handleSuccessFromSignup = () => {
    setOpenSignup(false);
    setOpenSuccess(true);
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
              <a href="#" className="text-gray-700 hover:text-blue-500 font-medium transition-colors flex items-center gap-1">
                <Phone size={16} />
                Contact
              </a>
            </nav>
            <div className="relative">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                Login
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <SignupModal open={openSignup} onClose={() => setOpenSignup(false)} onSignup={handleSuccessFromSignup} />
      <SigninModal open={openSignin} onClose={() => setOpenSignin(false)} />
      <SuccessModal open={openSuccess} onClose={() => setOpenSuccess(false)} />
    </>
  );
}