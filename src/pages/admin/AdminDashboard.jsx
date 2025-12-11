import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getDashboardStats } from '../../api/admin';
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
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    bookingsCount: 0,
    todayBookings: 0,
    totalRevenue: 0,
    cancellationRequests: 0
  });

  const [serviceBreakdown, setServiceBreakdown] = useState({
    carWash: 0,
    greenClean: 0,
    moversPackers: 0,
    painting: 0,
    laundry: 0,
    vehicleCheckup: 0,
    insurance: 0,
    puc: 0,
    keyServices: 0,
    vehicleAccessories: 0
  });

  const [currentCustomers, setCurrentCustomers] = useState([]);
  const [monthlyData, setMonthlyData] = useState({
    sales: new Array(12).fill(0),
    revenue: new Array(12).fill(0),
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  });
  const [loadError, setLoadError] = useState('');

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load dashboard stats (includes overview, monthlyRevenue, and recentBookings)
        const statsResponse = await getDashboardStats();
        if (!statsResponse.success) {
          throw new Error(statsResponse.message || 'Failed to load dashboard stats');
        }

        const { overview, monthlyRevenue = [], recentBookings = [], serviceBreakdown = {} } = statsResponse.data || {};

        // Cards
        setDashboardStats({
          bookingsCount: overview?.totalBookings ?? 0,
          todayBookings: overview?.todayBookings ?? 0,
          totalRevenue: overview?.totalRevenue ?? 0,
          cancellationRequests: overview?.cancelledBookings ?? 0,
        });

        // Service breakdown
        setServiceBreakdown({
          carWash: serviceBreakdown?.carWash ?? 0,
          greenClean: serviceBreakdown?.greenClean ?? 0,
          moversPackers: serviceBreakdown?.moversPackers ?? 0,
          painting: serviceBreakdown?.painting ?? 0,
          laundry: serviceBreakdown?.laundry ?? 0,
          vehicleCheckup: serviceBreakdown?.vehicleCheckup ?? 0,
          insurance: serviceBreakdown?.insurance ?? 0,
          puc: serviceBreakdown?.puc ?? 0,
          keyServices: serviceBreakdown?.keyServices ?? 0,
          vehicleAccessories: serviceBreakdown?.vehicleAccessories ?? 0
        });

        // Helper to extract phone from various sources (notes, serviceAddress, explicit fields)
        const extractPhone = (rb) => {
          const fromUser = rb?.userId?.phone;
          const fromSvcAddr = rb?.serviceAddress?.phone || rb?.serviceAddress?.contactPhone;
          const explicit = rb?.contactPhone || rb?.phone || rb?.paymentDetails?.contact;
          const fromNotes = (() => {
            const notes = rb?.customerNotes || rb?.notes || '';
            const m = /phone\s*[:\-]?\s*([+]?\d[\d\s-]{7,}\d)/i.exec(notes);
            return m ? m[1].replace(/\s+/g, '').replace(/-/g, '') : null;
          })();
          return explicit || fromSvcAddr || fromNotes || fromUser || 'N/A';
        };

        // Current customers table from recent bookings (prefer checkout-provided address/phone)
        const customersFromRecent = recentBookings.map((rb) => {
          const locRaw = rb.serviceAddress?.fullAddress || rb.serviceAddress?.address || rb.userId?.address || '';
          // Clean up placeholder defaults and standalone pincodes
          const location = (() => {
            if (!locRaw) return 'N/A';
            if (/^\s*Bengaluru,?\s*India\s*$/i.test(locRaw)) return 'N/A';
            if (/^\s*\d{6}\s*$/.test(locRaw)) return 'N/A';
            return locRaw;
          })();
          return ({
          id: rb._id,
          customer: rb.userId?.name || 'Unknown',
          contactNo: extractPhone(rb),
          location,
          serviceMode: rb.serviceType || rb.items?.[0]?.serviceName || 'N/A',
          paymentMethod: rb.paymentMethod || 'N/A',
          plan: rb.items?.[0]?.packageName || 'N/A',
          date: rb.createdAt ? new Date(rb.createdAt).toISOString().split('T')[0] : 'N/A',
          });
        });
        setCurrentCustomers(customersFromRecent);

        // Monthly charts from monthlyRevenue
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const sales = new Array(12).fill(0);
        const revenue = new Array(12).fill(0);
        monthlyRevenue.forEach((item) => {
          const idx = (item.month ?? item._id?.month) - 1;
          if (idx >= 0 && idx < 12) {
            sales[idx] = item.orders ?? 0;
            revenue[idx] = item.revenue ?? 0;
          }
        });
        setMonthlyData({ months, sales, revenue });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoadError('Failed to load dashboard data. Please check your admin authentication and server.');
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
  maintainAspectRatio: false,
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
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
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

        {/* Service-Specific Orders Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Orders by Service Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => navigate('/admin/orders?serviceType=car-wash')}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">Car Wash</p>
                  <p className="text-3xl font-bold mt-2">{serviceBreakdown.carWash}</p>
                  <p className="text-xs mt-2 opacity-75">Click to view orders</p>
                </div>
                <div className="text-4xl opacity-80">🚗</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/admin/green-clean')}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">Green & Clean</p>
                  <p className="text-3xl font-bold mt-2">{serviceBreakdown.greenClean}</p>
                  <p className="text-xs mt-2 opacity-75">Click to view bookings</p>
                </div>
                <div className="text-4xl opacity-80">🌿</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/admin/movers-packers')}
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">Movers & Packers</p>
                  <p className="text-3xl font-bold mt-2">{serviceBreakdown.moversPackers}</p>
                  <p className="text-xs mt-2 opacity-75">Click to view bookings</p>
                </div>
                <div className="text-4xl opacity-80">📦</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/admin/orders?serviceType=laundry')}
              className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">Laundry</p>
                  <p className="text-3xl font-bold mt-2">{serviceBreakdown.laundry}</p>
                  <p className="text-xs mt-2 opacity-75">Click to view orders</p>
                </div>
                <div className="text-4xl opacity-80">👔</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/admin/vehicle-checkup')}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">Vehicle Checkup</p>
                  <p className="text-3xl font-bold mt-2">{serviceBreakdown.vehicleCheckup}</p>
                  <p className="text-xs mt-2 opacity-75">Click to view bookings</p>
                </div>
                <div className="text-4xl opacity-80">🔧</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/admin/insurance-bookings')}
              className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">Insurance</p>
                  <p className="text-3xl font-bold mt-2">{serviceBreakdown.insurance}</p>
                  <p className="text-xs mt-2 opacity-75">Click to view bookings</p>
                </div>
                <div className="text-4xl opacity-80">🛡️</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/admin/puc-bookings')}
              className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">PUC Bookings</p>
                  <p className="text-3xl font-bold mt-2">{serviceBreakdown.puc}</p>
                  <p className="text-xs mt-2 opacity-75">Click to view bookings</p>
                </div>
                <div className="text-4xl opacity-80">📋</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/admin/key-services')}
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">Key Services</p>
                  <p className="text-3xl font-bold mt-2">{serviceBreakdown.keyServices}</p>
                  <p className="text-xs mt-2 opacity-75">Click to view bookings</p>
                </div>
                <div className="text-4xl opacity-80">🔑</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/admin/painting-services')}
              className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">Painting Quotes</p>
                  <p className="text-3xl font-bold mt-2">{serviceBreakdown.painting}</p>
                  <p className="text-xs mt-2 opacity-75">Click to view quotes</p>
                </div>
                <div className="text-4xl opacity-80">🎨</div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/admin/vehicle-accessories')}
              className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-medium opacity-90">Vehicle Accessories</p>
                  <p className="text-3xl font-bold mt-2">{serviceBreakdown.vehicleAccessories}</p>
                  <p className="text-xs mt-2 opacity-75">Click to view orders</p>
                </div>
                <div className="text-4xl opacity-80">🛞</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Customers Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Current Customers</h2>
            <p className="text-sm text-gray-600">Today's active bookings and services</p>
            {loadError && (
              <div className="mt-2 text-sm text-red-600">{loadError}</div>
            )}
          </div>
          {/* Mobile card list */}
          <div className="md:hidden p-4 space-y-4">
            {currentCustomers.length === 0 && (
              <div className="text-sm text-gray-500">No recent customers</div>
            )}
            {currentCustomers.map((c) => (
              <div key={c.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-gray-900">{c.customer}</div>
                    <div className="text-sm text-gray-600">{c.plan}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getServiceModeColor(c.serviceMode)}`}>{c.serviceMode}</div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Contact</span><span className="text-gray-800">{c.contactNo}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className={`px-2 py-0.5 rounded-full ${getPaymentMethodColor(c.paymentMethod)}`}>{c.paymentMethod}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="text-gray-800">{c.date}</span></div>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  <div className="line-clamp-2">{c.location}</div>
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
                    <td className="px-6 py-4">
                      <div className="max-w-xs md:max-w-sm lg:max-w-md text-sm text-gray-900 break-words line-clamp-2">{customer.location}</div>
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
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Monthly Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Sales</h3>
              <p className="text-sm text-gray-600">Number of bookings per month</p>
            </div>
            <div className="h-64 md:h-80">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              <p className="text-sm text-gray-600">Revenue generated per month</p>
            </div>
            <div className="h-64 md:h-80">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
