import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X, User, Phone, MapPin, Calendar, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [unassignedBookings, setUnassignedBookings] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    carSpecialists: 0,
    bikeSpecialists: 0,
    laundrySpecialists: 0
  });

  // Form state for employee
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialization: 'car',
    bankDetails: {
      accountNumber: '',
      ifsc: '',
      bankName: ''
    }
  });

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
    fetchUnassignedBookings();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/adminNew/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();
      if (result.success) {
        setEmployees(result.data.employees);
        setStats(result.data.stats);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/adminNew/bookings/unassigned', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.success) {
        setUnassignedBookings(result.data.bookings);
      }
    } catch (error) {
      console.error('Error fetching unassigned bookings:', error);
    }
  };

  // Handle create employee
  const handleCreateEmployee = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      specialization: 'car',
      bankDetails: {
        accountNumber: '',
        ifsc: '',
        bankName: ''
      }
    });
    setEditingEmployee(null);
    setShowCreateModal(true);
  };

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      specialization: employee.specialization,
      bankDetails: employee.bankDetails || {
        accountNumber: '',
        ifsc: '',
        bankName: ''
      }
    });
    setEditingEmployee(employee);
    setShowCreateModal(true);
  };

  // Save employee (create or update)
  const saveEmployee = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingEmployee 
        ? `/api/adminNew/employees/${editingEmployee._id}`
        : '/api/adminNew/employees';
      
      const method = editingEmployee ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        password: editingEmployee ? undefined : 'defaultPassword123' // Default password for new employees
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.success) {
        setShowCreateModal(false);
        fetchEmployees(); // Refresh employee list
        alert(editingEmployee ? 'Employee updated successfully!' : 'Employee created successfully!');
      } else {
        alert(result.message || 'Failed to save employee');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee');
    }
  };

  // Delete employee
  const deleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/adminNew/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        fetchEmployees(); // Refresh employee list
        alert('Employee deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  // Assign booking to employee
  const assignBooking = async () => {
    if (!selectedBooking || !formData.assignedEmployee) {
      alert('Please select an employee');
      return;
    }

    try {
      const selectedEmployee = employees.find(emp => emp._id === formData.assignedEmployee);
      const confirmMessage = `Are you sure you want to assign this booking to ${selectedEmployee?.name}?`;
      
      if (!window.confirm(confirmMessage)) {
        return;
      }

      setAssigning(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/adminNew/bookings/${selectedBooking._id}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: formData.assignedEmployee
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Reset form and close modal
        setFormData({
          ...formData,
          assignedEmployee: ''
        });
        handleCloseAssignModal();
        
        // Refresh data
        fetchUnassignedBookings();
        fetchEmployees(); // Refresh to update employee stats
        
        alert(`Booking successfully assigned to ${selectedEmployee?.name}!`);
      } else {
        alert(result.message || 'Failed to assign booking');
      }
    } catch (error) {
      console.error('Error assigning booking:', error);
      alert('Failed to assign booking. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  // Handle opening assign modal
  const handleAssignBooking = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      ...formData,
      assignedEmployee: '' // Reset selected employee
    });
    setShowAssignModal(true);
  };

  // Handle closing assign modal
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedBooking(null);
    setFormData({
      ...formData,
      assignedEmployee: '' // Reset selected employee
    });
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Get specialization badge color
  const getSpecializationColor = (specialization) => {
    switch (specialization) {
      case 'car': return 'bg-blue-100 text-blue-800';
      case 'bike': return 'bg-green-100 text-green-800';
      case 'laundry': return 'bg-purple-100 text-purple-800';
      case 'all': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-600">Manage your team and assign bookings</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchEmployees}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleCreateEmployee}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Active</h3>
            <p className="text-2xl font-bold text-green-600">{stats.activeEmployees}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Car Specialists</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.carSpecialists}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Bike Specialists</h3>
            <p className="text-2xl font-bold text-green-600">{stats.bikeSpecialists}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Laundry Specialists</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.laundrySpecialists}</p>
          </div>
        </div>

        {/* Unassigned Bookings Section */}
        {unassignedBookings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-yellow-800">
                Unassigned Bookings ({unassignedBookings.length})
              </h2>
              <button
                onClick={fetchUnassignedBookings}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unassignedBookings.slice(0, 6).map((booking) => (
                <div key={booking._id} className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{booking.userId?.name || 'Unknown Customer'}</h3>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {booking.orderStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Order: #{booking.orderNumber || booking._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Total: ₹{booking.totalAmount}
                  </p>
                  <button
                    onClick={() => handleAssignBooking(booking)}
                    className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                  >
                    Assign Employee
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Employees</h2>
          </div>
          
          {employees.length === 0 ? (
            <div className="p-8 text-center">
              <User size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No employees found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {employee.employeeId || employee._id.slice(-6)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.email}</div>
                        <div className="text-sm text-gray-500">{employee.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSpecializationColor(employee.specialization)}`}>
                          {employee.specialization}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(employee.joinDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteEmployee(employee._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Employee Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization *
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="car">Car Wash</option>
                      <option value="bike">Bike Wash</option>
                      <option value="laundry">Laundry</option>
                      <option value="all">All Services</option>
                    </select>
                  </div>

                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEmployee}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingEmployee ? 'Update' : 'Create'} Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Booking Modal */}
        {showAssignModal && selectedBooking && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Assign Booking to Employee</h2>
                  <button
                    onClick={handleCloseAssignModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Comprehensive Booking Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Booking Details</h3>
                  
                  {/* Basic Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-semibold text-lg">#{selectedBooking.orderNumber || selectedBooking._id.slice(-6)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          selectedBooking.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedBooking.orderStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {(selectedBooking.orderStatus || 'pending').replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-bold text-xl text-green-600">₹{selectedBooking.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-medium">{formatDate(selectedBooking.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-800 mb-3">Customer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedBooking.userId?.name || 'Unknown Customer'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedBooking.userId?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedBooking.userId?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Address */}
                  {selectedBooking.serviceAddress && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">Service Address</h4>
                      <div className="space-y-2">
                        <p className="font-medium">{selectedBooking.serviceAddress.fullAddress}</p>
                        {selectedBooking.serviceAddress.city && (
                          <p className="text-gray-600">
                            {selectedBooking.serviceAddress.city}, {selectedBooking.serviceAddress.state} - {selectedBooking.serviceAddress.pincode}
                          </p>
                        )}
                        {selectedBooking.serviceAddress.landmark && (
                          <p className="text-sm text-gray-500">Landmark: {selectedBooking.serviceAddress.landmark}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Service Items */}
                  {selectedBooking.items && selectedBooking.items.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">Service Items</h4>
                      <div className="space-y-3">
                        {selectedBooking.items.map((item, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium">{item.serviceName}</p>
                                {item.packageName && (
                                  <p className="text-sm text-gray-600">Package: {item.packageName}</p>
                                )}
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">₹{item.price}</p>
                              </div>
                            </div>
                            
                            {/* Add-ons */}
                            {item.addOns && item.addOns.length > 0 && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs text-gray-500 mb-1">Add-ons:</p>
                                {item.addOns.map((addon, addonIndex) => (
                                  <div key={addonIndex} className="flex justify-between text-sm">
                                    <span>{addon.name} (x{addon.quantity})</span>
                                    <span>₹{addon.price * addon.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scheduled Information */}
                  {(selectedBooking.scheduledDate || selectedBooking.scheduledTimeSlot) && (
                    <div className="bg-orange-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">Scheduled Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedBooking.scheduledDate && (
                          <div>
                            <p className="text-sm text-gray-600">Scheduled Date</p>
                            <p className="font-medium">{formatDate(selectedBooking.scheduledDate)}</p>
                          </div>
                        )}
                        {selectedBooking.scheduledTimeSlot && (
                          <div>
                            <p className="text-sm text-gray-600">Time Slot</p>
                            <p className="font-medium">{selectedBooking.scheduledTimeSlot}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Information */}
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-800 mb-3">Payment Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-medium">{selectedBooking.paymentMethod || 'COD'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          selectedBooking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                          selectedBooking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {(selectedBooking.paymentStatus || 'pending').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {selectedBooking.customerNotes && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Customer Notes</h4>
                      <p className="text-gray-700 italic">"{selectedBooking.customerNotes}"</p>
                    </div>
                  )}
                </div>

                {/* Employee Assignment Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Assign to Employee</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Employee *
                    </label>
                    <select
                      value={formData.assignedEmployee || ''}
                      onChange={(e) => setFormData({...formData, assignedEmployee: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Choose an employee...</option>
                      {employees.filter(emp => emp.isActive).map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.name} - {employee.specialization.toUpperCase()} Specialist
                          {employee.phone && ` (${employee.phone})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Show employee details when selected */}
                  {formData.assignedEmployee && (
                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                      {(() => {
                        const selectedEmp = employees.find(emp => emp._id === formData.assignedEmployee);
                        return selectedEmp ? (
                          <div>
                            <h5 className="font-medium text-green-800">Selected Employee:</h5>
                            <p className="text-sm text-green-700">
                              {selectedEmp.name} - {selectedEmp.specialization} specialist
                            </p>
                            <p className="text-sm text-green-600">{selectedEmp.email} | {selectedEmp.phone}</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={handleCloseAssignModal}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={assignBooking}
                    disabled={!formData.assignedEmployee || assigning}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {assigning && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {assigning ? 'Assigning...' : 'Assign Booking'}
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

export default EmployeeManagement;
