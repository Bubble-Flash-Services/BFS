import React, { useState, useEffect } from 'react';
import { Smartphone, Search, Filter, MapPin, Calendar, User, Phone, CheckCircle, XCircle, Clock, Edit, AlertCircle, DollarSign } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const DEFAULT_MOBILEFIX_STATS = {
  totalBookings: 0,
  pending: 0,
  confirmed: 0,
  assigned: 0,
  inProgress: 0,
  completed: 0,
  totalRevenue: 0,
  serviceTypeCounts: []
};

const MobileFixManagement = () => {
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
        ? `${API}/api/admin/mobilefix/bookings?status=${selectedStatus}`
        : `${API}/api/admin/mobilefix/bookings`;
      
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
      const response = await fetch(`${API}/api/admin/mobilefix/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      } else {
        setStats(DEFAULT_MOBILEFIX_STATS);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(DEFAULT_MOBILEFIX_STATS);
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedEmployee) {
      toast.error('Please select a technician');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${API}/api/admin/mobilefix/booking/${selectedBooking._id}/assign`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ technicianId: selectedEmployee }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success('Technician assigned successfully');
        setShowAssignModal(false);
        fetchBookings();
      } else {
        toast.error('Failed to assign technician');
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
      const response = await fetch(
        `${API}/api/admin/mobilefix/booking/${selectedBooking._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success('Status updated successfully');
        setShowStatusModal(false);
        fetchBookings();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleUpdateNotes = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${API}/api/admin/mobilefix/booking/${selectedBooking._id}/notes`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ adminNotes }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success('Notes updated successfully');
        fetchBookings();
      } else {
        toast.error('Failed to update notes');
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/mobilefix/booking/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Booking deleted successfully');
        fetchBookings();
        fetchStats();
      } else {
        toast.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      'in-progress': 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.userId?.name?.toLowerCase().includes(searchLower) ||
      booking.userId?.phone?.toLowerCase().includes(searchLower) ||
      booking.brandId?.name?.toLowerCase().includes(searchLower) ||
      booking.modelId?.name?.toLowerCase().includes(searchLower) ||
      booking.serviceType?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Smartphone className="w-8 h-8 text-blue-600" />
              MobileFix Pro Management
            </h1>
            <p className="text-gray-600 mt-1">Manage doorstep mobile repair bookings</p>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Assigned</p>
              <p className="text-2xl font-bold text-purple-600">{stats.assigned}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-indigo-600">₹{stats.totalRevenue?.toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No bookings found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Booking ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone Model</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        {booking._id.slice(-8)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{booking.userId?.name}</p>
                            <p className="text-xs text-gray-500">{booking.userId?.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {booking.brandId?.name} {booking.modelId?.name}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {booking.serviceType?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        ₹{booking.pricing?.finalPrice || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailsModal(true);
                              setAdminNotes(booking.adminNotes || '');
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowAssignModal(true);
                              setSelectedEmployee(booking.assignedTechnician?._id || '');
                            }}
                            className="text-purple-600 hover:text-purple-800"
                            title="Assign Technician"
                          >
                            <User className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowStatusModal(true);
                              setNewStatus(booking.status);
                            }}
                            className="text-green-600 hover:text-green-800"
                            title="Update Status"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Customer</label>
                      <p className="font-semibold">{selectedBooking.userId?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-semibold">{selectedBooking.contactPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone Model</label>
                      <p className="font-semibold">
                        {selectedBooking.brandId?.name} {selectedBooking.modelId?.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Service Type</label>
                      <p className="font-semibold">
                        {selectedBooking.serviceType?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Base Price</label>
                      <p className="font-semibold">₹{selectedBooking.pricing?.basePrice}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Final Price</label>
                      <p className="font-semibold text-green-600">₹{selectedBooking.pricing?.finalPrice}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Service Location</label>
                    <p className="font-semibold">{selectedBooking.serviceLocation?.fullAddress}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Preferred Date & Time</label>
                    <p className="font-semibold">
                      {new Date(selectedBooking.preferredDate).toLocaleDateString()} - {selectedBooking.preferredTimeSlot}
                    </p>
                  </div>

                  {selectedBooking.assignedTechnician && (
                    <div>
                      <label className="text-sm text-gray-600">Assigned Technician</label>
                      <p className="font-semibold">
                        {selectedBooking.assignedTechnician.name} - {selectedBooking.assignedTechnician.phone}
                      </p>
                    </div>
                  )}

                  {selectedBooking.specialInstructions && (
                    <div>
                      <label className="text-sm text-gray-600">Special Instructions</label>
                      <p className="font-semibold">{selectedBooking.specialInstructions}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-gray-600 block mb-2">Admin Notes</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Add notes about this booking..."
                    />
                    <button
                      onClick={handleUpdateNotes}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAssignModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Assign Technician</h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Technician
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a technician</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} - {emp.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAssignTechnician}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Assign
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showStatusModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Update Status</h2>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
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

export default MobileFixManagement;
