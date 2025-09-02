import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, RefreshCw, Calendar, Percent, DollarSign, Tag, Users, Clock, Target, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderAmount: '',
    maximumDiscountAmount: '',
    couponType: 'welcome',
    targetAudience: 'all_customers',
    usageLimit: '',
    userUsageLimit: 1,
    validFrom: '',
    validUntil: '',
    autoApply: false,
    showOnHomepage: false,
    priority: 5,
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});

  // Coupon type options
  const couponTypes = [
    { value: 'welcome', label: 'Welcome Offer', icon: Users, color: 'bg-green-100 text-green-800' },
    { value: 'festival_seasonal', label: 'Festival Special', icon: Calendar, color: 'bg-purple-100 text-purple-800' },
    { value: 'referral', label: 'Referral Bonus', icon: Users, color: 'bg-blue-100 text-blue-800' },
    { value: 'loyalty', label: 'Loyalty Reward', icon: Target, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'minimum_order', label: 'Minimum Order Discount', icon: DollarSign, color: 'bg-indigo-100 text-indigo-800' },
    { value: 'limited_time', label: 'Flash Sale', icon: Clock, color: 'bg-red-100 text-red-800' },
    { value: 'service_specific', label: 'Service Special', icon: Tag, color: 'bg-cyan-100 text-cyan-800' }
  ];

  const targetAudienceOptions = [
    { value: 'all_customers', label: 'All Customers' },
    { value: 'new_customers', label: 'New Customers Only' },
    { value: 'existing_customers', label: 'Existing Customers Only' }
  ];

  // Fetch coupons from backend
  const fetchCoupons = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch('/api/adminNew/coupons', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        setCoupons(result.data.coupons);
        setFilteredCoupons(result.data.coupons);
      } else {
        console.error('Failed to fetch coupons:', result.message);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Filter coupons based on search and filters
  useEffect(() => {
    let filtered = coupons;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      const now = new Date();
      if (statusFilter === 'active') {
        filtered = filtered.filter(coupon => coupon.isActive && new Date(coupon.validUntil) >= now);
      } else if (statusFilter === 'expired') {
        filtered = filtered.filter(coupon => new Date(coupon.validUntil) < now);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(coupon => !coupon.isActive);
      }
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(coupon => coupon.couponType === typeFilter);
    }

    setFilteredCoupons(filtered);
  }, [coupons, searchTerm, statusFilter, typeFilter]);

  const handleRefresh = () => {
    fetchCoupons(true);
  };

  const handleCreateCoupon = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minimumOrderAmount: '',
      maximumDiscountAmount: '',
      couponType: 'welcome',
      targetAudience: 'all_customers',
      usageLimit: '',
      userUsageLimit: 1,
      validFrom: '',
      validUntil: '',
      autoApply: false,
      showOnHomepage: false,
      priority: 5,
      isActive: true
    });
    setFormErrors({});
    setEditingCoupon(null);
    setShowCreateModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minimumOrderAmount: coupon.minimumOrderAmount.toString(),
      maximumDiscountAmount: coupon.maximumDiscountAmount?.toString() || '',
      couponType: coupon.couponType,
      targetAudience: coupon.targetAudience,
      usageLimit: coupon.usageLimit?.toString() || '',
      userUsageLimit: coupon.userUsageLimit,
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
      autoApply: coupon.autoApply,
      showOnHomepage: coupon.showOnHomepage,
      priority: coupon.priority,
      isActive: coupon.isActive
    });
    setFormErrors({});
    setEditingCoupon(coupon);
    setShowCreateModal(true);
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const response = await fetch(`/api/adminNew/coupons/${couponId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setCoupons(coupons.filter(coupon => coupon._id !== couponId));
        alert('Coupon deleted successfully!');
      } else {
        alert('Failed to delete coupon: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    if (!formData.code) errors.code = 'Coupon code is required';
    if (!formData.name) errors.name = 'Coupon name is required';
    if (!formData.discountValue) errors.discountValue = 'Discount value is required';
    if (!formData.validFrom) errors.validFrom = 'Valid from date is required';
    if (!formData.validUntil) errors.validUntil = 'Valid until date is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const couponData = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: parseFloat(formData.discountValue),
        minimumOrderAmount: parseFloat(formData.minimumOrderAmount) || 0,
        maximumDiscountAmount: formData.maximumDiscountAmount ? parseFloat(formData.maximumDiscountAmount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        userUsageLimit: parseInt(formData.userUsageLimit),
        priority: parseInt(formData.priority)
      };

      const url = editingCoupon 
        ? `/api/adminNew/coupons/${editingCoupon._id}`
        : '/api/adminNew/coupons';
      
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(couponData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`Coupon ${editingCoupon ? 'updated' : 'created'} successfully!`);
        setShowCreateModal(false);
        fetchCoupons();
      } else {
        alert(`Failed to ${editingCoupon ? 'update' : 'create'} coupon: ` + result.message);
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Failed to save coupon');
    }
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      const response = await fetch(`/api/adminNew/coupons/${coupon._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isActive: !coupon.isActive })
      });

      const result = await response.json();

      if (result.success) {
        fetchCoupons();
      } else {
        alert('Failed to toggle coupon status');
      }
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      alert('Failed to toggle coupon status');
    }
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const validUntil = new Date(coupon.validUntil);
    
    if (!coupon.isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Inactive</span>;
    } else if (validUntil < now) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Expired</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
    }
  };

  const getTypeConfig = (type) => {
    return couponTypes.find(t => t.value === type) || couponTypes[0];
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `₹${coupon.discountValue} OFF`;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col gap-3 md:flex-row md:justify-between md:items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
            <p className="text-gray-600">Create and manage discount coupons for your customers</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleCreateCoupon}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Coupon
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {couponTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Total: {filteredCoupons.length} coupons
          </div>
        </div>

        {/* Coupons Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCoupons.map((coupon) => {
            const typeConfig = getTypeConfig(coupon.couponType);
            const Icon = typeConfig.icon;
            
            return (
              <div key={coupon._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Coupon Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{coupon.code}</h3>
                        <p className="text-sm text-gray-600">{typeConfig.label}</p>
                      </div>
                    </div>
                    {getStatusBadge(coupon)}
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-1">{coupon.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatDiscount(coupon)}
                    </div>
                    {coupon.showOnHomepage && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Homepage
                      </span>
                    )}
                  </div>
                </div>

                {/* Coupon Details */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Min Order:</span>
                    <span className="font-medium">₹{coupon.minimumOrderAmount}</span>
                  </div>
                  
                  {coupon.maximumDiscountAmount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Max Discount:</span>
                      <span className="font-medium">₹{coupon.maximumDiscountAmount}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usage:</span>
                    <span className="font-medium">{coupon.usage || `${coupon.usedCount}/${coupon.usageLimit || '∞'}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium capitalize">{coupon.targetAudience.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Valid Period
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
        <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEditCoupon(coupon)}
          className="flex-1 min-w-[140px] flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => toggleCouponStatus(coupon)}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                      coupon.isActive 
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteCoupon(coupon._id)}
          className="flex-1 min-w-[120px] px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
            <p className="text-gray-600 mb-4">Create your first coupon to get started</p>
            <button
              onClick={handleCreateCoupon}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Coupon
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.code ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., BFSWELCOME10"
                    />
                    {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Name *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Welcome to BFS - 10% Off"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the coupon offer"
                  />
                </div>

                {/* Coupon Type and Target Audience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Type *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.couponType}
                      onChange={(e) => setFormData({ ...formData, couponType: e.target.value })}
                    >
                      {couponTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Audience
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    >
                      {targetAudienceOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Discount Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type *
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.discountValue ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      placeholder={formData.discountType === 'percentage' ? '10' : '50'}
                    />
                    {formErrors.discountValue && <p className="text-red-500 text-xs mt-1">{formErrors.discountValue}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Order Amount
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.minimumOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Discount Amount
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.maximumDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maximumDiscountAmount: e.target.value })}
                      placeholder="e.g., 500"
                    />
                  </div>
                )}

                {/* Usage Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Usage Limit
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      placeholder="Leave empty for unlimited"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Per User Limit
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.userUsageLimit}
                      onChange={(e) => setFormData({ ...formData, userUsageLimit: e.target.value })}
                      min="1"
                    />
                  </div>
                </div>

                {/* Validity Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid From *
                    </label>
                    <input
                      type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.validFrom ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    />
                    {formErrors.validFrom && <p className="text-red-500 text-xs mt-1">{formErrors.validFrom}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until *
                    </label>
                    <input
                      type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.validUntil ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    />
                    {formErrors.validUntil && <p className="text-red-500 text-xs mt-1">{formErrors.validUntil}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority (1-10)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">Higher priority coupons are shown first</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoApply"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      checked={formData.autoApply}
                      onChange={(e) => setFormData({ ...formData, autoApply: e.target.checked })}
                    />
                    <label htmlFor="autoApply" className="ml-2 text-sm text-gray-700">
                      Auto-apply this coupon
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showOnHomepage"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      checked={formData.showOnHomepage}
                      onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                    />
                    <label htmlFor="showOnHomepage" className="ml-2 text-sm text-gray-700">
                      Show on homepage banner
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CouponManagement;
