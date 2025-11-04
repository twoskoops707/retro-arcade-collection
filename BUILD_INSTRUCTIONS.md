# How to Build APK

Due to Termux limitations with interactive terminal prompts, the build must be triggered from the Expo web dashboard or GitHub Actions.

## ✅ Setup Complete

- ✅ EAS Project configured: `aa22c36e-9b08-4db3-b675-b3ca0213dc7a`
- ✅ GitHub repository connected: https://github.com/twoskoops707/retro-arcade-collection
- ✅ Build configuration ready (eas.json)
- ✅ GitHub Actions workflow created

## 🚀 Option 1: Build from Expo Dashboard (EASIEST)

### Step 1: Open Project Dashboard
Visit: **https://expo.dev/accounts/twskoops/projects/retro-arcade**

### Step 2: Start Build
1. Click **"Builds"** in the left sidebar
2. Click **"Create a build"** button (top right)
3. Select:
   - **Platform**: Android
   - **Profile**: preview
4. Click **"Create build"**

### Step 3: Configure Credentials
When prompted about Android Keystore:
- Select **"Generate new keystore"**
- Click **"Next"** / **"Continue"**

### Step 4: Monitor Build
- Build will start automatically on EAS servers (using GitHub Actions)
- Takes approximately 10-20 minutes
- You'll see real-time logs in the dashboard

### Step 5: Download APK
Once complete:
- Click **"Download"** button next to the build
- Or use CLI: `eas build:list --platform android`
- Install APK on any Android device

## 🔧 Option 2: Build via GitHub Actions

### Step 1: Create Expo Access Token
1. Visit: https://expo.dev/accounts/twskoops/settings/access-tokens
2. Click **"Create token"**
3. Name it: `GITHUB_ACTIONS`
4. Copy the token (you won't see it again!)

### Step 2: Add Token to GitHub
1. Go to: https://github.com/twoskoops707/retro-arcade-collection/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `EXPO_TOKEN`
4. Value: Paste the token from Step 1
5. Click **"Add secret"**

### Step 3: Trigger Build
1. Go to: https://github.com/twoskoops707/retro-arcade-collection/actions
2. Click **"EAS Build"** workflow (left sidebar)
3. Click **"Run workflow"** (right side)
4. Select:
   - Platform: **android**
   - Profile: **preview**
5. Click **"Run workflow"**

### Step 4: Monitor & Download
- Build runs on GitHub Actions runners
- Click on the running workflow to see logs
- When complete, download APK from Expo dashboard or CLI

## 📱 Option 3: Build from CLI (if TTY works)

If you have a proper interactive terminal:

```bash
cd /data/data/com.termux/files/home/project/retro-arcade
eas build --platform android --profile preview
```

When prompted:
- Generate new keystore: **Yes**
- Wait for build to complete
- Download APK from provided link

## 🔍 Check Build Status

From CLI:
```bash
eas build:list --platform android --limit 5
```

From web:
https://expo.dev/accounts/twskoops/projects/retro-arcade/builds

## 📥 Download APK

### From CLI:
```bash
# List builds and get URL
eas build:list --platform android --limit 1

# Download specific build
eas build:download --id BUILD_ID
```

### From Web:
1. Go to builds page
2. Click download icon next to completed build
3. Transfer APK to Android device
4. Enable "Install from unknown sources"
5. Install and enjoy!

## 🎮 Build Profiles

### Preview (Recommended for Testing)
- **Profile**: `preview`
- **Type**: APK (easy install)
- **Distribution**: Internal
- **Size**: ~30-50 MB

### Production (For App Stores)
- **Profile**: `production`
- **Type**: AAB (Google Play)
- **Distribution**: Store
- **Size**: Optimized

## ⏱️ Build Time

- **First build**: 15-25 minutes (generates credentials)
- **Subsequent builds**: 10-15 minutes
- Builds run on EAS cloud infrastructure (GitHub Actions)

## 🐛 Troubleshooting

### "Keystore generation failed"
- Use Expo web dashboard (Option 1)
- It handles credential generation through browser

### "Build timed out"
- Check GitHub Actions quota
- Free tier: 2000 minutes/month

### "Cannot find module"
- Run `npm install` locally first
- Commit and push changes

## 📞 Support

- **Expo Dashboard**: https://expo.dev/accounts/twskoops/projects/retro-arcade
- **GitHub Repo**: https://github.com/twoskoops707/retro-arcade-collection
- **EAS Build Docs**: https://docs.expo.dev/build/introduction/

---

## 🎯 Quick Start (TL;DR)

1. Open: https://expo.dev/accounts/twskoops/projects/retro-arcade
2. Click: **Builds** → **Create a build**
3. Select: **Android** + **preview** profile
4. Generate keystore when prompted
5. Wait 15 minutes
6. Download APK and install!

**That's it!** The build runs on GitHub/EAS servers, not locally.
