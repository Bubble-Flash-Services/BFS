import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal, 
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Truck,
  Shield,
  Package,
  ArrowUp
} from 'lucide-react';
import AccessoryCard from '../../components/AccessoryCard';
import AccessoryFilter from '../../components/AccessoryFilter';
import { useCart } from '../../components/CartContext';
import * as accessoriesApi from '../../api/vehicleAccessories';
import toast from 'react-hot-toast';

const VehicleAccessoriesPage = () => {
  const { getCartItemsCount } = useCart();
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    inStock: '',
    search: '',
    sort: 'popularity',
    page: 1,
    limit: 12
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch accessories when filters change
  useEffect(() => {
    fetchAccessories();
  }, [filters]);

  const fetchAccessories = async () => {
    setLoading(true);
    try {
      const response = await accessoriesApi.getAccessories(filters);
      if (response.success) {
        setAccessories(response.data.accessories);
        setPagination(response.data.pagination);
      } else {
        toast.error('Failed to load accessories');
      }
    } catch (error) {
      console.error('Error fetching accessories:', error);
      toast.error('Failed to load accessories');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sort: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      inStock: '',
      search: '',
      sort: 'popularity',
      page: 1,
      limit: 12
    });
  };

  const handleQuickView = (accessory) => {
    setSelectedAccessory(accessory);
    setShowQuickView(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Vehicle Accessories</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Discover premium accessories for your car and bike. From interior upgrades to maintenance essentials.
          </p>
          
          {/* Benefits Bar */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span className="text-sm">Free Delivery on ₹500+</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Genuine Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span className="text-sm">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search accessories..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* Sort */}
              <select
                value={filters.sort}
                onChange={handleSortChange}
                className="flex-1 lg:flex-none px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>
          </div>

          {/* Active Filters Tags */}
          {(filters.category || filters.minPrice || filters.maxPrice || filters.minRating || filters.inStock) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
                  <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  ₹{filters.minPrice || '0'} - ₹{filters.maxPrice || '∞'}
                  <button onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.minRating && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {filters.minRating}+ Stars
                  <button onClick={() => setFilters(prev => ({ ...prev, minRating: '' }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.inStock && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {filters.inStock === 'true' ? 'In Stock' : 'Out of Stock'}
                  <button onClick={() => setFilters(prev => ({ ...prev, inStock: '' }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4">
              <AccessoryFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {accessories.length} of {pagination.total} products
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-t-xl"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : accessories.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No accessories found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {accessories.map((accessory) => (
                  <AccessoryCard
                    key={accessory._id}
                    accessory={accessory}
                    viewMode={viewMode}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(pagination.pages)].map((_, idx) => {
                  const page = idx + 1;
                  // Show first, last, current, and adjacent pages
                  if (
                    page === 1 ||
                    page === pagination.pages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          page === pagination.page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.page - 2 ||
                    page === pagination.page + 2
                  ) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {showMobileFilter && (
        <AccessoryFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          isMobile={true}
          onClose={() => setShowMobileFilter(false)}
        />
      )}

      {/* Quick View Modal */}
      {showQuickView && selectedAccessory && (
        <QuickViewModal
          accessory={selectedAccessory}
          onClose={() => {
            setShowQuickView(false);
            setSelectedAccessory(null);
          }}
        />
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-40"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

// Quick View Modal Component
const QuickViewModal = ({ accessory, onClose }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    _id,
    name,
    description,
    basePrice,
    discountPrice,
    inStock,
    rating,
    reviewCount,
    images,
    features,
    specifications,
    variants,
    category
  } = accessory;

  const displayPrice = selectedVariant 
    ? basePrice + (selectedVariant.priceModifier || 0)
    : (discountPrice || basePrice);

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error('This item is out of stock');
      return;
    }

    addToCart({
      id: _id,
      serviceId: _id,
      name: selectedVariant ? `${name} - ${selectedVariant.name}` : name,
      price: displayPrice,
      image: images?.[0] || '/car/car1.png',
      img: images?.[0] || '/car/car1.png',
      category: `${category} Accessories`,
      type: 'accessory',
      quantity
    });

    toast.success(`${name} added to cart!`);
    onClose();
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < fullStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={images?.[currentImageIndex] || '/car/car1.png'}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images && images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === idx ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <span className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                {category}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{name}</h3>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">{renderStars()}</div>
                <span className="text-sm text-gray-500">
                  {rating} ({reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-3xl font-bold text-gray-900">₹{displayPrice}</span>
                {discountPrice && discountPrice < basePrice && !selectedVariant && (
                  <span className="text-lg text-gray-400 line-through">₹{basePrice}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-4">{description}</p>

              {/* Variants */}
              {variants && variants.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Options</h4>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(
                          selectedVariant?.name === variant.name ? null : variant
                        )}
                        disabled={!variant.inStock}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          selectedVariant?.name === variant.name
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : variant.inStock
                              ? 'border-gray-300 hover:border-gray-400'
                              : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Quantity</h4>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
                    inStock
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Features */}
              {features && features.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Features</h4>
                  <ul className="space-y-2">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleAccessoriesPage;
