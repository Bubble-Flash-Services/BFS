# Bubble Flash Services — Mobile App

React Native mobile application for Bubble Flash Services — a premium vehicle services platform.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| React Native CLI | Latest |
| Android Studio | Hedgehog+ (for Android) |
| Xcode | 14+ (for iOS, macOS only) |
| JDK | 17 |
| CocoaPods | Latest (macOS only) |

---

## Installation

```bash
# 1. Navigate to mobile app directory
cd mobile-app

# 2. Install JavaScript dependencies
npm install

# 3. iOS only: install CocoaPods
cd ios && pod install && cd ..
```

---

## Environment Setup

### Android
1. Install [Android Studio](https://developer.android.com/studio)
2. Install Android SDK (API 33+)
3. Set environment variables in `~/.bashrc` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

4. Create/start an Android Virtual Device (AVD) via Android Studio

### iOS (macOS only)
1. Install Xcode from App Store
2. Install Command Line Tools: `xcode-select --install`
3. Install CocoaPods: `sudo gem install cocoapods`
4. Accept Xcode license: `sudo xcodebuild -license accept`

---

## Running the App

### Start Metro Bundler
```bash
npm start
```

### Android
```bash
npm run android
# or
npx react-native run-android
```

### iOS (macOS only)
```bash
npm run ios
# or
npx react-native run-ios
```

---

## Project Structure

```
mobile-app/
├── src/
│   ├── App.js                     # Root component
│   ├── config/
│   │   └── index.js               # API base URL config
│   ├── theme/
│   │   ├── colors.js              # Brand color palette
│   │   ├── typography.js          # Font sizes & weights
│   │   ├── spacing.js             # Spacing scale
│   │   └── index.js               # Theme exports
│   ├── services/
│   │   ├── api.js                 # Axios instance + interceptors
│   │   ├── authService.js         # OTP auth methods
│   │   └── bookingService.js      # Booking CRUD
│   ├── store/
│   │   ├── AuthContext.js         # Auth state + context
│   │   └── BookingContext.js      # Booking state + context
│   ├── hooks/
│   │   ├── useAuth.js             # Auth hook
│   │   └── useBookings.js         # Bookings hook
│   ├── utils/
│   │   ├── helpers.js             # Utility functions
│   │   └── constants.js           # App-wide constants
│   ├── components/
│   │   ├── Button.jsx             # Multi-variant button
│   │   ├── ServiceCard.jsx        # Service listing card
│   │   ├── CategoryCard.jsx       # Category icon card
│   │   ├── Input.jsx              # Styled text input
│   │   ├── Loader.jsx             # Loading spinner
│   │   └── Header.jsx             # App header
│   ├── navigation/
│   │   ├── AppNavigator.js        # Root stack navigator
│   │   └── TabNavigator.js        # Bottom tab navigator
│   └── screens/
│       ├── SplashScreen.js        # Animated splash
│       ├── OnboardingScreen.js    # 3-slide onboarding
│       ├── AuthScreen.js          # Mobile OTP auth
│       ├── HomeScreen.js          # Main home (Pronto-style)
│       ├── ServiceListingScreen.js # Browse & filter services
│       ├── ServiceDetailScreen.js  # Service + packages
│       ├── BookingScreen.js        # Date/time/address booking
│       ├── MyBookingsScreen.js     # Booking history
│       ├── ProfileScreen.js        # User profile & settings
│       └── ExploreScreen.js        # Explore all services
├── index.js                        # RN entry point
├── app.json                         # App name config
├── babel.config.js                  # Babel config
├── metro.config.js                  # Metro bundler config
├── package.json                     # Dependencies
└── .gitignore
```

---

## Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#0A1F44` | Main brand, headers, buttons |
| Secondary | `#00D4FF` | Accents, highlights |
| Accent | `#FF7A00` | CTAs, badges |
| Background | `#F7F9FC` | App background |
| Card | `#FFFFFF` | Card surfaces |
| TextPrimary | `#0A0A0A` | Main text |
| TextSecondary | `#6B7280` | Muted text |

---

## API Configuration

Edit `src/config/index.js` to change the API base URL:

```js
export const BASE_URL = 'https://bubbleflashservices.in';
export const API_URL = `${BASE_URL}/api`;
```

---

## Build for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Android App Bundle (for Play Store)
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS (Xcode Archive)
1. Open `ios/BubbleFlashServices.xcworkspace` in Xcode
2. Set scheme to **Release**
3. Go to **Product → Archive**
4. Use **Distribute App** to upload to App Store Connect

---

## Key Features

- **OTP-based Auth** — Mobile number + 6-digit OTP login
- **Pronto-style Home** — Category grid, auto-sliding banners, horizontal service scrolls
- **6 Service Categories** — Car Wash, Bike Wash, Helmet Wash, PUC, Insurance, Accessories
- **Package Selection** — Basic / Standard / Premium tiers
- **Booking Flow** — Date picker, time slots, vehicle type, address
- **My Bookings** — Filter by status, cancel, view details
- **Profile** — Stats, menu, logout

---

## Troubleshooting

**Metro can't find module**: Clear cache: `npm start -- --reset-cache`

**Android build fails**: Run `cd android && ./gradlew clean`

**iOS build fails**: Run `cd ios && pod deintegrate && pod install`

**Vector icons not showing**: Follow [react-native-vector-icons setup](https://github.com/oblador/react-native-vector-icons#installation)
