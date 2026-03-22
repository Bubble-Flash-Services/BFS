import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Edit, Trash2, Home, Building, X, Save } from 'lucide-react';
import MapboxLocationPicker from '../components/MapboxLocationPicker';
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
    // Client-side availability check
    try {
      const availability = await addressAPI.checkServiceAvailability(formData.pincode);
      if (!availability?.success || availability.available === false) {
        const msg = availability?.message || 'We currently serve only Bangalore areas — coming soon to your area!';
        setErrors(prev => ({ ...prev, pincode: msg }));
        return;
      }
    } catch (_) {
      // If check fails for network reasons, proceed; server will enforce
    }
    
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

  const handleLocationSelect = (locationData) => {
    setFormData(prev => ({
      ...prev,
      fullAddress: locationData.fullAddress || '',
      city: locationData.city || '',
      state: locationData.state || '',
      pincode: locationData.pincode || '',
      latitude: locationData.latitude || null,
      longitude: locationData.longitude || null
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              📍 My Addresses
            </h1>
            <p className="text-gray-600 text-lg">Manage your service delivery addresses</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            Add Address
          </button>
        </div>

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600">
                <h2 className="text-2xl font-bold text-white">
                  {editingAddress ? '📍 Edit Address' : '📍 Add New Address'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🗺️ Select Your Location on Map
                  </label>
                  <MapboxLocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={
                      formData.latitude && formData.longitude
                        ? { latitude: formData.latitude, longitude: formData.longitude }
                        : undefined
                    }
                  />
                  {errors.fullAddress && <p className="text-red-500 text-sm mt-2">{errors.fullAddress}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">📝 Address Details</label>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                          }`}
                          placeholder="City"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                          }`}
                          placeholder="State"
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Pincode</label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={e => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.pincode ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                          }`}
                          placeholder="Pincode"
                        />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Full Address</label>
                      <textarea
                        value={formData.fullAddress}
                        onChange={e => setFormData(prev => ({ ...prev, fullAddress: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                          errors.fullAddress ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                        }`}
                        placeholder="Complete address"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🏷️ Additional Details</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={e => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Landmark (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">📌 Address Type</label>
                  <div className="flex gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                      <input
                        type="radio"
                        value="home"
                        checked={formData.type === 'home'}
                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Home size={18} />
                      <span className="font-medium">Home</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                      <input
                        type="radio"
                        value="work"
                        checked={formData.type === 'work'}
                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Building size={18} />
                      <span className="font-medium">Work</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                      <input
                        type="radio"
                        value="other"
                        checked={formData.type === 'other'}
                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <MapPin size={18} />
                      <span className="font-medium">Other</span>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={e => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">⭐ Set as default address</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2 shadow-lg"
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
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
              <MapPin size={64} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Addresses Added</h3>
            <p className="text-gray-600 mb-8 text-lg">Add your first address to get started with service bookings.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              📍 Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div key={address._id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all border border-gray-200 transform hover:scale-105">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      address.type === 'home' ? 'bg-green-100' : 
                      address.type === 'work' ? 'bg-blue-100' : 
                      'bg-gray-100'
                    }`}>
                      {getTypeIcon(address.type)}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 capitalize text-lg">{address.type}</span>
                      {address.isDefault && (
                        <span className="ml-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">✓ Default</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors font-semibold"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-700 text-sm leading-relaxed">{address.fullAddress}</p>
                  </div>
                  {address.landmark && (
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <span className="text-lg">📍</span> {address.landmark}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm font-medium">{address.city}, {address.state} - {address.pincode}</p>
                  {address.latitude && address.longitude && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      🌍 {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
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
