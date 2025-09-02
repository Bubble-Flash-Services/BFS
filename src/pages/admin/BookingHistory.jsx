import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Download, Eye, User, Phone, MapPin, Package, Calendar as CalendarIcon, CreditCard, Clock, CheckCircle, AlertCircle, XCircle, RefreshCw, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceModeFilter, setServiceModeFilter] = useState('all'); // Now used for payment method
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [acting, setActing] = useState(false);

  // Function to fetch bookings from backend
  const fetchBookings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch('/api/adminNew/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        console.log('Admin token expired or invalid, redirecting to login...');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        const formattedBookings = result.data.bookings.map(booking => ({
          id: booking.orderNumber,
          customerName: booking.userId?.name || 'N/A',
          phone: booking.userId?.phone || 'N/A',
          email: booking.userId?.email || 'N/A',
          serviceMode: booking.items[0]?.serviceName || 'Mixed Services',
          plan: booking.items[0]?.packageName || 'Custom',
          category: booking.items[0]?.vehicleType || 'Standard',
          location: booking.serviceAddress?.fullAddress || 'N/A',
          bookingDate: new Date(booking.createdAt).toISOString().split('T')[0],
          scheduledDate: new Date(booking.scheduledDate).toISOString().split('T')[0],
          completedDate: booking.actualEndTime ? new Date(booking.actualEndTime).toISOString().split('T')[0] : null,
          amount: booking.totalAmount,
          status: booking.orderStatus,
          paymentMethod: booking.paymentMethod,
          paymentStatus: booking.paymentStatus,
          items: booking.items,
          serviceAddress: booking.serviceAddress,
          customerNotes: booking.customerNotes,
          estimatedDuration: booking.estimatedDuration,
          discountAmount: booking.discountAmount,
          couponCode: booking.couponCode,
          subtotal: booking.subtotal,
          scheduledTimeSlot: booking.scheduledTimeSlot,
          rating: booking.rating,
          review: booking.review
        }));
        
        setBookings(formattedBookings);
        setFilteredBookings(formattedBookings);
      } else {
        console.error('Failed to fetch bookings:', result.message);
        // Fallback to mock data if API fails
        loadMockData();
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback to mock data if API fails
      loadMockData();
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Function to load mock data as fallback
  const loadMockData = () => {
    // Keep existing mock data as fallback
    const mockBookings = [
        {
          id: 'BF001',
          customerName: 'Darvin Kumar',
          phone: '9566751053',
          serviceMode: 'Car',
          plan: 'Premium Wash',
          category: 'Hatchbacks',
          location: 'HSR Layout',
          bookingDate: '2025-07-23',
          completedDate: '2025-07-23',
          amount: 699,
          status: 'completed',
          paymentMethod: 'UPI'
        },
        {
          id: 'BF002',
          customerName: 'Priya Sharma',
          phone: '9876543210',
          serviceMode: 'Bike',
          plan: 'Basic Wash',
          category: 'Standard',
          location: 'Koramangala',
          bookingDate: '2025-07-22',
          completedDate: '2025-07-22',
          amount: 199,
          status: 'completed',
          paymentMethod: 'Card'
        },
        {
          id: 'BF003',
          customerName: 'Rajesh Kumar',
          phone: '9123456789',
          serviceMode: 'Laundry',
          plan: 'Dry Clean',
          category: 'Premium',
          location: 'Whitefield',
          bookingDate: '2025-07-23',
          completedDate: null,
          amount: 299,
          status: 'in-progress',
          paymentMethod: 'Cash'
        },
        {
          id: 'BF004',
          customerName: 'Anita Singh',
          phone: '9555666777',
          serviceMode: 'Car',
          plan: 'Deluxe Wash',
          category: 'SUV',
          location: 'Indiranagar',
          bookingDate: '2025-07-21',
          completedDate: null,
          amount: 899,
          status: 'cancelled',
          paymentMethod: 'UPI'
        },
        {
          id: 'BF005',
          customerName: 'Vikram Patel',
          phone: '9444555666',
          serviceMode: 'Bike',
          plan: 'Premium Wash',
          category: 'Standard',
          location: 'Electronic City',
          bookingDate: '2025-07-20',
          completedDate: '2025-07-20',
          amount: 299,
          status: 'completed',
          paymentMethod: 'UPI'
        },
        {
          id: 'BF006',
          customerName: 'Sneha Reddy',
          phone: '9333444555',
          serviceMode: 'Laundry',
          plan: 'Wash & Fold',
          category: 'Basic',
          location: 'Jayanagar',
          bookingDate: '2025-07-23',
          completedDate: null,
          amount: 199,
          status: 'pending',
          paymentMethod: 'Card'
        }
      ];
      
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
    };

  // Fetch bookings from backend
  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchBookings(true);
  };

  // Filter bookings based on search term and filters
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (serviceModeFilter !== 'all') {
      filtered = filtered.filter(booking => 
        booking.paymentMethod && booking.paymentMethod.toLowerCase() === serviceModeFilter.toLowerCase()
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const bookingDate = new Date();

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(booking => 
            booking.bookingDate === today.toISOString().split('T')[0]
          );
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => 
            new Date(booking.bookingDate) >= weekAgo
          );
          break;
        case 'month':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          filtered = filtered.filter(booking => 
            new Date(booking.bookingDate) >= monthAgo
          );
          break;
      }
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, serviceModeFilter, statusFilter, dateFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceModeColor = (mode) => {
    switch (mode.toLowerCase()) {
      case 'car':
        return 'bg-blue-100 text-blue-800';
      case 'bike':
        return 'bg-green-100 text-green-800';
      case 'laundry':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportData = () => {
    console.log('Export booking data');
    // Implement export functionality
  };

  const handleViewBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) return;
    if (!window.confirm('Cancel this booking?')) return;
    try {
      setActing(true);
      const res = await fetch(`/api/adminNew/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'your order is cancalled by the the management' })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Update state lists
        const updated = bookings.map(b => b.id === bookingId ? {
          ...b,
          status: 'cancelled'
        } : b);
        setBookings(updated);
        setFilteredBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        if (selectedBooking && selectedBooking.id === bookingId) setSelectedBooking({ ...selectedBooking, status: 'cancelled' });
      } else {
        alert(result.message || 'Failed to cancel');
      }
    } catch (e) {
      console.error('Cancel booking failed:', e);
      alert('Failed to cancel');
    } finally {
      setActing(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

  const getTotalStats = () => {
    const totalBookings = filteredBookings.length;
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.amount, 0);
    const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;
    const pendingBookings = filteredBookings.filter(b => b.status === 'pending' || b.status === 'in-progress').length;

    return { totalBookings, totalRevenue, completedBookings, pendingBookings };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking History</h1>
            <p className="text-gray-600">View and manage all customer bookings</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Payment Method Filter */}
            <div>
              <select
                value={serviceModeFilter}
                onChange={(e) => setServiceModeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Payment Methods</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="cash">Cash on Delivery</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleExportData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Booking Records ({filteredBookings.length})
            </h2>
          </div>
          {/* Mobile card list */}
          <div className="md:hidden p-4 space-y-4">
            {filteredBookings.length === 0 && (
              <div className="text-sm text-gray-500">No bookings found</div>
            )}
            {filteredBookings.map((b) => (
              <div key={b.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-gray-900">#{b.id}</div>
                    <div className="text-sm text-gray-600">{b.customerName} • {b.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">₹{b.amount}</div>
                    <div className={`mt-1 text-xs inline-block px-2 py-1 rounded-full ${(b.paymentStatus === 'completed') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{(b.paymentStatus === 'completed') ? 'completed' : 'pending'}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-700">
                  {b.items && b.items.length ? (
                    <ul className="space-y-1">
                      {b.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>
                            <span className="font-medium">{it.serviceName}</span>
                            {it.packageName && <span className="text-gray-500"> - {it.packageName}</span>}
                            <span className="block text-xs text-gray-400">{it.vehicleType} × {it.quantity}</span>
                          </span>
                          <span className="text-green-600 font-medium">₹{it.price}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-600">
                      <span className="font-medium">{b.serviceMode}</span>
                      <span className="block text-xs">{b.plan} - {b.category}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="text-gray-800 text-right ml-3 flex-1 line-clamp-2">{b.location}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Booked</span><span className="text-gray-800">{b.bookingDate}</span></div>
                  {b.completedDate && <div className="flex justify-between"><span className="text-gray-500">Completed</span><span className="text-gray-800">{b.completedDate}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(b.status)}`}>{b.status}</span></div>
                </div>
                <div className="mt-4">
                  <button onClick={() => handleViewBooking(b.id)} className="px-3 py-2 rounded border text-blue-600 border-blue-200">View Details</button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cart Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
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
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {booking.items && booking.items.length > 0 ? (
                          <div className="space-y-1">
                            {booking.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <div>
                                  <span className="font-medium text-gray-900">{item.serviceName}</span>
                                  {item.packageName && (
                                    <span className="text-gray-500"> - {item.packageName}</span>
                                  )}
                                  <div className="text-xs text-gray-400">
                                    {item.vehicleType} × {item.quantity}
                                  </div>
                                </div>
                                <span className="text-green-600 font-medium">₹{item.price}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">{booking.serviceMode}</span>
                            <br />
                            <span className="text-xs">{booking.plan} - {booking.category}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.bookingDate}</div>
                      {booking.completedDate && (
                        <div className="text-sm text-gray-500">Completed: {booking.completedDate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Payment Status (only Completed or Pending) */}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (booking.paymentStatus === 'completed') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {(booking.paymentStatus === 'completed') ? 'completed' : 'pending'}
                      </span>
                      <div className="text-sm text-gray-900 mt-1">₹{booking.amount}</div>
                    </td>
                    {/* Order Status column: dropdown to set Completed/Pending/Cancelled */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={(booking.status === 'completed' || booking.status === 'cancelled') ? booking.status : 'pending'}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            setActing(true);
                            const res = await fetch(`/api/adminNew/bookings/${booking.id}/status`, {
                              method: 'PUT',
                              headers: {
                                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ status: newStatus })
                            });
                            const result = await res.json();
                            if (res.ok && result.success) {
                              const bUpd = result.booking;
                              const patch = {
                                status: newStatus,
                                amount: bUpd?.totalAmount ?? booking.amount,
                                paymentStatus: bUpd?.paymentStatus ?? booking.paymentStatus,
                                completedDate: (bUpd?.actualEndTime ? new Date(bUpd.actualEndTime).toISOString().split('T')[0] : booking.completedDate)
                              };
                              const updated = bookings.map(b => b.id === booking.id ? { ...b, ...patch } : b);
                              setBookings(updated);
                              setFilteredBookings(prev => prev.map(b => b.id === booking.id ? { ...b, ...patch } : b));
                              if (selectedBooking && selectedBooking.id === booking.id) setSelectedBooking({ ...selectedBooking, ...patch });
                            } else {
                              alert(result.message || 'Failed to update status');
                            }
                          } catch (err) {
                            console.error('Update status failed:', err);
                            alert('Failed to update status');
                          } finally {
                            setActing(false);
                          }
                        }}
                        className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(booking.status)}`}
                      >
                        <option value="completed">completed</option>
                        <option value="pending">pending</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewBooking(booking.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {/* Cancel action removed; status managed via dropdown */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No bookings found</div>
              <div className="text-gray-400">Try adjusting your search or filter criteria</div>
            </div>
          )}
        </div>

        {/* Detailed Booking Modal */}
        {showDetailModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 relative">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center rounded-t-3xl z-[110]">
                <div>
                  <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                  <p className="text-blue-100">#{selectedBooking.id}</p>
                </div>
                <button
                  onClick={closeDetailModal}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-8">
                
                {/* Customer Information */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{selectedBooking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedBooking.phone}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Service Address</p>
                      <p className="font-medium text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedBooking.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Service Details
                  </h3>
                  <div className="space-y-6">
                    {selectedBooking.items && selectedBooking.items.length > 0 ? (() => {
                      const getItemGroup = (item) => {
                        const type = (item.type || '').toLowerCase();
                        const label = ((item.serviceName || '') + ' ' + (item.vehicleType || '')).toLowerCase();
                        if (type.includes('car')) return 'Car';
                        if (type.includes('bike')) return 'Bike';
                        if (type.includes('helmet')) return 'Helmet';
                        if (/hatch|sedan|suv|mid\s*-\s*suv|luxur/.test(label)) return 'Car';
                        if (/scooter|motorbike|cruiser|bike/.test(label)) return 'Bike';
                        if (/helmet/.test(label)) return 'Helmet';
                        return 'Others';
                      };
                      const groups = {};
                      selectedBooking.items.forEach((it) => {
                        const g = getItemGroup(it);
                        if (!groups[g]) groups[g] = [];
                        groups[g].push(it);
                      });
                      const order = ['Car','Bike','Helmet','Others'];
                      return order.filter(k=>groups[k]?.length).map((gk) => (
                        <div key={gk}>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-800">{gk}</h4>
                            <span className="text-xs text-gray-500">{groups[gk].length} item{groups[gk].length>1?'s':''}</span>
                          </div>
                          <div className="space-y-4">
                            {groups[gk].map((item, index) => (
                        <div key={index} className="bg-white rounded-lg border border-blue-200 overflow-hidden">
                          {/* Item Header */}
                          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{item.serviceName}</h4>
                                <p className="text-sm text-gray-600">{item.vehicleType || 'Standard'}</p>
                              </div>
                              {(() => {
                                const addOnsTotal = (item.addOns || []).reduce((s, a) => s + (a.price * (a.quantity || 1)), 0);
                                const laundryTotal = (item.laundryItems || []).reduce((s, l) => s + (l.pricePerItem * (l.quantity || 1)), 0);
                                const baseTotal = (item.price || 0) * (item.quantity || 1);
                                const finalTotal = baseTotal + addOnsTotal + laundryTotal;
                                return (
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">₹{finalTotal}</p>
                                    <p className="text-sm text-gray-500">₹{item.price} each</p>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Package Details */}
                          <div className="px-6 py-4">
                            <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Package Includes</h5>
                              <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Base Service: {item.packageName || 'Custom Package'}</span>
                  <span className="text-gray-900 font-medium">₹{item.price}</span>
                                </div>
                  {Array.isArray(item.includedFeatures) && item.includedFeatures.length > 0 && (
                                    <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-700 mb-1">{(item.type||'')==='monthly_plan' ? 'Plan Features' : 'Included Features'}</p>
                                      <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                        {item.includedFeatures.map((f, i) => (
                                          <li key={i}>{f}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {item.planDetails && (
                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {Array.isArray(item.planDetails.washIncludes) && item.planDetails.washIncludes.length > 0 && (
                                        <div className="bg-white rounded p-3 border border-blue-200">
                                          <p className="text-xs font-semibold text-gray-700 mb-1">Each Wash Includes</p>
                                          <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                            {item.planDetails.washIncludes.map((f, i) => <li key={i}>{f}</li>)}
                                          </ul>
                                        </div>
                                      )}
                                      {Array.isArray(item.planDetails.weeklyIncludes) && item.planDetails.weeklyIncludes.length > 0 && (
                                        <div className="bg-white rounded p-3 border border-blue-200">
                                          <p className="text-xs font-semibold text-gray-700 mb-1">Weekly Includes</p>
                                          <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                            {item.planDetails.weeklyIncludes.map((f, i) => <li key={i}>{f}</li>)}
                                          </ul>
                                        </div>
                                      )}
                                      {Array.isArray(item.planDetails.biWeeklyIncludes) && item.planDetails.biWeeklyIncludes.length > 0 && (
                                        <div className="bg-white rounded p-3 border border-blue-200">
                                          <p className="text-xs font-semibold text-gray-700 mb-1">Bi-Weekly Includes</p>
                                          <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                            {item.planDetails.biWeeklyIncludes.map((f, i) => <li key={i}>{f}</li>)}
                                          </ul>
                                        </div>
                                      )}
                                      {Array.isArray(item.planDetails.monthlyBonuses) && item.planDetails.monthlyBonuses.length > 0 && (
                                        <div className="bg-white rounded p-3 border border-blue-200">
                                          <p className="text-xs font-semibold text-gray-700 mb-1">Monthly Bonuses</p>
                                          <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                            {item.planDetails.monthlyBonuses.map((f, i) => <li key={i}>{f}</li>)}
                                          </ul>
                                        </div>
                                      )}
                                      {Array.isArray(item.planDetails.platinumExtras) && item.planDetails.platinumExtras.length > 0 && (
                                        <div className="bg-white rounded p-3 border border-blue-200">
                                          <p className="text-xs font-semibold text-gray-700 mb-1">Premium Extras</p>
                                          <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                            {item.planDetails.platinumExtras.map((f, i) => <li key={i}>{f}</li>)}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>

                            {/* Add-ons */}
                            {item.addOns && item.addOns.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Add-ons</h5>
                                <div className="space-y-2">
                                  {item.addOns.map((addon, addonIndex) => (
                                    <div key={addonIndex} className="bg-green-50 rounded-lg p-3 flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className="text-green-600 mr-2">+</span>
                                        <span className="text-gray-700">{addon.name}</span>
                                        {addon.quantity > 1 && (
                                          <span className="text-gray-500 ml-2">x {addon.quantity}</span>
                                        )}
                                      </div>
                                      <span className="text-gray-900 font-medium">₹{addon.price * addon.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Laundry Items */}
                            {item.laundryItems && item.laundryItems.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Laundry Items</h5>
                                <div className="space-y-2">
                                  {item.laundryItems.map((laundryItem, laundryIndex) => (
                                    <div key={laundryIndex} className="bg-purple-50 rounded-lg p-3 flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className="text-purple-600 mr-2">•</span>
                                        <span className="text-gray-700">{laundryItem.itemType}</span>
                                        <span className="text-gray-500 ml-2">x {laundryItem.quantity}</span>
                                      </div>
                                      <span className="text-gray-900 font-medium">₹{laundryItem.pricePerItem * laundryItem.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Item Quantity and Total */}
                            <div className="bg-gray-50 rounded-lg p-4 mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-600">Quantity</span>
                                <span className="text-gray-900 font-medium">{item.quantity}</span>
                              </div>
                              <div className="flex items-center justify-between text-lg font-semibold border-t pt-2">
                                <span className="text-gray-700">Item Total</span>
                                <span className="text-green-600">₹{
                                  (item.price * item.quantity) + 
                                  ((item.addOns || []).reduce((sum, addon) => sum + (addon.price * addon.quantity), 0)) +
                                  ((item.laundryItems || []).reduce((sum, laundry) => sum + (laundry.pricePerItem * laundry.quantity), 0))
                                }</span>
                              </div>
                            </div>

                            {/* Special Instructions */}
                            {item.specialInstructions && (
                              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Special Instructions:</p>
                                <p className="text-gray-800">{item.specialInstructions}</p>
                              </div>
                            )}
                          </div>
                        </div>
                          ))}
                          </div>
                        </div>
                      ))
                    })() : (
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Service</p>
                            <p className="font-medium text-gray-900">{selectedBooking.serviceMode}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Plan</p>
                            <p className="font-medium text-gray-900">{selectedBooking.plan}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Category</p>
                            <p className="font-medium text-gray-900">{selectedBooking.category}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Summary: always show breakdown and compute grand total from items */}
                    {(() => {
                      const items = selectedBooking.items || [];
                      const itemsCount = items.reduce((sum, it) => sum + (it.quantity || 1), 0);
                      const computedSubtotal = items.reduce((sum, it) => {
                        const base = (it.price || 0) * (it.quantity || 1);
                        const add = (it.addOns || []).reduce((s, a) => s + (a.price * (a.quantity || 1)), 0);
                        const laundry = (it.laundryItems || []).reduce((s, l) => s + (l.pricePerItem * (l.quantity || 1)), 0);
                        return sum + base + add + laundry;
                      }, 0);
                      const discount = Number(selectedBooking.discountAmount) || 0;
                      const grandTotal = Math.max(0, computedSubtotal - discount);
                      return (
                      <div className="bg-white rounded-lg border-2 border-green-200 p-6 mt-6">
                        <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <CreditCard className="w-5 h-5 mr-2" />
                          Order Summary
                        </h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Subtotal ({itemsCount} {itemsCount===1?'item':'items'})</span>
                            <span className="text-gray-900 font-medium">₹{computedSubtotal}</span>
                          </div>
                          
                          {discount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Discount {selectedBooking.couponCode && `(${selectedBooking.couponCode})`}</span>
                              <span className="text-green-600 font-medium">-₹{discount}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Service charge</span>
                            <span className="text-green-600 font-medium">FREE</span>
                          </div>
                          
                          <div className="border-t pt-3">
                            <div className="flex items-center justify-between text-xl font-bold">
                              <span className="text-gray-800">Total</span>
                              <span className="text-green-600">₹{grandTotal}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700 font-medium text-center">Grand total computed from items</p>
                        </div>
                      </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Scheduling Information */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Scheduling Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Booking Date</p>
                      <p className="font-medium text-gray-900">{selectedBooking.bookingDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Date</p>
                      <p className="font-medium text-gray-900">{selectedBooking.scheduledDate || selectedBooking.bookingDate}</p>
                    </div>
                    {selectedBooking.scheduledTimeSlot && (
                      <div>
                        <p className="text-sm text-gray-600">Time Slot</p>
                        <p className="font-medium text-gray-900 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {selectedBooking.scheduledTimeSlot}
                        </p>
                      </div>
                    )}
                    {selectedBooking.completedDate && (
                      <div>
                        <p className="text-sm text-gray-600">Completed Date</p>
                        <p className="font-medium text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {selectedBooking.completedDate}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium text-gray-900 capitalize">{selectedBooking.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      {selectedBooking.paymentStatus === 'completed' ? (
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : (
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          selectedBooking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {(selectedBooking.paymentStatus || 'Pending').charAt(0).toUpperCase() + (selectedBooking.paymentStatus || 'Pending').slice(1)}
                        </span>
                      )}
                    </div>
                    {selectedBooking.estimatedDuration && (
                      <div>
                        <p className="text-sm text-gray-600">Estimated Duration</p>
                        <p className="font-medium text-gray-900">{selectedBooking.estimatedDuration} minutes</p>
                      </div>
                    )}
                    {selectedBooking.couponCode && (
                      <div>
                        <p className="text-sm text-gray-600">Coupon Applied</p>
                        <p className="font-medium text-green-600">{selectedBooking.couponCode}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Order Status
                  </h3>
                  <div className="flex items-center justify-center">
                    <span className={`inline-flex px-4 py-2 text-lg font-semibold rounded-full ${
                      selectedBooking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedBooking.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Customer Notes */}
                {selectedBooking.customerNotes && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Notes</h3>
                    <p className="text-gray-700">{selectedBooking.customerNotes}</p>
                  </div>
                )}

                {/* Review & Rating */}
                {selectedBooking.review && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Review</h3>
                    {selectedBooking.rating && (
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xl ${i < selectedBooking.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ⭐
                          </span>
                        ))}
                        <span className="ml-2 text-gray-600">({selectedBooking.rating}/5)</span>
                      </div>
                    )}
                    <p className="text-gray-700">{selectedBooking.review}</p>
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

export default BookingHistory;
