/**
 * Example: Integrating Capacitor Features in Main App
 * 
 * This file shows how to initialize and use all Capacitor features
 * in your React application's entry point.
 */

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import Capacitor services
import { initializeCapacitorFeatures } from './services/capacitorService';
import socketService from './api/socketService';

/**
 * Initialize all Capacitor features
 * Call this once when app starts
 */
const initializeApp = async () => {
  try {
    console.log('Initializing BFS App...');
    
    // 1. Initialize Capacitor native features (Push Notifications, Secure Storage)
    await initializeCapacitorFeatures();
    
    // 2. Connect to Socket.IO for real-time updates (if user is logged in)
    const token = localStorage.getItem('token');
    if (token) {
      console.log('User authenticated, connecting to real-time updates...');
      socketService.connect();
    }
    
    console.log('BFS App initialized successfully');
  } catch (error) {
    console.error('Error initializing app:', error);
  }
};

/**
 * Root component with initialization
 */
function Root() {
  useEffect(() => {
    // Initialize app on mount
    initializeApp();
    
    // Cleanup on unmount
    return () => {
      console.log('App unmounting, cleaning up...');
      // Socket will be cleaned up by the service
    };
  }, []);

  return <App />;
}

// Render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

/**
 * USAGE EXAMPLES
 * ===============
 */

// Example 1: Using API Client in a Component
// -------------------------------------------
/*
import { api } from './api/capacitorApiClient';

function MyComponent() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.services.getAll();
        setServices(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div>
      {services.map(service => (
        <div key={service.id}>{service.name}</div>
      ))}
    </div>
  );
}
*/

// Example 2: Using Socket.IO for Real-time Updates
// --------------------------------------------------
/*
import socketService from './api/socketService';

function OrderStatusComponent({ orderId }) {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    // Join order-specific room
    socketService.joinRoom(`order:${orderId}`);

    // Listen for status updates
    const handleStatusUpdate = (data) => {
      if (data.orderId === orderId) {
        setStatus(data.status);
      }
    };

    socketService.on('order_status_update', handleStatusUpdate);

    // Cleanup
    return () => {
      socketService.off('order_status_update', handleStatusUpdate);
      socketService.leaveRoom(`order:${orderId}`);
    };
  }, [orderId]);

  return <div>Order Status: {status}</div>;
}
*/

// Example 3: Using Push Notifications
// ------------------------------------
/*
import { NotificationService } from './services/capacitorService';

function NotificationSettings() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await NotificationService.getStatus();
      setEnabled(status.enabled);
    };
    checkStatus();
  }, []);

  const enableNotifications = async () => {
    await NotificationService.initialize();
    const status = await NotificationService.getStatus();
    setEnabled(status.enabled);
  };

  return (
    <div>
      <p>Notifications: {enabled ? 'Enabled' : 'Disabled'}</p>
      {!enabled && (
        <button onClick={enableNotifications}>
          Enable Notifications
        </button>
      )}
    </div>
  );
}
*/

// Example 4: Using Secure Storage
// --------------------------------
/*
import { SecureStorageService } from './services/capacitorService';

function LoginComponent() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      const response = await api.auth.login({ email, password });
      
      // Save token
      localStorage.setItem('token', response.data.token);
      
      // Save to secure storage if "remember me"
      if (rememberMe) {
        await SecureStorageService.saveAuthToken(response.data.token);
        await SecureStorageService.saveUserCredentials({ email });
      }
      
      // Navigate to home
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      handleLogin(formData.get('email'), formData.get('password'));
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
*/

// Example 5: Handling App Lifecycle
// ----------------------------------
/*
import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import socketService from './api/socketService';

function AppLifecycle() {
  useEffect(() => {
    // Handle app state changes (native only)
    const stateListener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Active:', isActive);
      
      if (isActive) {
        // App came to foreground - reconnect socket if needed
        if (!socketService.isConnected()) {
          socketService.connect();
        }
      } else {
        // App went to background - optionally disconnect
        // socketService.disconnect();
      }
    });

    // Handle back button (Android)
    const backListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        // At root - show exit confirmation
        if (confirm('Exit app?')) {
          CapacitorApp.exitApp();
        }
      } else {
        // Navigate back
        window.history.back();
      }
    });

    return () => {
      stateListener.remove();
      backListener.remove();
    };
  }, []);

  return null;
}
*/

// Example 6: Combined Usage - Complete Feature Demo
// --------------------------------------------------
/*
import React, { useState, useEffect } from 'react';
import { api } from './api/capacitorApiClient';
import socketService from './api/socketService';
import { 
  NotificationService, 
  SecureStorageService 
} from './services/capacitorService';

function CompleteExample() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [realtimeStatus, setRealtimeStatus] = useState('disconnected');
  const [notifStatus, setNotifStatus] = useState(false);

  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    // 1. Check for saved credentials
    const savedToken = await SecureStorageService.getAuthToken();
    if (savedToken) {
      localStorage.setItem('token', savedToken);
    }

    // 2. Get user profile
    try {
      const profile = await api.user.getProfile();
      setUser(profile.data);
    } catch (error) {
      console.error('Not logged in');
      return;
    }

    // 3. Connect Socket.IO
    socketService.connect();
    socketService.on('connect', () => {
      setRealtimeStatus('connected');
    });
    socketService.on('disconnect', () => {
      setRealtimeStatus('disconnected');
    });

    // 4. Setup real-time order updates
    socketService.on('order_status_update', (data) => {
      setOrders(prev => 
        prev.map(order => 
          order._id === data.orderId 
            ? { ...order, status: data.status }
            : order
        )
      );
    });

    // 5. Fetch orders
    const ordersResponse = await api.orders.getAll();
    setOrders(ordersResponse.data.orders || []);

    // 6. Check notification status
    const notifStat = await NotificationService.getStatus();
    setNotifStatus(notifStat.enabled);
  };

  const handleLogout = async () => {
    // Clear auth data
    await SecureStorageService.clearAuthData();
    localStorage.clear();
    
    // Disconnect socket
    socketService.disconnect();
    
    // Redirect
    window.location.href = '/';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">BFS App</h1>
      
      {user && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <p>Welcome, {user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <button 
            onClick={handleLogout}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      )}

      <div className="mb-4 p-4 bg-blue-50 rounded">
        <p>Real-time Status: 
          <span className={realtimeStatus === 'connected' ? 'text-green-600' : 'text-red-600'}>
            {' '}{realtimeStatus}
          </span>
        </p>
        <p>Notifications: 
          <span className={notifStatus ? 'text-green-600' : 'text-gray-600'}>
            {' '}{notifStatus ? 'Enabled' : 'Disabled'}
          </span>
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Your Orders</h2>
        {orders.map(order => (
          <div key={order._id} className="mb-3 p-3 border rounded">
            <p className="font-medium">Order #{order._id.slice(-6)}</p>
            <p className="text-sm">Status: {order.status}</p>
            <p className="text-sm">Total: ₹{order.totalAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompleteExample;
*/
