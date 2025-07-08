import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Edit, Trash2, Home, Building, X, Save } from 'lucide-react';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { addressAPI } from '../api/address';

export default function AddressesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    fullAddress: '',
    latitude: null,
    longitude: null,
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }
    
    if (user) {
      fetchAddresses();
    }
  }, [user, loading, navigate]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await addressAPI.getUserAddresses(token);
      
      if (response.success && Array.isArray(response.data)) {
        setAddresses(response.data);
      } else {
        console.error('Invalid response format:', response);
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      let response;
      if (editingAddress) {
        response = await addressAPI.updateAddress(editingAddress._id, formData);
      } else {
        response = await addressAPI.addAddress(formData);
      }
      
      if (response.success) {
        await fetchAddresses();
        handleCancel();
      } else {
        console.error('Error saving address:', response.message);
      }
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type || 'home',
      fullAddress: address.fullAddress || '',
      latitude: address.latitude || null,
      longitude: address.longitude || null,
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      landmark: address.landmark || '',
      isDefault: address.isDefault || false
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const response = await addressAPI.deleteAddress(addressId);
      if (response.success) {
        await fetchAddresses();
      } else {
        console.error('Error deleting address:', response.message);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setFormData({
      type: 'home',
      fullAddress: '',
      latitude: null,
      longitude: null,
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      isDefault: false
    });
    setErrors({});
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'home': return <Home size={16} className="text-green-600" />;
      case 'work': return <Building size={16} className="text-blue-600" />;
      default: return <MapPin size={16} className="text-gray-600" />;
    }
  };

  const handleAddressSelect = (selectedAddress) => {
    setFormData(prev => ({
      ...prev,
      fullAddress: selectedAddress.formatted_address || selectedAddress.display_name || '',
      city: selectedAddress.city || selectedAddress.town || selectedAddress.village || '',
      state: selectedAddress.state || selectedAddress.state_district || '',
      pincode: selectedAddress.postcode || '',
      latitude: selectedAddress.lat || selectedAddress.latitude || null,
      longitude: selectedAddress.lon || selectedAddress.longitude || null
    }));
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await addressAPI.setDefaultAddress(addressId);
      if (response.success) {
        await fetchAddresses();
      } else {
        console.error('Error setting default address:', response.message);
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  if (loading || loadingAddresses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading addresses...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Addresses</h1>
            <p className="text-gray-600">Manage your service delivery addresses</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Address
          </button>
        </div>

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Address</label>
                  <AddressAutocomplete
                    value={formData.fullAddress}
                    onChange={(value) => setFormData(prev => ({ ...prev, fullAddress: value }))}
                    onSelect={handleAddressSelect}
                    placeholder="Search for your address..."
                    showCurrentLocation={true}
                    className="w-full"
                  />
                  {errors.fullAddress && <p className="text-red-500 text-sm mt-1">{errors.fullAddress}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="City"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="State"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={e => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Pincode"
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={e => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Nearby landmark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="home"
                        checked={formData.type === 'home'}
                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="mr-2"
                      />
                      Home
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="work"
                        checked={formData.type === 'work'}
                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="mr-2"
                      />
                      Work
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="other"
                        checked={formData.type === 'other'}
                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="mr-2"
                      />
                      Other
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={e => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="mr-2"
                    />
                    Set as default address
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <MapPin size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Addresses Added</h3>
            <p className="text-gray-600 mb-6">Add your first address to get started with service bookings.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div key={address._id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(address.type)}
                    <span className="font-semibold text-gray-800 capitalize">{address.type}</span>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700">{address.fullAddress}</p>
                  {address.landmark && (
                    <p className="text-gray-600 text-sm">📍 {address.landmark}</p>
                  )}
                  <p className="text-gray-600 text-sm">{address.city}, {address.state} - {address.pincode}</p>
                  {address.latitude && address.longitude && (
                    <p className="text-xs text-gray-500">
                      📍 {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
