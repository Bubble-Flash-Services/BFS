import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Eye, Save, X, Percent, Calendar } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    usedCount: 0,
    validFrom: '',
    validUntil: '',
    isActive: true,
    categories: []
  });

  // Mock coupon data
  useEffect(() => {
    const mockCoupons = [
      {
        id: 1,
        code: 'FIRST50',
        title: 'First Time User Discount',
        description: 'Get 50% off on your first car wash',
        discountType: 'percentage',
        discountValue: 50,
        minOrderAmount: 199,
        maxDiscountAmount: 500,
        usageLimit: 100,
        usedCount: 23,
        validFrom: '2025-07-01',
        validUntil: '2025-12-31',
        isActive: true,
        categories: ['car'],
        createdDate: '2025-07-01'
      },
      {
        id: 2,
        code: 'BIKE20',
        title: 'Bike Wash Special',
        description: '₹20 off on bike wash services',
        discountType: 'fixed',
        discountValue: 20,
        minOrderAmount: 100,
        maxDiscountAmount: 20,
        usageLimit: 200,
        usedCount: 45,
        validFrom: '2025-07-15',
        validUntil: '2025-08-15',
        isActive: true,
        categories: ['bike'],
        createdDate: '2025-07-15'
      },
      {
        id: 3,
        code: 'LAUNDRY100',
        title: 'Laundry Weekend Deal',
        description: '₹100 off on laundry services',
        discountType: 'fixed',
        discountValue: 100,
        minOrderAmount: 500,
        maxDiscountAmount: 100,
        usageLimit: 50,
        usedCount: 12,
        validFrom: '2025-07-20',
        validUntil: '2025-07-31',
        isActive: true,
        categories: ['laundry'],
        createdDate: '2025-07-20'
      },
      {
        id: 4,
        code: 'EXPIRED10',
        title: 'Old Offer',
        description: '10% off on all services',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 200,
        maxDiscountAmount: 200,
        usageLimit: 100,
        usedCount: 100,
        validFrom: '2025-06-01',
        validUntil: '2025-06-30',
        isActive: false,
        categories: ['car', 'bike', 'laundry'],
        createdDate: '2025-06-01'
      }
    ];

    setTimeout(() => {
      setCoupons(mockCoupons);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateCoupon = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      usedCount: 0,
      validFrom: '',
      validUntil: '',
      isActive: true,
      categories: []
    });
    setEditingCoupon(null);
    setShowCreateModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setFormData({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount.toString(),
      maxDiscountAmount: coupon.maxDiscountAmount.toString(),
      usageLimit: coupon.usageLimit.toString(),
      usedCount: coupon.usedCount,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      isActive: coupon.isActive,
      categories: coupon.categories
    });
    setEditingCoupon(coupon);
    setShowCreateModal(true);
  };

  const handleDeleteCoupon = (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(coupon => coupon.id !== couponId));
    }
  };

  const handleToggleStatus = (couponId) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === couponId ? { ...coupon, isActive: !coupon.isActive } : coupon
    ));
  };

  const handleCopyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Coupon code copied to clipboard!');
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSaveCoupon = () => {
    if (!formData.code || !formData.title || !formData.discountValue) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingCoupon) {
      // Update existing coupon
      setCoupons(coupons.map(coupon => 
        coupon.id === editingCoupon.id ? { 
          ...editingCoupon, 
          ...formData,
          discountValue: parseFloat(formData.discountValue),
          minOrderAmount: parseFloat(formData.minOrderAmount),
          maxDiscountAmount: parseFloat(formData.maxDiscountAmount),
          usageLimit: parseInt(formData.usageLimit)
        } : coupon
      ));
    } else {
      // Create new coupon
      const newCoupon = {
        id: Date.now(),
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: parseFloat(formData.minOrderAmount),
        maxDiscountAmount: parseFloat(formData.maxDiscountAmount),
        usageLimit: parseInt(formData.usageLimit),
        createdDate: new Date().toISOString().split('T')[0]
      };
      setCoupons([...coupons, newCoupon]);
    }

    setShowCreateModal(false);
    setEditingCoupon(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingCoupon(null);
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];
    
    setFormData({ ...formData, categories: updatedCategories });
  };

  const getStatusColor = (coupon) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (!coupon.isActive) {
      return 'bg-gray-100 text-gray-800';
    }
    
    if (coupon.validUntil < today) {
      return 'bg-red-100 text-red-800';
    }
    
    if (coupon.usedCount >= coupon.usageLimit) {
      return 'bg-orange-100 text-orange-800';
    }
    
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (coupon) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (!coupon.isActive) {
      return 'Inactive';
    }
    
    if (coupon.validUntil < today) {
      return 'Expired';
    }
    
    if (coupon.usedCount >= coupon.usageLimit) {
      return 'Used Up';
    }
    
    return 'Active';
  };

  const getUsagePercentage = (coupon) => {
    return Math.round((coupon.usedCount / coupon.usageLimit) * 100);
  };

  const getCouponStats = () => {
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(c => {
      const today = new Date().toISOString().split('T')[0];
      return c.isActive && c.validUntil >= today && c.usedCount < c.usageLimit;
    }).length;
    const expiredCoupons = coupons.filter(c => {
      const today = new Date().toISOString().split('T')[0];
      return c.validUntil < today;
    }).length;
    const totalUsage = coupons.reduce((sum, coupon) => sum + coupon.usedCount, 0);

    return { totalCoupons, activeCoupons, expiredCoupons, totalUsage };
  };

  const stats = getCouponStats();

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
          <p className="text-gray-600">Create and manage discount coupons for your services</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">🎫</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Coupons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCoupons}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Coupons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCoupons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">⏰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expiredCoupons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Coupons</h2>
          <button
            onClick={handleCreateCoupon}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Coupon
          </button>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Coupon Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{coupon.title}</h3>
                    <p className="text-sm opacity-90">{coupon.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(coupon)}`}>
                    {getStatusText(coupon)}
                  </span>
                </div>
                
                {/* Coupon Code */}
                <div className="flex items-center justify-between bg-white bg-opacity-20 rounded-lg p-2 mt-3">
                  <span className="font-mono font-bold text-lg">{coupon.code}</span>
                  <button
                    onClick={() => handleCopyCouponCode(coupon.code)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Copy Code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Coupon Details */}
              <div className="p-4">
                {/* Discount Info */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Discount</span>
                    <span className="font-semibold">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}%` 
                        : `₹${coupon.discountValue}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Min Order</span>
                    <span className="font-semibold">₹{coupon.minOrderAmount}</span>
                  </div>
                  
                  {coupon.discountType === 'percentage' && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Max Discount</span>
                      <span className="font-semibold">₹{coupon.maxDiscountAmount}</span>
                    </div>
                  )}
                </div>

                {/* Usage Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Usage</span>
                    <span className="text-sm font-semibold">
                      {coupon.usedCount}/{coupon.usageLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getUsagePercentage(coupon)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{getUsagePercentage(coupon)}% used</span>
                </div>

                {/* Categories */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600 mb-2 block">Categories</span>
                  <div className="flex flex-wrap gap-1">
                    {coupon.categories.map((category) => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Validity */}
                <div className="mb-4 text-sm text-gray-600">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Valid: {coupon.validFrom} to {coupon.validUntil}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Coupon"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleToggleStatus(coupon.id)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                      coupon.isActive
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {coupons.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No coupons found</div>
              <div className="text-gray-400 mb-4">Create your first discount coupon</div>
              <button
                onClick={handleCreateCoupon}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Coupon
              </button>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-lg font-semibold">
                  {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
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
                {/* Coupon Code */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="ENTER CODE"
                    />
                    <button
                      onClick={generateCouponCode}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Generate
                    </button>
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
                    placeholder="Enter coupon title"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    placeholder="Enter coupon description"
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={formData.discountType === 'percentage' ? '50' : '100'}
                    />
                  </div>
                </div>

                {/* Min Order & Max Discount */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Order Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="199"
                    />
                  </div>
                  {formData.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Discount (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="500"
                      />
                    </div>
                  )}
                </div>

                {/* Usage Limit */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>

                {/* Validity Period */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid From
                    </label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicable Categories
                  </label>
                  <div className="flex gap-4">
                    {['car', 'bike', 'laundry'].map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Status */}
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
                    onClick={handleSaveCoupon}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingCoupon ? 'Update' : 'Create'}
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

export default CouponManagement;
