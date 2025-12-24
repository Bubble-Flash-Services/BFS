import React, { useState, useEffect } from 'react';
import { Flower2, Search, Filter, MapPin, Calendar, User, Phone, CheckCircle, XCircle, Clock, Edit, AlertCircle, Gift, Package } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || window.location.origin;

// Default stats structure
const DEFAULT_FLOWER_SERVICES_STATS = {
  totalBookings: 0,
  directBookings: 0,
  cartOrders: 0,
  statusCounts: {},
  categoryCounts: {},
  totalRevenue: 0
};

const FlowerServicesManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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
  }, [selectedStatus, selectedCategory]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      let url = `${API}/api/admin/flower-services/bookings?`;
      if (selectedStatus) url += `status=${selectedStatus}&`;
      if (selectedCategory) url += `category=${selectedCategory}&`;
      
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
      const response = await fetch(`${API}/api/admin/flower-services/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      } else {
        setStats(DEFAULT_FLOWER_SERVICES_STATS);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(DEFAULT_FLOWER_SERVICES_STATS);
    }
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `${API}/api/admin/flower-services/booking/${selectedBooking._id}/assign`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ employeeId: selectedEmployee }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success('Delivery person assigned successfully');
        setShowAssignModal(false);
        fetchBookings();
      } else {
        toast.error(result.message || 'Failed to assign delivery person');
      }
    } catch (error) {
      console.error('Error assigning delivery person:', error);
      toast.error('Failed to assign delivery person');
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
        `${API}/api/admin/flower-services/booking/${selectedBooking._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus, adminNotes }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success('Status updated successfully');
        setShowStatusModal(false);
        fetchBookings();
      } else {
        toast.error(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userId?.phone?.includes(searchQuery) ||
      booking.itemName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      'out-for-delivery': 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryColors = {
      'classic-bouquet': 'bg-pink-100 text-pink-800',
      'love-couple-bouquet': 'bg-red-100 text-red-800',
      'premium-bouquet': 'bg-purple-100 text-purple-800',
      'gift-box': 'bg-blue-100 text-blue-800',
      'photo-gift': 'bg-indigo-100 text-indigo-800',
      'love-surprise-box': 'bg-rose-100 text-rose-800',
      'birthday-decoration': 'bg-yellow-100 text-yellow-800',
      'couple-decoration': 'bg-pink-100 text-pink-800',
      'party-decoration': 'bg-orange-100 text-orange-800',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
        {category?.replace(/-/g, ' ')}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Flower2 className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-900">Flower Services Management</h1>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings || 0}</p>
                </div>
                <Package className="w-10 h-10 text-pink-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Direct Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.directBookings || 0}</p>
                </div>
                <Flower2 className="w-10 h-10 text-purple-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Cart Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.cartOrders || 0}</p>
                </div>
                <Gift className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue || 0}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Categories</option>
                <option value="classic-bouquet">Classic Bouquet</option>
                <option value="love-couple-bouquet">Love & Couple Bouquet</option>
                <option value="premium-bouquet">Premium Bouquet</option>
                <option value="gift-box">Gift Box</option>
                <option value="photo-gift">Photo Gift</option>
                <option value="love-surprise-box">Love Surprise Box</option>
                <option value="birthday-decoration">Birthday Decoration</option>
                <option value="couple-decoration">Couple Decoration</option>
                <option value="party-decoration">Party Decoration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.userId?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.userId?.phone || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{booking.itemName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">Qty: {booking.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCategoryBadge(booking.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {booking.deliveryDate ? new Date(booking.deliveryDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.deliveryTime || 'anytime'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
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
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {booking.bookingType !== 'cart' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setSelectedEmployee(booking.assignedDeliveryPerson?._id || '');
                                  setShowAssignModal(true);
                                }}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                Assign
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setNewStatus(booking.status);
                                  setAdminNotes(booking.adminNotes || '');
                                  setShowStatusModal(true);
                                }}
                                className="text-green-600 hover:text-green-900"
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

        {/* Assign Employee Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Assign Delivery Person</h3>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} - {emp.phone}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAssignEmployee}
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                >
                  Assign
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Update Booking Status</h3>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Admin notes..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
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
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Booking Details</h3>
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
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="font-medium">{selectedBooking.userId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedBooking.contactPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service</p>
                    <p className="font-medium">{selectedBooking.itemName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{selectedBooking.category?.replace(/-/g, ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-medium">{selectedBooking.quantity || 1}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Date</p>
                    <p className="font-medium">
                      {selectedBooking.deliveryDate 
                        ? new Date(selectedBooking.deliveryDate).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Time</p>
                    <p className="font-medium">{selectedBooking.deliveryTime || 'anytime'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p>{getStatusBadge(selectedBooking.status)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium">{selectedBooking.serviceLocation?.fullAddress || 'N/A'}</p>
                  </div>
                  {selectedBooking.customization?.message && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Custom Message</p>
                      <p className="font-medium">{selectedBooking.customization.message}</p>
                    </div>
                  )}
                  {selectedBooking.customization?.recipientName && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Recipient Name</p>
                      <p className="font-medium">{selectedBooking.customization.recipientName}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-pink-600">
                      ₹{selectedBooking.pricing?.totalPrice || 0}
                    </p>
                  </div>
                  {selectedBooking.assignedDeliveryPerson && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Assigned Delivery Person</p>
                      <p className="font-medium">
                        {selectedBooking.assignedDeliveryPerson.name} - {selectedBooking.assignedDeliveryPerson.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FlowerServicesManagement;
