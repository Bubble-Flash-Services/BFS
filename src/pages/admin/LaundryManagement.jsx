import React, { useState, useEffect } from 'react';
import { Shirt, Search, Filter, MapPin, Calendar, User, Phone, Package, CheckCircle, XCircle, Clock, Edit, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const LaundryManagement = () => {
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
        ? `${API}/api/admin/laundry/bookings?status=${selectedStatus}`
        : `${API}/api/admin/laundry/bookings`;
      
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
      const response = await fetch(`${API}/api/admin/laundry/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      } else {
        // Set default stats if API returns unsuccessful response
        setStats({
          totalBookings: 0,
          totalRevenue: 0,
          statusCounts: {},
          itemTypes: []
        });
        toast.error(result.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats on error
      setStats({
        totalBookings: 0,
        totalRevenue: 0,
        statusCounts: {},
        itemTypes: []
      });
      toast.error('Failed to fetch statistics');
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/laundry/booking/${selectedBooking._id}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId: selectedEmployee }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Employee assigned successfully');
        setShowAssignModal(false);
        setSelectedEmployee('');
        fetchBookings();
      } else {
        toast.error(result.message || 'Failed to assign employee');
      }
    } catch (error) {
      console.error('Error assigning employee:', error);
      toast.error('Failed to assign employee');
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/laundry/booking/${selectedBooking._id}/status`, {
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
      booking.orderNumber?.toLowerCase().includes(searchLower) ||
      booking.serviceAddress?.phone?.includes(searchQuery) ||
      booking._id?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'assigned': 'bg-indigo-100 text-indigo-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': Clock,
      'confirmed': CheckCircle,
      'assigned': User,
      'in_progress': Package,
      'completed': CheckCircle,
      'cancelled': XCircle,
    };
    return icons[status] || AlertCircle;
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shirt className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laundry Services Management</h1>
              <p className="text-gray-600">Manage laundry service bookings and orders</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Total Bookings</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-2xl font-bold text-green-600">₹{stats.totalRevenue?.toFixed(2)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Pending Orders</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.statusCounts?.pending || 0}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Completed Orders</div>
              <div className="text-2xl font-bold text-green-600">{stats.statusCounts?.completed || 0}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, order number, or phone..."
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
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const StatusIcon = getStatusIcon(booking.orderStatus);
                    return (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.orderNumber}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.userId?.name || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {booking.serviceAddress?.phone || booking.userId?.phone || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {booking.serviceDetails?.map((service, idx) => (
                              <div key={idx}>{service.serviceName}</div>
                            ))}
                          </div>
                          {booking.laundryItems && booking.laundryItems.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {booking.laundryItems.length} item types
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div className="text-sm text-gray-900">
                              {booking.scheduledDate 
                                ? new Date(booking.scheduledDate).toLocaleDateString()
                                : 'Not scheduled'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{booking.totalAmount?.toFixed(2) || '0.00'}
                          </div>
                          <div className="text-xs text-gray-500">{booking.paymentMethod}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.orderStatus)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {formatStatus(booking.orderStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.assignedEmployee ? (
                            <div className="text-sm text-gray-900">{booking.assignedEmployee.name}</div>
                          ) : (
                            <span className="text-xs text-gray-500">Not assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {!booking.assignedEmployee && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowAssignModal(true);
                                }}
                                className="text-green-600 hover:text-green-900"
                                title="Assign Employee"
                              >
                                <User className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setNewStatus(booking.orderStatus);
                                setShowStatusModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900"
                              title="Update Status"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assign Employee Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Assign Employee</h3>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} - {emp.specialization}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAssignEmployee}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Assign
                </button>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedEmployee('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Update Status</h3>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Admin notes (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus('');
                    setAdminNotes('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4">
              <h3 className="text-lg font-bold mb-4">Booking Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-semibold">Order Number:</label>
                  <p>{selectedBooking.orderNumber}</p>
                </div>
                <div>
                  <label className="font-semibold">Customer:</label>
                  <p>{selectedBooking.userId?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.userId?.email}</p>
                  <p className="text-sm text-gray-600">{selectedBooking.userId?.phone}</p>
                </div>
                <div>
                  <label className="font-semibold">Service Address:</label>
                  <p>{selectedBooking.serviceAddress?.fullAddress || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Phone: {selectedBooking.serviceAddress?.phone || 'N/A'}</p>
                </div>
                {selectedBooking.laundryItems && selectedBooking.laundryItems.length > 0 && (
                  <div>
                    <label className="font-semibold">Laundry Items:</label>
                    <div className="mt-2 space-y-2">
                      {selectedBooking.laundryItems.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-2 rounded">
                          <p>{item.itemType} - Qty: {item.quantity} - ₹{item.pricePerItem} each</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="font-semibold">Total Amount:</label>
                  <p className="text-lg">₹{selectedBooking.totalAmount?.toFixed(2)}</p>
                </div>
                <div>
                  <label className="font-semibold">Payment Method:</label>
                  <p>{selectedBooking.paymentMethod}</p>
                </div>
                <div>
                  <label className="font-semibold">Payment Status:</label>
                  <p>{selectedBooking.paymentStatus}</p>
                </div>
                {selectedBooking.customerNotes && (
                  <div>
                    <label className="font-semibold">Notes:</label>
                    <p>{selectedBooking.customerNotes}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="mt-4 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default LaundryManagement;
