import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getDashboardStats, getCurrentCustomers, getMonthlyData } from '../../api/admin';
import AdminLayout from '../../components/AdminLayout';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    bookingsCount: 0,
    todayBookings: 0,
    totalRevenue: 0,
    cancellationRequests: 0
  });

  const [currentCustomers, setCurrentCustomers] = useState([]);
  const [monthlyData, setMonthlyData] = useState({
    sales: [],
    revenue: [],
    months: []
  });

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load dashboard stats
        const statsResponse = await getDashboardStats();
        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }

        // Load current customers
        const customersResponse = await getCurrentCustomers();
        if (customersResponse.success) {
          setCurrentCustomers(customersResponse.data);
        }

        // Load monthly data
        const monthlyResponse = await getMonthlyData();
        if (monthlyResponse.success) {
          setMonthlyData(monthlyResponse.data);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Keep mock data as fallback
        setDashboardStats({
          bookingsCount: 1250,
          todayBookings: 8,
          totalRevenue: 50000,
          cancellationRequests: 5
        });

        setCurrentCustomers([
          {
            id: 1,
            customer: 'Darvin',
            contactNo: '9566751053',
            location: 'HSR Layout',
            serviceMode: 'Car',
            paymentMethod: 'UPI',
            plan: 'Premium Wash',
            date: '2025-07-23'
          },
          {
            id: 2,
            customer: 'Priya Sharma',
            contactNo: '9876543210',
            location: 'Koramangala',
            serviceMode: 'Bike',
            paymentMethod: 'Card',
            plan: 'Basic Wash',
            date: '2025-07-23'
          },
          {
            id: 3,
            customer: 'Rajesh Kumar',
            contactNo: '9123456789',
            location: 'Whitefield',
            serviceMode: 'Laundry',
            paymentMethod: 'Cash',
            plan: 'Dry Clean',
            date: '2025-07-23'
          },
          {
            id: 4,
            customer: 'Anita Singh',
            contactNo: '9555666777',
            location: 'Indiranagar',
            serviceMode: 'Car',
            paymentMethod: 'UPI',
            plan: 'Deluxe Wash',
            date: '2025-07-23'
          }
        ]);

        setMonthlyData({
          sales: [45, 52, 48, 61, 55, 67, 73, 69, 75, 82, 88, 95],
          revenue: [35000, 42000, 38000, 51000, 45000, 58000, 62000, 59000, 68000, 72000, 78000, 85000],
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        });
      }
    };

    loadDashboardData();
  }, []);

  // Chart configuration for monthly sales
  const salesChartData = {
    labels: monthlyData.months,
    datasets: [
      {
        label: 'Monthly Sales',
        data: monthlyData.sales,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Chart configuration for monthly revenue
  const revenueChartData = {
    labels: monthlyData.months,
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: monthlyData.revenue,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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

  const getPaymentMethodColor = (method) => {
    switch (method.toLowerCase()) {
      case 'upi':
        return 'bg-orange-100 text-orange-800';
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'cash':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
          <div className="text-sm text-gray-500 mt-2">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bookings Count</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.bookingsCount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.todayBookings}</p>
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
                <p className="text-2xl font-bold text-gray-900">₹{dashboardStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">❌</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancellation Requests</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.cancellationRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Customers Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Current Customers</h2>
            <p className="text-sm text-gray-600">Today's active bookings and services</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.contactNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceModeColor(customer.serviceMode)}`}>
                        {customer.serviceMode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(customer.paymentMethod)}`}>
                        {customer.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.plan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.date}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Sales</h3>
              <p className="text-sm text-gray-600">Number of bookings per month</p>
            </div>
            <div className="h-80">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-sm text-gray-600">Revenue generated per month</p>
            </div>
            <div className="h-80">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
