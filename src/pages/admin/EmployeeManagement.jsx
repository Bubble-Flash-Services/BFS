import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X, User, Phone, MapPin, Calendar, RefreshCw, Star } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [unassignedBookings, setUnassignedBookings] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    carSpecialists: 0,
    bikeSpecialists: 0,
    laundrySpecialists: 0
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  // Form state for employee
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialization: 'car',
    bankDetails: {
      accountNumber: '',
      ifsc: '',
      bankName: ''
    }
  });

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
    fetchUnassignedBookings();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/adminNew/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();
      if (result.success) {
        setEmployees(result.data.employees);
        setStats(result.data.stats);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/adminNew/bookings/unassigned', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.success) {
        setUnassignedBookings(result.data.bookings);
      }
    } catch (error) {
      console.error('Error fetching unassigned bookings:', error);
    }
  };

  // Handle create employee
  const handleCreateEmployee = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      specialization: 'car',
      bankDetails: {
        accountNumber: '',
        ifsc: '',
        bankName: ''
      }
    });
    setEditingEmployee(null);
    setShowCreateModal(true);
  };

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      specialization: employee.specialization,
      bankDetails: employee.bankDetails || {
        accountNumber: '',
        ifsc: '',
        bankName: ''
      }
    });
    setEditingEmployee(employee);
    setShowCreateModal(true);
  };

  // Save employee (create or update)
  const saveEmployee = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingEmployee
        ? `/api/adminNew/employees/${editingEmployee._id}`
        : '/api/adminNew/employees';

      const method = editingEmployee ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        password: editingEmployee ? undefined : 'defaultPassword123' // Default password for new employees
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setShowCreateModal(false);
        fetchEmployees(); // Refresh employee list
        alert(editingEmployee ? 'Employee updated successfully!' : 'Employee created successfully!');
      } else {
        alert(result.message || 'Failed to save employee');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee');
    }
  };

  // Delete employee
  const deleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/adminNew/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        fetchEmployees(); // Refresh employee list
        alert('Employee deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  // Assign booking to employee
  const assignBooking = async () => {
    if (!selectedBooking || !formData.assignedEmployee) {
      alert('Please select an employee');
      return;
    }

    try {
      const selectedEmployee = employees.find(emp => emp._id === formData.assignedEmployee);
      const confirmMessage = `Are you sure you want to assign this booking to ${selectedEmployee?.name}?`;

      if (!window.confirm(confirmMessage)) {
        return;
      }

      setAssigning(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/adminNew/bookings/${selectedBooking._id}/assign`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: formData.assignedEmployee
        })
      });

      const result = await response.json();

      if (result.success) {
        // Reset form and close modal
        setFormData({
          ...formData,
          assignedEmployee: ''
        });
        handleCloseAssignModal();

        // Refresh data
        fetchUnassignedBookings();
        fetchEmployees(); // Refresh to update employee stats

        alert(`Booking successfully assigned to ${selectedEmployee?.name}!`);
      } else {
        alert(result.message || 'Failed to assign booking');
      }
    } catch (error) {
      console.error('Error assigning booking:', error);
      alert('Failed to assign booking. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  // Handle opening assign modal
  const handleAssignBooking = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      ...formData,
      assignedEmployee: '' // Reset selected employee
    });
    setShowAssignModal(true);
  };

  // Handle closing assign modal
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedBooking(null);
    setFormData({
      ...formData,
      assignedEmployee: '' // Reset selected employee
    });
  };

  // Open details modal
  const openDetails = async (emp) => {
    setDetailsLoading(true);
    setShowDetailsModal(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/adminNew/employees/${emp._id}/details`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (result.success) {
        setEmployeeDetails(result.data);
      } else {
        setEmployeeDetails({ employee: emp, attendance: [], tasks: [] });
      }
    } catch (e) {
      console.error('Load employee details failed', e);
      setEmployeeDetails({ employee: emp, attendance: [], tasks: [] });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Get specialization badge color
  const getSpecializationColor = (specialization) => {
    switch (specialization) {
      case 'car': return 'bg-blue-100 text-blue-800';
      case 'bike': return 'bg-green-100 text-green-800';
      case 'laundry': return 'bg-purple-100 text-purple-800';
      case 'all': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-600">Manage your team and assign bookings</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchEmployees}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleCreateEmployee}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Error Message */}
        {/* Employee Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold truncate">
                    {employeeDetails?.employee?.name || 'Employee Details'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    ID: {employeeDetails?.employee?.employeeId || employeeDetails?.employee?._id?.slice?.(-6) || '—'} • {employeeDetails?.employee?.specialization?.toUpperCase?.()}
                  </p>
                </div>
                <button
                  onClick={() => { setShowDetailsModal(false); setEmployeeDetails(null); }}
                  className="p-2 rounded hover:bg-gray-100 text-gray-500"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Loading state */}
              {detailsLoading ? (
                <div className="p-10 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800">Contact</p>
                      <p className="text-sm text-blue-900 truncate">{employeeDetails?.employee?.email || '—'}</p>
                      <p className="text-sm text-blue-900">{employeeDetails?.employee?.phone || '—'}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-800">Join Date</p>
                      <p className="text-sm text-green-900">{formatDate(employeeDetails?.employee?.createdAt)}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-800">Specialization</p>
                      <span className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getSpecializationColor(employeeDetails?.employee?.specialization)}`}>
                        {employeeDetails?.employee?.specialization || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  {(() => {
                    const tasks = employeeDetails?.tasks || [];
                    const attendance = employeeDetails?.attendance || [];
                    const ratings = tasks.map(t => typeof t.rating === 'number' ? t.rating : null).filter(r => r !== null);
                    const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
                    const reviewsCount = tasks.filter(t => t.review || typeof t.rating === 'number').length;
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white border rounded-lg p-3">
                          <p className="text-xs text-gray-500">Completed Tasks</p>
                          <p className="text-xl font-semibold text-gray-800">{tasks.length}</p>
                        </div>
                        <div className="bg-white border rounded-lg p-3">
                          <p className="text-xs text-gray-500">Average Rating</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-semibold text-gray-800">{avgRating.toFixed(1)}</p>
                            <div className="flex items-center">
                              {[1,2,3,4,5].map(n => (
                                <Star key={n} size={14} className={n <= Math.round(avgRating) ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300'} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="bg-white border rounded-lg p-3">
                          <p className="text-xs text-gray-500">Reviews</p>
                          <p className="text-xl font-semibold text-gray-800">{reviewsCount}</p>
                        </div>
                        <div className="bg-white border rounded-lg p-3">
                          <p className="text-xs text-gray-500">Attendance Photos</p>
                          <p className="text-xl font-semibold text-gray-800">{attendance.length}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Attendance Gallery */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">Attendance</h3>
                      <span className="text-sm text-gray-500">{employeeDetails?.attendance?.length || 0} photos</span>
                    </div>
                    {employeeDetails?.attendance?.length ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {employeeDetails.attendance.slice(0, 24).map((a, idx) => (
                          <a key={a.publicId || idx} href={a.url} target="_blank" rel="noreferrer" className="group block">
                            <div className="aspect-square overflow-hidden rounded-md border">
                              <img src={a.url} alt={`attendance-${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <p className="mt-1 text-[11px] text-gray-500 truncate">{formatDate(a.uploadedAt)}</p>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 border rounded">No attendance records</div>
                    )}
                  </div>

                  {/* Completed Tasks */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">Completed Tasks</h3>
                      <span className="text-sm text-gray-500">{employeeDetails?.tasks?.length || 0} orders</span>
                    </div>
                    {employeeDetails?.tasks?.length ? (
                      <div className="space-y-4">
                        {employeeDetails.tasks.map((t, idx) => (
                          <div key={t.orderNumber || idx} className="border rounded-lg overflow-hidden">
                            {/* Top bar */}
                            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800">Order #{t.orderNumber || '—'}</p>
                                <p className="text-xs text-gray-500">Completed: {formatDate(t.completedAt)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-700">₹{t.amount ?? 0}</p>
                              </div>
                            </div>
                            {/* Content */}
                            <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                              {/* Images */}
                              <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Before</p>
                                  <div className="aspect-video rounded-md overflow-hidden border bg-gray-50">
                                    {t.beforeImage ? (
                                      <a href={t.beforeImage} target="_blank" rel="noreferrer">
                                        <img src={t.beforeImage} alt="before" className="w-full h-full object-cover" />
                                      </a>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">After</p>
                                  <div className="aspect-video rounded-md overflow-hidden border bg-gray-50">
                                    {t.afterImage ? (
                                      <a href={t.afterImage} target="_blank" rel="noreferrer">
                                        <img src={t.afterImage} alt="after" className="w-full h-full object-cover" />
                                      </a>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {/* Details */}
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-gray-500">Customer</p>
                                  <p className="text-sm text-gray-800">{t.customer?.name || '—'}{t.customer?.phone ? ` • ${t.customer.phone}` : ''}</p>
                                </div>
                                {t.address ? (
                                  <div>
                                    <p className="text-xs text-gray-500">Address</p>
                                    <p className="text-sm text-gray-800 line-clamp-3">{t.address}</p>
                                  </div>
                                ) : null}
                                {Array.isArray(t.items) && t.items.length ? (
                                  <div>
                                    <p className="text-xs text-gray-500">Items</p>
                                    <ul className="text-sm text-gray-800 list-disc ml-4 space-y-0.5">
                                      {t.items.slice(0, 4).map((it, i2) => (
                                        <li key={i2}>{it.name} ×{it.qty}</li>
                                      ))}
                                      {t.items.length > 4 && (
                                        <li className="text-gray-500">+ {t.items.length - 4} more</li>
                                      )}
                                    </ul>
                                  </div>
                                ) : null}
                                {/* Rating & Review */}
                                {(t.rating || t.review) && (
                                  <div className="pt-2 border-t">
                                    {typeof t.rating === 'number' && (
                                      <div className="flex items-center gap-1 mb-1">
                                        {[1,2,3,4,5].map(n => (
                                          <Star key={n} size={16} className={n <= t.rating ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300'} />
                                        ))}
                                        <span className="text-xs text-gray-500 ml-1">{t.rating}/5</span>
                                      </div>
                                    )}
                                    {t.review && (
                                      <p className="text-sm text-gray-700 italic">“{t.review}”</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 border rounded">No completed tasks</div>
                    )}
                  </div>

                  {/* Customer Reviews */}
                  {(() => {
                    const reviews = (employeeDetails?.tasks || []).filter(t => t.review || typeof t.rating === 'number');
                    if (!reviews.length) return null;
                    return (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
                          <span className="text-sm text-gray-500">{reviews.length} review{reviews.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="space-y-3">
                          {reviews.slice(0, 10).map((r, i) => (
                            <div key={(r.orderNumber || i) + '-review'} className="border rounded-lg p-3 bg-white">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-800">Order #{r.orderNumber || '—'}</p>
                                  <p className="text-xs text-gray-500">{r.customer?.name || '—'}{r.customer?.phone ? ` • ${r.customer.phone}` : ''}</p>
                                </div>
                                {typeof r.rating === 'number' && (
                                  <div className="flex items-center gap-1">
                                    {[1,2,3,4,5].map(n => (
                                      <Star key={n} size={14} className={n <= r.rating ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300'} />
                                    ))}
                                    <span className="text-xs text-gray-500 ml-1">{r.rating}/5</span>
                                  </div>
                                )}
                              </div>
                              {r.review && (
                                <p className="mt-2 text-sm text-gray-700 italic">“{r.review}”</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Footer */}
                  <div className="pt-4 border-t flex justify-end">
                    <button
                      onClick={() => { setShowDetailsModal(false); setEmployeeDetails(null); }}
                      className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Active</h3>
            <p className="text-2xl font-bold text-green-600">{stats.activeEmployees}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Car Specialists</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.carSpecialists}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Bike Specialists</h3>
            <p className="text-2xl font-bold text-green-600">{stats.bikeSpecialists}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Laundry Specialists</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.laundrySpecialists}</p>
          </div>
        </div>

        {/* Unassigned Bookings Section */}
        {unassignedBookings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-yellow-800">
                Unassigned Bookings ({unassignedBookings.length})
              </h2>
              <button
                onClick={fetchUnassignedBookings}
                className="text-yellow-600 hover:text-yellow-800"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unassignedBookings.slice(0, 6).map((booking) => (
                <div key={booking._id} className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{booking.userId?.name || 'Unknown Customer'}</h3>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {booking.orderStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Order: #{booking.orderNumber || booking._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Total: ₹{booking.totalAmount}
                  </p>
                  <button
                    onClick={() => handleAssignBooking(booking)}
                    className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                  >
                    Assign Employee
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Employees</h2>
          </div>

          {employees.length === 0 ? (
            <div className="p-8 text-center">
              <User size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No employees found</p>
            </div>
          ) : (
            <>
            {/* Mobile card list */}
            <div className="md:hidden p-4 space-y-4">
              {employees.map((employee) => (
                <div key={employee._id} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-600">ID: {employee.employeeId || employee._id.slice(-6)}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSpecializationColor(employee.specialization)}`}>{employee.specialization}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-800 ml-3 truncate max-w-[60%] text-right">{employee.email}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="text-gray-800">{employee.phone}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`text-xs px-2 py-1 rounded-full ${employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{employee.isActive ? 'Active' : 'Inactive'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Joined</span><span className="text-gray-800">{formatDate(employee.createdAt)}</span></div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => openDetails(employee)} className="px-3 py-2 rounded border text-blue-600 border-blue-200">View</button>
                    <button onClick={() => handleEditEmployee(employee)} className="px-3 py-2 rounded border text-green-600 border-green-200">Edit</button>
                    <button onClick={() => deleteEmployee(employee._id)} className="px-3 py-2 rounded border text-red-600 border-red-200">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                {/* FIX START: Added missing table cells and corrected tbody placement */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {employee.employeeId || employee._id.slice(-6)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.email}</div>
                        <div className="text-sm text-gray-500">{employee.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSpecializationColor(employee.specialization)}`}>
                          {employee.specialization}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {employee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(employee.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => openDetails(employee)} className="text-gray-500 hover:text-blue-600" title="View Details">
                            <Eye size={18} />
                          </button>
                          <button onClick={() => handleEditEmployee(employee)} className="text-gray-500 hover:text-green-600" title="Edit Employee">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => deleteEmployee(employee._id)} className="text-gray-500 hover:text-red-600" title="Delete Employee">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* FIX END */}
              </table>
            </div>
            </>
          )}
        </div>

        {/* Create/Edit Employee Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization *
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="car">Car Wash</option>
                      <option value="bike">Bike Wash</option>
                      <option value="laundry">Laundry</option>
                      <option value="all">All Services</option>
                    </select>
                  </div>

                  {/* FIX: Added missing bank details fields */}
                  <div className="border-t pt-4">
                    <h3 className="text-md font-medium text-gray-800 mb-2">Bank Details (Optional)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={formData.bankDetails.bankName}
                          onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, bankName: e.target.value } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={formData.bankDetails.accountNumber}
                          onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountNumber: e.target.value } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          value={formData.bankDetails.ifsc}
                          onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, ifsc: e.target.value } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEmployee}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingEmployee ? 'Update' : 'Create'} Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Booking Modal */}
        {showAssignModal && selectedBooking && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Assign Booking to Employee</h2>
                  <button
                    onClick={handleCloseAssignModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Comprehensive Booking Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Booking Details</h3>

                  {/* Basic Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-semibold text-lg">#{selectedBooking.orderNumber || selectedBooking._id.slice(-6)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${selectedBooking.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedBooking.orderStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {(selectedBooking.orderStatus || 'pending').replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-bold text-xl text-green-600">₹{selectedBooking.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-medium">{formatDate(selectedBooking.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-800 mb-3">Customer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedBooking.userId?.name || 'Unknown Customer'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedBooking.userId?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedBooking.userId?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Address */}
                  {selectedBooking.serviceAddress && (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">Service Address</h4>
                      <div className="space-y-2">
                        <p className="font-medium">{selectedBooking.serviceAddress.fullAddress}</p>
                        {selectedBooking.serviceAddress.city && (
                          <p className="text-gray-600">
                            {selectedBooking.serviceAddress.city}, {selectedBooking.serviceAddress.state} - {selectedBooking.serviceAddress.pincode}
                          </p>
                        )}
                        {selectedBooking.serviceAddress.landmark && (
                          <p className="text-sm text-gray-500">Landmark: {selectedBooking.serviceAddress.landmark}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Service Items */}
                  {selectedBooking.items && selectedBooking.items.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">Service Items</h4>
                      <div className="space-y-3">
                        {selectedBooking.items.map((item, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium">{item.serviceName}</p>
                                {item.packageName && (
                                  <p className="text-sm text-gray-600">Package: {item.packageName}</p>
                                )}
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">₹{item.price}</p>
                              </div>
                            </div>

                            {/* Add-ons */}
                            {item.addOns && item.addOns.length > 0 && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs text-gray-500 mb-1">Add-ons:</p>
                                {item.addOns.map((addon, addonIndex) => (
                                  <div key={addonIndex} className="flex justify-between text-sm">
                                    <span>{addon.name} (x{addon.quantity})</span>
                                    <span>₹{addon.price * addon.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scheduled Information */}
                  {(selectedBooking.scheduledDate || selectedBooking.scheduledTimeSlot) && (
                    <div className="bg-orange-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-800 mb-3">Scheduled Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedBooking.scheduledDate && (
                          <div>
                            <p className="text-sm text-gray-600">Scheduled Date</p>
                            <p className="font-medium">{formatDate(selectedBooking.scheduledDate)}</p>
                          </div>
                        )}
                        {selectedBooking.scheduledTimeSlot && (
                          <div>
                            <p className="text-sm text-gray-600">Time Slot</p>
                            <p className="font-medium">{selectedBooking.scheduledTimeSlot}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Information */}
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-800 mb-3">Payment Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-medium">{selectedBooking.paymentMethod || 'COD'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${selectedBooking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                            selectedBooking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {(selectedBooking.paymentStatus || 'pending').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {selectedBooking.customerNotes && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">Customer Notes</h4>
                      <p className="text-gray-700 italic">"{selectedBooking.customerNotes}"</p>
                    </div>
                  )}
                </div>

                {/* Employee Assignment Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Assign to Employee</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Employee *
                    </label>
                    <select
                      value={formData.assignedEmployee || ''}
                      onChange={(e) => setFormData({ ...formData, assignedEmployee: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Choose an employee...</option>
                      {employees.filter(emp => emp.isActive).map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.name} - {employee.specialization.toUpperCase()} Specialist
                          {employee.phone && ` (${employee.phone})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Show employee details when selected */}
                  {formData.assignedEmployee && (
                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                      {(() => {
                        const selectedEmp = employees.find(emp => emp._id === formData.assignedEmployee);
                        return selectedEmp ? (
                          <div>
                            <h5 className="font-medium text-green-800">Selected Employee:</h5>
                            <p className="text-sm text-green-700">
                              {selectedEmp.name} - {selectedEmp.specialization} specialist
                            </p>
                            <p className="text-sm text-green-600">{selectedEmp.email} | {selectedEmp.phone}</p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={handleCloseAssignModal}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={assignBooking}
                    disabled={!formData.assignedEmployee || assigning}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {assigning && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {assigning ? 'Assigning...' : 'Assign Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EmployeeManagement;