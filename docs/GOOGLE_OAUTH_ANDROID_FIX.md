# Google OAuth Android Deep Link Fix

## Problem
When users clicked "Continue with Google" in the Android app, the OAuth flow would open in a browser. After successful authentication, the session would remain in the browser instead of returning to the app.

## Root Cause
The Android app was missing proper deep link configuration to handle OAuth callback URLs (`/google-success`) from the Google authentication flow.

## Solution
Implemented Android App Links (deep linking) to intercept OAuth callback URLs and redirect them back to the app.

---

## Technical Changes

### 1. AndroidManifest.xml
Added two intent filters to handle deep links:

#### HTTPS Deep Link (Primary)
```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https"
          android:host="bubbleflashservices.in"
          android:pathPrefix="/google-success" />
</intent-filter>
```

This intercepts URLs like: `https://bubbleflashservices.in/google-success?token=...`

#### Custom Scheme Deep Link (Fallback)
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.bubbleflashservices.bfsapp" />
</intent-filter>
```

This handles custom URLs like: `com.bubbleflashservices.bfsapp://google-success?token=...`

### 2. App.jsx
Added Capacitor App plugin integration to handle incoming deep links:

```javascript
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

// Listen for deep link events (simplified version)
useEffect(() => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  // Handle cold start (app opened via deep link when not running)
  const checkInitialUrl = async () => {
    const result = await CapacitorApp.getLaunchUrl();
    if (result?.url) {
      handleDeepLink(result.url);
    }
  };

  // Handle deep link URL
  const handleDeepLink = (urlString) => {
    const url = new URL(urlString);
    let path = url.pathname;
    let search = url.search;
    
    // Handle custom scheme URLs
    if (url.protocol === 'com.bubbleflashservices.bfsapp:') {
      path = url.host || url.pathname || '';
      if (path.startsWith('//')) path = path.substring(2);
    }
    
    // Ensure path starts with /
    if (path && !path.startsWith('/')) path = '/' + path;
    
    const fullPath = path + search;
    navigate(fullPath, { replace: true });
  };

  // Handle warm start (app in background)
  const handleAppUrlOpen = (event) => handleDeepLink(event.url);

  checkInitialUrl();
  const listener = CapacitorApp.addListener('appUrlOpen', handleAppUrlOpen);
  return () => listener.remove();
}, [navigate]);
```

**Note:** The above is a simplified version. See `src/App.jsx` for the complete implementation with full error handling.

### 3. Dependencies
Added `@capacitor/app@^8.0.0` plugin for deep link handling.

---

## How It Works

### OAuth Flow with Deep Links

1. **User Initiates Login**
   - User clicks "Continue with Google" in the app
   - App opens browser: `https://accounts.google.com/...`

2. **Google Authentication**
   - User logs in with Google account
   - Google redirects to backend: `https://bfs-backend.onrender.com/api/auth/google/callback`

3. **Backend Processing**
   - Backend validates OAuth token
   - Creates JWT token for the user
   - Redirects to: `https://bubbleflashservices.in/google-success?token=...&email=...`

4. **Deep Link Intercept** (NEW!)
   - Android OS detects URL matches deep link filter
   - Opens BFS app instead of browser
   - Fires `appUrlOpen` event with the URL

5. **App Navigation**
   - App receives the deep link event
   - Extracts path and query params: `/google-success?token=...`
   - Navigates to GoogleSuccess component

6. **Login Completion**
   - GoogleSuccess component extracts token from URL
   - Stores token in localStorage
   - Fetches user profile
   - Redirects to home page

---

## Android App Links Verification

### What is `autoVerify="true"`?
Android App Links with `autoVerify="true"` tell Android to automatically verify your domain ownership. This:
- Skips the "Open with" dialog
- Opens links directly in your app
- Provides seamless user experience

### Domain Verification Requirements
For automatic verification to work, you need an `assetlinks.json` file hosted at:
```
https://bubbleflashservices.in/.well-known/assetlinks.json
```

### Creating assetlinks.json

1. **Get your app's signing certificate SHA-256 fingerprint:**
   ```bash
   cd android
   ./gradlew signingReport
   ```
   Look for the SHA-256 fingerprint under the release signing config.

2. **Create the assetlinks.json file:**
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.bubbleflashservices.bfsapp",
       "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
     }
   }]
   ```

3. **Host the file:**
   - Upload to: `https://bubbleflashservices.in/.well-known/assetlinks.json`
   - Ensure it's publicly accessible
   - Set content-type: `application/json`

4. **Verify the file:**
   Visit: https://developers.google.com/digital-asset-links/tools/generator

### Without assetlinks.json
- Deep links will still work via custom scheme: `com.bubbleflashservices.bfsapp://`
- Users may see "Open with" dialog for HTTPS links
- App will still open and handle the OAuth callback correctly

---

## Testing the Fix

### Prerequisites
- Android device or emulator with the app installed
- Backend server running at: `https://bfs-backend.onrender.com`
- Frontend hosted at: `https://bubbleflashservices.in`

### Test Steps

1. **Install the App**
   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   ```
   - Build and install the app from Android Studio

2. **Test Google Login**
   - Open the BFS app
   - Navigate to login screen
   - Click "Continue with Google"

3. **Expected Behavior**
   - Browser opens for Google authentication
   - User selects Google account and grants permissions
   - **App automatically opens** (instead of staying in browser)
   - User is logged in and redirected to home screen

4. **Verify Deep Link**
   - Check Android Studio logcat for:
     ```
     Deep link received: https://bubbleflashservices.in/google-success?token=...
     Navigating to: /google-success?token=...
     ```

### Testing Deep Links Manually

You can test deep links without going through the full OAuth flow:

1. **Using ADB (Android Debug Bridge):**
   ```bash
   # Test HTTPS deep link
   adb shell am start -W -a android.intent.action.VIEW \
     -d "https://bubbleflashservices.in/google-success?token=test123" \
     com.bubbleflashservices.bfsapp

   # Test custom scheme deep link
   adb shell am start -W -a android.intent.action.VIEW \
     -d "com.bubbleflashservices.bfsapp://google-success?token=test123" \
     com.bubbleflashservices.bfsapp
   ```

2. **Using a Test HTML Page:**
   Create a test HTML file and open it in Chrome on your device:
   ```html
   <!DOCTYPE html>
   <html>
   <body>
     <h1>Deep Link Test</h1>
     <a href="https://bubbleflashservices.in/google-success?token=test123">
       Test HTTPS Deep Link
     </a>
     <br><br>
     <a href="com.bubbleflashservices.bfsapp://google-success?token=test123">
       Test Custom Scheme Deep Link
     </a>
   </body>
   </html>
   ```

---

## Troubleshooting

### Issue: App doesn't open after Google login
**Possible Causes:**
1. Intent filters not properly configured
2. App not installed or wrong package name
3. Deep link URL doesn't match configured pattern

**Debug Steps:**
1. Check Android Studio logcat for errors
2. Verify AndroidManifest.xml has correct intent filters
3. Test deep links manually with ADB
4. Ensure app is installed: `adb shell pm list packages | grep bfsapp`

### Issue: "Open with" dialog appears
**Cause:** Android App Links not verified (missing or incorrect assetlinks.json)

**Solutions:**
1. Add assetlinks.json file to your website
2. Use custom scheme deep link as fallback
3. User can select "Always open with BFS App"

### Issue: App opens but shows error/blank screen
**Possible Causes:**
1. GoogleSuccess component not handling deep link URL correctly
2. Token missing or invalid in URL

**Debug Steps:**
1. Check browser console logs in the app
2. Verify token is present in URL: `?token=...`
3. Check GoogleSuccess.jsx logs
4. Verify API calls succeed

### Issue: Deep link works in browser but not in app
**Possible Causes:**
1. Capacitor App plugin not properly installed
2. AppContent component not mounted
3. Event listener not registered

**Debug Steps:**
1. Verify @capacitor/app is installed: `npm list @capacitor/app`
2. Check capacitor.build.gradle includes app plugin
3. Add console logs to appUrlOpen handler
4. Test on both emulator and real device

---

## Additional Notes

### Security Considerations
- Deep links can be intercepted by other apps with same URL patterns
- Always validate tokens on the backend
- Use HTTPS for production deep links
- Consider using Android App Links verification for added security

### Browser Fallback
If the app is not installed:
- HTTPS deep links open in browser normally
- GoogleSuccess page still works in browser
- User gets logged in via web interface

### iOS Support
To support iOS, you'll need to:
1. Add Universal Links configuration in Info.plist
2. Host apple-app-site-association file
3. Update Capacitor iOS project similarly

---

## References
- [Android App Links Documentation](https://developer.android.com/training/app-links)
- [Capacitor Deep Links Guide](https://capacitorjs.com/docs/guides/deep-links)
- [Digital Asset Links Tool](https://developers.google.com/digital-asset-links/tools/generator)
