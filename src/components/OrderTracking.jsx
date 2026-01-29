/**
 * Example React Component: Real-time Order Tracking
 * Demonstrates API calls and Socket.IO integration for Capacitor app
 */
import React, { useState, useEffect } from 'react';
import { api } from '../api/capacitorApiClient';
import socketService, { setupBFSSocketHandlers } from '../api/socketService';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);

  // Initialize Socket.IO connection on component mount
  useEffect(() => {
    // Connect to Socket.IO server
    socketService.connect();
    
    // Setup BFS-specific event handlers
    setupBFSSocketHandlers();

    // Listen for real-time order updates
    const handleOrderUpdate = (data) => {
      console.log('Real-time order update received:', data);
      
      // Update orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.orderId 
            ? { ...order, status: data.status, updatedAt: data.timestamp }
            : order
        )
      );

      // Add to updates feed
      setRealtimeUpdates(prev => [
        {
          id: Date.now(),
          message: `Order ${data.orderId} status changed to ${data.status}`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 9), // Keep last 10 updates
      ]);
    };

    socketService.on('order_status_update', handleOrderUpdate);

    // Cleanup on unmount
    return () => {
      socketService.off('order_status_update', handleOrderUpdate);
      // Don't disconnect here if socket is used globally
      // socketService.disconnect();
    };
  }, []);

  // Fetch orders using REST API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.orders.getAll({ limit: 20 });
        setOrders(response.data.orders || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to cancel an order
  const handleCancelOrder = async (orderId) => {
    try {
      await api.orders.cancel(orderId);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );

      alert('Order cancelled successfully');
    } catch (err) {
      alert('Failed to cancel order: ' + err.message);
    }
  };

  // Function to join order-specific room for updates
  const subscribeToOrder = (orderId) => {
    socketService.joinRoom(`order:${orderId}`);
    console.log(`Subscribed to updates for order: ${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>

      {/* Connection Status */}
      <div className="mb-4 p-3 rounded-lg bg-gray-100">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${socketService.isConnected() ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium">
            {socketService.isConnected() ? 'Connected to real-time updates' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Real-time Updates Feed */}
      {realtimeUpdates.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Recent Updates</h2>
          <div className="space-y-2">
            {realtimeUpdates.map(update => (
              <div key={update.id} className="flex justify-between text-sm">
                <span>{update.message}</span>
                <span className="text-gray-500">{update.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <p className="text-gray-700">
                  <span className="font-medium">Total:</span> ₹{order.totalAmount}
                </p>
                {order.items?.length > 0 && (
                  <p className="text-gray-700">
                    <span className="font-medium">Items:</span> {order.items.length}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => subscribeToOrder(order._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Track Live
                </button>
                
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
