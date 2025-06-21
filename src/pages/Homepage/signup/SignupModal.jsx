import React, { useState } from "react";

export default function SignupModal({ open, onClose, onSignup, onLoginNow }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: email.split('@')[0] })
      });
      const data = await res.json();
      if (data.token && data.user) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.reload();
        }, 2000);
      } else {
        alert(data.message || 'Sign up failed');
      }
    } catch (err) {
      alert('Sign up failed');
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="relative bg-white rounded-3xl shadow-lg w-full max-w-[400px]  max-h-screen overflow-y-auto p-6 sm:p-6 flex flex-col items-center justify-center">
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
          <span className="inline-block align-middle w-full overflow-visible">Sign up</span>
        </h2>
        <div className="w-3/4 border-t border-black mb-6 sm:mb-8" />
        {/* Form */}
        <form className="w-full flex flex-col items-center gap-4 sm:gap-8" onSubmit={handleSignup}>
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
          <div className="w-full">
            <label className="block text-lg sm:text-xl mb-2 text-gray-800 font-serif">Confirm Password</label>
            <input
              type="password"
              className="w-full rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-32 sm:w-40 bg-yellow-400 text-black font-bold text-xl sm:text-2xl rounded-full py-2 shadow-md hover:bg-yellow-500 transition mb-2"
          >
            Sign Up
          </button>
        </form>
        <div className="my-2 text-gray-500">or</div>
        <a
          href="http://localhost:5000/api/auth/google"
          className="flex items-center gap-2 border border-black rounded-lg px-4 sm:px-6 py-2 hover:bg-gray-100 transition mb-4 w-full justify-center"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
          <div className="relative bg-white rounded-3xl shadow-lg w-[500px] max-w-full p-10 flex flex-col items-center min-h-[500px]">
            <div className="flex flex-col items-center justify-center mt-12 mb-8">
              <div className="w-28 h-28 rounded-full bg-[#a385f7] flex items-center justify-center mb-8">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 10 17 4 11" /></svg>
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">Ready to Explore !</h2>
              <p className="text-gray-500 text-center text-lg">Your account password has been registered<br />successfully.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
