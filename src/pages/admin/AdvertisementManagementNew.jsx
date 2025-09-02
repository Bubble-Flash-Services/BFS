import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaMousePointer, 
  FaImage, 
  FaPalette,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaTimes,
  FaUpload
} from 'react-icons/fa';
import advertisementAPI from '../../api/advertisements';
import toast from 'react-hot-toast';

const AdvertisementManagement = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [filters, setFilters] = useState({
    serviceType: '',
    isActive: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'color',
    colorBackground: '#3B82F6',
    image: null,
    serviceTypes: [],
    ctaText: 'Book Now',
    ctaLink: '',
    priority: 1,
    isActive: true,
    startDate: '',
    endDate: ''
  });

  const serviceTypeOptions = [
    'car_wash',
    'bike_wash', 
    'helmet_wash',
    'laundry',
    'general'
  ];

  useEffect(() => {
    fetchAdvertisements();
  }, [filters]);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const response = await advertisementAPI.getAdvertisements(filters);
      setAdvertisements(response.data);
    } catch (error) {
      toast.error('Failed to fetch advertisements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiceTypesChange = (serviceType) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceType)
        ? prev.serviceTypes.filter(s => s !== serviceType)
        : [...prev.serviceTypes, serviceType]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      mediaType: 'color',
      colorBackground: '#3B82F6',
      image: null,
      serviceTypes: [],
      ctaText: 'Book Now',
      ctaLink: '',
      priority: 1,
      isActive: true,
      startDate: '',
      endDate: ''
    });
    setEditingAd(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    if (formData.serviceTypes.length === 0) {
      toast.error('At least one service type must be selected');
      return;
    }

    try {
      if (editingAd) {
        await advertisementAPI.updateAdvertisement(editingAd._id, formData);
        toast.success('Advertisement updated successfully');
      } else {
        await advertisementAPI.createAdvertisement(formData);
        toast.success('Advertisement created successfully');
      }
      
      fetchAdvertisements();
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Failed to save advertisement');
      console.error(error);
    }
  };

  const handleEdit = (ad) => {
    setFormData({
      title: ad.title,
      description: ad.description,
      mediaType: ad.mediaType,
      colorBackground: ad.colorBackground || '#3B82F6',
      image: null,
      serviceTypes: ad.serviceTypes,
      ctaText: ad.ctaText,
      ctaLink: ad.ctaLink,
      priority: ad.priority,
      isActive: ad.isActive,
      startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '',
      endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : ''
    });
    setEditingAd(ad);
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await advertisementAPI.deleteAdvertisement(id);
        toast.success('Advertisement deleted successfully');
        fetchAdvertisements();
      } catch (error) {
        toast.error('Failed to delete advertisement');
        console.error(error);
      }
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await advertisementAPI.updateAdvertisement(id, { isActive: !currentStatus });
      toast.success(`Advertisement ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchAdvertisements();
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const getMediaPreview = (ad) => {
    if (ad.mediaType === 'image' && ad.imageUrl) {
      return (
        <img 
          src={`${(import.meta.env.VITE_API_URL || window.location.origin)}${ad.imageUrl}`} 
          alt={ad.title}
          className="w-full h-24 object-cover rounded"
        />
      );
    } else {
      return (
        <div 
          className="w-full h-24 rounded flex items-center justify-center text-white font-semibold"
          style={{ backgroundColor: ad.colorBackground }}
        >
          <FaPalette className="text-2xl" />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advertisement Management</h1>
            <p className="text-gray-600 mt-2">Create and manage advertisements for your services</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            <span>Create Advertisement</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                value={filters.serviceType}
                onChange={(e) => setFilters(prev => ({ ...prev, serviceType: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Services</option>
                {serviceTypeOptions.map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.isActive}
                onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advertisements Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : advertisements.length === 0 ? (
          <div className="text-center py-12">
            <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first advertisement</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="inline mr-2" />
              Create Advertisement
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.map(ad => (
              <motion.div
                key={ad._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Media Preview */}
                <div className="h-32">
                  {getMediaPreview(ad)}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {ad.title}
                    </h3>
                    <button
                      onClick={() => toggleActive(ad._id, ad.isActive)}
                      className={`text-xl ${ad.isActive ? 'text-green-500' : 'text-gray-400'}`}
                    >
                      {ad.isActive ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {ad.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {ad.serviceTypes.map(type => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {type.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <FaEye />
                      <span>{ad.analytics?.views || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaMousePointer />
                      <span>{ad.analytics?.clicks || 0}</span>
                    </div>
                    <div className="text-xs">
                      Priority: {ad.priority}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(ad)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(ad._id)}
                      className="bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700 transition-colors"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Form Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingAd ? 'Edit Advertisement' : 'Create Advertisement'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <input
                          type="number"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          min="1"
                          max="10"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Media Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Media Type
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="mediaType"
                            value="color"
                            checked={formData.mediaType === 'color'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <FaPalette className="mr-1" />
                          Color Background
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="mediaType"
                            value="image"
                            checked={formData.mediaType === 'image'}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          <FaImage className="mr-1" />
                          Image
                        </label>
                      </div>
                    </div>

                    {/* Media Options */}
                    {formData.mediaType === 'color' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Color
                        </label>
                        <input
                          type="color"
                          name="colorBackground"
                          value={formData.colorBackground}
                          onChange={handleInputChange}
                          className="w-20 h-10 border border-gray-300 rounded-lg"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {/* Service Types */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Types *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {serviceTypeOptions.map(type => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.serviceTypes.includes(type)}
                              onChange={() => handleServiceTypesChange(type)}
                              className="mr-2"
                            />
                            {type.replace('_', ' ').toUpperCase()}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CTA Text
                        </label>
                        <input
                          type="text"
                          name="ctaText"
                          value={formData.ctaText}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CTA Link
                        </label>
                        <input
                          type="url"
                          name="ctaLink"
                          value={formData.ctaLink}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Active Status */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Active
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4 pt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <FaSave />
                        <span>{editingAd ? 'Update' : 'Create'} Advertisement</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdvertisementManagement;
