import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ServiceCategories() {
  const navigate = useNavigate();
  const categories = [
    {
      name: 'Cars',
      image: '/car/home.png',
      description: 'Professional car washing and detailing',
      route: '/cars',
    },
    {
      name: 'Bikes',
      image: '/bike/home.png',
      description: 'Expert bike cleaning and maintenance',
      route: '/bikes',
    },
    {
      name: 'Laundry',
      image: '/laundry/home.png',
      description: 'Premium laundry and dry cleaning',
      route: '/laundry',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Select by category</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => {
            return (
              <div
                key={category.name}
                className="group cursor-pointer transition-transform hover:scale-105"
                onClick={() => navigate(category.route)}
              >
                <div className="bg-white rounded-2xl overflow-hidden  hover:shadow-xl transition-shadow">
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-contain mx-auto"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}