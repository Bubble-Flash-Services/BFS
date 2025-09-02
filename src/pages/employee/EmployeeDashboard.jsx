import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, CheckCircle, AlertCircle, Calendar, User } from 'lucide-react';
import EmployeeLayout from '../../components/EmployeeLayout';
import { getEmployeeDashboard, uploadAttendanceSelfie, uploadTaskImages, completeTask, updateAssignmentStatus, getAssignmentDetails } from '../../api/employee';
import OrderDetailsModal from '../../components/employee/OrderDetailsModal';

const EmployeeDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState({}); // { [id]: { before?: File, after?: File } }
  const [uploadingByField, setUploadingByField] = useState({}); // { [id]: { before?: boolean, after?: boolean } }
  const [uploadedByField, setUploadedByField] = useState({});  // { [id]: { before?: boolean, after?: boolean } }
  const [amountCollectedByOrder, setAmountCollectedByOrder] = useState({}); // { [id]: boolean }
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
  // Minimal fallbacks to avoid hardcoding names when API is unavailable
  const fallbackEmployee = { name: 'Employee', specialization: '', todayAssignments: 0, completedToday: 0, pendingTasks: 0, totalEarnings: 0 };
  const fallbackAssignments = [];

    (async () => {
      try {
        const res = await getEmployeeDashboard();
        if (res.success) {
          setEmployee({
            id: res.data.employee.id,
            name: res.data.employee.name,
            specialization: res.data.employee.specialization,
            todayAssignments: res.data.todayStats.todayAssignments,
            completedToday: res.data.todayStats.completedToday,
            pendingTasks: res.data.todayStats.pendingTasks,
            totalEarnings: res.data.todayStats.totalEarnings,
          });
          setAssignments(res.data.assignments.map(a => ({
            id: a.id,
            customerName: a.customerName,
            customerPhone: a.customerPhone,
            serviceType: a.serviceType,
            location: a.location,
            address: a.address,
            scheduledTime: a.scheduledTime,
            estimatedDuration: a.estimatedDuration,
            amount: a.amount,
            status: a.status,
            instructions: a.instructions,
            assignedTime: a.assignedTime,
          })));
        } else {
          setEmployee(fallbackEmployee);
          setAssignments(fallbackAssignments);
        }
      } catch (e) {
  setEmployee(fallbackEmployee);
  setAssignments(fallbackAssignments);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load persisted upload flags from localStorage when assignments change
  useEffect(() => {
    if (!assignments || assignments.length === 0) return;
    setUploadedByField((prev) => {
      const next = { ...prev };
      for (const a of assignments) {
        try {
          const raw = localStorage.getItem(`taskUploads:${a.id}`);
          if (raw) {
            const obj = JSON.parse(raw);
            next[a.id] = { ...(next[a.id] || {}), ...obj };
          }
        } catch {}
      }
      return next;
    });
  }, [assignments]);

  const handleUpdateStatus = async (assignmentId, newStatus) => {
    const prev = assignments;
    try {
      if (newStatus === 'completed') {
        const res = await completeTask(assignmentId, { amountReceived: true, amountCollected: true });
        if (!res.success) throw new Error('Complete failed');
        setAssignments(prev.map(a => a.id === assignmentId ? { ...a, status: 'completed', completedTime: new Date().toISOString() } : a));
      } else {
        setAssignments(prev.map(a => a.id === assignmentId ? { ...a, status: newStatus } : a));
        const res = await updateAssignmentStatus(assignmentId, newStatus);
        if (!res.success) setAssignments(prev);
      }
    } catch {
      setAssignments(prev);
    }
  };

  const handleAttendanceUpload = async (file) => {
    await uploadAttendanceSelfie(file);
  };

  const handleTaskImagesUpload = async (orderId, files) => {
    // Upload single or both fields; update per-field flags accordingly
    const fields = ['before', 'after'];
    for (const field of fields) {
      const file = files[field];
      if (!file) continue;
      setUploadingByField(prev => ({ ...prev, [orderId]: { ...(prev[orderId] || {}), [field]: true } }));
      try {
        const res = await uploadTaskImages(orderId, { [field]: file });
        if (res?.success) {
          setUploadedByField(prev => ({
            ...prev,
            [orderId]: { ...(prev[orderId] || {}), [field]: true }
          }));
          // Persist to localStorage so it survives refreshes
          try {
            const current = JSON.parse(localStorage.getItem(`taskUploads:${orderId}`) || '{}');
            current[field] = true;
            localStorage.setItem(`taskUploads:${orderId}`, JSON.stringify(current));
          } catch {}
        }
      } finally {
        setUploadingByField(prev => ({ ...prev, [orderId]: { ...(prev[orderId] || {}), [field]: false } }));
      }
    }
  };

  const handleCompleteTask = async (orderId) => {
    // Always mark amount as received per requirement
    await completeTask(orderId, { amountReceived: true, amountCollected: true });
    // Optionally clear persisted upload flags after completion
    try { localStorage.removeItem(`taskUploads:${orderId}`); } catch {}
  };

  const openDetails = async (assignmentId) => {
    try {
      const res = await getAssignmentDetails(assignmentId);
      if (res?.success) {
        setOrderDetails(res.data);
        setDetailsOpen(true);
      }
    } catch {}
  };

  const onPickFile = async (assignmentId, field, file) => {
    if (!file) return;
    setImageFiles((prev) => ({
      ...prev,
      [assignmentId]: { ...(prev[assignmentId] || {}), [field]: file },
    }));
    await handleTaskImagesUpload(assignmentId, { [field]: file });
  };

  const getStatusColor = (status) => {
    switch (status) {
  case 'pending':
  case 'assigned':
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

  // priority removed from UI

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
      <div className="p-4 md:p-6">
  {/* Attendance is gated before entering Dashboard, so no UI here */}
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Good Morning, {employee?.name}!</h1>
              <p className="text-gray-600">Here are your assignments for today</p>
            </div>
            <div className="text-left md:text-right">
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
                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60" disabled={uploadingByField[assignment.id]?.before}>
                        {uploadingByField[assignment.id]?.before ? 'Uploading Before…' : (uploadedByField[assignment.id]?.before ? 'Reupload Before' : 'Upload Before')}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(assignment.id, 'before', e.target.files?.[0])} />
                      </label>
                      {uploadedByField[assignment.id]?.before && <span className="text-green-600 text-sm">Before uploaded</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60" disabled={uploadingByField[assignment.id]?.after}>
                        {uploadingByField[assignment.id]?.after ? 'Uploading After…' : (uploadedByField[assignment.id]?.after ? 'Reupload After' : 'Upload After')}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(assignment.id, 'after', e.target.files?.[0])} />
                      </label>
                      {uploadedByField[assignment.id]?.after && <span className="text-green-600 text-sm">After uploaded</span>}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={!!amountCollectedByOrder[assignment.id]}
                      onChange={(e) => setAmountCollectedByOrder(prev => ({ ...prev, [assignment.id]: e.target.checked }))}
                    />
                    Amount collected
                  </label>
                  <button
                    onClick={async () => {
                      // Always send amount received = true regardless of checkbox, but keep checkbox for UI
                      try {
                        setAssignments(prev => prev.map(a => a.id === assignment.id ? { ...a, status: 'completed', completedTime: new Date().toISOString() } : a));
                        const res = await completeTask(assignment.id, { amountReceived: true, amountCollected: true });
                        if (!res?.success) throw new Error('Complete failed');
                      } catch {
                        // revert status on failure
                        setAssignments(prev => prev.map(a => a.id === assignment.id ? { ...a, status: 'in-progress' } : a));
                        alert('Failed to mark as completed. Please try again.');
                      }
                    }}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Mark Completed
                  </button>
                  <a href={`tel:${assignment.customerPhone}`} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Call Customer
                  </a>
                  <a
                    href={assignment.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(assignment.address)}` : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View on Map
                  </a>
                  <button onClick={() => openDetails(assignment.id)} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Today's Assignments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Today's Assignments</h2>
            <p className="text-sm text-gray-600">Your scheduled tasks for today</p>
          </div>
          
          <div className="p-4 md:p-6">
            <div className="space-y-6">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                  {/* Assignment Header */}
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{assignment.serviceType}</h3>
                      </div>
                      <p className="text-sm text-gray-600">Booking ID: {assignment.id}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                        {assignment.status === 'assigned' ? 'pending' : assignment.status}
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
                    {(assignment.status === 'pending' || assignment.status === 'assigned') && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(assignment.id, 'in-progress')}
                          className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto"
                        >
                          Start Task
                        </button>
                        <a href={`tel:${assignment.customerPhone}`} className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
                          Call Customer
                        </a>
                      </>
                    )}
                    
                    {assignment.status === 'in-progress' && (
                      <>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={!!amountCollectedByOrder[assignment.id]}
                            onChange={(e) => setAmountCollectedByOrder(prev => ({ ...prev, [assignment.id]: e.target.checked }))}
                          />
                          Amount collected
                        </label>
                        <button
                          onClick={() => handleUpdateStatus(assignment.id, 'completed')}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60 w-full sm:w-auto"
                          disabled={!uploadedByField[assignment.id]?.before || !uploadedByField[assignment.id]?.after || !amountCollectedByOrder[assignment.id]}
                        >
                          Mark Completed
                        </button>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <label className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60" disabled={uploadingByField[assignment.id]?.before}>
                              {uploadingByField[assignment.id]?.before ? 'Uploading Before…' : (uploadedByField[assignment.id]?.before ? 'Reupload Before' : 'Upload Before')}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(assignment.id, 'before', e.target.files?.[0])} />
                            </label>
                            {uploadedByField[assignment.id]?.before && <span className="text-green-600 text-sm">Before uploaded</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60" disabled={uploadingByField[assignment.id]?.after}>
                              {uploadingByField[assignment.id]?.after ? 'Uploading After…' : (uploadedByField[assignment.id]?.after ? 'Reupload After' : 'Upload After')}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(assignment.id, 'after', e.target.files?.[0])} />
                            </label>
                            {uploadedByField[assignment.id]?.after && <span className="text-green-600 text-sm">After uploaded</span>}
                          </div>
                        </div>
                        <a href={`tel:${assignment.customerPhone}`} className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
                          Call Customer
                        </a>
                      </>
                    )}

                    {assignment.status === 'completed' && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}

                    <a
                      href={assignment.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(assignment.address)}` : '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
                    >
                      View on Map
                    </a>
                    <button onClick={() => openDetails(assignment.id)} className="border border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors w-full sm:w-auto">
                      View Details
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
  <OrderDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} order={orderDetails} />
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
