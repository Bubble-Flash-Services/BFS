import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw, 
  Package, 
  X,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const VehicleAccessoriesManagement = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    category: 'car',
    subcategory: '',
    name: '',
    description: '',
    shortDescription: '',
    basePrice: '',
    discountPrice: '',
    inStock: true,
    stockQuantity: 100,
    rating: 4.0,
    reviewCount: 0,
    images: [''],
    features: [''],
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    isActive: true,
    sortOrder: 0
  });

  const categories = [
    { value: 'car', label: 'Car Accessories' },
    { value: 'bike', label: 'Bike Accessories' },
    { value: 'common', label: 'Common/Universal' }
  ];

  const subcategories = {
    car: ['Interior', 'Exterior', 'Cleaning', 'Fragrance', 'Electronics'],
    bike: ['Maintenance', 'Safety', 'Protection', 'Comfort', 'Accessories'],
    common: ['Tools', 'Cleaning', 'Detailing', 'Safety']
  };

  useEffect(() => {
    fetchAccessories();
    fetchStats();
  }, []);

  const fetchAccessories = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API}/api/admin/vehicle-accessories/accessories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();

      if (result.success) {
        setAccessories(result.data.accessories);
      } else {
        toast.error('Failed to fetch accessories');
      }
    } catch (error) {
      console.error('Error fetching accessories:', error);
      toast.error('Failed to fetch accessories');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API}/api/admin/vehicle-accessories/accessories/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreate = () => {
    setEditingAccessory(null);
    setFormData({
      category: 'car',
      subcategory: '',
      name: '',
      description: '',
      shortDescription: '',
      basePrice: '',
      discountPrice: '',
      inStock: true,
      stockQuantity: 100,
      rating: 4.0,
      reviewCount: 0,
      images: [''],
      features: [''],
      isNew: false,
      isFeatured: false,
      isOnSale: false,
      isActive: true,
      sortOrder: 0
    });
    setShowModal(true);
  };

  const handleEdit = (accessory) => {
    setEditingAccessory(accessory);
    setFormData({
      category: accessory.category,
      subcategory: accessory.subcategory,
      name: accessory.name,
      description: accessory.description || '',
      shortDescription: accessory.shortDescription || '',
      basePrice: accessory.basePrice.toString(),
      discountPrice: accessory.discountPrice?.toString() || '',
      inStock: accessory.inStock,
      stockQuantity: accessory.stockQuantity || 100,
      rating: accessory.rating || 4.0,
      reviewCount: accessory.reviewCount || 0,
      images: accessory.images?.length ? accessory.images : [''],
      features: accessory.features?.length ? accessory.features : [''],
      isNew: accessory.isNew || false,
      isFeatured: accessory.isFeatured || false,
      isOnSale: accessory.isOnSale || false,
      isActive: accessory.isActive,
      sortOrder: accessory.sortOrder || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this accessory?')) {
      return;
    }

    try {
      const response = await fetch(`${API}/api/admin/vehicle-accessories/accessories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Accessory deleted successfully');
        fetchAccessories();
        fetchStats();
      } else {
        toast.error(result.message || 'Failed to delete accessory');
      }
    } catch (error) {
      console.error('Error deleting accessory:', error);
      toast.error('Failed to delete accessory');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${API}/api/admin/vehicle-accessories/accessories/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchAccessories();
        fetchStats();
      } else {
        toast.error(result.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to toggle status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.basePrice || !formData.subcategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const url = editingAccessory
        ? `${API}/api/admin/vehicle-accessories/accessories/${editingAccessory._id}`
        : `${API}/api/admin/vehicle-accessories/accessories`;

      const method = editingAccessory ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        sortOrder: parseInt(formData.sortOrder),
        images: formData.images.filter(img => img.trim()),
        features: formData.features.filter(f => f.trim())
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Accessory ${editingAccessory ? 'updated' : 'created'} successfully`);
        setShowModal(false);
        fetchAccessories();
        fetchStats();
      } else {
        toast.error(result.message || 'Failed to save accessory');
      }
    } catch (error) {
      console.error('Error saving accessory:', error);
      toast.error('Failed to save accessory');
    }
  };

  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Filter accessories
  const filteredAccessories = accessories.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         acc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || acc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && acc.isActive) ||
                         (statusFilter === 'inactive' && !acc.isActive) ||
                         (statusFilter === 'outofstock' && !acc.inStock);
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Vehicle Accessories</h1>
            <p className="text-gray-600">Manage car and bike accessories</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchAccessories(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Accessory
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
              <div className="text-sm text-gray-500">Total Products</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{stats.activeProducts}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-400">{stats.inactiveProducts}</div>
              <div className="text-sm text-gray-500">Inactive</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
              <div className="text-sm text-gray-500">Out of Stock</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search accessories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="outofstock">Out of Stock</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredAccessories.length} accessories
          </div>
        </div>

        {/* Accessories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredAccessories.map((accessory) => (
            <div key={accessory._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={accessory.images?.[0] || '/car/car1.png'}
                  alt={accessory.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/car/car1.png'; }}
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {accessory.isNew && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded">NEW</span>
                  )}
                  {accessory.isOnSale && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded">SALE</span>
                  )}
                  {!accessory.inStock && (
                    <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded">OUT</span>
                  )}
                </div>
                <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs rounded ${
                  accessory.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {accessory.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="text-xs text-blue-600 font-medium uppercase mb-1">
                  {accessory.category} - {accessory.subcategory}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{accessory.name}</h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{accessory.discountPrice || accessory.basePrice}
                  </span>
                  {accessory.discountPrice && (
                    <span className="text-sm text-gray-400 line-through">₹{accessory.basePrice}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>⭐ {accessory.rating}</span>
                  <span>•</span>
                  <span>{accessory.reviewCount} reviews</span>
                  <span>•</span>
                  <span>Stock: {accessory.stockQuantity}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(accessory)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(accessory._id)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      accessory.isActive
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {accessory.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(accessory._id)}
                    className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAccessories.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accessories found</h3>
            <p className="text-gray-600 mb-4">Create your first accessory to get started</p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Accessory
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingAccessory ? 'Edit Accessory' : 'Add New Accessory'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Category & Subcategory */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      required
                    >
                      <option value="">Select subcategory</option>
                      {subcategories[formData.category]?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    maxLength={255}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹) *</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                      min="0"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                      min="0"
                    />
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs</label>
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={img}
                        onChange={(e) => handleArrayFieldChange('images', idx, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('images', idx)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('images')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Image URL
                  </button>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={feature}
                        onChange={(e) => handleArrayFieldChange('features', idx, e.target.value)}
                        placeholder="Feature description"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('features', idx)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('features')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Feature
                  </button>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    />
                    <span className="text-sm">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    />
                    <span className="text-sm">Mark as New</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded"
                      checked={formData.isOnSale}
                      onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                    />
                    <span className="text-sm">On Sale</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="text-sm font-medium">Active (visible to customers)</span>
                </label>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingAccessory ? 'Update Accessory' : 'Create Accessory'}
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

export default VehicleAccessoriesManagement;
