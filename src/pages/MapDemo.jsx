import React, { useState } from 'react';
import MapboxLocationPicker from '../components/MapboxLocationPicker';

export default function MapDemo() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (locationData) => {
    console.log('Location selected:', locationData);
    setSelectedLocation(locationData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            📍 Mapbox Location Picker Demo
          </h1>
          <p className="text-gray-600 text-lg">
            Interactive map with drag-and-drop marker for precise location selection
          </p>
        </div>

        {/* Map Component */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <MapboxLocationPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={{ latitude: 12.9716, longitude: 77.5946 }} // Bangalore
          />
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>✅</span> Selected Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">Full Address</p>
                <p className="text-gray-900 font-medium">{selectedLocation.fullAddress}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">Coordinates</p>
                <p className="text-gray-900 font-medium">
                  {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">City</p>
                <p className="text-gray-900 font-medium">{selectedLocation.city || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">State</p>
                <p className="text-gray-900 font-medium">{selectedLocation.state || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">Pincode</p>
                <p className="text-gray-900 font-medium">{selectedLocation.pincode || 'N/A'}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">Data Format</p>
                <p className="text-gray-900 font-medium text-xs">JSON</p>
              </div>
            </div>
            
            {/* JSON Display */}
            <div className="mt-6 bg-gray-900 rounded-xl p-6">
              <p className="text-sm font-semibold text-gray-300 mb-3">JSON Response</p>
              <pre className="text-green-400 text-xs overflow-x-auto">
                {JSON.stringify(selectedLocation, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">🖱️</div>
            <h3 className="font-bold text-gray-800 mb-2">Click to Place</h3>
            <p className="text-sm text-gray-600">Click anywhere on the map to set your location</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-800 mb-2">Drag & Drop</h3>
            <p className="text-sm text-gray-600">Drag the marker to adjust your precise location</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-gray-800 mb-2">Search Places</h3>
            <p className="text-sm text-gray-600">Search for addresses or use your current location</p>
          </div>
        </div>
      </div>
    </div>
  );
}
