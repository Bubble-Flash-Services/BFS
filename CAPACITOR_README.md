# BFS Capacitor Mobile App - Quick Start Guide

Complete Capacitor setup for BubbleFlashServices mobile application with Android support, REST API, Socket.IO, and Play Store compliance.

## 📱 What's Included

This setup provides:
- ✅ **Capacitor Configuration** - Ready for Android deployment
- ✅ **REST API Client** - Axios-based with JWT authentication
- ✅ **Socket.IO Integration** - Real-time updates and notifications
- ✅ **Push Notifications** - Firebase Cloud Messaging support
- ✅ **Secure Storage** - Encrypted data storage on device
- ✅ **HTTPS Support** - All communications encrypted
- ✅ **Play Store Ready** - Compliant with Google Play policies

## 🚀 Quick Start

### 1. Install Dependencies

All necessary dependencies are already installed:
```bash
npm install
```

**Installed packages:**
- `@capacitor/core` - Capacitor core library
- `@capacitor/cli` - Capacitor CLI tools
- `@capacitor/android` - Android platform support
- `@capacitor/push-notifications` - Push notification plugin
- `@capacitor/preferences` - Secure storage plugin
- `socket.io-client` - Real-time communication

### 2. Build and Run

```bash
# Build React app and open Android Studio
npm run build:android

# Or step by step:
npm run build              # Build React app
npm run sync:android       # Sync to Android
npm run open:android       # Open Android Studio
```

### 3. Run on Device

In Android Studio:
1. Connect Android device or start emulator
2. Click **Run** button (green play icon)
3. App installs and launches automatically

## 📂 Project Structure

```
BFS/
├── android/                          # Native Android project (auto-generated)
├── capacitor.config.json             # Capacitor configuration
├── src/
│   ├── api/
│   │   ├── capacitorApiClient.js     # REST API with JWT auth
│   │   └── socketService.js          # Socket.IO real-time client
│   ├── services/
│   │   └── capacitorService.js       # Push notifications & secure storage
│   ├── components/
│   │   └── OrderTracking.jsx         # Example: API + Socket.IO usage
│   └── examples/
│       └── CapacitorIntegration.jsx  # Complete integration examples
├── docs/
│   ├── CAPACITOR_SETUP.md            # Detailed setup guide
│   └── ANDROID_BUILD_GUIDE.md        # Build & Play Store deployment
└── package.json                      # With Android build scripts
```

## ⚙️ Configuration

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
    "allowMixedContent": false
  },
  "plugins": {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
  }
}
```

**⚠️ Before production:**
1. Replace `https://my-bfs-backend.com` with your actual backend URL
2. Set `cleartext: false` for production
3. Add Firebase `google-services.json` to `android/app/`

## 💻 Usage Examples

### REST API Calls

```javascript
import { api } from './api/capacitorApiClient';

// Login
const response = await api.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get services
const services = await api.services.getAll();

// Create order
const order = await api.orders.create({
  items: [...],
  totalAmount: 1000
});
```

### Socket.IO Real-time Updates

```javascript
import socketService from './api/socketService';

// Connect
socketService.connect();

// Listen for events
socketService.on('order_status_update', (data) => {
  console.log('Order updated:', data);
  // Update UI
});

// Emit events
socketService.emit('subscribe_to_order', { orderId: '123' });

// Join room
socketService.joinRoom('order:123');
```

### Push Notifications

```javascript
import { NotificationService } from './services/capacitorService';

// Initialize (call on app start)
await NotificationService.initialize();

// Check status
const status = await NotificationService.getStatus();
console.log('Notifications enabled:', status.enabled);
```

### Secure Storage

```javascript
import { SecureStorageService } from './services/capacitorService';

// Save auth token
await SecureStorageService.saveAuthToken('jwt-token');

// Retrieve token
const token = await SecureStorageService.getAuthToken();

// Clear auth data
await SecureStorageService.clearAuthData();
```

## 🔧 Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run build:android` | Build React app, sync to Android, open Android Studio |
| `npm run sync:android` | Sync web assets to Android (after changes) |
| `npm run add:android` | Add Android platform (only once) |
| `npm run open:android` | Open project in Android Studio |
| `npm run build` | Build React production bundle |
| `npm run dev` | Run development server |

## 🏗️ Building for Play Store

### Prerequisites

1. **Android Studio** - Latest stable version
2. **Java JDK** - Version 11 or higher
3. **Firebase Project** - For push notifications
4. **Signing Key** - For app signing

### Generate Keystore

```bash
keytool -genkey -v -keystore bfs-release-key.jks \
  -alias bfsapp-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**⚠️ Important:** Save keystore file and passwords securely! If lost, you cannot update the app.

### Build AAB (Android App Bundle)

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Upload to Play Store

1. Go to [Google Play Console](https://play.google.com/console)
2. Create app or navigate to existing app
3. Go to **Production** > **Create new release**
4. Upload `app-release.aab`
5. Fill in release details
6. Submit for review

**📚 Detailed instructions:** See [docs/ANDROID_BUILD_GUIDE.md](./docs/ANDROID_BUILD_GUIDE.md)

## 🔒 Security Features

### HTTPS Enforcement
- All API calls use HTTPS
- Mixed content blocked
- Network security config enforced

### JWT Authentication
- Automatic token injection in headers
- Token expiration handling
- Auto-redirect on 401 errors

### Secure Storage
- Encrypted preferences on device
- Protected auth tokens
- Secure credential storage

### Play Store Compliance
- ✅ HTTPS for all network traffic
- ✅ JWT token authentication
- ✅ No cleartext traffic in production
- ✅ Proper permissions declared
- ✅ Privacy policy required
- ✅ Data encryption enabled

## 🔥 Firebase Setup (Push Notifications)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or select existing
3. Add Android app:
   - Package name: `com.bubbleflashservices.bfsapp`
   - Download `google-services.json`

### 2. Add to Android Project

```bash
# Place google-services.json in android/app/
cp ~/Downloads/google-services.json android/app/
```

### 3. Update Gradle (Already configured)

`android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-messaging'
}
```

### 4. Backend Integration

Send notifications from your backend:

```javascript
// Node.js example using Firebase Admin SDK
const admin = require('firebase-admin');

admin.messaging().send({
  token: userFcmToken,
  notification: {
    title: 'Order Update',
    body: 'Your order has been confirmed!'
  },
  data: {
    orderId: '123',
    type: 'order_update'
  }
});
```

## 📱 Testing

### Test on Physical Device

```bash
# Enable USB debugging on Android device
# Connect device via USB
# In Android Studio, click Run
```

### Test on Emulator

```bash
# Create AVD in Android Studio
# Tools > Device Manager > Create Device
# Select device and system image (API 29+)
# Click Run in Android Studio
```

### Test API Connection

```javascript
// Add to any component
import { api } from './api/capacitorApiClient';

const testAPI = async () => {
  try {
    const response = await api.services.getAll();
    console.log('API working:', response.data);
  } catch (error) {
    console.error('API error:', error);
  }
};
```

### Test Socket.IO

```javascript
import socketService from './api/socketService';

const testSocket = () => {
  socketService.connect();
  socketService.on('connect', () => {
    console.log('Socket connected!');
  });
};
```

## 🐛 Troubleshooting

### White Screen on Launch
```bash
# Rebuild and sync
npm run build
npm run sync:android
```

### API Calls Failing
- Verify backend URL in `capacitor.config.json`
- Check CORS settings on backend
- Ensure HTTPS certificate is valid

### Push Notifications Not Working
- Verify `google-services.json` exists in `android/app/`
- Check Firebase console for errors
- Ensure device has Play Services

### Build Errors in Android Studio
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew build
```

## 📚 Documentation

- **[Capacitor Setup Guide](./docs/CAPACITOR_SETUP.md)** - Comprehensive setup documentation
- **[Android Build Guide](./docs/ANDROID_BUILD_GUIDE.md)** - Play Store deployment guide
- **[Capacitor Docs](https://capacitorjs.com/docs)** - Official Capacitor documentation
- **[Firebase Setup](https://firebase.google.com/docs/android/setup)** - Firebase integration

## 🎯 Next Steps

1. **Update Configuration**
   - [ ] Replace backend URL in `capacitor.config.json`
   - [ ] Add `google-services.json` for push notifications
   - [ ] Configure signing keystore

2. **Customize App**
   - [ ] Update app name and icon
   - [ ] Add app-specific features
   - [ ] Implement deep linking if needed

3. **Testing**
   - [ ] Test on multiple devices
   - [ ] Test all API endpoints
   - [ ] Test push notifications
   - [ ] Test offline behavior

4. **Play Store**
   - [ ] Create Play Console account
   - [ ] Prepare store listing assets
   - [ ] Complete content rating
   - [ ] Submit for review

## 💡 Tips

- **Development**: Use `npm run dev` for fast iteration
- **Testing**: Test on real device, not just emulator
- **Debugging**: Use Chrome DevTools with `chrome://inspect`
- **Updates**: Increment `versionCode` in `build.gradle` for each release
- **Backup**: Keep keystore file in multiple secure locations

## 🆘 Support

If you encounter issues:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review [documentation](./docs/)
3. Check Android Studio Logcat for errors
4. Verify backend is running and accessible

## 📝 License

This project is part of BubbleFlashServices (BFS) application.

---

**Created**: January 2026  
**Capacitor Version**: 6.x  
**Target Android API**: 34 (Android 14)  
**Maintained by**: BFS Development Team
