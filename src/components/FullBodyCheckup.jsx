import React from 'react';

/**
 * FullBodyCheckup component
 * Props:
 *  - type: 'car' | 'bike'
 *  - compact: boolean (optional) for slightly tighter spacing
 */
export default function FullBodyCheckup({ type = 'car', compact = false }) {
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

  return (
    <div className={`group relative bg-white rounded-3xl shadow-lg border border-gray-200/70 hover:shadow-2xl transition-all ${compact ? 'p-6' : 'p-8'} overflow-hidden`}>
      <div className={`absolute inset-0 ${isCar ? 'bg-gradient-to-br from-blue-50 to-amber-50' : 'bg-gradient-to-br from-amber-50 to-blue-50'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className="relative z-10">
        <h3 className={`text-2xl font-bold ${isCar ? 'text-blue-700' : 'text-amber-600'} mb-6 flex items-center gap-3`}>
          <span className={`w-10 h-10 rounded-xl ${isCar ? 'bg-blue-600' : 'bg-amber-500'} text-white flex items-center justify-center font-semibold`}>{isCar ? 'Car' : 'Bike'}</span>
          Full Body {isCar ? 'Car' : 'Bike'} Checkup
        </h3>
        <ul className="space-y-5 text-sm md:text-base text-gray-700">
          {sections.map((s,i)=>(
            <li key={i}>
              <p className="font-semibold text-gray-900 mb-1">{s.title}</p>
              <p className="text-gray-600">{s.points}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-gray-500">Visual only – internally recorded as Good / Needs Attention / Issue. Not a certified mechanical inspection.</p>
      </div>
    </div>
  );
}
