import React, { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import { MapPin, Search, X, Loader, Navigation, AlertCircle } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox token - REQUIRED: Set VITE_MAPBOX_TOKEN environment variable
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.error('VITE_MAPBOX_TOKEN is not set. Please add it to your .env file.');
}

const MapboxLocationPicker = ({ 
  onLocationSelect,
  initialLocation = { latitude: 12.9716, longitude: 77.5946 }, // Bangalore default
  className = "",
  showCurrentLocation = true
}) => {
  const [viewport, setViewport] = useState({
    longitude: initialLocation.longitude,
    latitude: initialLocation.latitude,
    zoom: 13
  });
  
  const [marker, setMarker] = useState({
    longitude: initialLocation.longitude,
    latitude: initialLocation.latitude
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [error, setError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const mapRef = useRef();
  const searchTimeoutRef = useRef();

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lng, lat) => {
    try {
      setIsLoadingAddress(true);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=address,place,locality,neighborhood`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const address = feature.place_name;
        setSelectedAddress(address);
        
        // Extract address components
        const context = feature.context || [];
        let city = '', state = '', pincode = '';
        
        // Extract from feature properties
        if (feature.place_type.includes('address') || feature.place_type.includes('place')) {
          context.forEach(item => {
            if (item.id.includes('place')) {
              city = item.text;
            } else if (item.id.includes('region')) {
              state = item.text;
            } else if (item.id.includes('postcode')) {
              pincode = item.text;
            }
          });
        }
        
        // If city not found, try from place_name
        if (!city && feature.place_type.includes('place')) {
          city = feature.text;
        }
        
        return {
          fullAddress: address,
          latitude: lat,
          longitude: lng,
          city: city || '',
          state: state || '',
          pincode: pincode || ''
        };
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Search for places
  const searchPlaces = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=IN&limit=5&types=address,place,locality,neighborhood`
      );
      const data = await response.json();
      
      if (data.features) {
        setSearchResults(data.features);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(query);
    }, 300);
  };

  // Handle search result selection
  const handleSearchResultClick = async (result) => {
    const [lng, lat] = result.center;
    
    setMarker({ longitude: lng, latitude: lat });
    setViewport({
      longitude: lng,
      latitude: lat,
      zoom: 15
    });
    
    setSearchQuery(result.place_name);
    setShowSearchResults(false);
    
    // Get detailed address and notify parent
    const addressData = await reverseGeocode(lng, lat);
    if (addressData && onLocationSelect) {
      onLocationSelect(addressData);
    }
  };

  // Handle map click to place marker
  const handleMapClick = useCallback(async (event) => {
    const { lng, lat } = event.lngLat;
    
    setMarker({ longitude: lng, latitude: lat });
    
    // Get address for the clicked location
    const addressData = await reverseGeocode(lng, lat);
    if (addressData && onLocationSelect) {
      onLocationSelect(addressData);
    }
  }, [onLocationSelect]);

  // Handle marker drag
  const handleMarkerDrag = useCallback((event) => {
    const { lng, lat } = event.lngLat;
    setMarker({ longitude: lng, latitude: lat });
  }, []);

  // Handle marker drag end
  const handleMarkerDragEnd = useCallback(async (event) => {
    const { lng, lat } = event.lngLat;
    
    // Get address for the new location
    const addressData = await reverseGeocode(lng, lat);
    if (addressData && onLocationSelect) {
      onLocationSelect(addressData);
    }
  }, [onLocationSelect]);

  // Handle current location button
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          setMarker({ longitude, latitude });
          setViewport({
            longitude,
            latitude,
            zoom: 15
          });
          
          // Get address and notify parent
          const addressData = await reverseGeocode(longitude, latitude);
          if (addressData && onLocationSelect) {
            onLocationSelect(addressData);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enable location permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Initial address load
  useEffect(() => {
    reverseGeocode(marker.longitude, marker.latitude);
  }, []);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="ml-auto p-1 hover:bg-red-100 rounded"
          >
            <X className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a location..."
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {isSearching && (
            <Loader className="h-5 w-5 text-gray-400 animate-spin mr-2" />
          )}
          
          <button
            type="button"
            onClick={handleCurrentLocation}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
            title="Use current location"
          >
            <Navigation className="h-5 w-5" />
          </button>
          
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowSearchResults(false);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                onClick={() => handleSearchResultClick(result)}
              >
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {result.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {result.place_name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
        <Map
          ref={mapRef}
          {...viewport}
          onMove={evt => setViewport(evt.viewState)}
          onClick={handleMapClick}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '400px' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          <NavigationControl position="top-right" />
          
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            draggable
            onDrag={handleMarkerDrag}
            onDragEnd={handleMarkerDragEnd}
          >
            <div className="relative">
              <MapPin className="h-10 w-10 text-red-500 fill-red-500 drop-shadow-lg" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-black/20 rounded-full blur-sm" />
            </div>
          </Marker>
        </Map>

        {/* Loading Overlay */}
        {isLoadingAddress && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="bg-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
              <Loader className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="text-gray-700 font-medium">Getting address...</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 mb-1">Selected Location</p>
              <p className="text-sm text-gray-700">{selectedAddress}</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          💡 <strong>Tip:</strong> Click on the map or drag the marker to select your exact location
        </p>
      </div>
    </div>
  );
};

export default MapboxLocationPicker;
