import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Filter, Star } from 'lucide-react';

const AccessoryFilter = ({ 
  filters, 
  onFilterChange, 
  categories = [],
  subcategories = [],
  onReset,
  isMobile = false,
  onClose 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    availability: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, category, page: 1 });
  };

  const handlePriceChange = (type, value) => {
    onFilterChange({
      ...filters,
      [type]: value,
      page: 1
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? '' : rating,
      page: 1
    });
  };

  const handleAvailabilityChange = (inStock) => {
    onFilterChange({
      ...filters,
      inStock: filters.inStock === inStock ? '' : inStock,
      page: 1
    });
  };

  const priceRanges = [
    { label: 'Under ₹200', min: 0, max: 200 },
    { label: '₹200 - ₹500', min: 200, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: 'Over ₹2,000', min: 2000, max: 99999 }
  ];

  const ratingOptions = [4, 3, 2, 1];

  const categoryLabels = {
    car: 'Car Accessories',
    bike: 'Bike Accessories',
    common: 'Common/Universal'
  };

  const FilterSection = ({ title, expanded, onToggle, children }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {expanded && <div className="mt-3">{children}</div>}
    </div>
  );

  const content = (
    <div className="space-y-0">
      {/* Category Filter */}
      <FilterSection
        title="Category"
        expanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.category || filters.category === 'all'}
              onChange={() => handleCategoryChange('all')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">All Categories</span>
          </label>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === value}
                onChange={() => handleCategoryChange(value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Price Range"
        expanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-3">
          {/* Price Range Buttons */}
          <div className="space-y-2">
            {priceRanges.map((range, idx) => {
              const isSelected = 
                filters.minPrice === range.min.toString() && 
                filters.maxPrice === range.max.toString();
              
              return (
                <label key={idx} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      if (isSelected) {
                        handlePriceChange('minPrice', '');
                        handlePriceChange('maxPrice', '');
                      } else {
                        onFilterChange({
                          ...filters,
                          minPrice: range.min.toString(),
                          maxPrice: range.max.toString(),
                          page: 1
                        });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              );
            })}
          </div>

          {/* Custom Price Range */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Custom Range</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection
        title="Customer Rating"
        expanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        <div className="space-y-2">
          {ratingOptions.map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating.toString()}
                onChange={() => handleRatingChange(rating.toString())}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-700 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability Filter */}
      <FilterSection
        title="Availability"
        expanded={expandedSections.availability}
        onToggle={() => toggleSection('availability')}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock === 'true'}
              onChange={() => handleAvailabilityChange('true')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock === 'false'}
              onChange={() => handleAvailabilityChange('false')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Out of Stock</span>
          </label>
        </div>
      </FilterSection>

      {/* Reset Button */}
      <div className="pt-4">
        <button
          onClick={onReset}
          className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
        <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-4">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
        <Filter className="w-5 h-5 text-gray-600" />
        <h2 className="font-semibold text-gray-900">Filters</h2>
      </div>
      {content}
    </div>
  );
};

export default AccessoryFilter;
