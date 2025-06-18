import React from 'react';

const bikeCategories = [
  {
    name: 'Commuter Bikes',
    image: '/bike/bike1.png',
  },
  {
    name: 'Sports Bikes',
    image: '/bike/bike2.png',
  },
  {
    name: 'Cruiser Bikes',
    image: '/bike/bike3.png',
  },
];

export default function BikesPage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Select by bikes</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {bikeCategories.map((cat) => (
            <div key={cat.name} className="text-center">
              <img src={cat.image} alt={cat.name} className="w-full h-48 object-contain mx-auto" />
              <h3 className="text-xl font-semibold text-gray-800 mt-4">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}