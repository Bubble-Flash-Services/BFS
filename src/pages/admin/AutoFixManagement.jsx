import React, { useState, useEffect } from 'react';
import { Car, Search, Filter, MapPin, Calendar, User, Phone, CheckCircle, XCircle, Clock, Edit, AlertCircle, DollarSign } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const DEFAULT_AUTOFIX_STATS = {
  totalBookings: 0,
  pendingReview: 0,
  priceSent: 0,
  confirmed: 0,
  inProgress: 0,
  completed: 0,
  totalRevenue: 0,
  serviceTypeCounts: {}
};

const AutoFixManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [adminApprovedPrice, setAdminApprovedPrice] = useState('');
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
        ? `${API}/api/admin/autofix/bookings?status=${selectedStatus}`
        : `${API}/api/admin/autofix/bookings`;
      
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
      const response = await fetch(`${API}/api/admin/autofix/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      } else {
        setStats(DEFAULT_AUTOFIX_STATS);
        toast.error(result.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(DEFAULT_AUTOFIX_STATS);
      toast.error('Failed to fetch statistics');
    }
  };

  const handleApprovePrice = async () => {
    if (!adminApprovedPrice) {
      toast.error('Please enter approved price');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/autofix/booking/${selectedBooking._id}/approve-price`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          adminApprovedPrice: parseFloat(adminApprovedPrice),
          adminNotes 
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Price approved and sent to customer');
        setShowPriceModal(false);
        setAdminApprovedPrice('');
        setAdminNotes('');
        fetchBookings();
        fetchStats();
      } else {
        toast.error(result.message || 'Failed to approve price');
      }
    } catch (error) {
      console.error('Error approving price:', error);
      toast.error('Failed to approve price');
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) {
      toast.error('Please select a technician');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/autofix/booking/${selectedBooking._id}/assign`, {
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
      const response = await fetch(`${API}/api/admin/autofix/booking/${selectedBooking._id}/status`, {
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
        fetchStats();
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/autofix/booking/${id}`, {
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
        toast.error(result.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending-review': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      'price-sent': { color: 'bg-blue-100 text-blue-800', label: 'Price Sent' },
      'confirmed': { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
      'assigned': { color: 'bg-purple-100 text-purple-800', label: 'Assigned' },
      'in-progress': { color: 'bg-indigo-100 text-indigo-800', label: 'In Progress' },
      'completed': { color: 'bg-green-200 text-green-900', label: 'Completed' },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>{config.label}</span>;
  };

  const getServiceTypeLabel = (serviceType) => {
    const labels = {
      'minor-dent-repair': 'Minor Dent Repair',
      'scratch-repair': 'Scratch Repair',
      'bumper-repair': 'Bumper Repair',
      'rubbing-polishing': 'Rubbing & Polishing',
    };
    return labels[serviceType] || serviceType;
  };

  const filteredBookings = bookings.filter(booking => {
    const query = searchQuery.toLowerCase();
    return (
      booking.userId?.name?.toLowerCase().includes(query) ||
      booking.userId?.email?.toLowerCase().includes(query) ||
      booking.contactPhone?.includes(query) ||
      booking.serviceLocation?.fullAddress?.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">BFS AutoFix Pro Management</h1>
            <p className="text-gray-600 mt-1">Manage doorstep car repair bookings</p>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm text-gray-600">Total Bookings</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow">
              <div className="text-sm text-yellow-700">Pending Review</div>
              <div className="text-2xl font-bold text-yellow-900">{stats.pendingReview}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <div className="text-sm text-blue-700">Price Sent</div>
              <div className="text-2xl font-bold text-blue-900">{stats.priceSent}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              <div className="text-sm text-green-700">Confirmed</div>
              <div className="text-2xl font-bold text-green-900">{stats.confirmed}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg shadow">
              <div className="text-sm text-purple-700">In Progress</div>
              <div className="text-2xl font-bold text-purple-900">{stats.inProgress}</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <div className="text-sm text-green-700">Completed</div>
              <div className="text-2xl font-bold text-green-900">{stats.completed}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg shadow">
              <div className="text-sm text-orange-700">Total Revenue</div>
              <div className="text-2xl font-bold text-orange-900">₹{stats.totalRevenue}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending-review">Pending Review</option>
              <option value="price-sent">Price Sent</option>
              <option value="confirmed">Confirmed</option>
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{booking.userId?.name}</div>
                            <div className="text-sm text-gray-500">{booking.contactPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{getServiceTypeLabel(booking.serviceType)}</div>
                        {booking.polishingType && (
                          <div className="text-xs text-gray-500">{booking.polishingType}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{booking.carCategory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.preferredDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">{booking.preferredTimeSlot}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{booking.adminApprovedPrice || booking.pricing?.finalPrice || booking.pricing?.basePrice}
                        </div>
                        {booking.pricing?.isFirstOrder && (
                          <div className="text-xs text-green-600">First order</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            View
                          </button>
                          {booking.status === 'pending-review' && (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setAdminApprovedPrice('');
                                setShowPriceModal(true);
                              }}
                              className="text-green-600 hover:text-green-800"
                              title="Approve Price"
                            >
                              Price
                            </button>
                          )}
                          {(booking.status === 'confirmed' || booking.status === 'price-sent') && (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowAssignModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-800"
                              title="Assign Technician"
                            >
                              Assign
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setNewStatus(booking.status);
                              setShowStatusModal(true);
                            }}
                            className="text-orange-600 hover:text-orange-800"
                            title="Update Status"
                          >
                            Status
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            Delete
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

        {/* Price Approval Modal */}
        {showPriceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Approve Final Price</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price: ₹{selectedBooking?.pricing?.basePrice}
                  </label>
                  {selectedBooking?.damagePhotos?.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Damage Photos
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedBooking.damagePhotos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo.url}
                            alt={`Damage ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Final Approved Price *
                  </label>
                  <input
                    type="number"
                    value={adminApprovedPrice}
                    onChange={(e) => setAdminApprovedPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter approved price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Add any notes..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleApprovePrice}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                  >
                    Approve & Send to Customer
                  </button>
                  <button
                    onClick={() => {
                      setShowPriceModal(false);
                      setAdminApprovedPrice('');
                      setAdminNotes('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Technician Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Assign Technician</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Technician *
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a technician</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name} - {employee.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleAssignEmployee}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedEmployee('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="pending-review">Pending Review</option>
                    <option value="price-sent">Price Sent</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Add any notes..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateStatus}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setNewStatus('');
                      setAdminNotes('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
              <h3 className="text-xl font-bold mb-4">Booking Details</h3>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="text-gray-900">{selectedBooking.userId?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedBooking.contactPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Service</label>
                    <p className="text-gray-900">{getServiceTypeLabel(selectedBooking.serviceType)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Car Category</label>
                    <p className="text-gray-900 capitalize">{selectedBooking.carCategory}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <p className="text-gray-900">{new Date(selectedBooking.preferredDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Time</label>
                    <p className="text-gray-900">{selectedBooking.preferredTimeSlot}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900">{selectedBooking.serviceLocation?.fullAddress}</p>
                  </div>
                  {selectedBooking.specialInstructions && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Special Instructions</label>
                      <p className="text-gray-900">{selectedBooking.specialInstructions}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Base Price</label>
                    <p className="text-gray-900">₹{selectedBooking.pricing?.basePrice}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Final Price</label>
                    <p className="text-gray-900">₹{selectedBooking.adminApprovedPrice || selectedBooking.pricing?.finalPrice}</p>
                  </div>
                  {selectedBooking.adminNotes && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Admin Notes</label>
                      <p className="text-gray-900">{selectedBooking.adminNotes}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AutoFixManagement;
