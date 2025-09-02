import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, Filter } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    googleUsers: 0,
    localUsers: 0
  });

  // Modal states
  const [viewModal, setViewModal] = useState({ open: false, user: null });
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('Admin token not found');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/adminNew/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        console.log('Admin token expired, redirecting to login...');
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        // Helper function to safely format dates
        const formatDate = (dateValue) => {
          if (!dateValue) return 'N/A';
          try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toISOString().split('T')[0];
          } catch (error) {
            return 'N/A';
          }
        };

        // Transform API data to match frontend format
        const transformedUsers = result.data.users.map(user => ({
          id: user._id,
          name: user.name || 'N/A',
          email: user.email || 'N/A',
          phone: user.phone || 'N/A',
          location: user.address || 'N/A',
          joinedDate: formatDate(user.createdAt),
          totalBookings: user.totalBookings || user.totalOrders || 0,
          totalSpent: user.totalSpent || 0,
          status: user.status || 'active', // Use the actual status field from schema
          provider: user.provider || 'local',
          lastLogin: formatDate(user.lastLogin)
        }));

        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
        setPagination(result.data.pagination);
        setStats(result.data.stats);
      } else {
        console.error('Failed to fetch users:', result.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts or filters change
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, statusFilter]);

  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      // Debounce search
      const timeoutId = setTimeout(() => {
        fetchUsers();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      fetchUsers();
    }
  }, [searchTerm]);

  // Handle page changes
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle status filter change
  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Action handlers
  const handleViewUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setViewModal({ open: true, user });
  };

  const handleEditUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setEditModal({ open: true, user });
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setDeleteModal({ open: true, user });
  };

  // Update user status
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/adminNew/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
        setFilteredUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
        setEditModal({ open: false, user: null });
        fetchUsers(); // Refresh data
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/adminNew/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove from local state
        setUsers(prev => prev.filter(user => user.id !== userId));
        setFilteredUsers(prev => prev.filter(user => user.id !== userId));
        setDeleteModal({ open: false, user: null });
        fetchUsers(); // Refresh data
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage registered users and their information</p>
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
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((total, user) => total + user.totalBookings, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{users.reduce((total, user) => total + user.totalSpent, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Registered Users ({filteredUsers.length})
            </h2>
          </div>
          {/* Mobile card list */}
          <div className="md:hidden p-4 space-y-4">
            {filteredUsers.length === 0 && (
              <div className="text-sm text-gray-500">No users found</div>
            )}
            {filteredUsers.map((u) => (
              <div key={u.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-gray-900">{u.name}</div>
                    <div className="text-sm text-gray-600">{u.email}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(u.status)}`}>{u.status}</span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="text-gray-800">{u.phone}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Joined</span><span className="text-gray-800">{u.joinedDate}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Bookings</span><span className="text-gray-800">{u.totalBookings}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Spent</span><span className="text-gray-800">₹{u.totalSpent.toLocaleString()}</span></div>
                </div>
                <div className="mt-3 text-xs text-gray-600 line-clamp-2">{u.location}</div>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => handleViewUser(u.id)} className="px-3 py-2 rounded border text-blue-600 border-blue-200">View</button>
                  <button onClick={() => handleEditUser(u.id)} className="px-3 py-2 rounded border text-green-600 border-green-200">Edit</button>
                  <button onClick={() => handleDeleteUser(u.id)} className="px-3 py-2 rounded border text-red-600 border-red-200">Delete</button>
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.joinedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.totalBookings}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{user.totalSpent.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View User"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No users found</div>
              <div className="text-gray-400">Try adjusting your search or filter criteria</div>
            </div>
          )}
        </div>
      </div>

      {/* View User Modal */}
      {viewModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={() => setViewModal({ open: false, user: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {viewModal.user && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{viewModal.user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{viewModal.user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{viewModal.user.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{viewModal.user.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Join Date</label>
                  <p className="mt-1 text-sm text-gray-900">{viewModal.user.joinedDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewModal.user.status)}`}>
                    {viewModal.user.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Bookings</label>
                  <p className="mt-1 text-sm text-gray-900">{viewModal.user.totalBookings}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Spent</label>
                  <p className="mt-1 text-sm text-gray-900">₹{viewModal.user.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Provider</label>
                  <p className="mt-1 text-sm text-gray-900">{viewModal.user.provider}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Login</label>
                  <p className="mt-1 text-sm text-gray-900">{viewModal.user.lastLogin}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit User Status</h3>
              <button
                onClick={() => setEditModal({ open: false, user: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {editModal.user && (
              <div>
                <p className="mb-4">Change status for <strong>{editModal.user.name}</strong></p>
                <div className="space-y-2">
                  {['active', 'inactive', 'suspended'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateUserStatus(editModal.user.id, status)}
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        editModal.user.status === status
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Delete User</h3>
              <button
                onClick={() => setDeleteModal({ open: false, user: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {deleteModal.user && (
              <div>
                <p className="mb-6">
                  Are you sure you want to delete <strong>{deleteModal.user.name}</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => deleteUser(deleteModal.user.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: false, user: null })}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default UserManagement;
