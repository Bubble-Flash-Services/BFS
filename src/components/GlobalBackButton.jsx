import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function GlobalBackButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Hide on home page only
  if (path === '/') return null;

  const isAdmin = path.startsWith('/admin');
  const isEmployee = path.startsWith('/employee');
  // Header is hidden on admin/employee routes already.
  const topOffsetClass = (!isAdmin && !isEmployee) ? 'top-20' : 'top-4';

  const handleBack = () => {
    // If there's meaningful history inside the app, go back; else fallback home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className={`fixed ${topOffsetClass} left-3 z-[60] group rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-lg p-2 flex items-center justify-center hover:bg-white transition-colors`}
    >
      <ArrowLeft size={22} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
    </button>
  );
}
