import React from 'react';
import { Phone } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-500 capitalize">bubble flash</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">
              About us
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium transition-colors">
              Services
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium transition-colors flex items-center gap-1">
              <Phone size={16} />
              Contact
            </a>
          </nav>
          
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium transition-colors">
            sign up
          </button>
        </div>
      </div>
    </header>
  );
}