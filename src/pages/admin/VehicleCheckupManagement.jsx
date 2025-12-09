import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Car,
  Bike,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  UserCheck,
  Search,
  Eye,
  RefreshCw,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const VehicleCheckupManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [acting, setActing] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    vehicleType: '',
    search: '',
  });

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  // Fetch vehicle checkup bookings from orders (same approach as PUC bookings)
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API}/api/adminNew/bookings?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        // Filter for vehicle checkup bookings
        const checkupBookings = (data.data.bookings || []).filter(booking => {
          const items = booking.items || [];
          return items.some(item => 
            (item.type || '').toLowerCase().includes('vehicle-checkup') ||
            (item.type || '').toLowerCase().includes('checkup') ||
            (item.category || '').toLowerCase().includes('vehicle checkup') ||
            (item.serviceName || '').toLowerCase().includes('vehicle check-up') ||
            (item.serviceName || '').toLowerCase().includes('body vehicle check')
          );
        });
        
        setBookings(checkupBookings);
        setFilteredBookings(checkupBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load vehicle checkup bookings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API}/api/adminNew/employees?page=1&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        setEmployees(data.data.employees || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (filters.status) {
      filtered = filtered.filter((b) => {
        const status = b.orderStatus || b.status || 'pending';
        return status.toLowerCase() === filters.status.toLowerCase();
      });
    }

    if (filters.vehicleType) {
      filtered = filtered.filter((b) => {
        const item = b.items?.[0] || {};
        return item.vehicleType?.toLowerCase() === filters.vehicleType.toLowerCase();
      });
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.userId?.name?.toLowerCase().includes(searchLower) ||
          b.userId?.email?.toLowerCase().includes(searchLower) ||
          b.userId?.phone?.includes(searchLower) ||
          b.orderNumber?.toLowerCase().includes(searchLower) ||
          b.serviceAddress?.phone?.includes(searchLower)
      );
    }

    setFilteredBookings(filtered);
  };

  // Update booking status using adminNew API
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setActing(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API}/api/adminNew/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchBookings();
        setShowDetailsModal(false);
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setActing(false);
    }
  };

  // Assign employee using adminNew API
  const handleAssignEmployee = async () => {
    if (!selectedEmployee || !selectedBooking) {
      toast.error('Please select an employee');
      return;
    }

    try {
      setActing(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API}/api/adminNew/bookings/${selectedBooking._id}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employeeId: selectedEmployee })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Employee assigned successfully');
        setShowAssignModal(false);
        setSelectedEmployee('');
        setSelectedBooking(null);
        fetchBookings();
      } else {
        toast.error(data.message || 'Failed to assign employee');
      }
    } catch (error) {
      console.error('Error assigning employee:', error);
      toast.error('Failed to assign employee');
    } finally {
      setActing(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      'in-progress': 'bg-orange-100 text-orange-800',
      'inspection-completed': 'bg-indigo-100 text-indigo-800',
      'report-generated': 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getVehicleIcon = (type) => {
    return type === 'bike' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />;
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardCheck className="w-8 h-8 text-[#1F3C88]" />
                Vehicle Checkup Bookings
              </h1>
              <p className="text-gray-600 mt-1">Manage vehicle inspection bookings and employee assignments</p>
            </div>
            <button
              onClick={() => {
                setRefreshing(true);
                fetchBookings().finally(() => setRefreshing(false));
              }}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, email, phone..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C88] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C88] focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="inspection-completed">Inspection Completed</option>
                <option value="report-generated">Report Generated</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={filters.vehicleType}
                onChange={(e) =>
                  setFilters({ ...filters, vehicleType: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C88] focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="bike">Two-Wheeler</option>
                <option value="car">Four-Wheeler</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                &nbsp;
              </label>
              <button
                onClick={() =>
                  setFilters({ status: '', vehicleType: '', search: '' })
                }
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-[#1F3C88]">
                  {bookings.length}
                </p>
              </div>
              <ClipboardCheck className="w-12 h-12 text-[#1F3C88] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {bookings.filter((b) => (b.orderStatus || b.status || 'pending') === 'pending').length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Assigned/In Progress</p>
                <p className="text-3xl font-bold text-orange-600">
                  {bookings.filter((b) => {
                    const status = (b.orderStatus || b.status || '').toLowerCase();
                    return status === 'assigned' || status === 'in-progress' || status === 'in_progress';
                  }).length}
                </p>
              </div>
              <UserCheck className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter((b) => (b.orderStatus || b.status || '') === 'completed').length}
                </p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F3C88] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order & Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => {
                    const item = booking.items?.[0] || {};
                    const customer = booking.userId || {};
                    const status = booking.orderStatus || booking.status || 'pending';
                    
                    return (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{booking.orderNumber}</div>
                            <div className="text-gray-600 flex items-center gap-1 mt-1">
                              <User className="w-3 h-3" />
                              {customer.name || 'N/A'}
                            </div>
                            <div className="text-gray-600 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {customer.phone || booking.serviceAddress?.phone || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900 flex items-center gap-1">
                              {getVehicleIcon(item.vehicleType)}
                              <span className="capitalize">{item.vehicleType || 'N/A'}</span>
                            </div>
                            <div className="text-gray-600 mt-1">
                              {item.packageName || 'N/A'}
                            </div>
                            <div className="text-green-600 font-medium">
                              ₹{booking.totalAmount || item.price || 0}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="flex items-center gap-1 text-gray-900">
                              <Calendar className="w-3 h-3" />
                              {booking.scheduledDate 
                                ? new Date(booking.scheduledDate).toLocaleDateString() 
                                : 'N/A'}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 mt-1">
                              <Clock className="w-3 h-3" />
                              {booking.scheduledTimeSlot || item.scheduledTime || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs">
                            <div className="flex items-start gap-1">
                              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">
                                {booking.serviceAddress?.fullAddress || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {booking.assignedEmployee ? (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {booking.assignedEmployee.name}
                              </div>
                              <div className="text-gray-600 text-xs">
                                {booking.assignedEmployee.employeeId}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Not assigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}
                          >
                            {(status || 'pending').replace(/[-_]/g, ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsModal(true);
                              }}
                              className="text-[#1F3C88] hover:text-[#2952A3] font-medium"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {!booking.assignedEmployee && status !== 'cancelled' && status !== 'completed' && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowAssignModal(true);
                                }}
                                className="text-green-600 hover:text-green-800 font-medium"
                              >
                                <UserCheck className="w-5 h-5" />
                              </button>
                            )}
                            {status === 'assigned' && (
                              <button
                                onClick={() => handleUpdateStatus(booking._id, 'completed')}
                                className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                disabled={acting}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Complete
                              </button>
                            )}
                            {status !== 'cancelled' && status !== 'completed' && (
                              <button
                                onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                                className="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                disabled={acting}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-[#1F3C88] mb-6">
              Booking Details - {selectedBooking.orderNumber}
            </h2>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <span>{selectedBooking.userId?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{selectedBooking.userId?.phone || selectedBooking.serviceAddress?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{selectedBooking.userId?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{selectedBooking.serviceAddress?.fullAddress || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Service Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Vehicle Type:</span>{' '}
                    <span className="font-medium capitalize">
                      {selectedBooking.items?.[0]?.vehicleType || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Package:</span>{' '}
                    <span className="font-medium capitalize">
                      {selectedBooking.items?.[0]?.packageName || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Scheduled Date:</span>{' '}
                    <span className="font-medium">
                      {selectedBooking.scheduledDate 
                        ? new Date(selectedBooking.scheduledDate).toLocaleDateString() 
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time Slot:</span>{' '}
                    <span className="font-medium">
                      {selectedBooking.scheduledTimeSlot || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>{' '}
                    <span className="font-medium text-green-600">
                      ₹{selectedBooking.totalAmount || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Method:</span>{' '}
                    <span className="font-medium capitalize">
                      {selectedBooking.paymentMethod || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Update Status</h3>
                <select
                  value={selectedBooking.orderStatus || selectedBooking.status || 'pending'}
                  onChange={(e) =>
                    handleUpdateStatus(selectedBooking._id, e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  disabled={acting}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="assigned">Assigned</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Assign Employee Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-[#1F3C88] mb-6">
              Assign Employee
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F3C88]"
              >
                <option value="">Choose an employee...</option>
                {employees
                  .filter(emp => emp.isActive)
                  .map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} - {emp.employeeId} ({emp.specialization || 'General'})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedEmployee('');
                  setSelectedBooking(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={acting}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignEmployee}
                className="px-6 py-2 bg-[#1F3C88] text-white rounded-lg hover:bg-[#2952A3] disabled:opacity-50"
                disabled={acting || !selectedEmployee}
              >
                {acting ? 'Assigning...' : 'Assign Employee'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default VehicleCheckupManagement;
