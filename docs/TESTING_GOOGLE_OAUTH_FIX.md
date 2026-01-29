# Testing Guide: Google OAuth Android Deep Link Fix

This guide provides step-by-step instructions to test the Google OAuth deep link fix for the Android app.

---

## Prerequisites

Before testing, ensure you have:

1. **Android Studio** installed and configured
2. **Android device** or **emulator** running Android 6.0 (API 23) or higher
3. **ADB (Android Debug Bridge)** installed and accessible from command line
4. **Google account** for OAuth testing
5. **Backend server** running at `https://bfs-backend.onrender.com`
6. **Frontend** hosted at `https://bubbleflashservices.in`

---

## Step 1: Build and Install the App

### 1.1 Build the Frontend
```bash
cd /path/to/BFS
npm install
npm run build
```

### 1.2 Sync with Android
```bash
npx cap sync android
```

### 1.3 Open in Android Studio
```bash
npx cap open android
```

### 1.4 Build and Install
1. In Android Studio, click the **Run** button (green play icon)
2. Select your target device or emulator
3. Wait for the build to complete and the app to install

---

## Step 2: Manual Deep Link Testing

Test deep links manually before testing the full OAuth flow.

### 2.1 Test HTTPS Deep Link

**Method 1: Using ADB**
```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://bubbleflashservices.in/google-success?token=test123&email=test@example.com" \
  com.bubbleflashservices.bfsapp
```

**Expected Result:**
- App opens (or comes to foreground if already running)
- Navigates to `/google-success` route
- You should see the "Signing you in..." message briefly
- App navigates to home page (token will be invalid but navigation works)

**Check Logcat:**
```bash
adb logcat -s "Capacitor"
```

Look for:
```
Deep link received: https://bubbleflashservices.in/google-success?token=test123&email=test@example.com
Navigating to: /google-success?token=test123&email=test@example.com
```

### 2.2 Test Custom Scheme Deep Link

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "com.bubbleflashservices.bfsapp://google-success?token=test456" \
  com.bubbleflashservices.bfsapp
```

**Expected Result:**
- Same as HTTPS deep link test
- App should handle custom scheme URLs correctly

### 2.3 Test Invalid Deep Link (Security)

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://bubbleflashservices.in/malicious-path?param=evil" \
  com.bubbleflashservices.bfsapp
```

**Expected Result:**
- App opens
- Path validation detects invalid path
- Logcat shows: `Invalid deep link path: /malicious-path - redirecting to home`
- App navigates to home page `/` instead

---

## Step 3: Test Google OAuth Flow

### 3.1 Start the Test
1. **Open the BFS app** on your Android device/emulator
2. If not already logged out, log out first
3. Navigate to the **login screen**
4. Click **"Continue with Google"** button

### 3.2 Expected Behavior

**Step-by-Step Flow:**

1. **Browser Opens**
   - Chrome or system browser opens
   - Shows Google OAuth consent screen
   - URL: `https://accounts.google.com/...`

2. **User Authentication**
   - Select your Google account
   - Grant permissions (first time only)
   - Google authenticates the user

3. **Backend Redirect**
   - Browser redirects to backend: `https://bfs-backend.onrender.com/api/auth/google/callback`
   - Backend validates OAuth token
   - Backend creates JWT token
   - Backend redirects to: `https://bubbleflashservices.in/google-success?token=...`

4. **Deep Link Intercept** ✅ **THIS IS THE FIX**
   - Android OS intercepts the URL
   - Recognizes it matches the deep link pattern
   - **Closes the browser**
   - **Opens the BFS app**

5. **App Navigation**
   - App receives deep link event
   - Validates the path (security check)
   - Navigates to `/google-success` route
   - Shows "Signing you in..." message

6. **Login Completion**
   - GoogleSuccess component extracts token
   - Stores token in localStorage
   - Fetches user profile from backend
   - Navigates to home page
   - **User is now logged in** ✅

### 3.3 Verification Checklist

After completing the OAuth flow, verify:

- [ ] Browser closed automatically after Google authentication
- [ ] BFS app opened automatically
- [ ] No "Open with" dialog appeared (if App Links are verified)
- [ ] User is logged in (check top-right corner for user menu)
- [ ] User profile data is loaded correctly
- [ ] Can navigate to Profile page and see user details
- [ ] Token is stored in localStorage (check browser console in app)

### 3.4 Check Logcat

Open logcat while testing:
```bash
adb logcat | grep -E "Capacitor|Deep link|Google"
```

Look for these log messages:

```
✅ App launched with deep link: https://bubbleflashservices.in/google-success?token=...
✅ Deep link received: https://bubbleflashservices.in/google-success?token=...
✅ Navigating to: /google-success?token=...
✅ 🔍 Fetching complete profile data after Google login...
✅ ✅ Complete profile data fetched: {...}
```

---

## Step 4: Test Edge Cases

### 4.1 Test Cold Start

**Scenario:** App is completely closed, not in background

1. Close the app completely: `adb shell am force-stop com.bubbleflashservices.bfsapp`
2. Trigger deep link: `adb shell am start -W -a android.intent.action.VIEW -d "https://bubbleflashservices.in/google-success?token=test" com.bubbleflashservices.bfsapp`
3. **Expected:** App launches and handles the deep link

**Check:** Logcat should show `App launched with deep link:`

### 4.2 Test Warm Start

**Scenario:** App is in background

1. Open the app and put it in background (press home button)
2. Trigger deep link: `adb shell am start -W -a android.intent.action.VIEW -d "https://bubbleflashservices.in/google-success?token=test" com.bubbleflashservices.bfsapp`
3. **Expected:** App comes to foreground and handles the deep link

**Check:** Logcat should show `Deep link received:`

### 4.3 Test Multiple Deep Links

1. Trigger first deep link with test token
2. Immediately trigger second deep link
3. **Expected:** Both are handled correctly, no duplicate processing

**Check:** Logcat should show both deep links processed

### 4.4 Test Without App Installed

1. Uninstall the app: `adb uninstall com.bubbleflashservices.bfsapp`
2. Open URL in browser: `https://bubbleflashservices.in/google-success?token=test`
3. **Expected:** Page opens in browser, user can still log in via web interface

---

## Step 5: Test Error Scenarios

### 5.1 Invalid Token
1. Trigger deep link with invalid token
2. **Expected:** App opens, shows error, redirects to home or login

### 5.2 Missing Token
1. Trigger deep link without token: `https://bubbleflashservices.in/google-success`
2. **Expected:** App handles gracefully, redirects to home

### 5.3 Network Failure
1. Disable internet on device
2. Trigger OAuth flow (will fail at Google login)
3. Re-enable internet and retry
4. **Expected:** Works correctly after internet is restored

---

## Troubleshooting

### Issue: Browser doesn't close after OAuth

**Possible Causes:**
1. Intent filters not properly configured
2. App not installed
3. Android version too old (< 6.0)

**Debug Steps:**
1. Check AndroidManifest.xml has intent filters
2. Verify app package name: `adb shell pm list packages | grep bfs`
3. Check Android version: `adb shell getprop ro.build.version.release`
4. Test manual deep link with ADB

### Issue: "Open with" dialog appears

**Cause:** Android App Links not verified

**Solutions:**
1. This is normal without App Links verification
2. User can select "Always open with BFS App"
3. To fix permanently, set up assetlinks.json (see GOOGLE_OAUTH_ANDROID_FIX.md)

### Issue: App opens but shows blank screen

**Possible Causes:**
1. Token missing from URL
2. GoogleSuccess component error
3. Navigation issue

**Debug Steps:**
1. Check logcat for JavaScript errors
2. Verify token is in URL
3. Check network requests in Chrome DevTools (chrome://inspect)
4. Verify backend is responding

### Issue: Deep link test works but OAuth doesn't

**Possible Causes:**
1. Backend not redirecting to correct URL
2. BASE_URL environment variable incorrect
3. Google OAuth credentials issue

**Debug Steps:**
1. Check backend logs
2. Verify BASE_URL = `https://bubbleflashservices.in`
3. Check Google Cloud Console OAuth settings
4. Test OAuth flow in browser first

---

## Success Criteria

The fix is successful if:

- [x] User clicks "Continue with Google" in Android app
- [x] Browser opens for Google authentication
- [x] After authentication, **browser closes automatically**
- [x] **BFS app opens automatically** (instead of staying in browser)
- [x] User is logged in and sees their profile
- [x] Can access protected routes without re-login
- [x] Manual deep link tests work correctly
- [x] Security validation blocks invalid paths
- [x] Both cold start and warm start scenarios work

---

## Recording Test Results

After testing, document your results:

**Test Date:** _______________  
**Tester:** _______________  
**Device/Emulator:** _______________  
**Android Version:** _______________

### Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| Manual HTTPS deep link | ⬜ Pass / ⬜ Fail | |
| Manual custom scheme deep link | ⬜ Pass / ⬜ Fail | |
| Invalid path security test | ⬜ Pass / ⬜ Fail | |
| Full Google OAuth flow | ⬜ Pass / ⬜ Fail | |
| Cold start deep link | ⬜ Pass / ⬜ Fail | |
| Warm start deep link | ⬜ Pass / ⬜ Fail | |
| Browser closes automatically | ⬜ Pass / ⬜ Fail | |
| User logged in successfully | ⬜ Pass / ⬜ Fail | |

### Issues Found

Document any issues or unexpected behavior:

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## Next Steps After Testing

1. **If all tests pass:**
   - Deploy to production
   - Monitor for any issues
   - Consider setting up App Links (assetlinks.json)

2. **If tests fail:**
   - Review logcat output
   - Check the troubleshooting section
   - File an issue with test results and logs

3. **Optional improvements:**
   - Set up Android App Links verification
   - Add deep link analytics tracking
   - Implement iOS Universal Links support

---

## Additional Resources

- **Full technical guide:** [GOOGLE_OAUTH_ANDROID_FIX.md](./GOOGLE_OAUTH_ANDROID_FIX.md)
- **Android App Links:** https://developer.android.com/training/app-links
- **Capacitor Deep Links:** https://capacitorjs.com/docs/guides/deep-links
- **ADB Commands Reference:** https://developer.android.com/studio/command-line/adb
