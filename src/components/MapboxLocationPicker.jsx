import React, { useState, useEffect, useCallback, useRef } from "react";
import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl";
import { MapPin, Search, Loader, X } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxLocationPicker = ({
  value,
  onChange,
  onSelect,
  placeholder = "Search or select location on map",
  className = "",
  initialCoords = null,
}) => {
  const [searchQuery, setSearchQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(
    initialCoords || { latitude: 12.9716, longitude: 77.5946 } // Bangalore default
  );
  const [viewport, setViewport] = useState({
    latitude: initialCoords?.latitude || 12.9716,
    longitude: initialCoords?.longitude || 77.5946,
    zoom: initialCoords ? 15 : 12,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const searchTimeoutRef = useRef();

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(
    async (lat, lng) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
        );

        if (!response.ok) {
          console.error(
            "Reverse geocoding API request failed:",
            response.status
          );
          return;
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const place = data.features[0];
          const address = place.place_name;

          // Extract city and pincode
          let city = "";
          let pincode = "";

          place.context?.forEach((item) => {
            if (item.id.includes("place")) city = item.text;
            if (item.id.includes("postcode")) pincode = item.text;
          });

          setSearchQuery(address);
          if (onChange) onChange(address);

          if (onSelect) {
            onSelect({
              fullAddress: address,
              latitude: lat,
              longitude: lng,
              city: city,
              pincode: pincode,
            });
          }
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
      }
    },
    [onChange, onSelect]
  );

  // Search for places using Mapbox Geocoding API
  const searchPlaces = useCallback(async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_TOKEN}&country=IN&limit=5&autocomplete=true`
      );

      if (!response.ok) {
        console.error("Geocoding API request failed:", response.status);
        setSuggestions([]);
        return;
      }

      const data = await response.json();

      if (data.features) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onChange) onChange(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(query);
    }, 300);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const [lng, lat] = suggestion.center;
    const address = suggestion.place_name;

    // Extract city and pincode
    let city = "";
    let pincode = "";

    suggestion.context?.forEach((item) => {
      if (item.id.includes("place")) city = item.text;
      if (item.id.includes("postcode")) pincode = item.text;
    });

    setSearchQuery(address);
    setMarkerPosition({ latitude: lat, longitude: lng });
    setViewport({ latitude: lat, longitude: lng, zoom: 15 });
    setShowSuggestions(false);
    setSuggestions([]);

    if (onChange) onChange(address);

    if (onSelect) {
      onSelect({
        fullAddress: address,
        latitude: lat,
        longitude: lng,
        city: city,
        pincode: pincode,
      });
    }

    setShowMap(true);
  };

  // Handle marker drag
  const handleMarkerDragEnd = useCallback(
    (event) => {
      const { lngLat } = event;
      const newPosition = {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      };
      setMarkerPosition(newPosition);
      setIsDragging(false);
      reverseGeocode(lngLat.lat, lngLat.lng);
    },
    [reverseGeocode]
  );

  // Handle map click
  const handleMapClick = useCallback(
    (event) => {
      const { lngLat } = event;
      const newPosition = {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      };
      setMarkerPosition(newPosition);
      reverseGeocode(lngLat.lat, lngLat.lng);
    },
    [reverseGeocode]
  );

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* Error message if no Mapbox token */}
      {!MAPBOX_TOKEN && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Mapbox token not configured.</strong> Please add
                VITE_MAPBOX_ACCESS_TOKEN to your environment variables.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowMap(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {isLoading && (
            <Loader className="h-5 w-5 text-gray-400 animate-spin mr-2" />
          )}

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                if (onChange) onChange("");
                setShowSuggestions(false);
                setSuggestions([]);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mb-2 mt-2">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.place_name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {suggestion.place_type?.[0]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Map */}
      {showMap && MAPBOX_TOKEN && (
        <div className="mt-2 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
          <div className="h-80 w-full relative">
            <Map
              {...viewport}
              onMove={(evt) => setViewport(evt.viewState)}
              onClick={handleMapClick}
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/streets-v12"
            >
              <NavigationControl position="top-right" />
              <GeolocateControl
                position="top-right"
                trackUserLocation
                onGeolocate={(e) => {
                  const newPosition = {
                    latitude: e.coords.latitude,
                    longitude: e.coords.longitude,
                  };
                  setMarkerPosition(newPosition);
                  setViewport({ ...newPosition, zoom: 15 });
                  reverseGeocode(e.coords.latitude, e.coords.longitude);
                }}
                onError={(error) => {
                  console.error("Geolocation error:", error);
                  // User-friendly error messages are handled by the GeolocateControl itself
                }}
              />

              <Marker
                latitude={markerPosition.latitude}
                longitude={markerPosition.longitude}
                draggable
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleMarkerDragEnd}
              >
                <div
                  className={`cursor-move transition-transform ${
                    isDragging ? "scale-125" : ""
                  }`}
                  title="Drag to adjust location"
                >
                  <MapPin
                    className="w-10 h-10 text-red-500 drop-shadow-lg"
                    fill="currentColor"
                  />
                </div>
              </Marker>
            </Map>
          </div>

          <div className="bg-blue-50 px-4 py-3 border-t border-blue-200">
            <p className="text-sm text-blue-800 flex items-center">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <strong className="mr-1">Tip:</strong> Click on the map or drag
              the pin to select your exact location
            </p>
          </div>
        </div>
      )}

      {!showMap && MAPBOX_TOKEN && (
        <button
          type="button"
          onClick={() => setShowMap(true)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          <MapPin className="w-4 h-4 mr-1" />
          Show map to select location
        </button>
      )}
    </div>
  );
};

export default MapboxLocationPicker;
