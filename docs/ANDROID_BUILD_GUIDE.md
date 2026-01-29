# Android Build and Play Store Deployment Guide for BFS App

This guide provides step-by-step instructions for building a signed Android App Bundle (AAB) for Google Play Store upload.

## Prerequisites

- Android Studio installed (latest stable version)
- Java JDK 11 or higher
- Node.js and npm installed
- BFS project with Capacitor configured

## 1. Initial Setup

### Install Dependencies
```bash
cd /path/to/BFS
npm install
```

### Build React App and Sync to Android
```bash
npm run build:android
```

This command will:
1. Build the React app (creates `dist` folder)
2. Copy assets to Android project
3. Open Android Studio automatically

## 2. Configure Android App

### Update App Information

Edit `android/app/build.gradle`:

```gradle
android {
    namespace "com.bubbleflashservices.bfsapp"
    compileSdk 34
    
    defaultConfig {
        applicationId "com.bubbleflashservices.bfsapp"
        minSdk 22
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Update App Name and Icon

1. **App Name**: Edit `android/app/src/main/res/values/strings.xml`
```xml
<resources>
    <string name="app_name">BFSApp</string>
    <string name="title_activity_main">BFSApp</string>
    <string name="package_name">com.bubbleflashservices.bfsapp</string>
</resources>
```

2. **App Icon**: Replace icons in `android/app/src/main/res/mipmap-*` directories
   - Use Android Studio > Right-click res > New > Image Asset
   - Choose launcher icons
   - Upload your BFS logo

### Configure Network Security (HTTPS)

The app is already configured for HTTPS in `capacitor.config.json`:
```json
{
  "server": {
    "url": "https://my-bfs-backend.com",
    "androidScheme": "https"
  },
  "android": {
    "allowMixedContent": false
  }
}
```

For additional security, edit `android/app/src/main/res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    
    <!-- Only for development/staging -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

## 3. Configure Firebase (for Push Notifications)

### Add Firebase to Android App

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Add Android app with package name: `com.bubbleflashservices.bfsapp`
4. Download `google-services.json`
5. Place it in `android/app/` directory

### Update build.gradle files

`android/build.gradle`:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

`android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-messaging'
}
```

## 4. Generate Signing Key

### Create Keystore File

```bash
keytool -genkey -v -keystore bfs-release-key.jks \
  -alias bfsapp-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Important**: Save this information securely:
- Keystore password
- Key alias: `bfsapp-key`
- Key password
- Keystore file: `bfs-release-key.jks`

**⚠️ WARNING**: 
- Never commit the keystore file to git
- Store it in a secure location (password manager, secure cloud storage)
- If lost, you cannot update your app on Play Store

### Store Keystore in Project

Move keystore to Android project:
```bash
mkdir -p android/app/keystore
mv bfs-release-key.jks android/app/keystore/
```

### Configure Signing in Gradle

Create `android/keystore.properties`:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=bfsapp-key
storeFile=keystore/bfs-release-key.jks
```

**⚠️ Add to .gitignore:**
```
android/keystore.properties
android/app/keystore/
```

Update `android/app/build.gradle`:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 5. Build Signed AAB for Play Store

### Build AAB via Command Line

```bash
cd android
./gradlew bundleRelease
```

The AAB file will be created at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Build AAB via Android Studio

1. Open project in Android Studio
2. Go to **Build** > **Generate Signed Bundle / APK**
3. Select **Android App Bundle**
4. Click **Next**
5. Choose existing keystore or create new
6. Fill in keystore details:
   - Key store path: `android/app/keystore/bfs-release-key.jks`
   - Key store password
   - Key alias: `bfsapp-key`
   - Key password
7. Click **Next**
8. Select **release** build variant
9. Click **Finish**

## 6. Test the Build

### Install on Device
```bash
cd android
./gradlew installRelease
```

### Test Checklist
- [ ] App launches successfully
- [ ] All screens render correctly
- [ ] API calls work (HTTPS)
- [ ] Authentication works (JWT)
- [ ] Push notifications work
- [ ] No console errors
- [ ] All images/assets load
- [ ] No network security errors

## 7. Prepare for Play Store

### Required Assets

1. **App Icon**: 512x512 PNG (32-bit with alpha)
2. **Feature Graphic**: 1024x500 PNG or JPG
3. **Screenshots**: 
   - Phone: At least 2 (16:9 or 9:16 aspect ratio)
   - Tablet: At least 2 (optional but recommended)
4. **Privacy Policy URL**: Required if app handles user data
5. **App Description**: Short (80 chars) and Full (4000 chars)

### App Signing

For new apps on Play Store, Google requires **Play App Signing**:
1. Google will re-sign your app with their key
2. Your upload key is used for uploading
3. Google manages the app signing key

**Enable Play App Signing:**
1. Go to Play Console
2. Select your app
3. Navigate to **Release > Setup > App signing**
4. Follow instructions to enable

## 8. Upload to Google Play Console

### Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in app details:
   - App name: **BFSApp**
   - Default language: English
   - App or game: App
   - Free or paid: Free
4. Accept declarations

### Upload AAB

1. Go to **Production** (or Internal testing for first upload)
2. Click **Create new release**
3. Upload the AAB file: `app-release.aab`
4. Fill in **Release name**: v1.0.0
5. Add **Release notes**
6. Click **Save** and **Review release**

### Complete Store Listing

Required information:
- App name: BFSApp
- Short description: Quick summary of BFS services
- Full description: Detailed description of all features
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (at least 2)
- App category: Business / Lifestyle
- Contact email
- Privacy policy URL

### Content Rating

1. Go to **Policy > App content > Content rating**
2. Fill out questionnaire
3. Submit for rating

### Target Audience & Content

1. Set target age group
2. Declare if app has ads
3. Complete all required declarations

### Review and Publish

1. Review all sections (must have green checkmarks)
2. Click **Send for review**
3. Review typically takes 1-7 days

## 9. Play Store Requirements Checklist

### Technical Requirements
- [x] Uses HTTPS for all API calls
- [x] Implements JWT authentication
- [x] Targets Android API 33 (targetSdk 34)
- [x] No cleartext traffic (except localhost for dev)
- [x] Signed with release keystore
- [x] Built as AAB format
- [x] Push notifications configured with Firebase
- [x] Secure storage for sensitive data
- [x] Proper error handling
- [x] No hardcoded secrets

### Policy Requirements
- [ ] Privacy Policy URL provided
- [ ] Data safety form completed
- [ ] Permissions justified and documented
- [ ] Content rating completed
- [ ] Target audience defined
- [ ] All required declarations made

### Quality Requirements
- [ ] App tested on multiple devices
- [ ] No crashes or ANRs
- [ ] Fast load times (< 5 seconds)
- [ ] Responsive UI
- [ ] Proper back button handling
- [ ] Proper lifecycle handling
- [ ] No memory leaks

## 10. Updating the App

### Increment Version

Edit `android/app/build.gradle`:
```gradle
defaultConfig {
    versionCode 2  // Increment for each release
    versionName "1.0.1"  // User-visible version
}
```

### Build and Upload

```bash
# 1. Build React app
npm run build

# 2. Sync to Android
npm run sync:android

# 3. Build new AAB
cd android && ./gradlew bundleRelease

# 4. Upload to Play Console (Production or Testing track)
```

## 11. Common Issues and Solutions

### Issue: Network Security Error
**Solution**: Ensure all API calls use HTTPS and network_security_config.xml is properly configured.

### Issue: Keystore not found
**Solution**: Check keystore.properties file path and verify keystore file exists.

### Issue: Push notifications not working
**Solution**: 
- Verify google-services.json is in android/app/
- Check Firebase project configuration
- Ensure FCM token is being sent to backend

### Issue: App crashes on startup
**Solution**: 
- Check Capacitor plugins are installed
- Run `npx cap sync android`
- Check Android Studio Logcat for errors

### Issue: White screen on launch
**Solution**: 
- Verify dist folder contains built files
- Check capacitor.config.json webDir is "dist"
- Run `npm run build` before syncing

## 12. Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)

## Support

For issues specific to BFS App:
1. Check application logs in Android Studio
2. Verify environment variables are set correctly
3. Test API endpoints separately
4. Contact development team

---

**Last Updated**: January 2026
**Version**: 1.0
**Maintained by**: BFS Development Team
