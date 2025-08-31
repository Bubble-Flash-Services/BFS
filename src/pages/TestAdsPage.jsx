import React from 'react';
import DynamicAdvertisementSlider, { CarWashDeals, BikeWashDeals } from '../components/DynamicAdvertisementSlider';

const TestAdsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Advertisement Tests</h1>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Car Wash Advertisements</h2>
          <CarWashDeals className="mb-6" />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Bike Wash Advertisements</h2>
          <BikeWashDeals className="mb-6" />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">General Advertisements</h2>
          <DynamicAdvertisementSlider serviceType="general" className="mb-6" />
        </div>
      </div>
    </div>
  );
};

export default TestAdsPage;
