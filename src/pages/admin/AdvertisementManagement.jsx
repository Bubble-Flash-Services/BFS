import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Image, Save, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const AdvertisementManagement = () => {
  const [ads, setAds] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('car');
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'car',
    bgColor: 'from-blue-500 to-purple-600',
    isActive: true
  });

  // Predefined gradient options
  const gradientOptions = [
    { value: 'from-blue-500 to-purple-600', label: 'Blue to Purple', preview: 'bg-gradient-to-r from-blue-500 to-purple-600' },
    { value: 'from-green-500 to-blue-500', label: 'Green to Blue', preview: 'bg-gradient-to-r from-green-500 to-blue-500' },
    { value: 'from-orange-500 to-red-500', label: 'Orange to Red', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'from-yellow-400 to-orange-500', label: 'Yellow to Orange', preview: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { value: 'from-indigo-500 to-purple-600', label: 'Indigo to Purple', preview: 'bg-gradient-to-r from-indigo-500 to-purple-600' },
    { value: 'from-pink-500 to-rose-500', label: 'Pink to Rose', preview: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    { value: 'from-cyan-500 to-blue-500', label: 'Cyan to Blue', preview: 'bg-gradient-to-r from-cyan-500 to-blue-500' }
  ];

  // Mock advertisement data
  useEffect(() => {
    const mockAds = [
      {
        id: 1,
        title: '50% OFF on Premium Packages',
        subtitle: 'Limited Time Offer - Book Now!',
        category: 'car',
        bgColor: 'from-blue-500 to-purple-600',
        isActive: true,
        createdDate: '2025-07-20'
      },
      {
        id: 2,
        title: 'Free Car Mats Cleaning',
        subtitle: 'With Every Exterior Wash Package',
        category: 'car',
        bgColor: 'from-green-500 to-blue-500',
        isActive: true,
        createdDate: '2025-07-18'
      },
      {
        id: 3,
        title: 'Weekend Special Deals',
        subtitle: 'Extra 20% Off on Saturday & Sunday',
        category: 'car',
        bgColor: 'from-orange-500 to-red-500',
        isActive: false,
        createdDate: '2025-07-15'
      },
      {
        id: 4,
        title: 'Bike Wash Starting ₹99',
        subtitle: 'Premium Service at Affordable Prices',
        category: 'bike',
        bgColor: 'from-green-500 to-blue-500',
        isActive: true,
        createdDate: '2025-07-22'
      },
      {
        id: 5,
        title: 'Laundry + Dry Clean Combo',
        subtitle: 'Save 30% on Combined Services',
        category: 'laundry',
        bgColor: 'from-purple-500 to-pink-500',
        isActive: true,
        createdDate: '2025-07-21'
      }
    ];

    setTimeout(() => {
      setAds(mockAds);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAds = ads.filter(ad => ad.category === selectedCategory);

  const handleCreateAd = () => {
    setFormData({
      title: '',
      subtitle: '',
      category: selectedCategory,
      bgColor: 'from-blue-500 to-purple-600',
      isActive: true
    });
    setEditingAd(null);
    setShowCreateModal(true);
  };

  const handleEditAd = (ad) => {
    setFormData({
      title: ad.title,
      subtitle: ad.subtitle,
      category: ad.category,
      bgColor: ad.bgColor,
      isActive: ad.isActive
    });
    setEditingAd(ad);
    setShowCreateModal(true);
  };

  const handleDeleteAd = (adId) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      setAds(ads.filter(ad => ad.id !== adId));
    }
  };

  const handleToggleStatus = (adId) => {
    setAds(ads.map(ad => 
      ad.id === adId ? { ...ad, isActive: !ad.isActive } : ad
    ));
  };

  const handleSaveAd = () => {
    if (!formData.title || !formData.subtitle) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingAd) {
      // Update existing ad
      setAds(ads.map(ad => 
        ad.id === editingAd.id ? { ...editingAd, ...formData } : ad
      ));
    } else {
      // Create new ad
      const newAd = {
        id: Date.now(),
        ...formData,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setAds([...ads, newAd]);
    }

    setShowCreateModal(false);
    setEditingAd(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingAd(null);
    setFormData({
      title: '',
      subtitle: '',
      category: selectedCategory,
      bgColor: 'from-blue-500 to-purple-600',
      isActive: true
    });
  };

  const getCategoryStats = () => {
    const totalAds = filteredAds.length;
    const activeAds = filteredAds.filter(ad => ad.isActive).length;
    const inactiveAds = totalAds - activeAds;
    
    return { totalAds, activeAds, inactiveAds };
  };

  const stats = getCategoryStats();

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advertisement Management</h1>
          <p className="text-gray-600">Create and manage promotional banners for different service categories</p>
        </div>

        {/* Category Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {['car', 'bike', 'laundry'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category} Wash
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📢</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Ads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAds}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Ads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAds}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">⏸️</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Ads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactiveAds}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 capitalize">
            {selectedCategory} Wash Advertisements
          </h2>
          <button
            onClick={handleCreateAd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Advertisement
          </button>
        </div>

        {/* Advertisements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <div key={ad.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Ad Preview */}
              <div className={`h-32 bg-gradient-to-r ${ad.bgColor} flex items-center justify-center text-white relative`}>
                <div className="text-center px-4">
                  <h3 className="font-bold text-lg mb-1">{ad.title}</h3>
                  <p className="text-sm opacity-90">{ad.subtitle}</p>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    ad.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {ad.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Ad Details */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Created: {ad.createdDate}</span>
                  <span className="text-sm text-gray-500 capitalize">{ad.category}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditAd(ad)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Advertisement"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Advertisement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleToggleStatus(ad.id)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                      ad.isActive
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {ad.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredAds.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No advertisements found</div>
              <div className="text-gray-400 mb-4">Create your first advertisement for {selectedCategory} wash</div>
              <button
                onClick={handleCreateAd}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Advertisement
              </button>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-lg font-semibold">
                  {editingAd ? 'Edit Advertisement' : 'Create Advertisement'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6">
                {/* Preview */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className={`h-32 bg-gradient-to-r ${formData.bgColor} rounded-lg flex items-center justify-center text-white`}>
                    <div className="text-center px-4">
                      <h3 className="font-bold text-lg mb-1">
                        {formData.title || 'Your Title Here'}
                      </h3>
                      <p className="text-sm opacity-90">
                        {formData.subtitle || 'Your subtitle here'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter advertisement title"
                  />
                </div>

                {/* Subtitle */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter advertisement subtitle"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="car">Car Wash</option>
                    <option value="bike">Bike Wash</option>
                    <option value="laundry">Laundry</option>
                  </select>
                </div>

                {/* Background Color */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {gradientOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFormData({ ...formData, bgColor: option.value })}
                        className={`relative h-12 rounded-lg ${option.preview} border-2 transition-all ${
                          formData.bgColor === option.value 
                            ? 'border-blue-500 scale-105' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {formData.bgColor === option.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAd}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingAd ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdvertisementManagement;
