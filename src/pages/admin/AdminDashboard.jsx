import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { getDashboardStats } from '../../api/admin';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats(token);
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <StatCard
              title="Total Users"
              value={stats.totalUsers || 0}
              iconBg="bg-blue-500"
              iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
            {/* Total Orders */}
            <StatCard
              title="Total Orders"
              value={stats.totalOrders || 0}
              iconBg="bg-green-500"
              iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            {/* Total Revenue */}
            <StatCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue || 0}`}
              iconBg="bg-yellow-500"
              iconPath="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
            {/* Active Services */}
            <StatCard
              title="Active Services"
              value={stats.activeServices || 0}
              iconBg="bg-purple-500"
              iconPath="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                {stats?.recentOrders?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentOrders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.customer?.name || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{order.total}</p>
                          <p className={`text-sm px-2 py-1 rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No recent orders</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <QuickAction iconColor="text-blue-600" bgColor="bg-blue-50" label="Add Service" iconPath="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  <QuickAction iconColor="text-green-600" bgColor="bg-green-50" label="View Orders" iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <QuickAction iconColor="text-purple-600" bgColor="bg-purple-50" label="Add Coupon" iconPath="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  <QuickAction iconColor="text-yellow-600" bgColor="bg-yellow-50" label="View Reports" iconPath="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

// Reusable components
const StatCard = ({ title, value, iconBg, iconPath }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center`}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
        </div>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const QuickAction = ({ label, iconColor, bgColor, iconPath }) => (
  <button className={`p-4 ${bgColor} rounded-lg hover:brightness-95 transition-colors`}>
    <div className={`${iconColor} mb-2`}>
      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-900">{label}</p>
  </button>
);

export default AdminDashboard;
