import React, { useState, useEffect } from 'react';
import { Leaf, Search, Filter, MapPin, Calendar, User, Phone, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

const GreenCleanManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
    fetchProviders();
  }, [selectedStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch Green & Clean bookings from GreenBooking model
      const greenBookingsUrl = selectedStatus 
        ? `${API}/api/green/admin/bookings?status=${selectedStatus}`
        : `${API}/api/green/admin/bookings`;
      
      const greenBookingsResponse = await fetch(greenBookingsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const greenBookingsResult = await greenBookingsResponse.json();
      const greenBookings = greenBookingsResult.success ? (greenBookingsResult.bookings || []) : [];
      
      // Also fetch Green & Clean orders from Order model
      const ordersUrl = selectedStatus
        ? `${API}/api/admin/orders?serviceType=green-clean&status=${selectedStatus}`
        : `${API}/api/admin/orders?serviceType=green-clean`;
      
      const ordersResponse = await fetch(ordersUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const ordersResult = await ordersResponse.json();
      const greenOrders = ordersResult.success ? (ordersResult.data || []) : [];
      
      // Transform orders to match the booking format for unified display
      const transformedOrders = greenOrders.map(order => ({
        _id: order._id,
        bookingNumber: order.orderNumber,
        user: {
          name: order.userId?.name || 'N/A',
          phone: order.userId?.phone || order.serviceAddress?.phone || 'N/A',
          userId: order.userId?._id
        },
        serviceName: order.items?.[0]?.serviceName || 'Green & Clean Service',
        serviceCategory: 'Green & Clean',
        address: {
          full: order.serviceAddress?.fullAddress || 'N/A',
          pincode: order.serviceAddress?.pincode || ''
        },
        totalAmount: order.totalAmount || 0,
        status: order.orderStatus || 'pending',
        scheduledAt: order.scheduledDate || order.createdAt,
        createdAt: order.createdAt,
        payment: {
          status: order.paymentStatus || 'pending',
          method: order.paymentMethod || 'razorpay'
        },
        notes: order.customerNotes || '',
        adminNotes: '',
        isFromOrderModel: true // Flag to identify orders vs bookings
      }));
      
      // Combine both arrays
      const allBookings = [...greenBookings, ...transformedOrders];
      
      // Sort by creation date (newest first)
      allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setBookings(allBookings);
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

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/green/providers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setProviders(result.providers || []);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleAssignProvider = async () => {
    if (!selectedProvider) {
      toast.error('Please select a provider');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/green/admin/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bookingId: selectedBooking._id,
          providerId: selectedProvider 
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Provider assigned successfully');
        setShowAssignModal(false);
        setSelectedProvider('');
        fetchBookings();
      } else {
        toast.error(result.message || 'Failed to assign provider');
      }
    } catch (error) {
      console.error('Error assigning provider:', error);
      toast.error('Failed to assign provider');
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      
      // Check if this is from Order model or GreenBooking model
      if (selectedBooking.isFromOrderModel) {
        // Update order status via admin orders endpoint
        const response = await fetch(`${API}/api/admin/orders/${selectedBooking._id}/status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
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
      } else {
        // Update GreenBooking status
        const response = await fetch(`${API}/api/green/admin/bookings/${selectedBooking._id}/status`, {
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
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      // Shared statuses
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      // GreenBooking specific
      created: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      // Order model specific
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      // Shared statuses
      in_progress: Package,
      completed: CheckCircle,
      cancelled: XCircle,
      // GreenBooking specific
      created: Clock,
      assigned: CheckCircle,
      // Order model specific
      pending: Clock,
      confirmed: CheckCircle,
    };
    return icons[status] || Clock;
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.user?.phone?.toLowerCase().includes(searchLower) ||
      booking.user?.name?.toLowerCase().includes(searchLower) ||
      booking.serviceName?.toLowerCase().includes(searchLower) ||
      booking.bookingNumber?.toLowerCase().includes(searchLower) ||
      booking.address?.full?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Green & Clean Management</h1>
              <p className="text-sm text-gray-600">Manage eco-friendly cleaning service requests</p>
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
                placeholder="Search by booking number, phone, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                <option value="">All Status</option>
                <option value="created">Created</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
                            {booking.serviceName}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Booking #{booking.bookingNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ₹{booking.totalAmount?.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-600">Total Amount</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600">Service Address</p>
                          <p className="text-sm text-gray-900 line-clamp-2">{booking.address?.full}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-600">Customer</p>
                          <p className="text-sm text-gray-900">{booking.user?.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-600">Scheduled</p>
                          <p className="text-sm text-gray-900">
                            {new Date(booking.scheduledAt).toLocaleDateString('en-IN', {
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
                          <p className="text-sm text-gray-900">{booking.user?.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.providerId && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-900">
                          Provider Assigned: <span className="font-medium">{booking.providerId?.name || 'N/A'}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {booking.adminNotes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Admin Notes:</p>
                      <p className="text-sm text-gray-900">{booking.adminNotes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    {!booking.isFromOrderModel && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowAssignModal(true);
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Assign Provider
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setNewStatus(booking.status);
                        setAdminNotes(booking.adminNotes || '');
                        setShowStatusModal(true);
                      }}
                      className={`${booking.isFromOrderModel ? 'flex-1' : 'flex-1'} px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium`}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Assign Provider Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Provider</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Choose a provider</option>
                  {providers.map((provider) => (
                    <option key={provider._id} value={provider._id}>
                      {provider.name} - {provider.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedProvider('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignProvider}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    {selectedBooking?.isFromOrderModel ? (
                      // Order model statuses
                      <>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </>
                    ) : (
                      // GreenBooking statuses
                      <>
                        <option value="created">Created</option>
                        <option value="assigned">Assigned</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </>
                    )}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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

export default GreenCleanManagement;
