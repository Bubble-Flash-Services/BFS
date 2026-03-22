import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Car,
  CheckCircle, 
  AlertCircle, 
  XCircle,
  UserCheck,
  RefreshCw,
  Eye
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const PUCBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [acting, setActing] = useState(false);

  // Fetch PUC bookings
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
        // Filter for PUC certificate bookings
        const pucBookings = (data.data.bookings || []).filter(booking => {
          const items = booking.items || [];
          return items.some(item => 
            (item.type || '').toLowerCase().includes('puc') ||
            (item.category || '').toLowerCase().includes('puc') ||
            (item.serviceName || '').toLowerCase().includes('puc')
          );
        });
        
        setBookings(pucBookings);
        setFilteredBookings(pucBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load PUC bookings');
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

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => {
        const customer = booking.userId?.name || '';
        const phone = booking.userId?.phone || booking.serviceAddress?.phone || '';
        const vehicleNumber = booking.items?.[0]?.vehicleNumber || '';
        const orderNumber = booking.orderNumber || '';
        
        return (
          customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          phone.includes(searchTerm) ||
          vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => {
        const status = booking.orderStatus || booking.status || 'pending';
        return status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  // Assign employee to booking
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

  // Update booking status
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

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusLower = (status || 'pending').toLowerCase();
    
    switch (statusLower) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'assigned':
      case 'in_progress':
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            {statusLower === 'assigned' ? 'Assigned' : 'In Progress'}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-green-600" />
                PUC Certificate Bookings
              </h1>
              <p className="text-gray-600 mt-1">Manage PUC certificate service bookings and employee assignments</p>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, phone, vehicle number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No PUC Bookings Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'No bookings match your filters' 
                : 'No PUC certificate bookings yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
                              <Car className="w-4 h-4" />
                              {item.vehicleType || 'N/A'}
                            </div>
                            <div className="text-gray-600 mt-1">
                              {item.vehicleNumber || 'N/A'}
                            </div>
                            <div className="text-green-600 font-medium">
                              ₹{item.price || 0}
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
                                {booking.serviceAddress?.fullAddress || item.location || 'N/A'}
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
                        <td className="px-6 py-4">
                          {getStatusBadge(status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {!booking.assignedEmployee && status !== 'cancelled' && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowAssignModal(true);
                                }}
                                className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                disabled={acting}
                              >
                                <UserCheck className="w-3 h-3 mr-1" />
                                Assign
                              </button>
                            )}
                            
                            {status === 'assigned' && (
                              <button
                                onClick={() => handleUpdateStatus(booking._id, 'completed')}
                                className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                disabled={acting}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Complete
                              </button>
                            )}
                            
                            {status !== 'cancelled' && status !== 'completed' && (
                              <button
                                onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                                className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
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

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {filteredBookings.map((booking) => {
                const item = booking.items?.[0] || {};
                const customer = booking.userId || {};
                const status = booking.orderStatus || booking.status || 'pending';
                
                return (
                  <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">{booking.orderNumber}</div>
                        <div className="text-sm text-gray-600">{customer.name || 'N/A'}</div>
                      </div>
                      {getStatusBadge(status)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span>{item.vehicleType || 'N/A'} - {item.vehicleNumber || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {booking.scheduledDate 
                            ? new Date(booking.scheduledDate).toLocaleDateString() 
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{booking.scheduledTimeSlot || item.scheduledTime || 'N/A'}</span>
                      </div>
                      {booking.assignedEmployee && (
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-gray-400" />
                          <span>{booking.assignedEmployee.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      {!booking.assignedEmployee && status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowAssignModal(true);
                          }}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                          disabled={acting}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Assign
                        </button>
                      )}
                      
                      {status === 'assigned' && (
                        <button
                          onClick={() => handleUpdateStatus(booking._id, 'completed')}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                          disabled={acting}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Assign Employee Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Assign Employee</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Employee
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose an employee...</option>
                  {employees
                    .filter(emp => emp.isActive)
                    .map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} - {emp.employeeId} ({emp.specialization})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedEmployee('');
                    setSelectedBooking(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={acting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignEmployee}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  disabled={acting || !selectedEmployee}
                >
                  {acting ? 'Assigning...' : 'Assign Employee'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PUCBookingManagement;
