import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, CheckCircle, AlertCircle, Calendar, User } from 'lucide-react';
import EmployeeLayout from '../../components/EmployeeLayout';

const EmployeeDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockEmployee = {
      id: 1,
      name: 'Ravi Kumar',
      specialization: 'car',
      phone: '9876543210',
      email: 'ravi.kumar@bubbleflash.com',
      todayAssignments: 3,
      completedToday: 1,
      pendingTasks: 2,
      totalEarnings: 850
    };

    const mockAssignments = [
      {
        id: 'BF001',
        customerName: 'Darvin Kumar',
        customerPhone: '9566751053',
        serviceType: 'Premium Car Wash',
        location: 'HSR Layout, Bangalore',
        address: '123 Main Street, HSR Layout',
        scheduledTime: '10:00 AM',
        estimatedDuration: '45 mins',
        amount: 699,
        status: 'in-progress',
        priority: 'high',
        instructions: 'Customer requested extra care for leather seats',
        assignedTime: '2025-07-23T09:30:00'
      },
      {
        id: 'BF002',
        customerName: 'Priya Sharma',
        customerPhone: '9876543210',
        serviceType: 'Essential Car Wash',
        location: 'Koramangala, Bangalore',
        address: '456 Park Avenue, Koramangala',
        scheduledTime: '2:00 PM',
        estimatedDuration: '30 mins',
        amount: 299,
        status: 'pending',
        priority: 'medium',
        instructions: 'Regular wash, customer will provide water',
        assignedTime: '2025-07-23T13:30:00'
      },
      {
        id: 'BF003',
        customerName: 'Rajesh Kumar',
        customerPhone: '9123456789',
        serviceType: 'Deluxe Car Wash',
        location: 'Whitefield, Bangalore',
        address: '789 Tech Park, Whitefield',
        scheduledTime: '4:30 PM',
        estimatedDuration: '60 mins',
        amount: 899,
        status: 'pending',
        priority: 'low',
        instructions: 'Include dashboard polishing',
        assignedTime: '2025-07-23T16:00:00'
      }
    ];

    setTimeout(() => {
      setEmployee(mockEmployee);
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpdateStatus = (assignmentId, newStatus) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, status: newStatus }
        : assignment
    ));

    // Update employee stats
    if (newStatus === 'completed') {
      setEmployee(prev => ({
        ...prev,
        completedToday: prev.completedToday + 1,
        pendingTasks: prev.pendingTasks - 1
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <EmployeeLayout>
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
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Good Morning, {employee?.name}!</h1>
              <p className="text-gray-600">Here are your assignments for today</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{getCurrentTime()}</div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{employee?.todayAssignments}</p>
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
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{employee?.completedToday}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{employee?.pendingTasks}</p>
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
                <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{employee?.totalEarnings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Assignment (if any in-progress) */}
        {assignments.find(a => a.status === 'in-progress') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-blue-900">Current Assignment</h2>
            </div>
            {assignments.filter(a => a.status === 'in-progress').map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{assignment.serviceType}</h3>
                    <p className="text-sm text-gray-600">Customer: {assignment.customerName}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                    In Progress
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {assignment.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {assignment.scheduledTime} ({assignment.estimatedDuration})
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => handleUpdateStatus(assignment.id, 'completed')}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Mark Completed
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Call Customer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Today's Assignments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Today's Assignments</h2>
            <p className="text-sm text-gray-600">Your scheduled tasks for today</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Assignment Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{assignment.serviceType}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Booking ID: {assignment.id}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-1">₹{assignment.amount}</p>
                    </div>
                  </div>

                  {/* Customer & Location Info */}
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
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{assignment.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {assignment.scheduledTime} ({assignment.estimatedDuration})
                        </span>
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

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {assignment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(assignment.id, 'in-progress')}
                          className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Start Task
                        </button>
                        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                          Call Customer
                        </button>
                      </>
                    )}
                    
                    {assignment.status === 'in-progress' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(assignment.id, 'completed')}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          Mark Completed
                        </button>
                        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                          Call Customer
                        </button>
                      </>
                    )}

                    {assignment.status === 'completed' && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}

                    <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      View on Map
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {assignments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No assignments for today</div>
                <div className="text-gray-400">Check back later for new assignments</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
