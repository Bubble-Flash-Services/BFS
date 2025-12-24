import React, { useState, useEffect } from 'react';
import { Smartphone, Plus, Edit, Trash2, Save, X, DollarSign, Clock } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const SERVICE_TYPES = [
  { value: 'screen-replacement', label: 'Screen / Display Replacement' },
  { value: 'battery-replacement', label: 'Battery Replacement' },
  { value: 'charging-port-replacement', label: 'Charging Port Replacement' },
  { value: 'speaker-microphone-replacement', label: 'Speaker / Microphone Replacement' },
  { value: 'camera-glass-replacement', label: 'Camera Glass Replacement' },
  { value: 'phone-cleaning-diagnostics', label: 'Phone Cleaning & Diagnostics' },
];

const MobilePricingManagement = () => {
  const [activeTab, setActiveTab] = useState('brands');
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [pricingList, setPricingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const [editingBrand, setEditingBrand] = useState(null);
  const [editingModel, setEditingModel] = useState(null);
  const [editingPricing, setEditingPricing] = useState(null);

  const [brandForm, setBrandForm] = useState({ name: '', displayOrder: 0 });
  const [modelForm, setModelForm] = useState({ brandId: '', name: '', displayOrder: 0 });
  const [pricingForm, setPricingForm] = useState({
    modelId: '',
    serviceType: '',
    price: '',
    estimatedTime: '',
  });

  useEffect(() => {
    fetchBrands();
    fetchModels();
    fetchPricing();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/mobilefix/brands`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setBrands(result.data.brands || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/mobilefix/models`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setModels(result.data.models || []);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to fetch models');
    }
  };

  const fetchPricing = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/mobilefix/pricing`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setPricingList(result.data.pricingList || []);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Failed to fetch pricing');
    }
  };

  const handleSaveBrand = async () => {
    if (!brandForm.name.trim()) {
      toast.error('Brand name is required');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingBrand
        ? `${API}/api/admin/mobilefix/brands/${editingBrand._id}`
        : `${API}/api/admin/mobilefix/brands`;
      const method = editingBrand ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(brandForm),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(editingBrand ? 'Brand updated' : 'Brand created');
        setShowBrandModal(false);
        setBrandForm({ name: '', displayOrder: 0 });
        setEditingBrand(null);
        fetchBrands();
      } else {
        toast.error(result.message || 'Failed to save brand');
      }
    } catch (error) {
      console.error('Error saving brand:', error);
      toast.error('Failed to save brand');
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Are you sure? This will prevent creating new models for this brand.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/mobilefix/brands/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Brand deleted');
        fetchBrands();
      } else {
        toast.error(result.message || 'Failed to delete brand');
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to delete brand');
    }
  };

  const handleSaveModel = async () => {
    if (!modelForm.brandId || !modelForm.name.trim()) {
      toast.error('Brand and model name are required');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingModel
        ? `${API}/api/admin/mobilefix/models/${editingModel._id}`
        : `${API}/api/admin/mobilefix/models`;
      const method = editingModel ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(modelForm),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(editingModel ? 'Model updated' : 'Model created');
        setShowModelModal(false);
        setModelForm({ brandId: '', name: '', displayOrder: 0 });
        setEditingModel(null);
        fetchModels();
      } else {
        toast.error(result.message || 'Failed to save model');
      }
    } catch (error) {
      console.error('Error saving model:', error);
      toast.error('Failed to save model');
    }
  };

  const handleDeleteModel = async (id) => {
    if (!window.confirm('Are you sure? This will prevent creating pricing for this model.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/mobilefix/models/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Model deleted');
        fetchModels();
      } else {
        toast.error(result.message || 'Failed to delete model');
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Failed to delete model');
    }
  };

  const handleSavePricing = async () => {
    if (!pricingForm.modelId || !pricingForm.serviceType || !pricingForm.price || !pricingForm.estimatedTime) {
      toast.error('All fields are required');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingPricing
        ? `${API}/api/admin/mobilefix/pricing/${editingPricing._id}`
        : `${API}/api/admin/mobilefix/pricing`;
      const method = editingPricing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...pricingForm,
          price: parseInt(pricingForm.price),
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(editingPricing ? 'Pricing updated' : 'Pricing created');
        setShowPricingModal(false);
        setPricingForm({ modelId: '', serviceType: '', price: '', estimatedTime: '' });
        setEditingPricing(null);
        fetchPricing();
      } else {
        toast.error(result.message || 'Failed to save pricing');
      }
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Failed to save pricing');
    }
  };

  const handleDeletePricing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/mobilefix/pricing/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Pricing deleted');
        fetchPricing();
      } else {
        toast.error('Failed to delete pricing');
      }
    } catch (error) {
      console.error('Error deleting pricing:', error);
      toast.error('Failed to delete pricing');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-blue-600" />
              Mobile Pricing Management
            </h1>
            <p className="text-gray-600 mt-1">Manage phone brands, models, and pricing</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('brands')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'brands'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Phone Brands
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'models'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Phone Models
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'pricing'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Service Pricing
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'brands' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Phone Brands</h2>
                  <button
                    onClick={() => {
                      setBrandForm({ name: '', displayOrder: 0 });
                      setEditingBrand(null);
                      setShowBrandModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Brand
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brands.map((brand) => (
                    <div key={brand._id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{brand.name}</h3>
                        <p className="text-sm text-gray-600">
                          Order: {brand.displayOrder} | {brand.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setBrandForm({
                              name: brand.name,
                              displayOrder: brand.displayOrder,
                              isActive: brand.isActive,
                            });
                            setEditingBrand(brand);
                            setShowBrandModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'models' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Phone Models</h2>
                  <button
                    onClick={() => {
                      setModelForm({ brandId: '', name: '', displayOrder: 0 });
                      setEditingModel(null);
                      setShowModelModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Model
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Brand</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Model</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Display Order</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {models.map((model) => (
                        <tr key={model._id}>
                          <td className="px-4 py-3">{model.brandId?.name}</td>
                          <td className="px-4 py-3 font-medium">{model.name}</td>
                          <td className="px-4 py-3">{model.displayOrder}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                model.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {model.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setModelForm({
                                    brandId: model.brandId?._id,
                                    name: model.name,
                                    displayOrder: model.displayOrder,
                                    isActive: model.isActive,
                                  });
                                  setEditingModel(model);
                                  setShowModelModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteModel(model._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Service Pricing</h2>
                  <button
                    onClick={() => {
                      setPricingForm({ modelId: '', serviceType: '', price: '', estimatedTime: '' });
                      setEditingPricing(null);
                      setShowPricingModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Pricing
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Brand</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Model</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Service Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Est. Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pricingList.map((pricing) => (
                        <tr key={pricing._id}>
                          <td className="px-4 py-3">{pricing.modelId?.brandId?.name}</td>
                          <td className="px-4 py-3">{pricing.modelId?.name}</td>
                          <td className="px-4 py-3">
                            {SERVICE_TYPES.find(st => st.value === pricing.serviceType)?.label}
                          </td>
                          <td className="px-4 py-3 font-bold text-green-600">₹{pricing.price}</td>
                          <td className="px-4 py-3">{pricing.estimatedTime}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                pricing.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {pricing.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setPricingForm({
                                    modelId: pricing.modelId?._id,
                                    serviceType: pricing.serviceType,
                                    price: pricing.price.toString(),
                                    estimatedTime: pricing.estimatedTime,
                                    isActive: pricing.isActive,
                                  });
                                  setEditingPricing(pricing);
                                  setShowPricingModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePricing(pricing._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {showBrandModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{editingBrand ? 'Edit' : 'Add'} Brand</h2>
                <button onClick={() => setShowBrandModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                  <input
                    type="text"
                    value={brandForm.name}
                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Samsung, Apple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={brandForm.displayOrder}
                    onChange={(e) => setBrandForm({ ...brandForm, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {editingBrand && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="brandActive"
                      checked={brandForm.isActive}
                      onChange={(e) => setBrandForm({ ...brandForm, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="brandActive" className="text-sm font-medium text-gray-700">Active</label>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSaveBrand}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setShowBrandModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showModelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{editingModel ? 'Edit' : 'Add'} Model</h2>
                <button onClick={() => setShowModelModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={modelForm.brandId}
                    onChange={(e) => setModelForm({ ...modelForm, brandId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingModel}
                  >
                    <option value="">Select Brand</option>
                    {brands.filter(b => b.isActive).map((brand) => (
                      <option key={brand._id} value={brand._id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model Name</label>
                  <input
                    type="text"
                    value={modelForm.name}
                    onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Galaxy S21, iPhone 13"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={modelForm.displayOrder}
                    onChange={(e) => setModelForm({ ...modelForm, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {editingModel && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="modelActive"
                      checked={modelForm.isActive}
                      onChange={(e) => setModelForm({ ...modelForm, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="modelActive" className="text-sm font-medium text-gray-700">Active</label>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSaveModel}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setShowModelModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showPricingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{editingPricing ? 'Edit' : 'Add'} Pricing</h2>
                <button onClick={() => setShowPricingModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Model</label>
                  <select
                    value={pricingForm.modelId}
                    onChange={(e) => setPricingForm({ ...pricingForm, modelId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingPricing}
                  >
                    <option value="">Select Model</option>
                    {models.filter(m => m.isActive).map((model) => (
                      <option key={model._id} value={model._id}>
                        {model.brandId?.name} {model.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    value={pricingForm.serviceType}
                    onChange={(e) => setPricingForm({ ...pricingForm, serviceType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingPricing}
                  >
                    <option value="">Select Service</option>
                    {SERVICE_TYPES.map((service) => (
                      <option key={service.value} value={service.value}>{service.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={pricingForm.price}
                    onChange={(e) => setPricingForm({ ...pricingForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Time</label>
                  <input
                    type="text"
                    value={pricingForm.estimatedTime}
                    onChange={(e) => setPricingForm({ ...pricingForm, estimatedTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 30-45 minutes"
                  />
                </div>
                {editingPricing && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pricingActive"
                      checked={pricingForm.isActive}
                      onChange={(e) => setPricingForm({ ...pricingForm, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="pricingActive" className="text-sm font-medium text-gray-700">Active</label>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSavePricing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MobilePricingManagement;
