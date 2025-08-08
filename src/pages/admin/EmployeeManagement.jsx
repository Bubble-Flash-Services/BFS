import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X, User, Phone, MapPin, Calendar } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state for employee
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialization: 'car',
    experience: '',
    salary: '',
    joinDate: '',
    status: 'active',
    emergencyContact: '',
    aadharNumber: '',
    profileImage: ''
  });

  // Mock employee data
  useEffect(() => {
    const mockEmployees = [
      {
        id: 1,
        name: 'Ravi Kumar',
        email: 'ravi.kumar@bubbleflash.com',
        phone: '9876543210',
        address: 'HSR Layout, Bangalore',
        specialization: 'car',
        experience: '3 years',
        salary: 25000,
        joinDate: '2024-01-15',
        status: 'active',
        emergencyContact: '9876543211',
        aadharNumber: '1234-5678-9012',
        assignedBookings: 8,
        completedToday: 3,
        profileImage: ''
      },
      {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya.sharma@bubbleflash.com',
        phone: '9876543220',
        address: 'Koramangala, Bangalore',
        specialization: 'bike',
        experience: '2 years',
        salary: 22000,
        joinDate: '2024-03-10',
        status: 'active',
        emergencyContact: '9876543221',
        aadharNumber: '2345-6789-0123',
        assignedBookings: 5,
        completedToday: 2,
        profileImage: ''
      },
      {
        id: 3,
        name: 'Amit Singh',
        email: 'amit.singh@bubbleflash.com',
        phone: '9876543230',
        address: 'Whitefield, Bangalore',
        specialization: 'laundry',
        experience: '4 years',
        salary: 28000,
        joinDate: '2023-11-20',
        status: 'active',
        emergencyContact: '9876543231',
        aadharNumber: '3456-7890-1234',
        assignedBookings: 12,
        completedToday: 5,
        profileImage: ''
      },
      {
        id: 4,
        name: 'Sunita Devi',
        email: 'sunita.devi@bubbleflash.com',
        phone: '9876543240',
        address: 'Indiranagar, Bangalore',
        specialization: 'laundry',
        experience: '1 year',
        salary: 20000,
        joinDate: '2024-06-01',
        status: 'inactive',
        emergencyContact: '9876543241',
        aadharNumber: '4567-8901-2345',
        assignedBookings: 0,
        completedToday: 0,
        profileImage: ''
      }
    ];

    const mockBookings = [
      {
        id: 'BF001',
        customerName: 'Darvin Kumar',
        phone: '9566751053',
        serviceMode: 'car',
        plan: 'Premium Wash',
        location: 'HSR Layout',
        bookingDate: '2025-07-23',
        status: 'pending',
        assignedTo: null
      },
      {
        id: 'BF002',
        customerName: 'Anita Singh',
        phone: '9555666777',
        serviceMode: 'bike',
        plan: 'Basic Wash',
        location: 'Indiranagar',
        bookingDate: '2025-07-23',
        status: 'pending',
        assignedTo: null
      },
      {
        id: 'BF003',
        customerName: 'Rajesh Kumar',
        phone: '9123456789',
        serviceMode: 'laundry',
        plan: 'Dry Clean',
        location: 'Whitefield',
        bookingDate: '2025-07-23',
        status: 'assigned',
        assignedTo: 3
      }
    ];

    setTimeout(() => {
      setEmployees(mockEmployees);
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateEmployee = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      specialization: 'car',
      experience: '',
      salary: '',
      joinDate: '',
      status: 'active',
      emergencyContact: '',
      aadharNumber: '',
      profileImage: ''
    });
    setEditingEmployee(null);
    setShowCreateModal(true);
  };

  const handleEditEmployee = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      specialization: employee.specialization,
      experience: employee.experience,
      salary: employee.salary.toString(),
      joinDate: employee.joinDate,
      status: employee.status,
      emergencyContact: employee.emergencyContact,
      aadharNumber: employee.aadharNumber,
      profileImage: employee.profileImage || ''
    });
    setEditingEmployee(employee);
    setShowCreateModal(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    }
  };

  const handleSaveEmployee = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingEmployee) {
      // Update existing employee
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? { 
          ...editingEmployee, 
          ...formData,
          salary: parseFloat(formData.salary),
          assignedBookings: editingEmployee.assignedBookings,
          completedToday: editingEmployee.completedToday
        } : emp
      ));
    } else {
      // Create new employee
      const newEmployee = {
        id: Date.now(),
        ...formData,
        salary: parseFloat(formData.salary),
        assignedBookings: 0,
        completedToday: 0
      };
      setEmployees([...employees, newEmployee]);
    }

    setShowCreateModal(false);
    setEditingEmployee(null);
  };

  const handleAssignBooking = (booking) => {
    setSelectedBooking(booking);
    setShowAssignModal(true);
  };

  const assignBookingToEmployee = (employeeId) => {
    setBookings(bookings.map(booking => 
      booking.id === selectedBooking.id 
        ? { ...booking, assignedTo: employeeId, status: 'assigned' }
        : booking
    ));

    // Update employee's assigned bookings count
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, assignedBookings: emp.assignedBookings + 1 }
        : emp
    ));

    setShowAssignModal(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpecializationColor = (specialization) => {
    switch (specialization) {
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

  const getEmployeeStats = () => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const totalAssigned = employees.reduce((sum, emp) => sum + emp.assignedBookings, 0);
    const completedToday = employees.reduce((sum, emp) => sum + emp.completedToday, 0);

    return { totalEmployees, activeEmployees, totalAssigned, completedToday };
  };

  const getUnassignedBookings = () => {
    return bookings.filter(booking => booking.status === 'pending');
  };

  const stats = getEmployeeStats();
  const unassignedBookings = getUnassignedBookings();

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
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
          <p className="text-gray-600">Manage your workforce and assign bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssigned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">✨</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unassigned Bookings Section */}
        {unassignedBookings.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Unassigned Bookings ({unassignedBookings.length})</h2>
              <p className="text-sm text-gray-600">Bookings waiting to be assigned to employees</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unassignedBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{booking.id}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSpecializationColor(booking.serviceMode)}`}>
                        {booking.serviceMode}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Customer: {booking.customerName}</p>
                    <p className="text-sm text-gray-600 mb-1">Plan: {booking.plan}</p>
                    <p className="text-sm text-gray-600 mb-3">Location: {booking.location}</p>
                    <button
                      onClick={() => handleAssignBooking(booking)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Assign Employee
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Employees</h2>
          <button
            onClick={handleCreateEmployee}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </button>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Employee Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    {employee.profileImage ? (
                      <img src={employee.profileImage} alt={employee.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-gray-600" />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {employee.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {employee.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined: {employee.joinDate}
                  </div>
                </div>

                <div className="mt-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSpecializationColor(employee.specialization)} capitalize`}>
                    {employee.specialization} Specialist
                  </span>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{employee.assignedBookings}</p>
                    <p className="text-xs text-gray-500">Assigned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{employee.completedToday}</p>
                    <p className="text-xs text-gray-500">Completed Today</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Employee"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Employee"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    ₹{employee.salary.toLocaleString()}/month
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Employee Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-lg font-semibold">
                  {editingEmployee ? 'Edit Employee' : 'Add Employee'}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter emergency contact"
                    />
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="car">Car Wash</option>
                      <option value="bike">Bike Wash</option>
                      <option value="laundry">Laundry</option>
                    </select>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2 years"
                    />
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Salary (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter monthly salary"
                    />
                  </div>

                  {/* Join Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Join Date
                    </label>
                    <input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Aadhar Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      value={formData.aadharNumber}
                      onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="XXXX-XXXX-XXXX"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    placeholder="Enter full address"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEmployee}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingEmployee ? 'Update' : 'Add'} Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Booking Modal */}
        {showAssignModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              {/* Header */}
              <div className="border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-lg font-semibold">Assign Booking</h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Booking Details:</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm"><strong>ID:</strong> {selectedBooking.id}</p>
                    <p className="text-sm"><strong>Customer:</strong> {selectedBooking.customerName}</p>
                    <p className="text-sm"><strong>Service:</strong> {selectedBooking.serviceMode} - {selectedBooking.plan}</p>
                    <p className="text-sm"><strong>Location:</strong> {selectedBooking.location}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Available Employees:</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {employees
                      .filter(emp => emp.status === 'active' && emp.specialization === selectedBooking.serviceMode)
                      .map((employee) => (
                        <button
                          key={employee.id}
                          onClick={() => assignBookingToEmployee(employee.id)}
                          className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-sm text-gray-600">{employee.specialization} specialist</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">{employee.assignedBookings} assigned</p>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
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
