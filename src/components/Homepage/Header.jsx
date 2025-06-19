import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import SignupModal from './signup/SignupModal';
import OtpModal from './signup/OtpModal';
import PasswordModal from './signup/PasswordModal';
import SuccessModal from './signup/SuccessModal';
import SigninModal from '../signin/SigninModal';
import AboutPage from '../AboutPage';

export default function Header() {
  const [openSignup, setOpenSignup] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  // Handler to open OTP modal from SignupModal
  const handleOtpFromSignup = () => {
    setOpenSignup(false);
    setOpenOtp(true);
  };
  // Handler to open Password modal from OtpModal
  const handlePasswordFromOtp = () => {
    setOpenOtp(false);
    setOpenPassword(true);
  };
  // Handler to open Success modal from PasswordModal
  const handleSuccessFromPassword = () => {
    setOpenPassword(false);
    setOpenSuccess(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="BFS Logo" className="w-8 h-8 object-contain mr-2" />
              <h1 className="text-2xl font-bold text-blue-500 capitalize">bubble flash</h1>
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
            <div className="flex gap-4">
              <button
                className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setOpenSignin(true)}
              >
                sign in
              </button>
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setOpenSignup(true)}
              >
                sign up
              </button>
            </div>
          </div>
        </div>
      </header>
      <SignupModal open={openSignup} onClose={() => setOpenSignup(false)} onOtp={handleOtpFromSignup} />
      <SigninModal open={openSignin} onClose={() => setOpenSignin(false)} />
      <OtpModal open={openOtp} onClose={() => setOpenOtp(false)} onVerify={handlePasswordFromOtp} />
      <PasswordModal open={openPassword} onClose={() => setOpenPassword(false)} onSubmit={handleSuccessFromPassword} />
      <SuccessModal open={openSuccess} onClose={() => setOpenSuccess(false)} />
    </>
  );
}