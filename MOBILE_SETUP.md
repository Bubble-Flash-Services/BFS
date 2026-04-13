# 📱 Bubble Flash Services – Mobile App Setup

The React Native (Expo) mobile app is located in the [`mobile/`](./mobile/) directory.

## Quick Start

```bash
cd mobile
npm install
cp .env.example .env   # Fill in your API URL and Google OAuth keys
npx expo start         # Start dev server
```

## Full Documentation

See [`mobile/README.md`](./mobile/README.md) for:
- Complete setup guide
- Google Sign-In configuration (in-app, no browser redirect)
- Building APK / App Bundle
- Google Play Store deployment step-by-step

## Key Features

| Feature | Implementation |
|---------|---------------|
| **In-app Google Sign-In** | `expo-auth-session` – no Chrome redirect |
| **OTP Login** | Phone number + SMS OTP via backend |
| **Email Login** | Standard email/password |
| **Cart & Checkout** | Sync with backend, address selection |
| **Order Tracking** | Real-time status updates |
| **Admin Portal** | Secure admin login + dashboard |
| **Employee Portal** | OTP-based employee access |
| **Mobile Design** | Yellow/Black brand, rounded cards, proper touch targets |
| **Play Store Ready** | EAS Build profiles configured |
