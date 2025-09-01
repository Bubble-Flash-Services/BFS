import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Edit, Save, X, Camera } from 'lucide-react';
import EmployeeLayout from '../../components/EmployeeLayout';
import { getEmployeeProfile, updateEmployeeProfile } from '../../api/employee';

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getEmployeeProfile();
        if (res?.success && res?.data?.employee) {
          setEmployee(res.data.employee);
          setEditedEmployee(res.data.employee);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    const payload = {
      name: editedEmployee?.name,
      phone: editedEmployee?.phone,
      address: editedEmployee?.address,
    };
    const res = await updateEmployeeProfile(payload);
    if (res?.success) {
      setEmployee(prev => ({ ...prev, ...payload }));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedEmployee(employee);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedEmployee(prev => ({ ...prev, [field]: value }));
  };

  const getSpecializationLabel = (specialization) => {
    switch (specialization) {
      case 'car':
        return 'Car Wash Specialist';
      case 'bike':
        return 'Bike Wash Specialist';
      case 'laundry':
        return 'Laundry Specialist';
      default:
        return specialization ? `${String(specialization).charAt(0).toUpperCase()}${String(specialization).slice(1)} Specialist` : 'Specialist';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your personal information</p>
            </div>
            {!isEditing ? (
              <button onClick={handleEdit} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-3">
                <button onClick={handleSave} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button onClick={handleCancel} className="flex items-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>

              {/* Profile Picture Section */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {employee?.name?.charAt(0)}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 bg-gray-600 text-white p-1 rounded-full hover:bg-gray-700">
                      <Camera className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{employee?.name}</h3>
                  <p className="text-sm text-gray-600">{getSpecializationLabel(employee?.specialization)}</p>
                  {employee?.stats?.averageRating ? (
                    <div className="flex items-center mt-1">
                      <div className="flex">{renderStars(Math.round(employee.stats.averageRating))}</div>
                      <span className="text-sm text-gray-600 ml-2">({employee.stats.averageRating.toFixed(1)})</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedEmployee?.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{employee?.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                  <div className="flex items-center">
                    <span className="text-gray-900 font-mono">{employee?.employeeId}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedEmployee?.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{employee?.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedEmployee?.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{employee?.phone}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      value={editedEmployee?.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <span className="text-gray-900">{employee?.address}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  {isEditing ? (
                    <select
                      value={editedEmployee?.specialization || ''}
                      onChange={(e) => handleChange('specialization', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="car">Car Wash Specialist</option>
                      <option value="bike">Bike Wash Specialist</option>
                      <option value="laundry">Laundry Specialist</option>
                    </select>
                  ) : (
                    <span className="text-gray-900">{getSpecializationLabel(employee?.specialization)}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {employee?.joinDate ? new Date(employee?.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeProfile;
