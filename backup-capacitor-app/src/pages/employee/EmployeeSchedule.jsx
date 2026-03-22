import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, User, ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react';
import EmployeeLayout from '../../components/EmployeeLayout';
import { getEmployeeSchedule } from '../../api/employee';

const EmployeeSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState({});
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [loading, setLoading] = useState(true);

  // Load schedule data from API
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 60);
        const res = await getEmployeeSchedule({
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        });
        if (res?.success && res?.data?.scheduleData) {
          setScheduleData(res.data.scheduleData);
        } else {
          setScheduleData({});
        }
      } catch {
        setScheduleData({});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getWeekDays = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    // Adjust to start from Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'tentative':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // priority removed from UI

  const getTodaySchedule = () => {
    const today = formatDate(new Date());
    return scheduleData[today] || [];
  };

  const getDateSchedule = (date) => {
    const dateStr = formatDate(date);
    return scheduleData[dateStr] || [];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schedule</h1>
              <p className="text-gray-600">View your upcoming assignments and manage your time</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'week' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'month' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Month
                </button>
              </div>
              {/* Add Task (placeholder trigger, can wire to modal later) */}
              <button
                type="button"
                className="inline-flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                title="Add task for selected day"
                onClick={() => alert('Add Task: open a form to create an assignment for the selected date.')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {viewMode === 'week' 
                ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }
            </h2>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Today's Schedule Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {getTodaySchedule().length > 0 ? (
              getTodaySchedule().map((task, index) => (
                <div key={task.id} className={`bg-white rounded-lg p-4`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{task.serviceType}</h4>
                      <p className="text-sm text-gray-600">{task.customerName} • {task.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {task.time}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-blue-700">No assignments scheduled for today</p>
            )}
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {viewMode === 'week' ? (
            <div>
              <div className="hidden md:grid grid-cols-7 gap-0">
                {/* Week Header */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="bg-gray-50 p-4 text-center font-medium text-gray-700 border-b border-gray-200">
                    {day}
                  </div>
                ))}
                {/* Week Days */}
                {getWeekDays(currentDate).map((date) => {
                  const daySchedule = getDateSchedule(date);
                  return (
                    <div key={date.toISOString()} className="border-r border-gray-200 last:border-r-0">
                      <div className={`p-3 border-b border-gray-200 ${isToday(date) ? 'bg-blue-50' : 'bg-white'}`}>
                        <div className={`text-center font-medium ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
                          {date.getDate()}
                        </div>
                      </div>
                      <div className="p-2 min-h-48">
                        <div className="space-y-2">
                          {daySchedule.map((task) => (
                            <div key={task.id} className="p-2 rounded text-xs cursor-pointer hover:shadow-sm transition-shadow" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                              <div className="font-medium text-gray-900 truncate">{task.serviceType}</div>
                              <div className="text-gray-600 truncate">{task.customerName}</div>
                              <div className="flex items-center text-gray-500 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {task.time}
                              </div>
                              <span className={`inline-block px-1 py-0.5 text-xs rounded-full mt-1 ${getStatusColor(task.status)}`}>{task.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Mobile list for week view */}
              <div className="md:hidden p-3 space-y-3">
                {getWeekDays(currentDate).map((date) => {
                  const daySchedule = getDateSchedule(date);
                  return (
                    <div key={date.toISOString()}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        {isToday(date) && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Today</span>}
                      </div>
                      {daySchedule.length === 0 ? (
                        <div className="text-sm text-gray-500">No assignments</div>
                      ) : (
                        <div className="space-y-2">
                          {daySchedule.map((task) => (
                            <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{task.serviceType}</div>
                                  <div className="text-xs text-gray-600">{task.customerName} • {task.location || ''}</div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center text-xs text-gray-600 justify-end">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {task.time}
                                  </div>
                                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${getStatusColor(task.status)}`}>{task.status}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="hidden md:grid grid-cols-7 gap-0">
                {/* Month Header */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="bg-gray-50 p-4 text-center font-medium text-gray-700 border-b border-gray-200">
                    {day}
                  </div>
                ))}
                {/* Month Days */}
                {getMonthDays(currentDate).map((date) => {
                  const daySchedule = getDateSchedule(date);
                  const isCurrent = isSameMonth(date);
                  return (
                    <div key={date.toISOString()} className="border-r border-b border-gray-200 last:border-r-0">
                      <div className={`p-2 h-24 ${isCurrent ? 'bg-white' : 'bg-gray-50'}`}>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday(date)
                            ? 'text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center'
                            : isCurrent
                              ? 'text-gray-900'
                              : 'text-gray-400'
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {daySchedule.slice(0, 2).map((task) => (
                            <div key={task.id} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate">
                              {task.time} - {task.customerName}
                            </div>
                          ))}
                          {daySchedule.length > 2 && (
                            <div className="text-xs text-gray-500">+{daySchedule.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Mobile list for month view */}
              <div className="md:hidden p-3 space-y-3">
                {getMonthDays(currentDate).map((date) => {
                  const daySchedule = getDateSchedule(date);
                  if (!isSameMonth(date)) return null;
                  return (
                    <div key={date.toISOString()}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        {isToday(date) && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Today</span>}
                      </div>
                      {daySchedule.length === 0 ? (
                        <div className="text-sm text-gray-500">No assignments</div>
                      ) : (
                        <div className="space-y-2">
                          {daySchedule.map((task) => (
                            <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{task.serviceType}</div>
                                  <div className="text-xs text-gray-600">{task.customerName} • {task.location || ''}</div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center text-xs text-gray-600 justify-end">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {task.time}
                                  </div>
                                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${getStatusColor(task.status)}`}>{task.status}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200 mr-2">
                    confirmed
                  </span>
                  <span className="text-sm text-gray-600">Confirmed appointment</span>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs font-medium rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200 mr-2">
                    pending
                  </span>
                  <span className="text-sm text-gray-600">Awaiting confirmation</span>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs font-medium rounded-full border bg-blue-100 text-blue-800 border-blue-200 mr-2">
                    tentative
                  </span>
                  <span className="text-sm text-gray-600">Tentative booking</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeSchedule;
