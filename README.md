# Retro Arcade 8-Bit Collection

A collection of classic Apple IIe-style games for mobile devices, featuring authentic retro aesthetics with modern mobile controls.

## Features

### Games Included

1. **Lode Runner** - Classic platformer where you collect gold while avoiding enemies
2. **Oregon Trail** - Journey across America in 1848, managing resources and making crucial decisions
3. **Carmen Sandiego** - Detective adventure game where you track down thieves around the world

### Authentic Retro Experience

- **Apple IIe Color Palette** - 6-color authentic retro graphics
- **CRT Screen Effects** - Scanlines and vintage monitor aesthetics
- **Pixel-Perfect Graphics** - 8-bit style visuals scaled for modern displays
- **Chiptune Audio** - Retro sound effects and background music

### Mobile-Optimized Features

- **Virtual Controls** - Responsive touch joystick and action buttons
- **Haptic Feedback** - Physical feedback for button presses
- **Portrait & Landscape** - Supports both orientations
- **Data Persistence** - Saves high scores and game progress
- **Settings** - Customizable sound, music, haptics, and CRT effects

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo AV** for audio
- **AsyncStorage** for data persistence
- **React Native SVG** for graphics
- **Expo Haptics** for tactile feedback

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- For iOS: macOS with Xcode
- For Android: Android Studio

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd retro-arcade

# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web
```

### Development in Termux

This project is fully compatible with Termux on Android:

```bash
# Install Node.js in Termux
pkg install nodejs-lts

# Install dependencies
npm install

# Start Expo
npm start
```

## Building for Production

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure your project
eas build:configure

# Build for Android (APK)
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios --profile production

# Build for both platforms
eas build --platform all
```

### Local Builds

#### Android APK
```bash
# Build APK locally
npx expo run:android --variant release
```

#### iOS (requires macOS)
```bash
# Build for iOS
npx expo run:ios --configuration Release
```

## Project Structure

```
retro-arcade/
├── App.tsx                    # Main app entry point
├── app.json                   # Expo configuration
├── eas.json                   # EAS Build configuration
├── package.json
├── assets/                    # Images, fonts, sounds
│   ├── sprites/
│   ├── sounds/
│   ├── music/
│   └── fonts/
└── src/
    ├── components/           # Reusable components
    │   ├── VirtualJoystick.tsx
    │   ├── ActionButtons.tsx
    │   └── CRTEffect.tsx
    ├── screens/              # App screens
    │   ├── MainMenu.tsx
    │   ├── SettingsScreen.tsx
    │   └── HighScoresScreen.tsx
    ├── games/                # Game implementations
    │   ├── LodeRunnerGame.tsx
    │   ├── OregonTrailGame.tsx
    │   └── CarmenSandiegoGame.tsx
    ├── engine/               # Game engine
    │   ├── GameLoop.ts
    │   ├── Physics.ts
    │   ├── CollisionDetection.ts
    │   └── SpriteManager.ts
    ├── utils/                # Utilities
    │   ├── Storage.ts
    │   └── SoundManager.ts
    └── constants/            # Constants and config
        ├── Colors.ts
        ├── GameConstants.ts
        └── Levels.ts
```

## Game Controls

### Lode Runner
- **Joystick**: Move player (left, right, up/down ladders)
- **Button A**: Jump
- **Button B**: Dig hole

### Oregon Trail
- Touch-based menu navigation
- Make decisions via button selections

### Carmen Sandiego
- Touch-based menu navigation
- Investigate locations and follow clues
- Make arrest decisions

## Configuration

### App Configuration (`app.json`)

Update the following for your build:

- `name`: Your app name
- `slug`: URL-friendly identifier
- `version`: Version number
- `bundleIdentifier` (iOS): `com.yourcompany.yourapp`
- `package` (Android): `com.yourcompany.yourapp`

### EAS Build Configuration (`eas.json`)

The project includes three build profiles:

- **development**: For testing with development client
- **preview**: Internal distribution (APK)
- **production**: Production builds for app stores

## Publishing to App Stores

### Google Play Store

1. Build production APK/AAB:
   ```bash
   eas build --platform android --profile production
   ```

2. Create developer account at https://play.google.com/console

3. Upload APK/AAB and fill out store listing

4. Submit for review

### Apple App Store

1. Build production IPA:
   ```bash
   eas build --platform ios --profile production
   ```

2. Create developer account at https://developer.apple.com

3. Use EAS Submit or upload via App Store Connect

4. Fill out app information and submit for review

## Monetization (Future)

The app is ready for AdMob integration:

- Banner ads placement prepared
- Interstitial ads between levels
- Rewarded video ads for extra lives

To integrate AdMob:
1. Install `react-native-google-mobile-ads`
2. Configure AdMob account
3. Add ad units to the code

## Assets

### Required Assets

The following assets need to be created/sourced:

- **App Icon**: 1024x1024px PNG
- **Splash Screen**: 2048x2048px PNG
- **Sound Effects**: Jump, collect, die, menu sounds
- **Background Music**: Chiptune tracks for menu and gameplay
- **Sprite Sheets**: Character and enemy sprites

### Asset Guidelines

- Use 8-bit style graphics
- Stick to Apple IIe color palette
- Sound effects should be retro/chiptune style
- Keep file sizes small for mobile

## Performance

- Target 60 FPS gameplay
- Optimized collision detection
- Efficient sprite rendering
- Minimal memory footprint
- Fast app startup

## Future Enhancements

- Additional classic games (Karateka, Prince of Persia)
- Online leaderboards
- Multiplayer support
- More levels for existing games
- Cloud save sync
- Achievement system
- Daily challenges

## Troubleshooting

### Build Issues

**Error: Cannot find module**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Android build fails**
```bash
# Clear Android build cache
cd android && ./gradlew clean
cd .. && npm run android
```

**iOS build fails**
```bash
# Reinstall pods
cd ios && pod install
cd .. && npm run ios
```

### Runtime Issues

**App crashes on startup**
- Check console for errors
- Ensure all dependencies are installed
- Verify app.json configuration

**Controls not responding**
- Check haptic permissions
- Verify touch event handlers
- Test on physical device

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by classic Apple IIe games
- Oregon Trail - Original by MECC
- Carmen Sandiego - Original by Broderbund
- Lode Runner - Original by Broderbund

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [your-email]

## Version History

### v1.0.0 (Current)
- Initial release
- Three classic games included
- Full mobile controls
- Settings and high scores
- Retro CRT effects

---

Built with ❤️ for retro gaming enthusiasts
