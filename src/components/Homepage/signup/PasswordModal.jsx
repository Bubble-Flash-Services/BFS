import React from "react";

export default function PasswordModal({ open, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="relative bg-white rounded-3xl shadow-lg w-[450px] max-w-full p-10 flex flex-col items-center">
        <button
          className="absolute top-6 right-6 text-2xl text-gray-700 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-2 tracking-wide text-center">Sign up</h2>
        <div className="w-3/4 border-t border-black mb-8" />
        <form className="w-full flex flex-col items-center gap-8" onSubmit={e => { e.preventDefault(); onSubmit && onSubmit(); }}>
          <div className="w-full">
            <label className="block text-xl mb-2 text-gray-500 font-serif">New password</label>
            <input
              type="password"
              className="w-full rounded-2xl px-6 py-4 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder=""
            />
          </div>
          <div className="w-full">
            <label className="block text-xl mb-2 text-gray-500 font-serif">Confirm password</label>
            <input
              type="password"
              className="w-full rounded-2xl px-6 py-4 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder=""
            />
          </div>
          <button
            type="submit"
            className="w-40 bg-yellow-400 text-black font-bold text-2xl rounded-full py-2 shadow-md hover:bg-yellow-500 transition mb-2"
          >
            Submit
          </button>
        </form>
        <div className="mt-8 text-center text-gray-600 text-sm">
          By continuing you accept our <a href="#" className="text-green-700 underline">Terms of Service</a>.<br />
          Also learn how we process your data in our <a href="#" className="text-green-700 underline">Privacy Policy</a> and <a href="#" className="text-green-700 underline">Cookies policy</a>.
        </div>
      </div>
    </div>
  );
}
