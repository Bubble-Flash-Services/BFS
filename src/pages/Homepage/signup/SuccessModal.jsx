import React from "react";

export default function SuccessModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="relative bg-white rounded-3xl shadow-lg w-[500px] max-w-full p-10 flex flex-col items-center min-h-[500px]">
        <button
          className="absolute top-6 right-6 text-2xl text-gray-700 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center justify-center mt-12 mb-8">
          <div className="w-28 h-28 rounded-full bg-[#a385f7] flex items-center justify-center mb-8">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 10 17 4 11" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">
            Ready to Explore !
          </h2>
          <p className="text-gray-500 text-center text-lg">
            Your account password has been registered
            <br />
            successfully.
          </p>
        </div>
      </div>
    </div>
  );
}
