import React, { useState, useEffect } from 'react';
import { Key, Search, Filter, MapPin, Calendar, User, Phone, Shield, CheckCircle, XCircle, Clock, Edit, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const KeyServicesManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
    fetchStats();
  }, [selectedStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const url = selectedStatus 
        ? `${API}/api/admin/key-services/bookings?status=${selectedStatus}`
        : `${API}/api/admin/key-services/bookings`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setBookings(result.data.bookings || []);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/adminNew/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setEmployees(result.data?.employees || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/key-services/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/key-services/booking/${selectedBooking._id}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId: selectedEmployee }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Technician assigned successfully');
        setShowAssignModal(false);
        setSelectedEmployee('');
        fetchBookings();
      } else {
        toast.error(result.message || 'Failed to assign technician');
      }
    } catch (error) {
      console.error('Error assigning technician:', error);
      toast.error('Failed to assign technician');
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/key-services/booking/${selectedBooking._id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, adminNotes }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Status updated successfully');
        setShowStatusModal(false);
        setNewStatus('');
        setAdminNotes('');
        fetchBookings();
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.userId?.name?.toLowerCase().includes(searchLower) ||
      booking.contactPhone?.includes(searchQuery) ||
      booking.specificService?.toLowerCase().includes(searchLower) ||
      booking._id?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getServiceTypeLabel = (type) => {
    const labels = {
      'key-duplication': 'Key Duplication',
      'lock-services': 'Lock Services',
      'advanced-services': 'Advanced Services',
      'specialized-keys': 'Specialized Keys'
    };
    return labels[type] || type;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Key Services Management</h1>
              <p className="text-gray-600">Manage key duplication and lock service bookings</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings || 0}</p>
                </div>
                <Key className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Emergency Calls</p>
                  <p className="text-2xl font-bold text-red-600">{stats.emergencyBookings || 0}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.statusCounts?.completed || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">₹{stats.totalRevenue || 0}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, phone, service, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-8 text-center">
              <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Technician
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {booking._id.slice(-6)}
                          {booking.isEmergency && (
                            <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                              EMERGENCY
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{booking.userId?.name || 'N/A'}</div>
                          <div className="text-gray-500">{booking.contactPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.keyType?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">Qty: {booking.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getServiceTypeLabel(booking.serviceType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.assignedTechnician?.name || (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{booking.pricing?.totalPrice || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </button>
                          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowAssignModal(true);
                                }}
                                className="text-green-600 hover:text-green-800"
                              >
                                Assign
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setNewStatus(booking.status);
                                  setShowStatusModal(true);
                                }}
                                className="text-purple-600 hover:text-purple-800"
                              >
                                Update
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Assign Technician Modal */}
        {showAssignModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Assign Technician</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Technician
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a technician...</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} - {employee.phone}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAssignEmployee}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Assign
                </button>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedEmployee('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Update Booking Status</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus('');
                    setAdminNotes('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">Booking Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="font-medium">{selectedBooking.userId?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Phone</p>
                    <p className="font-medium">{selectedBooking.contactPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service Type</p>
                    <p className="font-medium">{getServiceTypeLabel(selectedBooking.serviceType)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specific Service</p>
                    <p className="font-medium">{selectedBooking.keyType?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-medium">{selectedBooking.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Is Emergency</p>
                    <p className="font-medium">{selectedBooking.isEmergency ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="font-medium">₹{selectedBooking.pricing?.totalPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-medium capitalize">{selectedBooking.paymentStatus}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Service Location</p>
                  <p className="font-medium">{selectedBooking.serviceLocation?.fullAddress}</p>
                </div>

                {selectedBooking.specialInstructions && (
                  <div>
                    <p className="text-sm text-gray-600">Special Instructions</p>
                    <p className="font-medium">{selectedBooking.specialInstructions}</p>
                  </div>
                )}

                {selectedBooking.idProof && (
                  <div>
                    <p className="text-sm text-gray-600">ID Proof Type</p>
                    <p className="font-medium capitalize">{selectedBooking.idProof}</p>
                  </div>
                )}

                {selectedBooking.verificationCode && (
                  <div>
                    <p className="text-sm text-gray-600">Verification Code</p>
                    <p className="font-bold text-lg text-blue-600">{selectedBooking.verificationCode}</p>
                  </div>
                )}

                {selectedBooking.assignedTechnician && (
                  <div>
                    <p className="text-sm text-gray-600">Assigned Technician</p>
                    <p className="font-medium">
                      {selectedBooking.assignedTechnician.name} - {selectedBooking.assignedTechnician.phone}
                    </p>
                  </div>
                )}

                {selectedBooking.adminNotes && (
                  <div>
                    <p className="text-sm text-gray-600">Admin Notes</p>
                    <p className="font-medium">{selectedBooking.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default KeyServicesManagement;
