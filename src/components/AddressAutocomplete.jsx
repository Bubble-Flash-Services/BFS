import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Target, Loader } from 'lucide-react';
import { addressAPI } from '../api/address';

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  onSelect, 
  placeholder = "Enter your address",
  className = "",
  showCurrentLocation = true,
  debounceMs = 300
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const inputRef = useRef();
  const suggestionsRef = useRef();
  const timeoutRef = useRef();

  // Debounced search function
  const debouncedSearch = (query) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(async () => {
      if (query.length >= 3) {
        setIsLoading(true);
        try {
          const result = await addressAPI.getAddressSuggestions(query);
          if (result.success) {
            setSuggestions(result.data);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error('Address search error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, debounceMs);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
    debouncedSearch(newValue);
    setSelectedIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    if (onChange) {
      onChange(suggestion.display_name);
    }
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    
    if (onSelect) {
      onSelect({
        fullAddress: suggestion.display_name,
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
        city: suggestion.city,
        state: suggestion.state,
        pincode: suggestion.pincode
      });
    }
  };

  // Handle current location
  const handleCurrentLocation = async () => {
    if (!showCurrentLocation) return;
    
    setIsGettingLocation(true);
    try {
      const result = await addressAPI.getCurrentAddress();
      if (result.success) {
        if (onChange) {
          onChange(result.data.fullAddress);
        }
        setShowSuggestions(false);
        setSuggestions([]);
        
        if (onSelect) {
          onSelect(result.data);
        }
      } else {
        alert(result.message || 'Unable to get current location');
      }
    } catch (error) {
      console.error('Current location error:', error);
      alert('Failed to get current location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 3 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {isLoading && (
            <Loader className="h-5 w-5 text-gray-400 animate-spin mr-2" />
          )}
          
          {showCurrentLocation && (
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={isGettingLocation}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
              title="Use current location"
            >
              {isGettingLocation ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Target className="h-5 w-5" />
              )}
            </button>
          )}
          
          {value && (
            <button
              type="button"
              onClick={() => {
                if (onChange) {
                  onChange('');
                }
                setShowSuggestions(false);
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id || index}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {suggestion.display_name}
                  </div>
                  {(suggestion.city || suggestion.state) && (
                    <div className="text-xs text-gray-500 mt-1">
                      {[suggestion.city, suggestion.state].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No suggestions message */}
      {showSuggestions && suggestions.length === 0 && !isLoading && value.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-sm">
            No addresses found for "{value}"
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
