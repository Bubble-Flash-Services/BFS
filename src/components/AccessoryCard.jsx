import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Eye, Package, Check } from 'lucide-react';
import { useCart } from './CartContext';
import toast from 'react-hot-toast';

const AccessoryCard = ({ accessory, onQuickView, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    _id,
    name,
    shortDescription,
    description,
    basePrice,
    discountPrice,
    inStock,
    rating,
    reviewCount,
    images,
    category,
    isNew,
    isOnSale,
    isFeatured
  } = accessory;

  const displayPrice = discountPrice || basePrice;
  const hasDiscount = discountPrice && discountPrice < basePrice;
  const discountPercent = hasDiscount 
    ? Math.round(((basePrice - discountPrice) / basePrice) * 100) 
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock) {
      toast.error('This item is out of stock');
      return;
    }
    
    addToCart({
      id: _id,
      serviceId: _id,
      name,
      price: displayPrice,
      image: images?.[0] || '/car/car1.png',
      img: images?.[0] || '/car/car1.png',
      category: `${category} Accessories`,
      type: 'accessory',
      quantity: 1
    });
    
    toast.success(`${name} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(accessory);
    }
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const fallbackImage = '/car/car1.png';
  const imageUrl = imageError ? fallbackImage : (images?.[0] || fallbackImage);

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={() => setImageError(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                NEW
              </span>
            )}
            {isOnSale && hasDiscount && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                -{discountPercent}%
              </span>
            )}
            {!inStock && (
              <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded">
                OUT OF STOCK
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full shadow-md transition-colors ${
                isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
              {category}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mt-1 hover:text-blue-600 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {shortDescription || description}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              {renderStars()}
              <span className="text-sm text-gray-500 ml-1">
                ({reviewCount})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{displayPrice}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{basePrice}
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={() => setImageError(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
              NEW
            </span>
          )}
          {isOnSale && hasDiscount && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
              -{discountPercent}%
            </span>
          )}
          {!inStock && (
            <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleQuickView}
            className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button (shows on hover) */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
              inStock
                ? 'bg-white text-gray-900 hover:bg-blue-600 hover:text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
          {category}
        </span>
        <h3 className="text-base font-semibold text-gray-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {renderStars()}
          <span className="text-xs text-gray-500 ml-1">
            ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{displayPrice}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{basePrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-1 mt-2">
          {inStock ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600">In Stock</span>
            </>
          ) : (
            <>
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Out of Stock</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessoryCard;
