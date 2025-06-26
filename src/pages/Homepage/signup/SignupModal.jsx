import React, { useState } from "react";
import { signup, sendOtp, verifyOtp } from '../../../api/auth';

export default function SignupModal({ open, onClose, onSignup, onLoginNow }) {
  const [mode, setMode] = useState('email'); // 'email' or 'mobile'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === 'email') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setLoading(true);
      try {
        const res = await signup({ email, password, name: name || email.split('@')[0] });
        setLoading(false);
        if (res.token && res.user) {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            window.location.reload();
          }, 2000);
        } else {
          setError(res.error || res.message || 'Sign up failed');
        }
      } catch (err) {
        setLoading(false);
        setError('Sign up failed');
      }
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await sendOtp({ phone });
      setLoading(false);
      if (res.success) {
        setOtpSent(true);
      } else {
        setError(res.error || 'Failed to send OTP');
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp({ phone, otp });
      setLoading(false);
      if (res.token && res.user) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          window.location.reload();
        }, 2000);
      } else {
        setError(res.error || 'Invalid OTP');
      }
    } catch (err) {
      setLoading(false);
      setError('Invalid OTP');
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl bg-white rounded-3xl shadow-2xl p-4 sm:p-8 md:p-10 flex flex-col items-center overflow-y-auto max-h-[95vh] animate-fadeIn">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-3xl sm:text-4xl text-gray-900 bg-white rounded-full border border-gray-300 shadow-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center z-50 cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 tracking-wide text-center break-words whitespace-normal w-full max-w-full bg-white z-10 overflow-x-hidden text-ellipsis">
          <span className="inline-block align-middle w-full overflow-visible">Sign up</span>
        </h2>
        <div className="w-2/3 sm:w-3/4 border-t border-black mb-4 sm:mb-6 md:mb-8" />
        {/* Toggle */}
        <div className="flex w-full justify-center gap-2 mb-4">
          <button className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold ${mode==='email' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'}`} onClick={()=>{setMode('email');setError('')}}>Email</button>
          <button className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold ${mode==='mobile' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'}`} onClick={()=>{setMode('mobile');setError('')}}>Mobile</button>
        </div>
        {/* Form */}
        <div className="w-full flex flex-col items-center">
          {mode === 'email' && (
            <form className="w-full flex flex-col items-center gap-4 sm:gap-8" onSubmit={handleSignup}>
              <div className="w-full">
                <label className="block text-base sm:text-lg md:text-xl mb-2 text-gray-800 font-serif">Name</label>
                <input
                  type="text"
                  className="w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="w-full">
                <label className="block text-base sm:text-lg md:text-xl mb-2 text-gray-800 font-serif">Email</label>
                <input
                  type="email"
                  className="w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="w-full flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label className="block text-base sm:text-lg md:text-xl mb-2 text-gray-800 font-serif">Password</label>
                  <input
                    type="password"
                    className="w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-base sm:text-lg md:text-xl mb-2 text-gray-800 font-serif">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-32 sm:w-40 bg-yellow-400 text-black font-bold text-xl sm:text-2xl rounded-full py-2 shadow-md hover:bg-yellow-500 transition mb-2"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          )}
          {mode === 'mobile' && !otpSent && (
            <form className="w-full flex flex-col items-center gap-4 sm:gap-8" onSubmit={handleSendOtp}>
              <div className="w-full">
                <label className="block text-base sm:text-lg md:text-xl mb-2 text-gray-800 font-serif">Name</label>
                <input
                  type="text"
                  className="w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="w-full">
                <label className="block text-base sm:text-lg md:text-xl mb-2 text-gray-800 font-serif">Mobile Number</label>
                <input
                  type="tel"
                  className="w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-32 sm:w-40 bg-yellow-400 text-black font-bold text-xl sm:text-2xl rounded-full py-2 shadow-md hover:bg-yellow-500 transition mb-2"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}
          {mode === 'mobile' && otpSent && (
            <form className="w-full flex flex-col items-center gap-4 sm:gap-8" onSubmit={handleVerifyOtp}>
              <div className="w-full">
                <label className="block text-base sm:text-lg md:text-xl mb-2 text-gray-800 font-serif">Enter OTP</label>
                <input
                  type="text"
                  className="w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter the OTP sent to your mobile"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-32 sm:w-40 bg-yellow-400 text-black font-bold text-xl sm:text-2xl rounded-full py-2 shadow-md hover:bg-yellow-500 transition mb-2"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}
        </div>
        <a
          href="http://localhost:5000/api/auth/google"
          className="flex items-center gap-2 border border-black rounded-lg px-4 sm:px-6 py-2 hover:bg-gray-100 transition mb-4 w-full justify-center mt-4"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          <span className="text-base sm:text-lg">Continue with Google</span>
        </a>
        <div className="text-center text-gray-600 text-sm mt-2">
          Have an account?{' '}
          <button className="text-blue-500 hover:underline" onClick={() => {
            onLoginNow && onLoginNow();
            onClose && onClose();
          }}>Log in now</button>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative bg-white rounded-3xl shadow-2xl w-[90vw] max-w-lg p-10 flex flex-col items-center min-h-[350px] animate-fadeIn">
            <div className="flex flex-col items-center justify-center mt-8 mb-6">
              <div className="w-24 h-24 rounded-full bg-[#a385f7] flex items-center justify-center mb-6">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 10 17 4 11" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Ready to Explore !</h2>
              <p className="text-gray-500 text-center text-lg">Your account has been registered<br />successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
