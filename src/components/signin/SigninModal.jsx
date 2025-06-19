import React from "react";

export default function SigninModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="relative bg-white rounded-3xl shadow-lg w-[400px] max-w-full p-10 flex flex-col items-center">
        <button
          className="absolute top-6 right-6 text-2xl text-gray-700 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-6 tracking-wide text-center">Sign in</h2>
        <form className="w-full flex flex-col items-center gap-8">
          <div className="w-full">
            <label className="block text-xl mb-2 text-gray-800 font-serif">Username or Phone Number</label>
            <input
              type="text"
              className="w-full rounded-2xl px-6 py-4 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter username or phone number"
            />
          </div>
          <div className="w-full">
            <label className="block text-xl mb-2 text-gray-800 font-serif">Password</label>
            <input
              type="password"
              className="w-full rounded-2xl px-6 py-4 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-40 bg-blue-400 text-white font-bold text-2xl rounded-full py-2 shadow-md hover:bg-blue-500 transition mb-2"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
