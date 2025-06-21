import React, { useState, useEffect } from 'react';
import { Calendar, Phone, MapPin, ChevronDown } from 'lucide-react';
import { TextGenerateEffect } from '../../components/ui/text-generate-effect';
import { SparklesText } from '../../components/ui/sparkles-text';
import MegaWinHeading from '../../components/ui/MegaWinHeading';

export default function HeroSection() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          if (data.display_name) {
            setFullAddress(data.display_name);
            setSelectedLocation(data.display_name);
          } else if (data.address) {
            const { house_number, road, suburb, city, town, village, state, postcode, country } = data.address;
            const address = [house_number, road, suburb, city || town || village, state, postcode, country].filter(Boolean).join(', ');
            setFullAddress(address);
            setSelectedLocation(address);
          }
        } catch (e) {
          // fallback or ignore
        }
      });
    }
  }, []);

  const categories = ['Car Wash', 'Bike Wash', 'Laundry Service'];
  const locations = [fullAddress || 'Bengaluru, India', 'Chennai, India'];

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MegaWinHeading className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight text-center">
          Professional Cleaning Services for Cars, Bikes & More
        </MegaWinHeading>
        <SparklesText
          text="Experience top-tier car wash, bike detailing, and laundry care – all under one roof in Bengaluru."
          className="text-xl text-gray-600 mb-8 leading-relaxed text-center"
        />
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
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
                        onChange={e => setPickupDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
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
                    <input
                      type="text"
                      value={fullAddress}
                      onChange={e => { setFullAddress(e.target.value); setSelectedLocation(e.target.value); }}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detecting your address..."
                    />
                    <MapPin className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>
                </div>
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-6 rounded-lg font-medium transition-colors mt-6">
                  Book now
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:mb-36 md:mb-0">
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