import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, Star, Calendar, MapPin, Phone, User, Clock } from 'lucide-react';
import EmployeeLayout from '../../components/EmployeeLayout';
import { getCompletedTasks } from '../../api/employee';

const EmployeeCompleted = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockCompletedTasks = [
      {
        id: 'BF001',
        customerName: 'Darvin Kumar',
        customerPhone: '9566751053',
        serviceType: 'Premium Car Wash',
        location: 'HSR Layout, Bangalore',
        address: '123 Main Street, HSR Layout, Bangalore',
        completedDate: '2025-01-23',
        completedTime: '11:30 AM',
        scheduledTime: '10:00 AM',
        estimatedDuration: '45 mins',
        actualDuration: '42 mins',
        amount: 699,
        customerRating: 5,
        customerFeedback: 'Excellent service! Very thorough and professional.',
        beforePhoto: null,
        afterPhoto: null,
        earnings: 105 // Commission
      },
      {
        id: 'BF004',
        customerName: 'Anita Reddy',
        customerPhone: '9988776655',
        serviceType: 'Essential Bike Wash',
        location: 'BTM Layout, Bangalore',
        address: '321 Ring Road, BTM Layout, Bangalore',
        completedDate: '2025-01-22',
        completedTime: '11:20 AM',
        scheduledTime: '11:00 AM',
        estimatedDuration: '25 mins',
        actualDuration: '20 mins',
        amount: 199,
        customerRating: 4,
        customerFeedback: 'Good service, bike looks clean.',
        beforePhoto: null,
        afterPhoto: null,
        earnings: 30
      },
      {
        id: 'BF005',
        customerName: 'Vikram Singh',
        customerPhone: '9111222333',
        serviceType: 'Premium Laundry',
        location: 'Indiranagar, Bangalore',
        address: '555 100 Feet Road, Indiranagar, Bangalore',
        completedDate: '2025-01-21',
        completedTime: '10:45 AM',
        scheduledTime: '9:00 AM',
        estimatedDuration: '120 mins',
        actualDuration: '135 mins',
        amount: 450,
        customerRating: 5,
        customerFeedback: 'Perfect! Clothes are spotless and smell great.',
        beforePhoto: null,
        afterPhoto: null,
        earnings: 68
      },
      {
        id: 'BF007',
        customerName: 'Priya Sharma',
        customerPhone: '9876543210',
        serviceType: 'Deluxe Car Wash',
        location: 'Koramangala, Bangalore',
        address: '456 Park Avenue, Koramangala, Bangalore',
        completedDate: '2025-01-20',
        completedTime: '3:45 PM',
        scheduledTime: '2:00 PM',
        estimatedDuration: '60 mins',
        actualDuration: '65 mins',
        amount: 899,
        customerRating: 4,
        customerFeedback: 'Very satisfied with the service quality.',
        beforePhoto: null,
        afterPhoto: null,
        earnings: 135
      },
      {
        id: 'BF008',
        customerName: 'Rajesh Kumar',
        customerPhone: '9123456789',
        serviceType: 'Essential Car Wash',
        location: 'Whitefield, Bangalore',
        address: '789 Tech Park, Whitefield, Bangalore',
        completedDate: '2025-01-19',
        completedTime: '5:30 PM',
        scheduledTime: '4:30 PM',
        estimatedDuration: '30 mins',
        actualDuration: '35 mins',
        amount: 299,
        customerRating: 3,
        customerFeedback: 'Okay service, could be better.',
        beforePhoto: null,
        afterPhoto: null,
        earnings: 45
      }
    ];

    (async () => {
      try {
        const res = await getCompletedTasks({ dateFilter: 'all' });
        if (res.success) {
          setCompletedTasks(
            res.data.tasks?.map(t => ({
              id: t.id,
              customerName: t.customerName,
              customerPhone: t.customerPhone,
              serviceType: t.serviceType,
              location: t.location,
              address: t.address,
              completedDate: t.completedDate,
              completedTime: t.completedTime,
              scheduledTime: t.scheduledTime,
              estimatedDuration: t.estimatedDuration,
              actualDuration: t.actualDuration,
              amount: t.amount,
              customerRating: t.customerRating,
              customerFeedback: t.customerFeedback,
              earnings: t.earnings,
            })) || []
          );
        } else {
          setCompletedTasks(mockCompletedTasks);
        }
      } catch (e) {
        setCompletedTasks(mockCompletedTasks);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter tasks based on search and filters
  useEffect(() => {
    let filtered = completedTasks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

    if (dateFilter === 'today') {
      filtered = filtered.filter(task => task.completedDate === today);
    } else if (dateFilter === 'yesterday') {
      filtered = filtered.filter(task => task.completedDate === yesterday);
    } else if (dateFilter === 'week') {
      filtered = filtered.filter(task => task.completedDate >= weekAgo);
    } else if (dateFilter === 'month') {
      filtered = filtered.filter(task => task.completedDate >= monthAgo);
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(task => task.customerRating >= rating);
    }

    setFilteredTasks(filtered);
  }, [completedTasks, searchTerm, dateFilter, ratingFilter]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const calculateStats = () => {
    const totalEarnings = filteredTasks.reduce((sum, task) => sum + task.earnings, 0);
    const averageRating = filteredTasks.length > 0 
      ? (filteredTasks.reduce((sum, task) => sum + task.customerRating, 0) / filteredTasks.length).toFixed(1)
      : 0;
    const totalTasks = filteredTasks.length;
    const fiveStarTasks = filteredTasks.filter(task => task.customerRating === 5).length;

    return { totalEarnings, averageRating, totalTasks, fiveStarTasks };
  };

  const stats = calculateStats();

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
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Completed Tasks</h1>
          <p className="text-gray-600">View your completed assignments and customer feedback</p>
        </div>

        {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">₹</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">★</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.fiveStarTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search completed tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredTasks.length} of {completedTasks.length} tasks
            </div>
          </div>
        </div>

        {/* Completed Tasks List */}
    <div className="space-y-6">
          {filteredTasks.map((task) => (
      <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
              {/* Task Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">{task.serviceType}</h3>
                    <div className="flex items-center bg-green-50 px-2 py-1 rounded-full border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-700">Completed</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>ID: {task.id}</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(task.completedDate)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 mb-1">₹{task.amount}</p>
                  <p className="text-sm text-green-600 font-medium">Earned: ₹{task.earnings}</p>
                </div>
              </div>

              {/* Customer & Timing Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{task.customerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{task.customerPhone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      Completed: {task.completedTime} (Duration: {task.actualDuration})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{task.location}</span>
                  </div>
                </div>
              </div>

              {/* Customer Rating & Feedback */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Customer Rating & Feedback</h4>
                  <div className="flex items-center">
                    <div className="flex mr-2">{renderStars(task.customerRating)}</div>
                    <span className="text-sm font-medium text-gray-900">({task.customerRating}/5)</span>
                  </div>
                </div>
                {task.customerFeedback && (
                  <p className="text-sm text-gray-700 italic">"{task.customerFeedback}"</p>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Scheduled Time</div>
                  <div className="text-lg font-bold text-blue-900">{task.scheduledTime}</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Completed Time</div>
                  <div className="text-lg font-bold text-green-900">{task.completedTime}</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Duration</div>
                  <div className="text-lg font-bold text-purple-900">{task.actualDuration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">No completed tasks found</div>
            <div className="text-gray-400">Try adjusting your filters or complete some assignments</div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeCompleted;
