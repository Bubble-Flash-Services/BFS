import React, { useState } from 'react';
import { Calendar, Phone, MapPin, ChevronDown } from 'lucide-react';
import { TextGenerateEffect } from './ui/text-generate-effect';
import { SparklesText } from './ui/sparkles-text';

export default function HeroSection() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const categories = ['Car Wash', 'Bike Wash', 'Laundry Service'];
  const locations = ['Bengaluru', 'Chennai',];

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-6 leading-tight">
              Professional Cleaning Services for Cars, Bikes & More
            </h1>
            <SparklesText
              text="Experience top-tier car wash, bike detailing, and laundry care – all under one roof in Bengaluru."
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            />
            
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Book your Service</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select category
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a service</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Calendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Phone className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select location</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3 flex items-center gap-2">
                      <MapPin className="text-gray-400" size={16} />
                      <ChevronDown className="text-gray-400" size={20} />
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors mt-6">
                  Book now
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-blue-50 rounded-2xl p-8 max-w-md">
              <div className="text-4xl mb-4">💙</div>
              <TextGenerateEffect
                words={`Really impressed with the car wash service at Bubble Flash Car Wash! The team was professional, friendly, and detailed in their work. My car looked spotless afterward.`}
                className="text-gray-600 italic leading-relaxed"
                duration={2}
                filter={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}