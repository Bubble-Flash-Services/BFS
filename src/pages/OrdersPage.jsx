import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, DollarSign, MapPin, Star, Eye, ArrowLeft, RefreshCw, CheckCircle, X } from 'lucide-react';

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }
    
    if (user) {
      fetchOrders();
    }
  }, [user, loading, navigate]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      if (response.ok) {
        const result = await response.json();
        console.log('Orders API response:', result);
        
        if (result.success && result.data) {
          setOrders(result.data.orders || []);
        } else {
          setOrders([]);
          setError(result.message || 'Failed to fetch orders');
        }
      } else {
        console.error('Failed to fetch orders:', response.status);
        setError(`Failed to fetch orders (${response.status})`);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Network error. Please check your connection.');
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const openCancelConfirm = (orderId) => {
    setCancelTargetId(orderId);
    setShowCancelConfirm(true);
  };

  const performCancel = async () => {
    if (!cancelTargetId) return;
    try {
      setActing(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${cancelTargetId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Cancelled by customer' })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setOrders(prev => prev.map(o => o._id === cancelTargetId ? result.data : o));
        if (selectedOrder && selectedOrder._id === cancelTargetId) setSelectedOrder(result.data);
        setShowCancelConfirm(false);
        setShowCancelSuccess(true);
        setTimeout(() => setShowCancelSuccess(false), 1800);
      } else {
        // Soft error UI: briefly flash a red note in the modal
        // Keep modal open so user can retry or close
        console.error('Cancel failed:', result);
      }
    } catch (e) {
      console.error('Cancel order failed:', e);
    } finally {
      setActing(false);
    }
  };

  const handleDownloadInvoice = (order) => {
    if (!order) return;
    if (order.orderStatus === 'cancelled') {
      // Invoice is intentionally unavailable for cancelled orders
      return;
    }
    const logoUrl = '/logo.png';
    const dateFmt = (d) => new Date(d).toLocaleString();
    const phoneFromNotes = order.customerNotes && /Phone:\s*([^\n]+)/i.exec(order.customerNotes)?.[1]?.trim();
    const customerName = (user?.name) || (order.userId?.name) || '';
    const customerPhone = (user?.phone) || (order.userId?.phone) || phoneFromNotes || '';
    // Group items for better readability in invoice
    const getItemGroup = (item) => {
      const type = (item.type || '').toLowerCase();
      const label = ((item.serviceName || '') + ' ' + (item.vehicleType || '')).toLowerCase();
      if (type.includes('car')) return 'Car';
      if (type.includes('bike')) return 'Bike';
      if (type.includes('helmet')) return 'Helmet';
      if (/hatch|sedan|suv|mid\s*-\s*suv|luxur/.test(label)) return 'Car';
      if (/scooter|motorbike|cruiser|bike/.test(label)) return 'Bike';
      if (/helmet/.test(label)) return 'Helmet';
      return 'Others';
    };
    const orderGroups = ['Car','Bike','Helmet','Others'];
    const itemsByGroup = {};
    (order.items || []).forEach((it) => {
      const g = getItemGroup(it);
      if (!itemsByGroup[g]) itemsByGroup[g] = [];
      itemsByGroup[g].push(it);
    });
    let rowIndex = 0;
    const itemsRows = orderGroups.flatMap((gk) => {
      const arr = itemsByGroup[gk] || [];
      if (!arr.length) return [];
      const headerRow = `
        <tr>
          <td colspan="5" style="background:#f3f4f6;font-weight:700">${gk}</td>
        </tr>`;
      const rows = arr.map((item) => {
        const addOns = item.addOns || [];
        const baseTotal = (item.price || 0) * (item.quantity || 1);
        const laundryTotal = (item.laundryItems || []).reduce((s,l)=> s + (l.pricePerItem || 0) * (l.quantity || 1), 0);
        const itemRowTotal = baseTotal + laundryTotal; // exclude add-ons here; they will be separate rows
        const mainRow = `
        <tr>
          <td>${++rowIndex}</td>
          <td>
            <div><strong>${item.serviceName || item.serviceId?.name || 'Service'}</strong></div>
            <div style="color:#555">${item.packageName || 'Custom Package'}</div>
            ${Array.isArray(item.includedFeatures) && item.includedFeatures.length ? `<div style="margin-top:6px"><em>Included:</em><ul>${item.includedFeatures.map(f => `<li>${f}</li>`).join('')}</ul></div>` : ''}
            ${item.planDetails ? [
              ['Each Wash Includes', item.planDetails.washIncludes],
              ['Weekly Includes', item.planDetails.weeklyIncludes],
              ['Bi-Weekly Includes', item.planDetails.biWeeklyIncludes],
              ['Monthly Bonuses', item.planDetails.monthlyBonuses],
              ['Premium Extras', item.planDetails.platinumExtras],
            ].map(([label, arr]) => Array.isArray(arr) && arr.length ? `<div style=\"margin-top:4px\"><em>${label}:</em><ul>${arr.map(x => `<li>${x}</li>`).join('')}</ul></div>` : '').join('') : ''}
          </td>
          <td>${item.quantity}</td>
          <td>₹${item.price}</td>
          <td>₹${itemRowTotal}</td>
        </tr>`;
        const addOnRows = addOns.map(a => `
        <tr>
          <td></td>
          <td style="padding-left:18px">+ Add-on: ${a.name}</td>
          <td>${a.quantity || 1}</td>
          <td>₹${a.price}</td>
          <td>₹${(a.price || 0) * (a.quantity || 1)}</td>
        </tr>`).join('');
        return mainRow + addOnRows;
      });
      return [headerRow, ...rows];
  }).join('');
    const html = `
<!doctype html><html><head><meta charset="utf-8"/>
<title>Invoice ${order.orderNumber || order._id}</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;color:#111;padding:24px}
  .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
  .brand{display:flex;align-items:center;gap:10px}
  .brand img{height:40px}
  .muted{color:#666}
  table{width:100%;border-collapse:collapse;margin-top:12px}
  th,td{border:1px solid #e5e7eb;padding:8px;vertical-align:top}
  th{background:#f8fafc;text-align:left}
  .totals{margin-top:12px;float:right}
  .totals div{display:flex;justify-content:space-between;gap:24px}
  @media print{button{display:none}}
  ul{margin:4px 0 0 16px;}
</style></head><body>
  <div class="header">
    <div class="brand">
      <img src="${logoUrl}" alt="BFS Logo"/>
      <div>
        <div style="font-weight:700">Bubble Flash Services</div>
        <div class="muted">Order Invoice</div>
      </div>
    </div>
    <div style="text-align:right">
      <div><strong>Order:</strong> ${order.orderNumber || order._id}</div>
      <div class="muted">${dateFmt(order.createdAt)}</div>
    </div>
  </div>
  <div>
    <div><strong>Name:</strong> ${customerName}</div>
    <div><strong>Phone:</strong> ${customerPhone}</div>
    <div><strong>Address:</strong> ${order.serviceAddress?.fullAddress || ''}</div>
    ${order.scheduledDate ? `<div><strong>Scheduled:</strong> ${new Date(order.scheduledDate).toDateString()} ${order.scheduledTimeSlot ? '('+order.scheduledTimeSlot+')' : ''}</div>` : ''}
  </div>
  <table>
    <thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
    <tbody>${itemsRows}</tbody>
  </table>
  <div class="totals">
    <div><span>Subtotal</span><span>₹${order.subtotal ?? order.totalAmount}</span></div>
    ${order.discountAmount ? `<div><span>Discount${order.couponCode ? ' ('+order.couponCode+')' : ''}</span><span>-₹${order.discountAmount}</span></div>` : ''}
    <div style="font-weight:700;border-top:1px solid #e5e7eb;margin-top:8px;padding-top:8px"><span>Total</span><span>₹${order.totalAmount}</span></div>
  </div>
  <div style="clear:both;margin-top:48px" class="muted">Thank you for choosing Bubble Flash Services.</div>
  <button onclick="window.print()" style="margin-top:16px;padding:8px 12px;border:1px solid #ddd;border-radius:6px;background:#fff">Print / Save PDF</button>
</body></html>`;
    // Try opening in a new tab (desktop-friendly). Many mobile browsers block this.
    let opened = false;
    try {
      const w = window.open('', '_blank');
      if (w && w.document) {
        w.document.open();
        w.document.write(html);
        w.document.close();
        opened = true;
      }
    } catch (_) {
      // ignore and try next fallback
    }

    if (opened) return;

    // Fallback 1: Force a file download via Blob (works on most Android browsers)
    try {
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.orderNumber || order._id}.html`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
      opened = true;
    } catch (_) {
      // ignore and try next fallback
    }

    if (opened) return;

    // Fallback 2: Open inline in the same tab using a data URL (iOS Safari friendly)
    try {
      const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
      window.location.href = dataUrl;
    } catch (_) {
      // As a last resort, do nothing (user can retry)
    }
  };

  const getStatusColor = (orderStatus) => {
    switch ((orderStatus || '').toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openReview = (order) => {
    setReviewTarget(order);
    setReviewRating(order.rating || 5);
    setReviewText(order.review || '');
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!reviewTarget) return;
    try {
      setReviewSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${reviewTarget._id}/review`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, review: reviewText })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Update in list
        setOrders(prev => prev.map(o => o._id === reviewTarget._id ? result.data : o));
        if (selectedOrder && selectedOrder._id === reviewTarget._id) setSelectedOrder(result.data);
        setShowReviewModal(false);
      } else {
        console.error('Review failed:', result);
      }
    } catch (e) {
      console.error('Submit review error:', e);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {showReviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Rate your service</h4>
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setReviewRating(n)} className={"p-1 " + (reviewRating>=n? 'text-yellow-500' : 'text-gray-300')}>
                      <Star size={20} fill={reviewRating>=n? 'currentColor':'none'} />
                    </button>
                  ))}
                </div>
                <textarea className="w-full border rounded-lg p-2 text-sm" rows={4} placeholder="Share your feedback..." value={reviewText} onChange={e=>setReviewText(e.target.value)} />
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={()=>setShowReviewModal(false)} className="px-4 py-2 rounded-lg border">Close</button>
                  <button onClick={submitReview} disabled={reviewSubmitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">Submit</button>
                </div>
              </div>
            </div>
          )}
          {/* Cancel Confirm Modal (Detail View) */}
          {showCancelConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Cancel booking?</h4>
                <p className="text-gray-600 mb-4">Are you sure you want to cancel this booking?</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 rounded-lg border">No</button>
                  <button onClick={performCancel} disabled={acting} className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50">Yes, Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Success Toast (Detail View) */}
          {showCancelSuccess && (
            <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
              Booking cancelled successfully
            </div>
          )}
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft size={16} />
              Back to Orders
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
                <p className="text-gray-600">Order #{selectedOrder.orderNumber || selectedOrder._id}</p>
              </div>
              <img src="/logo.png" alt="BFS" className="h-10" />
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                      {(selectedOrder.orderStatus || 'pending').replace('_', ' ')}
                    </span>
                  </div>
                  {selectedOrder.orderStatus === 'cancelled' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <X size={16} />
                      <span>your order is cancalled by the the management</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-gray-800">₹{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="text-gray-800">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-800">{selectedOrder.paymentMethod || 'COD'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Address</h3>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-500 mt-1" />
                  <div className="text-gray-700">
                    {selectedOrder.serviceAddress ? (
                      <div>
                        <p>{selectedOrder.serviceAddress.fullAddress}</p>
                        {selectedOrder.serviceAddress.city && (
                          <p>{selectedOrder.serviceAddress.city}, {selectedOrder.serviceAddress.state} {selectedOrder.serviceAddress.pincode}</p>
                        )}
                        {selectedOrder.serviceAddress.landmark && (
                          <p className="text-sm text-gray-600">Landmark: {selectedOrder.serviceAddress.landmark}</p>
                        )}
                      </div>
                    ) : (
                      <p>Address not available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Services Ordered</h3>
              <div className="flex gap-2">
                {selectedOrder.orderStatus !== 'cancelled' && (
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Download Bill
                  </button>
                )}
                {selectedOrder.orderStatus === 'pending' && (
                  <button
          onClick={() => openCancelConfirm(selectedOrder._id)}
                    disabled={acting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Cancel Booking
                  </button>
                )}
                {(selectedOrder.orderStatus === 'completed' || selectedOrder.status === 'completed') && !selectedOrder.isReviewSubmitted && (
                  <button onClick={()=>openReview(selectedOrder)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Leave a Review
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {selectedOrder.items && selectedOrder.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.serviceName || item.serviceId?.name || 'Service'}</h4>
                      <p className="text-sm text-gray-600">{item.packageName || item.packageId?.name || 'Custom Package'}</p>
                      {/* Package details like Cart */}
                      <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" /> Package Includes
                        </div>
                        <div className="text-sm text-gray-700">Base Service: <span className="font-medium">₹{item.price}</span></div>
            {Array.isArray(item.includedFeatures) && item.includedFeatures.length > 0 && (
                          <div className="mt-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">{(item.type||'')==='monthly_plan' ? 'Plan Features:' : 'Included Features:'}</p>
                            <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                              {item.includedFeatures.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                          </div>
                        )}
                        {item.planDetails && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Array.isArray(item.planDetails.washIncludes) && item.planDetails.washIncludes.length > 0 && (
                              <div className="bg-white rounded p-3 border border-blue-200">
                                <p className="text-xs font-semibold text-gray-700 mb-1">Each Wash Includes</p>
                                <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                  {item.planDetails.washIncludes.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                              </div>
                            )}
                            {Array.isArray(item.planDetails.weeklyIncludes) && item.planDetails.weeklyIncludes.length > 0 && (
                              <div className="bg-white rounded p-3 border border-blue-200">
                                <p className="text-xs font-semibold text-gray-700 mb-1">Weekly Includes</p>
                                <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                  {item.planDetails.weeklyIncludes.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                              </div>
                            )}
                            {Array.isArray(item.planDetails.biWeeklyIncludes) && item.planDetails.biWeeklyIncludes.length > 0 && (
                              <div className="bg-white rounded p-3 border border-blue-200">
                                <p className="text-xs font-semibold text-gray-700 mb-1">Bi-Weekly Includes</p>
                                <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                  {item.planDetails.biWeeklyIncludes.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                              </div>
                            )}
                            {Array.isArray(item.planDetails.monthlyBonuses) && item.planDetails.monthlyBonuses.length > 0 && (
                              <div className="bg-white rounded p-3 border border-blue-200">
                                <p className="text-xs font-semibold text-gray-700 mb-1">Monthly Bonuses</p>
                                <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                  {item.planDetails.monthlyBonuses.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                              </div>
                            )}
                            {Array.isArray(item.planDetails.platinumExtras) && item.planDetails.platinumExtras.length > 0 && (
                              <div className="bg-white rounded p-3 border border-blue-200">
                                <p className="text-xs font-semibold text-gray-700 mb-1">Premium Extras</p>
                                <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                                  {item.planDetails.platinumExtras.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        {(item.addOns && item.addOns.length > 0) && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Add-ons:</p>
                            <div className="space-y-1">
                              {item.addOns.map((addon, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <span className="text-gray-600">+ {addon.name} {addon.quantity > 1 ? `× ${addon.quantity}` : ''}</span>
                                  <span className="text-green-600 font-medium">₹{addon.price * (addon.quantity || 1)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">₹{item.price}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Review Modal (List View) */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Rate your service</h4>
              <div className="flex items-center gap-2 mb-3">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReviewRating(n)} className={"p-1 " + (reviewRating>=n? 'text-yellow-500' : 'text-gray-300')}>
                    <Star size={20} fill={reviewRating>=n? 'currentColor':'none'} />
                  </button>
                ))}
              </div>
              <textarea className="w-full border rounded-lg p-2 text-sm" rows={4} placeholder="Share your feedback..." value={reviewText} onChange={e=>setReviewText(e.target.value)} />
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={()=>setShowReviewModal(false)} className="px-4 py-2 rounded-lg border">Close</button>
                <button onClick={submitReview} disabled={reviewSubmitting} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">Submit</button>
              </div>
            </div>
          </div>
        )}
        {/* Cancel Confirm Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Cancel booking?</h4>
              <p className="text-gray-600 mb-4">Are you sure you want to cancel this booking?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 rounded-lg border">No</button>
                <button onClick={performCancel} disabled={acting} className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50">Yes, Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Success Toast */}
        {showCancelSuccess && (
          <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
            Booking cancelled successfully
          </div>
        )}
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
            <p className="text-gray-600">Track your service requests and order history</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loadingOrders}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={loadingOrders ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loadingOrders && !error && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        )}

        {/* Orders List */}
        {!loadingOrders && !error && (
          orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <Package size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start by browsing our services!</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order.orderNumber || order._id}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {(order.orderStatus || 'pending').replace('_', ' ')}
                        </span>
                      </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-gray-600">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-gray-500" />
                        <span className="text-gray-600">₹{order.totalAmount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-gray-500" />
                        <span className="text-gray-600">
                          {order.items ? order.items.length : 0} item(s)
                        </span>
                      </div>
                    </div>

                    {/* Services Preview */}
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
            {order.items && order.items.slice(0, 3).map((item, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {item.serviceName || item.serviceId?.name || 'Service'}
                          </span>
                        ))}
                        {order.items && order.items.length > 3 && (
                          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    {(order.orderStatus === 'completed' || order.status === 'completed') && !order.isReviewSubmitted && (
                      <button onClick={()=>openReview(order)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Star size={16} />
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )
        )}
      </div>
    </div>
  );
}
