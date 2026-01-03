import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, CheckCircle, Sparkles } from 'lucide-react';

/**
 * FullBodyCheckup component
 * Props:
 *  - type: 'car' | 'bike'
 *  - compact: boolean (optional) for slightly tighter spacing
 *  - teaser: boolean (optional) shows only a brief teaser with "View Details" button
 */
export default function FullBodyCheckup({ type = 'car', compact = false, teaser = false }) {
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

  const handleViewDetails = () => {
    // Navigate to VehicleCheckupPage and set the vehicle type
    navigate('/services/vehicle-checkup', { state: { vehicleType: isCar ? 'car' : 'bike' } });
  };

  // Teaser mode - compact view with just CTA
  if (teaser) {
    return (
      <div className={`group relative bg-gradient-to-br ${isCar ? 'from-blue-600 via-blue-700 to-blue-800' : 'from-amber-500 via-amber-600 to-amber-700'} rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-start gap-6">
            {/* Icon section */}
            <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl ${isCar ? 'bg-white/20' : 'bg-white/20'} backdrop-blur-sm flex items-center justify-center text-4xl md:text-5xl shadow-lg`}>
              {isCar ? '🚗' : '🏍️'}
            </div>
            
            {/* Content section */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">Premium Service</span>
              </div>
              
              <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                BFS Full Body {isCar ? 'Car' : 'Bike'} Checkup
              </h3>
              
              <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
                Comprehensive {isCar ? '50+' : '40+'} point inspection service to ensure your {isCar ? 'car' : 'bike'} stays in perfect condition. Professional mechanics, digital reports, and expert recommendations.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Professional Inspection</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Digital Report</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Expert Advice</span>
                </div>
              </div>
              
              {/* CTA Button */}
              <button
                onClick={handleViewDetails}
                className="group/btn bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 w-full md:w-auto justify-center"
              >
                <span>View Details</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full detailed view (original)
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
          onClick={handleViewDetails}
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
