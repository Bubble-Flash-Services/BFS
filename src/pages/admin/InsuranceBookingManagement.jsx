import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Shield,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Car,
  CheckCircle,
  AlertCircle,
  XCircle,
  UserCheck,
  RefreshCw,
  Eye,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || window.location.origin;

const InsuranceBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [acting, setActing] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    totalRevenue: 0,
  });

  // Fetch Insurance bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API}/api/adminNew/bookings?page=1&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success && data.data) {
        // Filter for Insurance bookings
        const insuranceBookings = (data.data.bookings || []).filter(
          (booking) => {
            const items = booking.items || [];
            return items.some(
              (item) =>
                (item.type || "").toLowerCase().includes("insurance") ||
                (item.category || "").toLowerCase().includes("insurance") ||
                (item.serviceName || "").toLowerCase().includes("insurance")
            );
          }
        );

        setBookings(insuranceBookings);
        setFilteredBookings(insuranceBookings);
        calculateStats(insuranceBookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load insurance bookings");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (bookings) => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      inProgress: bookings.filter(
        (b) => b.status === "in-progress" || b.status === "assigned"
      ).length,
      completed: bookings.filter((b) => b.status === "completed").length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    };
    setStats(stats);
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API}/api/adminNew/employees?page=1&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success && data.data) {
        setEmployees(data.data.employees || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchEmployees();
  }, []);

  // Filter bookings
  useEffect(() => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((booking) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (booking.bookingId || "").toLowerCase().includes(searchLower) ||
          (booking.userId?.name || "").toLowerCase().includes(searchLower) ||
          (booking.userId?.email || "").toLowerCase().includes(searchLower) ||
          (booking.formData?.vehicleNumber || "")
            .toLowerCase()
            .includes(searchLower)
        );
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    // Filter by service type
    if (serviceTypeFilter !== "all") {
      filtered = filtered.filter((booking) => {
        const items = booking.items || [];
        return items.some((item) =>
          (item.variant || "")
            .toLowerCase()
            .includes(serviceTypeFilter.toLowerCase())
        );
      });
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, serviceTypeFilter, bookings]);

  // Refresh bookings
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
    toast.success("Bookings refreshed");
  };

  // Assign employee to booking
  const handleAssignEmployee = async () => {
    if (!selectedEmployee || !selectedBooking) return;

    try {
      setActing(true);
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API}/api/adminNew/bookings/${selectedBooking._id}/assign`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: selectedEmployee,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Employee assigned successfully");
        setShowAssignModal(false);
        fetchBookings();
      } else {
        toast.error(data.message || "Failed to assign employee");
      }
    } catch (error) {
      console.error("Error assigning employee:", error);
      toast.error("Failed to assign employee");
    } finally {
      setActing(false);
    }
  };

  // Update booking status
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `${API}/api/adminNew/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchBookings();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // View booking details
  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      assigned: "bg-blue-100 text-blue-800",
      "in-progress": "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              Insurance Bookings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage vehicle insurance assistance bookings
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Total Bookings</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-800">
              {stats.pending}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-800">
              {stats.completed}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-purple-800">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by booking ID, name, vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="renewal">Renewal</option>
              <option value="new">New Policy</option>
              <option value="claim">Claim Assistance</option>
            </select>
            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No insurance bookings found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.bookingId || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.userId?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.userId?.email ||
                                booking.formData?.email ||
                                "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Car className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.formData?.vehicleNumber || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.formData?.vehicleType || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.items?.[0]?.variant || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.assignedTo?.name || "Unassigned"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{booking.totalAmount?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => viewBookingDetails(booking)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!booking.assignedTo && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowAssignModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Assign Employee"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assign Employee Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Assign Employee</h3>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} - {emp.role}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAssignEmployee}
                  disabled={!selectedEmployee || acting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Assign
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Booking Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Booking ID</label>
                    <p className="font-semibold">{selectedBooking.bookingId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <div className="mt-1">
                      <StatusBadge status={selectedBooking.status} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Customer Name
                    </label>
                    <p className="font-semibold">
                      {selectedBooking.userId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-semibold">
                      {selectedBooking.formData?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-semibold">
                      {selectedBooking.formData?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Vehicle Number
                    </label>
                    <p className="font-semibold">
                      {selectedBooking.formData?.vehicleNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Vehicle Type
                    </label>
                    <p className="font-semibold">
                      {selectedBooking.formData?.vehicleType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Make & Model
                    </label>
                    <p className="font-semibold">
                      {selectedBooking.formData?.make}{" "}
                      {selectedBooking.formData?.model}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Service Type
                    </label>
                    <p className="font-semibold">
                      {selectedBooking.items?.[0]?.variant || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Amount</label>
                    <p className="font-semibold text-green-600">
                      ₹{selectedBooking.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
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

export default InsuranceBookingManagement;
