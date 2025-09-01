import React, { useEffect, useState } from 'react';
import { getEmployeeProfile, getAttendanceStatus } from '../api/employee';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList,
  CheckCircle,
  Calendar,
  User,
  Menu, 
  X,
  LogOut
} from 'lucide-react';

const EmployeeLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/employee/dashboard',
      icon: LayoutDashboard,
      active: location.pathname === '/employee/dashboard'
    },
    {
      name: 'My Assignments',
      href: '/employee/assignments',
      icon: ClipboardList,
      active: location.pathname === '/employee/assignments'
    },
    {
      name: 'Completed Tasks',
      href: '/employee/completed',
      icon: CheckCircle,
      active: location.pathname === '/employee/completed'
    },
    {
      name: 'Schedule',
      href: '/employee/schedule',
      icon: Calendar,
      active: location.pathname === '/employee/schedule'
    },
    {
      name: 'Profile',
      href: '/employee/profile',
      icon: User,
      active: location.pathname === '/employee/profile'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeUser');
    window.location.href = '/employee/login';
  };

  const [employeeHeader, setEmployeeHeader] = useState({ name: '', specialization: '', profileImage: null });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('employeeUser') || '{}');
      const name = stored?.name || '';
      setEmployeeHeader(prev => ({ ...prev, name }));
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEmployeeProfile();
        if (res?.success && res?.data?.employee) {
          const e = res.data.employee;
          setEmployeeHeader(prev => ({
            ...prev,
            name: prev.name || e.name || '',
            specialization: e.specialization ? (e.specialization === 'all' ? 'Specialist' : `${e.specialization.charAt(0).toUpperCase()}${e.specialization.slice(1)} Specialist`) : prev.specialization,
            profileImage: e.profileImage || prev.profileImage || null,
          }));
        }
      } catch {}
    })();
  }, []);

  // Enhance avatar with today's attendance selfie if available
  useEffect(() => {
    (async () => {
      try {
        const status = await getAttendanceStatus();
        if (status?.success && status.doneToday && status.url) {
          setEmployeeHeader(prev => ({ ...prev, profileImage: status.url }));
        }
      } catch {}
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Bubble Flash</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Employee Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {employeeHeader.profileImage ? (
                <img src={employeeHeader.profileImage} alt={employeeHeader.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{employeeHeader.name || 'Employee'}</p>
              <p className="text-xs text-gray-500">{employeeHeader.specialization || ''}</p>
            </div>
          </div>
        </div>

        <nav className="mt-4 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${item.active 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Employee Portal</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
