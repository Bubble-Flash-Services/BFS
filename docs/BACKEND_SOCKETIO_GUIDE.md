# Backend Socket.IO Integration Guide for BFS

This guide shows how to set up Socket.IO on the Express backend to work with the Capacitor mobile app.

## Server Setup

### Install Dependencies

```bash
cd server
npm install socket.io cors
```

### Basic Server Configuration

**File: `server/app.js`**

```javascript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const httpServer = createServer(app);

// Configure CORS for both Express and Socket.IO
const corsOptions = {
  origin: [
    'http://localhost:5173',           // Vite dev server
    'https://my-bfs-backend.com',      // Production web
    'capacitor://localhost',            // Capacitor iOS
    'http://localhost'                  // Capacitor Android
  ],
  credentials: true
};

app.use(cors(corsOptions));

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ['websocket', 'polling']
});

// JWT Authentication Middleware for Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userEmail = decoded.email;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id, 'User:', socket.userEmail);

  // Join user-specific room
  socket.join(`user:${socket.userId}`);

  // Handle room joins
  socket.on('join_room', (data) => {
    const { room } = data;
    socket.join(room);
    console.log(`User ${socket.userId} joined room: ${room}`);
    socket.emit('room_joined', { room });
  });

  // Handle room leaves
  socket.on('leave_room', (data) => {
    const { room } = data;
    socket.leave(room);
    console.log(`User ${socket.userId} left room: ${room}`);
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });

  // Send welcome message
  socket.emit('connected', {
    message: 'Connected to BFS real-time server',
    userId: socket.userId
  });
});

// Make io available to routes
app.set('io', io);

// Your existing Express routes...

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Socket.IO server ready');
});
```

## Event Handlers

### Order Status Updates

**File: `server/controllers/orderController.js`**

```javascript
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Update order in database
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get Socket.IO instance
    const io = req.app.get('io');

    // Emit to order-specific room
    io.to(`order:${orderId}`).emit('order_status_update', {
      orderId: order._id,
      status: order.status,
      timestamp: new Date().toISOString()
    });

    // Also emit to user's room
    io.to(`user:${order.userId}`).emit('order_status_update', {
      orderId: order._id,
      status: order.status,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
```

### Booking Confirmations

**File: `server/controllers/bookingController.js`**

```javascript
export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed', confirmedAt: new Date() },
      { new: true }
    );

    // Emit to Socket.IO
    const io = req.app.get('io');
    
    io.to(`user:${booking.userId}`).emit('booking_confirmed', {
      bookingId: booking._id,
      serviceName: booking.serviceName,
      scheduledDate: booking.scheduledDate,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
```

### Real-time Notifications

**File: `server/services/notificationService.js`**

```javascript
export const sendNotification = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification', {
    id: notification._id,
    title: notification.title,
    body: notification.body,
    type: notification.type,
    data: notification.data,
    timestamp: new Date().toISOString()
  });
};

// Example usage in any controller
import { sendNotification } from '../services/notificationService.js';

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    
    // Send real-time notification
    const io = req.app.get('io');
    sendNotification(io, req.user.id, {
      title: 'Order Created',
      body: `Your order #${order._id.toString().slice(-6)} has been created!`,
      type: 'order_created',
      data: { orderId: order._id }
    });
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Service Availability Updates

**File: `server/controllers/serviceController.js`**

```javascript
export const updateServiceAvailability = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { available, availableSlots } = req.body;

    const service = await Service.findByIdAndUpdate(
      serviceId,
      { available, availableSlots },
      { new: true }
    );

    // Broadcast to all connected clients
    const io = req.app.get('io');
    io.emit('service_availability', {
      serviceId: service._id,
      serviceName: service.name,
      available: service.available,
      availableSlots: service.availableSlots,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Chat/Support Messages

**File: `server/controllers/chatController.js`**

```javascript
export const setupChatHandlers = (io) => {
  io.on('connection', (socket) => {
    // Join chat room for support
    socket.on('join_support_chat', (data) => {
      const chatRoom = `support:${socket.userId}`;
      socket.join(chatRoom);
      
      // Load chat history
      ChatMessage.find({ userId: socket.userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .then(messages => {
          socket.emit('chat_history', messages);
        });
    });

    // Handle incoming messages
    socket.on('send_message', async (data) => {
      const { message } = data;
      
      // Save to database
      const chatMessage = await ChatMessage.create({
        userId: socket.userId,
        message,
        sender: 'user',
        timestamp: new Date()
      });

      // Emit to user
      socket.emit('chat_message', {
        id: chatMessage._id,
        message: chatMessage.message,
        sender: 'user',
        timestamp: chatMessage.timestamp
      });

      // Notify admin/support room
      io.to('support_team').emit('new_user_message', {
        userId: socket.userId,
        userEmail: socket.userEmail,
        message: chatMessage.message,
        timestamp: chatMessage.timestamp
      });
    });
  });
};

// Call in app.js after io initialization
setupChatHandlers(io);
```

## Push Notifications Integration

### Send Push via FCM when Socket.IO fails

**File: `server/services/pushNotificationService.js`**

```javascript
import admin from 'firebase-admin';

// Initialize Firebase Admin (add to app.js)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

export const sendPushNotification = async (userId, notification) => {
  try {
    // Get user's FCM token from database
    const user = await User.findById(userId);
    
    if (!user || !user.fcmToken) {
      console.log('No FCM token for user:', userId);
      return;
    }

    // Send FCM notification
    const message = {
      token: user.fcmToken,
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: {
        ...notification.data,
        type: notification.type
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'bfs_notifications'
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log('FCM notification sent:', response);
    
    return response;
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

// Use alongside Socket.IO
export const sendRealtimeOrPush = async (io, userId, notification) => {
  // Try Socket.IO first
  const socketRoom = `user:${userId}`;
  const sockets = await io.in(socketRoom).fetchSockets();
  
  if (sockets.length > 0) {
    // User is online, send via Socket.IO
    io.to(socketRoom).emit('notification', notification);
    console.log('Sent via Socket.IO to user:', userId);
  } else {
    // User is offline, send push notification
    await sendPushNotification(userId, notification);
    console.log('Sent push notification to user:', userId);
  }
};
```

## Room-based Broadcasting

### Broadcast to Multiple Users

```javascript
// Emit to specific order watchers
io.to(`order:${orderId}`).emit('order_update', data);

// Emit to specific user
io.to(`user:${userId}`).emit('notification', data);

// Emit to all connected clients
io.emit('system_announcement', data);

// Emit to all except sender
socket.broadcast.emit('new_order', data);

// Emit to multiple rooms
io.to('room1').to('room2').emit('event', data);
```

## Environment Variables

**File: `server/.env`**

```env
# Server
PORT=5000
JWT_SECRET=your-jwt-secret-key

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bfs

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://my-bfs-backend.com
```

## Testing

### Test with Postman or curl

```bash
# Test Socket.IO connection
npm install -g socket.io-client-tool

# Connect
socket-io-client-tool http://localhost:5000 --auth token=YOUR_JWT_TOKEN
```

### Test from Frontend

```javascript
import socketService from './api/socketService';

// Connect
socketService.connect();

// Test event
socketService.on('connect', () => {
  console.log('✅ Connected to backend');
  
  // Join a room
  socketService.joinRoom('order:123');
  
  // Listen for events
  socketService.on('order_status_update', (data) => {
    console.log('Order update received:', data);
  });
});
```

## Production Considerations

### 1. Use Redis Adapter for Multiple Servers

```bash
npm install @socket.io/redis-adapter redis
```

```javascript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

### 2. Rate Limiting

```javascript
import { RateLimiter } from 'socket.io-rate-limiter';

io.use(new RateLimiter({
  maxRequests: 100,
  perTime: 60000 // 100 requests per minute
}));
```

### 3. Monitoring

```javascript
io.on('connection', (socket) => {
  // Log connections
  console.log({
    timestamp: new Date(),
    event: 'connection',
    socketId: socket.id,
    userId: socket.userId,
    transport: socket.conn.transport.name
  });
});

// Monitor Socket.IO metrics
setInterval(() => {
  console.log('Connected clients:', io.engine.clientsCount);
  console.log('Rooms:', io.sockets.adapter.rooms);
}, 60000);
```

## Security Best Practices

1. **Always validate JWT tokens**
2. **Use HTTPS in production**
3. **Implement rate limiting**
4. **Validate all incoming events**
5. **Sanitize data before emitting**
6. **Use rooms for private data**
7. **Log all connections and events**
8. **Implement reconnection limits**

## Complete Example

See `server/socket.js` for a complete implementation:

```javascript
// server/socket.js
import jwt from 'jsonwebtoken';

export const setupSocketIO = (io) => {
  // Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No token'));
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.userId);
    
    // Join user room
    socket.join(`user:${socket.userId}`);
    
    // Event handlers
    socket.on('join_room', (data) => {
      socket.join(data.room);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.userId);
    });
  });
};
```

---

**Last Updated**: January 2026  
**Socket.IO Version**: 4.x  
**Compatible with**: Capacitor 6.x mobile app
