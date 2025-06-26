import React, { useState } from "react";
import { login, sendOtp, verifyOtp } from '../../../api/auth';
import ForgotPasswordModal from '../../ForgotPasswordModal';

export default function SigninModal({ open, onClose, onSignupNow, onLogin }) {
  const [mode, setMode] = useState('email'); // 'email' or 'mobile'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ email, password });
      setLoading(false);
      if (res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        onLogin && onLogin(res.user);
        window.location.reload();
      } else {
        setError(res.error || 'Login failed');
      }
    } catch (err) {
      setLoading(false);
      setError('Login failed');
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
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        onLogin && onLogin(res.user);
        window.location.reload();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="relative bg-white rounded-3xl shadow-lg w-full max-w-[400px] max-h-screen overflow-y-auto p-6 sm:p-6 flex flex-col items-center justify-center">
        {/* Close button */}
        <button
          className="absolute top-6 right-6 text-2xl text-gray-700 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-wide text-center break-words whitespace-normal w-full max-w-full bg-white z-10">
          <span className="inline-block align-middle w-full overflow-visible">Log in</span>
        </h2>
        <div className="w-3/4 border-t border-black mb-6 sm:mb-8" />
        {/* Toggle */}
        <div className="flex w-full justify-center gap-2 mb-4">
          <button className={`px-4 py-2 rounded-full text-sm font-bold ${mode==='email' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'}`} onClick={()=>{setMode('email');setError('')}}>Email</button>
          <button className={`px-4 py-2 rounded-full text-sm font-bold ${mode==='mobile' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'}`} onClick={()=>{setMode('mobile');setError('')}}>Mobile</button>
        </div>
        {/* Form */}
        {mode === 'email' && (
          <form className="w-full flex flex-col items-center gap-4 sm:gap-8" onSubmit={handleLogin}>
            <div className="w-full">
              <label className="block text-lg sm:text-xl mb-2 text-gray-800 font-serif">Email</label>
              <input
                type="email"
                className="w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-lg sm:text-xl mb-2 text-gray-800 font-serif">Password</label>
              <input
                type="password"
                className="w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-32 sm:w-40 bg-yellow-400 text-black font-bold text-xl sm:text-2xl rounded-full py-2 shadow-md hover:bg-yellow-500 transition mb-2"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <button type="button" className="text-blue-500 hover:underline text-sm" onClick={()=>setShowForgot(true)}>Forgot password?</button>
          </form>
        )}
        {mode === 'mobile' && !otpSent && (
          <form className="w-full flex flex-col items-center gap-4 sm:gap-8" onSubmit={handleSendOtp}>
            <div className="w-full">
              <label className="block text-lg sm:text-xl mb-2 text-gray-800 font-serif">Mobile Number</label>
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
              <label className="block text-lg sm:text-xl mb-2 text-gray-800 font-serif">Enter OTP</label>
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
        <a
          href="http://localhost:5000/api/auth/google"
          className="flex items-center gap-2 border border-black rounded-lg px-4 sm:px-6 py-2 hover:bg-gray-100 transition mb-4 w-full justify-center"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          <span className="text-base sm:text-lg">Continue with Google</span>
        </a>
        <div className="text-center text-gray-600 text-sm mt-2">
          New user?{' '}
          <button className="text-blue-500 hover:underline" onClick={() => {
            onSignupNow && onSignupNow();
            onClose && onClose();
          }}>Sign up now</button>
        </div>
      </div>
      {showForgot && <ForgotPasswordModal onSubmit={async (data) => {
        if (data.email && !data.resetToken) {
          // send reset link
          return await import('../../../api/auth').then(api => api.forgotPassword(data));
        } else if (data.email && data.resetToken && data.password) {
          // reset password
          return await import('../../../api/auth').then(api => api.resetPassword(data));
        }
      }} onClose={()=>setShowForgot(false)} />}
    </div>
  );
}
