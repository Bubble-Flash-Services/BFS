/**
 * Socket.IO Client for Real-time Updates in BFS App
 * Supports WebSocket connections on both web and native platforms
 * Includes automatic reconnection and JWT authentication
 */
import { io } from 'socket.io-client';

// Socket.IO server URL - should match your backend
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://my-bfs-backend.com';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  /**
   * Initialize and connect to Socket.IO server
   * @param {Object} options - Connection options
   */
  connect(options = {}) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const token = localStorage.getItem('token');
    
    // Socket.IO connection options
    const socketOptions = {
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000,
      auth: {
        token: token, // Send JWT token for authentication
      },
      ...options,
    };

    console.log('Connecting to Socket.IO server:', SOCKET_URL);
    this.socket = io(SOCKET_URL, socketOptions);

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('Socket.IO connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error.message);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket.IO reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket.IO reconnection failed');
    });

    return this.socket;
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect() {
    if (this.socket) {
      console.log('Disconnecting Socket.IO');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Emit an event to the server
   * @param {string} event - Event name
   * @param {*} data - Data to send
   * @param {Function} callback - Optional callback
   */
  emit(event, data, callback) {
    if (!this.socket?.connected) {
      console.error('Socket not connected. Cannot emit:', event);
      return false;
    }

    console.log('Emitting event:', event, data);
    
    if (callback) {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
    
    return true;
  }

  /**
   * Listen for an event from the server
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.socket) {
      console.error('Socket not initialized. Call connect() first.');
      return;
    }

    console.log('Registering listener for:', event);
    this.socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this.socket) {
      return;
    }

    if (callback) {
      this.socket.off(event, callback);
      
      // Remove from listeners map
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    } else {
      // Remove all listeners for this event
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }

  /**
   * Listen for an event once
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  once(event, callback) {
    if (!this.socket) {
      console.error('Socket not initialized. Call connect() first.');
      return;
    }

    this.socket.once(event, callback);
  }

  /**
   * Check if socket is connected
   */
  isConnected() {
    return this.connected && this.socket?.connected;
  }

  /**
   * Get socket ID
   */
  getSocketId() {
    return this.socket?.id;
  }

  /**
   * Join a room
   * @param {string} room - Room name
   */
  joinRoom(room) {
    this.emit('join_room', { room });
  }

  /**
   * Leave a room
   * @param {string} room - Room name
   */
  leaveRoom(room) {
    this.emit('leave_room', { room });
  }
}

// Export singleton instance
const socketService = new SocketService();

// Example event handlers for BFS app
export const setupBFSSocketHandlers = () => {
  // Order updates
  socketService.on('order_status_update', (data) => {
    console.log('Order status updated:', data);
    // Dispatch to state management or trigger UI update
  });

  // Booking updates
  socketService.on('booking_confirmed', (data) => {
    console.log('Booking confirmed:', data);
    // Show notification to user
  });

  // Real-time notifications
  socketService.on('notification', (data) => {
    console.log('New notification:', data);
    // Display push notification or in-app alert
  });

  // Service availability updates
  socketService.on('service_availability', (data) => {
    console.log('Service availability changed:', data);
    // Update service list in real-time
  });

  // Chat messages (for customer support)
  socketService.on('chat_message', (data) => {
    console.log('New chat message:', data);
    // Update chat UI
  });
};

export default socketService;
