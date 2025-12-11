import React, { useState, useEffect } from 'react';
import { Truck, Search, Filter, MapPin, Calendar, User, Phone, Package, CheckCircle, XCircle, Clock, Edit } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const MoversPackersManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
  }, [selectedStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const url = selectedStatus 
        ? `${API}/api/admin/movers-packers/bookings?status=${selectedStatus}`
        : `${API}/api/admin/movers-packers/bookings`;
      
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

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/movers-packers/booking/${selectedBooking._id}/assign`, {
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
      const response = await fetch(`${API}/api/admin/movers-packers/booking/${selectedBooking._id}/status`, {
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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      'in-progress': Package,
      completed: CheckCircle,
      cancelled: XCircle,
    };
    return icons[status] || Clock;
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.contactPhone?.toLowerCase().includes(searchLower) ||
      booking.contactEmail?.toLowerCase().includes(searchLower) ||
      booking.sourceCity?.fullAddress?.toLowerCase().includes(searchLower) ||
      booking.destinationCity?.fullAddress?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFB400] rounded-lg">
              <Truck className="w-6 h-6 text-[#1F3C88]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Movers & Packers Management</h1>
              <p className="text-sm text-gray-600">Manage moving service requests and assignments</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by phone, email, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent appearance-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB400]"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);
              return (
                <div key={booking._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="w-6 h-6 text-gray-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {booking.homeSize} - {booking.moveType === 'within-city' ? 'Within City' : 'Intercity'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Booking ID: {booking._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#1F3C88]">
                        ₹{booking.estimatedPrice?.totalPrice?.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-600">Estimated Price</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600">From</p>
                          <p className="text-sm text-gray-900 truncate">{booking.sourceCity?.fullAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600">To</p>
                          <p className="text-sm text-gray-900 truncate">{booking.destinationCity?.fullAddress}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-600">Moving Date</p>
                          <p className="text-sm text-gray-900">
                            {new Date(booking.movingDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-600">Contact</p>
                          <p className="text-sm text-gray-900">{booking.contactPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.assignedEmployee && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-900">
                          Assigned to: <span className="font-medium">{booking.assignedEmployee?.name || 'N/A'}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowAssignModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-[#1F3C88] text-white rounded-lg hover:bg-[#2952A3] transition-colors text-sm font-medium"
                    >
                      Assign Employee
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setNewStatus(booking.status);
                        setAdminNotes(booking.adminNotes || '');
                        setShowStatusModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-[#FFB400] text-[#1F3C88] rounded-lg hover:bg-[#e0a000] transition-colors text-sm font-medium"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Assign Employee Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Employee</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Employee
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
                >
                  <option value="">Choose an employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} - {emp.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedEmployee('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignEmployee}
                  className="flex-1 px-4 py-2 bg-[#FFB400] text-[#1F3C88] rounded-lg hover:bg-[#e0a000] font-medium"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Update Booking Status</h3>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB400] focus:border-transparent resize-none"
                    placeholder="Add any notes or comments..."
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus('');
                    setAdminNotes('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 px-4 py-2 bg-[#FFB400] text-[#1F3C88] rounded-lg hover:bg-[#e0a000] font-medium"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MoversPackersManagement;
