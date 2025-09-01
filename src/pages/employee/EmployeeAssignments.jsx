import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, MapPin, Phone, User, Calendar, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import EmployeeLayout from '../../components/EmployeeLayout';
import { getAssignments, updateAssignmentStatus, uploadTaskImages, completeTask, getAssignmentDetails } from '../../api/employee';
import OrderDetailsModal from '../../components/employee/OrderDetailsModal';

const EmployeeAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState({}); // { [id]: { before?: File, after?: File } }
  const [uploadingByField, setUploadingByField] = useState({}); // { [id]: { before?: boolean, after?: boolean } }
  const [uploadedByField, setUploadedByField] = useState({});  // { [id]: { before?: boolean, after?: boolean } }
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const mockAssignments = [
      {
        id: 'BF001',
        customerName: 'Darvin Kumar',
        customerPhone: '9566751053',
        serviceType: 'Premium Car Wash',
        location: 'HSR Layout, Bangalore',
        address: '123 Main Street, HSR Layout, Bangalore',
        scheduledDate: '2025-01-23',
        scheduledTime: '10:00 AM',
        estimatedDuration: '45 mins',
        amount: 699,
        status: 'in-progress',
        instructions: 'Customer requested extra care for leather seats',
        assignedTime: '2025-01-23T09:30:00',
        completedTime: null,
        customerRating: null
      },
      {
        id: 'BF002',
        customerName: 'Priya Sharma',
        customerPhone: '9876543210',
        serviceType: 'Essential Car Wash',
        location: 'Koramangala, Bangalore',
        address: '456 Park Avenue, Koramangala, Bangalore',
        scheduledDate: '2025-01-23',
        scheduledTime: '2:00 PM',
        estimatedDuration: '30 mins',
        amount: 299,
        status: 'pending',
        instructions: 'Regular wash, customer will provide water',
        assignedTime: '2025-01-23T13:30:00',
        completedTime: null,
        customerRating: null
      },
      {
        id: 'BF003',
        customerName: 'Rajesh Kumar',
        customerPhone: '9123456789',
        serviceType: 'Deluxe Car Wash',
        location: 'Whitefield, Bangalore',
        address: '789 Tech Park, Whitefield, Bangalore',
        scheduledDate: '2025-01-23',
        scheduledTime: '4:30 PM',
        estimatedDuration: '60 mins',
        amount: 899,
        status: 'pending',
        instructions: 'Include dashboard polishing',
        assignedTime: '2025-01-23T16:00:00',
        completedTime: null,
        customerRating: null
      },
      {
        id: 'BF004',
        customerName: 'Anita Reddy',
        customerPhone: '9988776655',
        serviceType: 'Essential Bike Wash',
        location: 'BTM Layout, Bangalore',
        address: '321 Ring Road, BTM Layout, Bangalore',
        scheduledDate: '2025-01-22',
        scheduledTime: '11:00 AM',
        estimatedDuration: '25 mins',
        amount: 199,
        status: 'completed',
        instructions: 'Quick wash before office',
        assignedTime: '2025-01-22T10:30:00',
        completedTime: '2025-01-22T11:20:00',
        customerRating: 4.5
      },
      {
        id: 'BF005',
        customerName: 'Vikram Singh',
        customerPhone: '9111222333',
        serviceType: 'Premium Laundry',
        location: 'Indiranagar, Bangalore',
        address: '555 100 Feet Road, Indiranagar, Bangalore',
        scheduledDate: '2025-01-21',
        scheduledTime: '9:00 AM',
        estimatedDuration: '120 mins',
        amount: 450,
        status: 'completed',
        instructions: 'Handle delicate fabrics with care',
        assignedTime: '2025-01-21T08:30:00',
        completedTime: '2025-01-21T10:45:00',
        customerRating: 5
      },
      {
        id: 'BF006',
        customerName: 'Meera Patel',
        customerPhone: '9444555666',
        serviceType: 'Essential Car Wash',
        location: 'Electronic City, Bangalore',
        address: '777 Tech Boulevard, Electronic City, Bangalore',
        scheduledDate: '2025-01-24',
        scheduledTime: '3:00 PM',
        estimatedDuration: '30 mins',
        amount: 299,
        status: 'pending',
        instructions: 'Park in basement level 2',
        assignedTime: '2025-01-24T14:30:00',
        completedTime: null,
        customerRating: null
      }
    ];

    (async () => {
      try {
        const res = await getAssignments({ status: 'all', dateFilter: 'all' });
        if (res.success) {
          setAssignments(
            res.data.assignments?.map(a => ({
              id: a.id,
              customerName: a.customerName,
              customerPhone: a.customerPhone,
              serviceType: a.serviceType,
              location: a.location,
              address: a.address,
              scheduledDate: a.scheduledDate,
              scheduledTime: a.scheduledTime,
              estimatedDuration: a.estimatedDuration,
              amount: a.amount,
              status: a.status,
              
              instructions: a.instructions,
              assignedTime: a.assignedTime,
              completedTime: a.completedTime,
              customerRating: a.customerRating,
            })) || []
          );
        } else {
          setAssignments(mockAssignments);
        }
      } catch (e) {
        setAssignments(mockAssignments);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter assignments based on search and filters
  useEffect(() => {
    let filtered = assignments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment => 
        assignment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter (treat 'assigned' as 'pending' for UI)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => {
        if (statusFilter === 'pending') return assignment.status === 'pending' || assignment.status === 'assigned';
        return assignment.status === statusFilter;
      });
    }

    // Date filter
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    if (dateFilter === 'today') {
      filtered = filtered.filter(assignment => assignment.scheduledDate === today);
    } else if (dateFilter === 'yesterday') {
      filtered = filtered.filter(assignment => assignment.scheduledDate === yesterday);
    } else if (dateFilter === 'tomorrow') {
      filtered = filtered.filter(assignment => assignment.scheduledDate === tomorrow);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      filtered = filtered.filter(assignment => assignment.scheduledDate >= weekAgo);
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, statusFilter, dateFilter]);

  const handleUpdateStatus = async (assignmentId, newStatus) => {
    const prev = assignments;
    try {
      if (newStatus === 'completed') {
        const res = await completeTask(assignmentId);
        if (!res.success) throw new Error('Complete failed');
        setAssignments(prev.map(a => a.id === assignmentId ? { ...a, status: 'completed', completedTime: new Date().toISOString() } : a));
      } else {
        setAssignments(prev.map(a => a.id === assignmentId ? { ...a, status: newStatus } : a));
        const res = await updateAssignmentStatus(assignmentId, newStatus);
        if (!res.success) setAssignments(prev);
      }
    } catch {
      setAssignments(prev);
    }
  };

  const onPickFile = async (assignmentId, field, file) => {
    if (!file) return;
    setImageFiles((prev) => ({
      ...prev,
      [assignmentId]: { ...(prev[assignmentId] || {}), [field]: file },
    }));
    setUploadingByField(prev => ({ ...prev, [assignmentId]: { ...(prev[assignmentId] || {}), [field]: true } }));
    try {
      const res = await uploadTaskImages(assignmentId, { [field]: file });
      if (res?.success) {
        setUploadedByField(prev => ({
          ...prev,
          [assignmentId]: { ...(prev[assignmentId] || {}), [field]: true }
        }));
      }
    } finally {
      setUploadingByField(prev => ({ ...prev, [assignmentId]: { ...(prev[assignmentId] || {}), [field]: false } }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
  case 'pending':
  case 'assigned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // priority removed from UI

  const getStatusIcon = (status) => {
    switch (status) {
  case 'pending':
  case 'assigned':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const openDetails = async (assignmentId) => {
    try {
      const res = await getAssignmentDetails(assignmentId);
      if (res?.success) {
        setOrderDetails(res.data);
        setDetailsOpen(true);
      }
    } catch {}
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assignments</h1>
          <p className="text-gray-600">Manage and track your assigned tasks</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">This Week</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredAssignments.length} of {assignments.length} assignments
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Assignment Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">{assignment.serviceType}</h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>ID: {assignment.id}</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(assignment.scheduledDate)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(assignment.status)} mb-2`}>
                    {getStatusIcon(assignment.status)}
                    <span className="ml-1 capitalize">{(assignment.status === 'assigned' ? 'pending' : assignment.status).replace('-', ' ')}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">₹{assignment.amount}</p>
                </div>
              </div>

              {/* Customer & Timing Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{assignment.customerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{assignment.customerPhone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {assignment.scheduledTime} ({assignment.estimatedDuration})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{assignment.location}</span>
                  </div>
                </div>
              </div>

              {/* Full Address */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Address:</strong> {assignment.address}
                </p>
              </div>

              {/* Special Instructions */}
              {assignment.instructions && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Special Instructions:</strong> {assignment.instructions}
                  </p>
                </div>
              )}

              {/* Completion Info */}
              {assignment.status === 'completed' && assignment.completedTime && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-800">
                        <strong>Completed:</strong> {new Date(assignment.completedTime).toLocaleString()}
                      </p>
                    </div>
                    {assignment.customerRating && (
                      <div className="flex items-center">
                        <span className="text-sm text-green-800 mr-2">Rating:</span>
                        <div className="flex">{renderStars(assignment.customerRating)}</div>
                        <span className="text-sm text-green-800 ml-1">({assignment.customerRating})</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {(assignment.status === 'pending' || assignment.status === 'assigned') && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(assignment.id, 'in-progress')}
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Start Task
                    </button>
                    <a href={`tel:${assignment.customerPhone}`} className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Call Customer
                    </a>
                    <a
                      href={assignment.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(assignment.address)}` : '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      View on Map
                    </a>
                    <button onClick={() => openDetails(assignment.id)} className="border border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      View Details
                    </button>
                  </>
                )}
                
                {assignment.status === 'in-progress' && (
                  <>
                    <div className="flex items-center gap-2 flex-wrap">
                      <label
                        className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
                        disabled={uploadingByField[assignment.id]?.before}
                      >
                        {uploadingByField[assignment.id]?.before
                          ? 'Uploading Before…'
                          : uploadedByField[assignment.id]?.before
                          ? 'Reupload Before'
                          : 'Upload Before'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onPickFile(assignment.id, 'before', e.target.files?.[0])}
                        />
                      </label>
                      {uploadedByField[assignment.id]?.before && (
                        <span className="text-green-600 text-sm">Before uploaded</span>
                      )}
                      <label
                        className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
                        disabled={uploadingByField[assignment.id]?.after}
                      >
                        {uploadingByField[assignment.id]?.after
                          ? 'Uploading After…'
                          : uploadedByField[assignment.id]?.after
                          ? 'Reupload After'
                          : 'Upload After'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onPickFile(assignment.id, 'after', e.target.files?.[0])}
                        />
                      </label>
                      {uploadedByField[assignment.id]?.after && (
                        <span className="text-green-600 text-sm">After uploaded</span>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(assignment.id, 'completed')}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
                        disabled={!
                          uploadedByField[assignment.id]?.before || !uploadedByField[assignment.id]?.after
                        }
                      >
                        Mark Completed
                      </button>
                    </div>
                    <a href={`tel:${assignment.customerPhone}`} className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Call Customer
                    </a>
                    <a
                      href={assignment.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(assignment.address)}` : '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      View on Map
                    </a>
                    <button onClick={() => openDetails(assignment.id)} className="border border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      View Details
                    </button>
                  </>
                )}

                {assignment.status === 'completed' && (
                  <>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Task Completed</span>
                    </div>
                    <button onClick={() => openDetails(assignment.id)} className="border border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      View Details
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No assignments found</div>
            <div className="text-gray-400">Try adjusting your filters or search terms</div>
          </div>
        )}
      </div>
      <OrderDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} order={orderDetails} />
    </EmployeeLayout>
  );
};

export default EmployeeAssignments;
