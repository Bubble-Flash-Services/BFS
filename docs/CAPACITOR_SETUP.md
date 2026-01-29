# Capacitor Setup Guide - BFS Mobile App

Complete guide for setting up and using Capacitor in the BubbleFlashServices (BFS) mobile application.

## Overview

This project uses Capacitor to convert the React web app into a native Android application with access to native device features like push notifications and secure storage.

## Configuration

### Capacitor Config (`capacitor.config.json`)

```json
{
  "appId": "com.bubbleflashservices.bfsapp",
  "appName": "BFSApp",
  "webDir": "dist",
  "server": {
    "url": "https://my-bfs-backend.com",
    "cleartext": true,
    "androidScheme": "https"
  },
  "android": {
    "buildOptions": {
      "keystorePath": "path/to/your/keystore.jks",
      "keystoreAlias": "bfsapp-key"
    },
    "allowMixedContent": false
  },
  "plugins": {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    },
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#ffffff",
      "showSpinner": true,
      "androidSpinnerStyle": "large",
      "spinnerColor": "#3880ff"
    }
  }
}
```

### Key Configuration Options

- **appId**: Unique identifier for your app (reverse domain notation)
- **appName**: Display name of the app
- **webDir**: Directory containing built web assets (Vite outputs to `dist`)
- **server.url**: Backend API URL (production URL for the app)
- **server.androidScheme**: Use HTTPS for security (required by Play Store)
- **allowMixedContent**: false ensures all content is loaded over HTTPS

## Installation

### Dependencies Installed

```json
{
  "@capacitor/core": "^6.x",
  "@capacitor/cli": "^6.x",
  "@capacitor/android": "^6.x",
  "@capacitor/push-notifications": "^8.x",
  "@capacitor/preferences": "^8.x",
  "socket.io-client": "^4.x"
}
```

### Initial Setup Commands

```bash
# Install dependencies
npm install

# Initialize Capacitor (already done)
npx cap init "BFSApp" "com.bubbleflashservices.bfsapp" --web-dir=dist

# Add Android platform
npm run add:android
```

## NPM Scripts

### Available Commands

```bash
# Build React app, sync to Android, and open Android Studio
npm run build:android

# Sync web assets to Android without rebuilding
npm run sync:android

# Add Android platform (only needed once)
npm run add:android

# Open project in Android Studio
npm run open:android
```

## Project Structure

```
BFS/
├── android/                      # Native Android project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/          # Web assets (auto-copied)
│   │   │   ├── java/            # Native Java/Kotlin code
│   │   │   └── res/             # Android resources
│   │   ├── build.gradle         # App-level Gradle config
│   │   └── google-services.json # Firebase config (add this)
│   └── build.gradle             # Project-level Gradle config
├── capacitor.config.json        # Capacitor configuration
├── dist/                        # Built web app (Vite output)
├── src/                         # React source code
│   ├── api/
│   │   ├── capacitorApiClient.js    # API client with JWT
│   │   └── socketService.js         # Socket.IO client
│   ├── components/
│   │   └── OrderTracking.jsx        # Example component
│   └── services/
│       └── capacitorService.js      # Native features
└── package.json
```

## Features Implementation

### 1. REST API with JWT Authentication

**File**: `src/api/capacitorApiClient.js`

```javascript
import { api } from './api/capacitorApiClient';

// Example: Login
const response = await api.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Example: Get user orders
const orders = await api.orders.getAll();

// Example: Create order
const newOrder = await api.orders.create(orderData);
```

**Features**:
- Automatic JWT token handling in headers
- Token expiration detection (401 errors)
- Automatic redirect to login on auth failure
- Works on both web and native platforms
- HTTPS only for security

### 2. Socket.IO for Real-time Updates

**File**: `src/api/socketService.js`

```javascript
import socketService from './api/socketService';

// Connect to Socket.IO server
socketService.connect();

// Listen for events
socketService.on('order_status_update', (data) => {
  console.log('Order updated:', data);
});

// Emit events
socketService.emit('subscribe_to_order', { orderId: '123' });

// Join rooms
socketService.joinRoom('order:123');

// Disconnect
socketService.disconnect();
```

**Features**:
- Automatic reconnection
- JWT authentication via auth token
- WebSocket with polling fallback
- Room-based messaging
- Event listener management

### 3. Push Notifications

**File**: `src/services/capacitorService.js`

```javascript
import { NotificationService } from './services/capacitorService';

// Initialize on app startup
await NotificationService.initialize();

// Check status
const status = await NotificationService.getStatus();
console.log('Notifications enabled:', status.enabled);
```

**Setup Requirements**:
1. Add `google-services.json` to `android/app/`
2. Configure Firebase Cloud Messaging
3. Send FCM tokens to backend
4. Backend sends notifications via FCM API

**Notification Types**:
- Order status updates
- Booking confirmations
- Service availability changes
- Chat messages
- Promotional notifications

### 4. Secure Storage

**File**: `src/services/capacitorService.js`

```javascript
import { SecureStorageService } from './services/capacitorService';

// Save auth token
await SecureStorageService.saveAuthToken('jwt-token-here');

// Retrieve auth token
const token = await SecureStorageService.getAuthToken();

// Save user settings
await SecureStorageService.saveUserSettings({
  theme: 'dark',
  notifications: true
});

// Clear all auth data
await SecureStorageService.clearAuthData();
```

**Features**:
- Encrypted storage on device
- Persists across app restarts
- Works on web (localStorage) and native (secure preferences)
- Automatic JSON serialization

## Development Workflow

### 1. Develop React App

```bash
# Run development server
npm run dev

# Make changes to React code
# Test in browser at http://localhost:5173
```

### 2. Build for Production

```bash
# Build optimized production bundle
npm run build

# Output: dist/ directory
```

### 3. Sync to Android

```bash
# Copy web assets to Android project
npm run sync:android
```

### 4. Open in Android Studio

```bash
# Open Android Studio
npm run open:android

# Or all in one command:
npm run build:android
```

### 5. Test on Device/Emulator

In Android Studio:
1. Connect device or start emulator
2. Click **Run** (green play button)
3. App installs and launches

## Testing

### Test API Connectivity

Create a test component:

```javascript
import { api } from './api/capacitorApiClient';

function TestAPI() {
  const testConnection = async () => {
    try {
      const response = await api.services.getAll();
      console.log('API working:', response.data);
    } catch (error) {
      console.error('API error:', error);
    }
  };

  return (
    <button onClick={testConnection}>
      Test API Connection
    </button>
  );
}
```

### Test Socket.IO

```javascript
import socketService from './api/socketService';

function TestSocket() {
  const testSocket = () => {
    socketService.connect();
    
    socketService.on('connect', () => {
      console.log('Socket connected!');
    });
  };

  return (
    <button onClick={testSocket}>
      Test Socket Connection
    </button>
  );
}
```

### Test Push Notifications

```javascript
import { NotificationService } from './services/capacitorService';

function TestNotifications() {
  const testNotif = async () => {
    await NotificationService.initialize();
    const status = await NotificationService.getStatus();
    alert(`Notifications: ${status.enabled ? 'Enabled' : 'Disabled'}`);
  };

  return (
    <button onClick={testNotif}>
      Test Notifications
    </button>
  );
}
```

## Environment Variables

Create `.env` file:

```bash
# API Configuration
VITE_API_URL=https://my-bfs-backend.com
VITE_SOCKET_URL=https://my-bfs-backend.com

# Firebase (optional - also in google-services.json)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
```

**Note**: Variables must be prefixed with `VITE_` to be accessible in Vite.

## Troubleshooting

### Issue: White screen on Android

**Solution**:
```bash
# Ensure build was successful
npm run build

# Check dist folder exists and has files
ls -la dist/

# Re-sync to Android
npm run sync:android
```

### Issue: API calls failing

**Possible causes**:
1. HTTPS certificate issues
2. CORS not configured on backend
3. Wrong API URL in config

**Solution**:
```javascript
// Check API URL
console.log(import.meta.env.VITE_API_URL);

// Test with fetch
fetch('https://my-bfs-backend.com/api/services')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));
```

### Issue: Socket.IO not connecting

**Solution**:
1. Verify backend has Socket.IO configured
2. Check CORS settings on Socket.IO server
3. Try polling transport only:
```javascript
socketService.connect({ transports: ['polling'] });
```

### Issue: Push notifications not working

**Solutions**:
1. Verify `google-services.json` is in `android/app/`
2. Check Firebase project has Android app added
3. Ensure package name matches: `com.bubbleflashservices.bfsapp`
4. Test FCM from Firebase Console

### Issue: Build fails in Android Studio

**Common fixes**:
```bash
# Clear Gradle cache
cd android
./gradlew clean

# Sync Capacitor again
cd ..
npm run sync:android

# Update Gradle dependencies
cd android
./gradlew build --refresh-dependencies
```

## Security Best Practices

### 1. HTTPS Only
- All API calls must use HTTPS
- Set `allowMixedContent: false` in config
- Configure network security in Android

### 2. JWT Token Security
- Store tokens in secure storage
- Implement token refresh logic
- Clear tokens on logout

### 3. API Key Protection
- Never commit API keys to git
- Use environment variables
- Rotate keys regularly

### 4. Input Validation
- Validate all user input
- Sanitize data before API calls
- Use TypeScript for type safety

## Play Store Compliance

### Required Features
- [x] HTTPS for all network traffic
- [x] JWT authentication
- [x] Secure data storage
- [x] Push notifications (FCM)
- [x] Proper error handling
- [x] Privacy policy
- [x] Data encryption

### Permissions
The app requests:
- **Internet**: For API calls
- **Push Notifications**: For order updates
- **Storage**: For preferences (secure)

All permissions are justified and documented in Play Store listing.

## Additional Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Build Guide](./ANDROID_BUILD_GUIDE.md)
- [Firebase Setup](https://firebase.google.com/docs/android/setup)
- [Socket.IO Docs](https://socket.io/docs/v4/)

## Support

For technical issues:
1. Check Capacitor/Android Studio logs
2. Verify configuration files
3. Test on multiple devices
4. Contact BFS development team

---

**Last Updated**: January 2026
**Capacitor Version**: 6.x
**Target Android**: API 34 (Android 14)
