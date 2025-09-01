import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ComingSoon({ title = 'Coming Soon', message = 'This service will be available shortly.' }) {
  const navigate = useNavigate();
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-16">
      <div className="max-w-xl w-full bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
          <span className="text-3xl">🧺</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Go to Home
        </button>
      </div>
    </section>
  );
}
