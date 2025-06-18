import React, { useState } from "react";

export default function OtpModal({ open, onClose, onVerify }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  if (!open) return null;

  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) {
      document.getElementById(`otp-input-${idx + 1}`)?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="relative bg-white rounded-3xl shadow-lg w-[550px] max-w-full p-10 flex flex-col items-center">
        <button
          className="absolute top-6 right-6 text-2xl text-gray-700 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-3xl font-serif font-normal mb-8 mt-4 text-center">Enter OTP</h2>
        <div className="flex gap-4 mb-6">
          {otp.map((val, idx) => (
            <input
              key={idx}
              id={`otp-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={e => handleOtpChange(e, idx)}
              className="w-14 h-14 rounded-lg border border-gray-300 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoFocus={idx === 0}
            />
          ))}
        </div>
        <div className="text-gray-600 text-center mb-2">
          A message with a verification code has been sent to your mobile no. please enter the code to continue.
        </div>
        <div className="text-gray-400 text-center mb-6">
          Didn't receive code? <button className="text-blue-600 font-semibold hover:underline">Resend</button>
        </div>
        <button
          className="w-40 bg-yellow-400 text-black font-bold text-xl rounded-full py-2 shadow-md hover:bg-yellow-500 transition"
          onClick={onVerify}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
