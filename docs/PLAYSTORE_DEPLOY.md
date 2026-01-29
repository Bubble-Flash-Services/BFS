# Deploy to Google Play Store

Complete guide to build a signed Android App Bundle (AAB) and deploy to Google Play Store.

---

## Prerequisites

Before deploying, ensure:
- [x] App runs successfully in Android Studio
- [x] All features tested and working
- [x] Backend API is live and accessible
- [x] You have a Google Play Console account ($25 one-time fee)

---

## Part 1: Prepare Your App

### Step 1: Update App Configuration

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.bubbleflashservices.bfsapp"
        minSdk 22
        targetSdk 34
        versionCode 1          // Increment for each release: 1, 2, 3...
        versionName "1.0.0"    // User-visible version
    }
}
```

**Important**: 
- `versionCode`: Increment by 1 for every Play Store update (1, 2, 3, 4...)
- `versionName`: Semantic version for users (1.0.0, 1.0.1, 1.1.0...)

### Step 2: Update App Name and Icon

**App Name** - Edit `android/app/src/main/res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">BFSApp</string>
    <string name="title_activity_main">BFSApp</string>
</resources>
```

**App Icon** - Replace default launcher icons:
1. Open Android Studio
2. Right-click `res` folder
3. Select **New > Image Asset**
4. Choose **Launcher Icons**
5. Upload your BFS logo (512x512 PNG)
6. Click **Next** then **Finish**

This replaces all `ic_launcher.png` files in `mipmap-*` folders.

### Step 3: Update Backend URL (Production)

Edit `capacitor.config.json`:
```json
{
  "server": {
    "url": "https://your-production-backend.com",
    "cleartext": false,
    "androidScheme": "https"
  }
}
```

Then sync:
```bash
npm run sync:android
```

---

## Part 2: Generate Signing Key

### What is a Signing Key?

Every Android app must be digitally signed. The signing key:
- Proves you're the legitimate developer
- Required for Play Store uploads
- **Cannot be changed** - keep it safe forever!

### Generate Keystore File

Run this command (replace with your details):

```bash
keytool -genkey -v -keystore android/app/keystore/bfs-release-key.jks \
  -alias bfsapp-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**You'll be prompted for**:
- Keystore password (choose strong password)
- Key password (can be same as keystore password)
- Your name
- Organization name (BubbleFlashServices)
- City, State, Country

**Example**:
```
Enter keystore password: MyStr0ngP@ssword123
Re-enter new password: MyStr0ngP@ssword123
What is your first and last name? John Doe
What is the name of your organizational unit? Engineering
What is the name of your organization? BubbleFlashServices
What is the name of your City or Locality? Bangalore
What is the name of your State or Province? Karnataka
What is the two-letter country code for this unit? IN
Is CN=John Doe, OU=Engineering, O=BubbleFlashServices, L=Bangalore, ST=Karnataka, C=IN correct? yes

Enter key password for <bfsapp-key>
        (RETURN if same as keystore password): [Press Enter]
```

**Output**: File created at `android/app/keystore/bfs-release-key.jks`

### ⚠️ CRITICAL - Backup Your Keystore

**IMMEDIATELY backup these**:
1. Keystore file: `bfs-release-key.jks`
2. Keystore password
3. Key alias: `bfsapp-key`
4. Key password

**Store in**:
- Password manager (1Password, LastPass)
- Encrypted cloud storage (Google Drive, Dropbox)
- External hard drive
- Keep 3 separate copies!

**Why?** If you lose this keystore:
- ❌ You can NEVER update your app on Play Store
- ❌ You must create a new app with new package name
- ❌ All your users must reinstall
- ❌ You lose all reviews and ratings

---

## Part 3: Configure Signing

### Create keystore.properties File

Create `android/keystore.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=bfsapp-key
storeFile=keystore/bfs-release-key.jks
```

**Security**:
```bash
# Add to .gitignore (already done)
echo "android/keystore.properties" >> .gitignore
echo "android/app/keystore/" >> .gitignore
```

**Never commit this file to git!**

### Update build.gradle

Edit `android/app/build.gradle`:

Add at the top (before `android {`):
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

---

## Part 4: Build Signed AAB

### Build via Command Line (Recommended)

```bash
cd android
./gradlew bundleRelease
```

**Output location**:
```
android/app/build/outputs/bundle/release/app-release.aab
```

**Build time**: 2-5 minutes

### Build via Android Studio (Alternative)

1. Open project in Android Studio
2. Go to **Build > Generate Signed Bundle / APK**
3. Select **Android App Bundle**
4. Click **Next**
5. Enter keystore details:
   - Key store path: `android/app/keystore/bfs-release-key.jks`
   - Key store password
   - Key alias: `bfsapp-key`
   - Key password
6. Click **Next**
7. Select **release** build variant
8. Click **Finish**

**Output**: Same location as command line

---

## Part 5: Test the AAB

### Install on Device (Optional)

AAB files cannot be directly installed. To test:

1. **Build APK for testing**:
```bash
cd android
./gradlew assembleRelease
```

2. **Install APK**:
```bash
adb install app/build/outputs/apk/release/app-release.apk
```

3. **Test thoroughly**:
- [ ] App launches
- [ ] Login works
- [ ] All screens load
- [ ] API calls succeed
- [ ] No crashes
- [ ] Performance is good

---

## Part 6: Create Play Console Account

### Sign Up

1. Go to [Google Play Console](https://play.google.com/console)
2. Sign in with Google account
3. Accept developer agreement
4. Pay $25 one-time registration fee
5. Complete account details

---

## Part 7: Create App in Play Console

### Create New App

1. Click **Create app**
2. Fill in details:
   - **App name**: BFSApp
   - **Default language**: English (United States)
   - **App or Game**: App
   - **Free or Paid**: Free
3. Accept declarations
4. Click **Create app**

### Set Up App

You'll see a dashboard with tasks to complete:

---

## Part 8: Upload AAB

### Internal Testing (Recommended First)

1. Go to **Testing > Internal testing**
2. Click **Create new release**
3. Click **Upload** and select your AAB file:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```
4. Release name: `1.0.0` (matches versionName)
5. Release notes:
   ```
   Initial release of BFS mobile app
   - Order management
   - Service booking
   - Real-time updates
   - Push notifications
   ```
6. Click **Save**
7. Click **Review release**
8. Click **Start rollout to Internal testing**

### Add Testers

1. Go to **Testers** tab
2. Click **Create email list**
3. Add tester emails (team members)
4. Save

Testers will receive an email with download link.

### Production Release (After Testing)

Once internal testing is complete:

1. Go to **Production**
2. Click **Create new release**
3. Click **Upload** (same AAB or updated one)
4. Fill in release notes
5. Click **Review release**
6. Click **Start rollout to Production**

**Note**: First production release requires completing all store listing tasks.

---

## Part 9: Complete Store Listing

### App Details

**Category**: Business or Lifestyle

**Tags**: Services, Booking, Local Services

### Store Listing

1. **Short description** (80 chars max):
   ```
   Book services easily - Car wash, cleaning, repairs & more. Fast & reliable!
   ```

2. **Full description** (4000 chars max):
   ```
   BubbleFlashServices (BFS) - Your one-stop app for all home and vehicle services!

   🚗 VEHICLE SERVICES
   - Car & Bike Wash
   - Vehicle Checkup
   - Auto Repairs
   - Accessories

   🏠 HOME SERVICES
   - House Cleaning
   - Green Cleaning
   - Painting
   - Movers & Packers

   ⚡ KEY FEATURES
   - Easy booking in 3 taps
   - Real-time order tracking
   - Multiple payment options
   - Verified service providers
   - 24/7 customer support
   
   Download now and get your first service at special rates!
   ```

### Graphics (Required)

Upload these assets:

1. **App icon**: 512x512 PNG (already created)
2. **Feature graphic**: 1024x500 PNG/JPG
   - Create a banner with BFS logo and tagline
3. **Phone screenshots**: At least 2
   - Take screenshots from your app (different screens)
   - Recommended: 6-8 screenshots
4. **Tablet screenshots**: At least 2 (optional but recommended)

**Quick way to get screenshots**:
- Run app on device
- Navigate to different screens
- Press Power + Volume Down to capture
- Transfer to computer via USB

### Contact Details

- **Email**: support@bubbleflashservices.com
- **Phone**: Your support number (optional)
- **Website**: https://bubbleflashservices.com (if you have)

---

## Part 10: Privacy Policy

### Required by Play Store

Create a simple privacy policy page and host it (free options):

**Option 1: GitHub Pages**
1. Create file: `privacy-policy.html`
2. Enable GitHub Pages in repository settings
3. URL: `https://yourusername.github.io/BFS/privacy-policy.html`

**Option 2: Firebase Hosting** (free)

**Minimum content**:
```
Privacy Policy for BFSApp

We collect:
- Name, email, phone for account creation
- Location for service delivery
- Payment information (processed securely)

We use this data to:
- Provide booking services
- Send order updates
- Process payments
- Customer support

We do not:
- Sell your data
- Share with third parties (except payment providers)

Contact: support@bubbleflashservices.com
```

Add URL in Play Console: **Policy > App content > Privacy policy**

---

## Part 11: Content Rating

1. Go to **Policy > App content > Content rating**
2. Fill out questionnaire:
   - Does app contain violence? **No**
   - Does app contain sexual content? **No**
   - Does app contain language? **No**
   - Is app a news app? **No**
3. Submit
4. Receive rating (likely Everyone or Everyone 10+)

---

## Part 12: Target Audience

1. Go to **Policy > App content > Target audience**
2. Select age groups: **18+** (if booking requires 18+)
3. Submit

---

## Part 13: Data Safety

1. Go to **Policy > App content > Data safety**
2. Answer questions about data collection:
   - Collect location? **Yes** (for service delivery)
   - Collect personal info? **Yes** (name, email, phone)
   - Collect financial info? **Yes** (payment details)
3. Describe how data is secured
4. Submit

---

## Part 14: Review and Publish

### Pre-Launch Checklist

- [x] App builds successfully
- [x] Tested on multiple devices
- [x] AAB uploaded
- [x] Store listing complete
- [x] Screenshots uploaded
- [x] Privacy policy URL added
- [x] Content rating received
- [x] Data safety form completed
- [x] All policy sections completed

### Submit for Review

1. Go to **Production** (or **Internal testing**)
2. All items should have green checkmarks
3. Click **Review and publish**
4. Review summary
5. Click **Publish to production**

### Review Process

- **Time**: 1-7 days (usually 2-3 days)
- **Status**: Check Publishing overview page
- **Notifications**: You'll receive email updates

**Possible outcomes**:
- ✅ **Approved**: App goes live!
- ❌ **Rejected**: Fix issues and resubmit

---

## Part 15: Updating Your App

### For Each Update

1. **Update version** in `android/app/build.gradle`:
   ```gradle
   versionCode 2        // Increment by 1
   versionName "1.0.1"  // Update version
   ```

2. **Build new AAB**:
   ```bash
   npm run build
   npm run sync:android
   cd android && ./gradlew bundleRelease
   ```

3. **Upload to Play Console**:
   - Go to Production
   - Create new release
   - Upload new AAB
   - Add release notes
   - Publish

### Version Numbering

- **Patch** (bug fixes): 1.0.0 → 1.0.1
- **Minor** (new features): 1.0.1 → 1.1.0
- **Major** (breaking changes): 1.1.0 → 2.0.0

---

## Troubleshooting

### Error: "Upload failed - duplicate version"
**Solution**: Increment `versionCode` in build.gradle

### Error: "Signing key mismatch"
**Solution**: You're using wrong keystore. Use original keystore.

### Error: "Missing privacy policy"
**Solution**: Add privacy policy URL in App content section

### Error: "Content rating required"
**Solution**: Complete content rating questionnaire

### App rejected for "Policy violation"
**Solution**: Review rejection email, fix issues, resubmit

---

## Quick Reference

### Essential Files
- **AAB**: `android/app/build/outputs/bundle/release/app-release.aab`
- **Keystore**: `android/app/keystore/bfs-release-key.jks`
- **Config**: `android/keystore.properties`
- **Version**: `android/app/build.gradle`

### Essential Commands
```bash
# Build signed AAB
cd android && ./gradlew bundleRelease

# Build for testing
cd android && ./gradlew assembleRelease

# Clean build
cd android && ./gradlew clean
```

### Checklist for Each Release
- [ ] Update versionCode and versionName
- [ ] Build and test locally
- [ ] Build signed AAB
- [ ] Test AAB on devices
- [ ] Upload to Play Console
- [ ] Add release notes
- [ ] Submit for review

---

## Support

- **Play Console Help**: https://support.google.com/googleplay/android-developer
- **Android Developer Guide**: https://developer.android.com/distribute/play-console
- **BFS Support**: support@bubbleflashservices.com

---

**Congratulations!** Your app is now on Google Play Store! 🎉

Monitor your app's performance in Play Console:
- User ratings and reviews
- Crash reports
- Installation statistics
- User feedback

Respond to user reviews and keep your app updated regularly!
