import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FullBodyCheckup component
 * Props:
 *  - type: 'car' | 'bike'
 *  - compact: boolean (optional) for slightly tighter spacing
 */
export default function FullBodyCheckup({ type = 'car', compact = false }) {
  const navigate = useNavigate();
  const isCar = type === 'car';
  const sections = isCar ? [
    { title: '1. Exterior', points: 'Paint condition, scratches/dents, windshield & windows, side mirrors' },
    { title: '2. Tyres & Wheels', points: 'Tread depth (visual), air pressure (if gauge), rim condition' },
    { title: '3. Interior', points: 'Dashboard, seats, floor mats, AC vents airflow' },
    { title: '4. Lights', points: 'Headlights, tail lights, indicators, fog lamps' },
    { title: '5. Engine Bay (Visual)', points: 'Oil leak signs, coolant level (top view), battery terminals' },
    { title: '6. Underbody (Glance)', points: 'Visible leak traces, rust / damage areas' }
  ] : [
    { title: '1. Exterior', points: 'Body panels, paint & stickers, headlight & indicators, mirrors' },
    { title: '2. Tyres & Wheels', points: 'Tread depth (visual), tyre pressure (if gauge), wheel rims/alloys' },
    { title: '3. Engine & Mechanical', points: 'Oil leak signs, chain lubrication, brake pads/cables, suspension glance' },
    { title: '4. Electricals', points: 'Headlight brightness, tail / brake light, indicators, horn, battery (visual)' },
    { title: '5. Safety Accessories', points: 'Helmet (if provided), basic first aid kit, basic tool kit presence' }
  ];

  const handleBookNow = () => {
    // Navigate to VehicleCheckupPage and set the vehicle type
    navigate('/vehicle-checkup', { state: { vehicleType: isCar ? 'car' : 'bike' } });
  };

  return (
    <div className={`group relative bg-white rounded-3xl shadow-xl border-2 border-gray-200/70 hover:shadow-2xl transition-all ${compact ? 'p-6' : 'p-8'} overflow-hidden`}>
      <div className={`absolute inset-0 ${isCar ? 'bg-gradient-to-br from-blue-50 to-amber-50' : 'bg-gradient-to-br from-amber-50 to-blue-50'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className="relative z-10">
        <div className="mb-6">
          <h3 className={`text-3xl md:text-4xl font-extrabold ${isCar ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-amber-500' : 'bg-gradient-to-r from-amber-600 via-amber-500 to-blue-600'} bg-clip-text text-transparent mb-3 flex items-center gap-3 drop-shadow-lg`}>
            <span className={`w-12 h-12 rounded-xl ${isCar ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-amber-500 to-amber-600'} text-white flex items-center justify-center font-semibold shadow-lg text-lg`}>{isCar ? '🚗' : '🏍️'}</span>
            Full Body {isCar ? 'Car' : 'Bike'} Checkup
          </h3>
          <p className="text-gray-600 text-base md:text-lg ml-16">Professional inspection service to keep your vehicle in top condition</p>
        </div>
        <ul className="space-y-5 text-sm md:text-base text-gray-700">
          {sections.map((s,i)=>(
            <li key={i}>
              <p className="font-semibold text-gray-900 mb-1">{s.title}</p>
              <p className="text-gray-600">{s.points}</p>
            </li>
          ))}
        </ul>
        <button
          onClick={handleBookNow}
          className={`mt-8 w-full md:w-auto px-8 py-4 ${isCar ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'} text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2`}
        >
          <span>📋</span>
          Book Now
        </button>
        <p className="mt-6 text-xs text-gray-500">Visual only – internally recorded as Good / Needs Attention / Issue. Not a certified mechanical inspection.</p>
      </div>
    </div>
  );
}
