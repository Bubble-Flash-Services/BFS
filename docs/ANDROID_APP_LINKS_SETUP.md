# Android App Links Setup for BFS App

## Overview
This document explains the setup required to enable automatic app opening for OAuth redirects on Android, eliminating the "Open with..." dialog.

## Changes Made

### 1. **GoogleSuccess Component** (`src/pages/GoogleSuccess.jsx`)
- Now stores authentication token in **both** localStorage and Capacitor Preferences
- Ensures token persistence when app is opened via deep link (fresh WebView)

### 2. **AuthContext** (`src/components/AuthContext.jsx`)
- Checks Capacitor Preferences during initialization
- Syncs token from native storage to localStorage when app opens via deep link
- Ensures logout clears data from both storages

### 3. **OAuth Callback** (`server/routes/auth.js`)
- Detects Android devices via User-Agent
- Redirects Android users directly to custom scheme (`com.bubbleflashservices.bfsapp://`)
- This bypasses the Chrome "Open with..." dialog

### 4. **Digital Asset Links** (`public/.well-known/assetlinks.json`)
- Created template for Android App Links verification
- **REQUIRES CONFIGURATION** (see below)

## Required Configuration Steps

### Step 1: Get Your App's Certificate Fingerprint

You need to get the SHA-256 fingerprint of your app's release signing certificate:

#### For Debug Build:
```bash
cd android
./gradlew signingReport
```

Look for the SHA-256 fingerprint under "Variant: debug"

#### For Release Build:
```bash
keytool -list -v -keystore path/to/your/keystore.jks -alias bfsapp-key
```

This will show you the certificate fingerprint. Copy the SHA-256 value.

### Step 2: Update assetlinks.json

1. Open `public/.well-known/assetlinks.json`
2. Replace `REPLACE_WITH_YOUR_RELEASE_CERTIFICATE_SHA256_FINGERPRINT` with your actual SHA-256 fingerprint
3. Format: `"AB:CD:EF:12:34:56:..."`  (colon-separated uppercase hex)

Example:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.bubbleflashservices.bfsapp",
      "sha256_cert_fingerprints": [
        "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5"
      ]
    }
  }
]
```

### Step 3: Deploy the assetlinks.json File

The file **MUST** be accessible at:
```
https://bubbleflashservices.in/.well-known/assetlinks.json
```

- Ensure your web server serves this file with correct MIME type: `application/json`
- The file must be publicly accessible (no authentication required)
- HTTPS is required (not HTTP)

### Step 4: Verify Configuration

Use Google's testing tool to verify your setup:
```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://bubbleflashservices.in&relation=delegate_permission/common.handle_all_urls
```

Or use the command-line tool:
```bash
adb shell pm get-app-links com.bubbleflashservices.bfsapp
```

### Step 5: Test on Device

1. Build and install the app on an Android device
2. Clear app data: Settings > Apps > BFS App > Storage > Clear Data
3. Open Chrome and initiate Google login
4. After authentication, the app should open automatically without showing "Open with..." dialog
5. Verify that you're logged in without needing to re-authenticate

## Troubleshooting

### Issue: Still seeing "Open with..." dialog

**Possible causes:**
1. `assetlinks.json` not deployed or not accessible
2. Fingerprint mismatch between assetlinks.json and installed app
3. Android hasn't verified the app links yet (can take a few minutes)

**Solutions:**
- Verify the JSON file is accessible at the URL
- Check fingerprint matches using `adb shell pm get-app-links`
- Force reverification: Settings > Apps > BFS App > Open by default > Add link > Select all

### Issue: App opens but user is not logged in

**This is fixed by the changes in GoogleSuccess.jsx and AuthContext.jsx**

The token is now stored in Capacitor Preferences, which persists across app launches and is accessible when the app is opened via deep link.

### Issue: Token not syncing between web and app

Ensure that:
1. `@capacitor/preferences` is properly installed
2. Capacitor is properly configured in `capacitor.config.json`
3. App has been rebuilt after changes: `npm run build:android`

## Environment Variables

Ensure `BASE_URL` is set in your server's environment variables:
```bash
BASE_URL=https://bubbleflashservices.in
```

This is used for non-Android OAuth callbacks.

## Testing Checklist

- [ ] Get SHA-256 fingerprint from signing certificate
- [ ] Update `public/.well-known/assetlinks.json` with correct fingerprint
- [ ] Deploy assetlinks.json to production server
- [ ] Verify JSON file is accessible via HTTPS
- [ ] Clear app data on test device
- [ ] Test Google login from Chrome on Android
- [ ] Verify app opens automatically (no dialog)
- [ ] Verify user is logged in without re-authentication
- [ ] Test on multiple Android devices/versions

## Additional Notes

- The custom scheme `com.bubbleflashservices.bfsapp://` is already configured in `AndroidManifest.xml`
- App Links (HTTPS URLs) are verified by Android and have higher priority than custom schemes
- Both methods will work, but App Links provide better user experience
- For iOS support in the future, you'll need to configure Universal Links similarly

## References

- [Android App Links Documentation](https://developer.android.com/training/app-links)
- [Digital Asset Links Protocol](https://developers.google.com/digital-asset-links/v1/getting-started)
- [Capacitor Deep Links](https://capacitorjs.com/docs/guides/deep-links)
