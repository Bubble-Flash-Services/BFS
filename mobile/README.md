# 📱 Bubble Flash Services – Mobile App

> React Native (Expo) mobile app for the Bubble Flash Services platform.  
> Doorstep cleaning services for Bengaluru – car wash, bike detailing, helmet care, and more.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Local Development Setup](#local-development-setup)
4. [Google Sign-In Configuration](#google-sign-in-configuration)
5. [Environment Variables](#environment-variables)
6. [Running on Devices](#running-on-devices)
7. [Building for Production](#building-for-production)
8. [Google Play Store Deployment](#google-play-store-deployment)
9. [App Architecture](#app-architecture)
10. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18.x | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9.x | Included with Node.js |
| Expo CLI | ≥ 5.x | `npm install -g expo-cli` |
| EAS CLI | Latest | `npm install -g eas-cli` |
| Android Studio | Latest | For Android emulator |
| Expo Go app | Latest | Install on your physical device |

> **Note:** You do **not** need Xcode (iOS builds use EAS cloud). For Android local builds, Android Studio is required.

---

## 2. Project Structure

```
mobile/
├── App.js                          # Root component
├── app.json                        # Expo & build configuration
├── eas.json                        # EAS Build profiles
├── babel.config.js                 # Babel transpiler config
├── package.json                    # Dependencies
├── .env.example                    # Environment template
└── src/
    ├── api/
    │   ├── config.js               # Axios client + interceptors
    │   ├── auth.js                 # Auth API (login, signup, OTP, Google)
    │   ├── services.js             # Services & packages API
    │   ├── cart.js                 # Cart operations
    │   ├── orders.js               # Order management
    │   ├── addresses.js            # Saved addresses
    │   └── admin.js                # Admin & employee APIs
    ├── context/
    │   ├── AuthContext.js          # Auth state (AsyncStorage-backed)
    │   └── CartContext.js          # Cart state
    ├── navigation/
    │   └── AppNavigator.js         # Stack + bottom-tab navigation
    ├── screens/
    │   ├── home/HomeScreen.js      # Landing page with service categories
    │   ├── services/ServicesScreen.js  # Browse & search services
    │   ├── cart/CartScreen.js      # Cart, address selection, checkout
    │   ├── orders/OrdersScreen.js  # Order history with status filters
    │   ├── profile/
    │   │   ├── ProfileScreen.js    # User profile & account settings
    │   │   └── AddressesScreen.js  # Manage saved addresses
    │   ├── auth/
    │   │   ├── LoginScreen.js      # Email/OTP/Google login
    │   │   └── RegisterScreen.js   # New account registration
    │   ├── admin/
    │   │   ├── AdminLoginScreen.js # Admin credentials login
    │   │   └── AdminDashboardScreen.js  # Orders & stats overview
    │   └── employee/
    │       ├── EmployeeLoginScreen.js   # Employee OTP login
    │       └── EmployeeDashboardScreen.js  # Assignments & attendance
    ├── components/
    │   ├── Buttons.js              # Primary, Secondary, Google, Icon buttons
    │   ├── Cards.js                # Service, Package, Order, Cart cards
    │   └── UI.js                   # Header, EmptyState, Loading, Divider
    └── theme/
        ├── colors.js               # Brand color palette
        ├── typography.js           # Font sizes, weights, styles
        └── styles.js               # Spacing, radius, shadows, common styles
```

---

## 3. Local Development Setup

### Step 1: Clone and navigate

```bash
git clone https://github.com/hemanthkumarv24/BFS.git
cd BFS/mobile
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure environment

```bash
cp .env.example .env
# Edit .env with your actual values
```

### Step 4: Start the backend server

```bash
# In the project root (not the mobile/ folder)
cd ../server
npm install
cp .env.example .env   # Fill in MongoDB URI, JWT secret, etc.
npm start              # Starts on port 5000
```

### Step 5: Update API URL for local development

In `mobile/.env`, set `EXPO_PUBLIC_API_URL` to your machine's **local IP address** (not `localhost`):

```env
# Find your IP: ipconfig (Windows) or ifconfig (macOS/Linux)
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
```

> ⚠️ Mobile devices cannot reach `localhost` – always use your LAN IP.

### Step 6: Start Expo development server

```bash
npm start
# or
npx expo start
```

You'll see a QR code and options:
- Press `a` → opens Android emulator
- Press `i` → opens iOS simulator
- Scan QR code with **Expo Go** app on your physical device

---

## 4. Google Sign-In Configuration

The app uses **`expo-auth-session`** for in-app Google authentication.  
This means users **never leave the app** to sign in — no Chrome redirect, no external browser.

### How it works

```
User taps "Continue with Google"
    ↓
expo-auth-session opens a secure in-app WebView/system dialog
    ↓
User authenticates with Google (fully in-app)
    ↓
Google returns access_token to the app
    ↓
App sends access_token to backend: POST /api/auth/google-token
    ↓
Backend validates with Google API, returns JWT
    ↓
User is logged in ✅
```

### Setup Steps

#### A. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (e.g., `BubbleFlashServices`)
3. Enable **Google Sign-In API** → APIs & Services → Library

#### B. Create OAuth 2.0 Credentials

Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**

Create **3 client IDs**:

| Type | Authorized redirect URIs | Use for |
|------|--------------------------|---------|
| **Web application** | `https://auth.expo.io/@your-expo-username/bubble-flash-services` | Expo Go / development |
| **Android** | Package: `com.bubbleflashservices.bfsapp` | Android build |
| **iOS** | Bundle ID: `com.bubbleflashservices.bfsapp` | iOS build |

For Android, also add your **SHA-1 fingerprint** (get it with `eas credentials`).

#### C. Update Environment Variables

```env
# mobile/.env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
```

#### D. Update app.json scheme

The `scheme` in `app.json` must match your app's deep link scheme:

```json
{
  "expo": {
    "scheme": "bubbleflash"
  }
}
```

And add to authorized redirect URIs in Google Cloud Console:
```
bubbleflash://google-auth
```

---

## 5. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_API_URL` | ✅ | Backend API base URL |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | For Google login | Web OAuth Client ID |
| `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` | For Google login | Android OAuth Client ID |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | For Google login | iOS OAuth Client ID |

> In Expo, env vars prefixed with `EXPO_PUBLIC_` are exposed to the client.

---

## 6. Running on Devices

### Android Emulator (Android Studio)

```bash
# Start Android Virtual Device (AVD) from Android Studio first
npm run android
# or
npx expo run:android
```

### Physical Android Device

1. Enable **Developer Options** on your device
2. Enable **USB Debugging**
3. Connect device via USB
4. Run: `npx expo run:android`

### iOS Simulator (macOS only)

```bash
npm run ios
# or
npx expo run:ios
```

### Expo Go (Quickest way – no build required)

1. Install [Expo Go](https://expo.dev/go) from Play Store / App Store
2. Run `npx expo start`
3. Scan the QR code with Expo Go

> Note: Some features (like in-app Google Sign-In) require a development build, not Expo Go.

### Development Build (Recommended for full features)

```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Build development APK
eas build --profile development --platform android

# Install on device
eas build:run --platform android
```

---

## 7. Building for Production

### Prerequisites

1. **EAS Account**: Sign up at [expo.dev](https://expo.dev)
2. **EAS CLI**: `npm install -g eas-cli`
3. **Login**: `eas login`
4. **Configure project**:
   ```bash
   cd mobile
   eas build:configure
   ```

### Build Android APK (for testing)

```bash
eas build --profile preview --platform android
```

This produces an `.apk` file you can install directly.

### Build Android App Bundle (for Play Store)

```bash
eas build --profile production --platform android
```

This produces an `.aab` file required by Google Play Store.

### Signing Keys

EAS manages signing keys for you by default. For your own key:

```bash
# Generate a keystore
eas credentials
# Select: Android → Set up a new keystore
```

> ⚠️ **Keep your keystore safe!** If you lose it, you cannot update your app on the Play Store.

---

## 8. Google Play Store Deployment

### Step 1: Create Google Play Developer Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay the one-time registration fee ($25 USD)
3. Complete account verification

### Step 2: Create the App

1. **Create app** → Enter app name: "Bubble Flash Services"
2. Select **Default language**: English (India) or Hindi
3. Select app type: **App** (not game)
4. Choose **Free** or **Paid**

### Step 3: App Content Setup

Complete all required sections:

- **App access**: All functionality accessible without restrictions
- **Ads**: Does your app contain ads? (No)
- **Content rating**: Fill out the questionnaire (likely rated "Everyone")
- **Target audience**: All ages / General audience
- **Data safety**: Fill out data collection details (user email, name, location)
- **App category**: Lifestyle or Local
- **Store listing**:
  - Short description (80 chars): "Doorstep car wash, bike detailing & cleaning services in Bengaluru"
  - Full description: Full description of BFS services
  - Screenshots (phone): Min 2, max 8 (1080×1920 or 2160×3840)
  - Feature graphic: 1024×500 px
  - App icon: 512×512 px (already in `assets/icon.png`)

### Step 4: Build the Production Bundle

```bash
# In the mobile/ directory
eas build --profile production --platform android

# Wait for build to complete (usually 5–15 minutes)
# Download the .aab file from EAS dashboard or use:
eas build:run --platform android  # to download latest
```

### Step 5: Set Up Internal Testing (Recommended first)

1. In Play Console → **Testing → Internal testing**
2. Create release → Upload `.aab` file
3. Add testers by email
4. Submit for review
5. Install via the provided link

### Step 6: Production Release

1. **Production → Create release**
2. Upload the `.aab` file
3. Add release notes:
   ```
   v1.0.0 – Initial Release
   • Book car wash, bike wash, helmet care
   • In-app Google Sign-In (no browser redirect)
   • OTP & Email login
   • Cart, order tracking, saved addresses
   • Admin & employee portals
   ```
4. **Review release** → **Start rollout to production**

### Step 7: Automated Submission (Optional)

```bash
# Configure service account in eas.json first
eas submit --platform android --profile production
```

---

## 9. App Architecture

### Authentication Flow

```
App Start
  ↓
Check AsyncStorage for stored token
  ↓ token found → validate expiry (JWT decode)
  ├─ Valid token → restore session → Home Screen
  └─ Expired/missing → Guest mode → Home Screen (show Login prompt)

User taps "Log In"
  ↓
LoginScreen opens as modal
  ├─ Email + Password → POST /api/auth/login → JWT stored in AsyncStorage
  ├─ OTP → send-otp → verify-otp → JWT stored in AsyncStorage
  └─ Google (in-app, NO browser) → expo-auth-session → access_token → POST /api/auth/google-token → JWT
```

### Navigation Structure

```
AppNavigator (Stack)
├── Main (Bottom Tabs)
│   ├── Home
│   ├── Services
│   ├── Cart
│   ├── Orders
│   └── Profile
├── Login (Modal)
├── Register (Modal)
├── Addresses
├── AdminLogin (Modal)
├── AdminDashboard
├── EmployeeLogin (Modal)
├── EmployeeDashboard
└── OrderDetail
```

### State Management

- **AuthContext**: User session (token, user data) stored in AsyncStorage
- **CartContext**: Cart items synced with backend API
- **Local state**: Per-screen state (forms, loading flags, data)

---

## 10. Troubleshooting

### "Network request failed" on device

Your device can't reach `localhost`. Use your machine's LAN IP in `.env`:
```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:5000/api
```

### Google Sign-In not working in Expo Go

Expo Go doesn't fully support custom URI schemes. Use a **development build**:
```bash
eas build --profile development --platform android
```

### Build fails with "missing keystore"

Let EAS manage the keystore:
```bash
eas credentials --platform android
# Select: Build credentials → Set up a new keystore
```

### App crashes on Android 12+

Ensure `android.permissions` in `app.json` includes needed permissions and `allowBackup` is set.

### White screen on launch

Check that `expo-splash-screen` is properly configured and `SplashScreen.hideAsync()` is called.

### "expo-auth-session" redirect not working

1. Ensure `scheme` in `app.json` matches your `makeRedirectUri` call
2. Add the redirect URI to Google Cloud Console's authorized redirect URIs
3. For production builds, use the SHA-1 fingerprint of your signing key

---

## 📞 Support

- **Email**: support@bubbleflash.in  
- **WhatsApp**: +91 XXXXX XXXXX  
- **Website**: [bubbleflash.in](https://bubbleflash.in)

---

*Built with ❤️ using React Native + Expo*
