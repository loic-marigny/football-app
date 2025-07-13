# Football Fans App ⚽

A modern React Native app for football fans built with Expo Router, featuring match tracking, predictions, news, and more!

## 🚀 **Now Running on Expo SDK 53!**

This app has been successfully upgraded to Expo SDK 53, which includes:
- **React Native 0.79** with React 19
- **New Architecture** enabled by default
- **React Navigation v7** for improved navigation
- **Edge-to-edge layouts** on Android
- **Modern background tasks** with expo-background-task
- **Enhanced performance** and stability

## Features

- 🏠 **Home Screen**: Live match tracking, predictions, and trending topics
- 🔍 **Explore**: Browse leagues, teams, news, and player statistics
- 💰 **Wallet**: Points system with rewards and transactions
- 👤 **Profile**: User profiles with achievements and social features
- 🌙 **Dark Mode**: Complete dark/light theme support
- 📱 **Cross Platform**: Works on iOS, Android, and Web

## Get Started

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### Running the App

#### For Windows Users (PowerShell Execution Policy Issues):

**Option 1: Use Command Prompt (Recommended)**
```cmd
cmd /c "npx expo start"
```

**Option 2: Use Batch Files**
```cmd
# Start development server
start-app.bat

# Or use the interactive menu
run-commands.bat
```

#### For Other Platforms:
```bash
# Start development server
npx expo start

# Start on specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

## 🔧 Troubleshooting

### Common Issues After SDK 53 Upgrade

#### 1. React Navigation Error
If you see "Couldn't register the navigator" error:
```bash
# Clear node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps
```

#### 2. Port Conflicts
If port 8081 is in use:
```bash
npx expo start --port 8082
```

#### 3. React 19 Compatibility Issues
The app uses React 19 with package overrides to ensure compatibility. If you encounter issues:
```bash
# Check for conflicting packages
npm ls react
npm ls react-dom

# Clear cache and reinstall
npm cache clean --force
npm install --legacy-peer-deps
```

#### 4. New Architecture Issues
If you experience crashes or compatibility issues:
- Temporarily disable New Architecture by setting `"newArchEnabled": false` in app.json
- Check third-party libraries for New Architecture compatibility
- Run `npx expo-doctor` to identify incompatible packages

### Development Commands

```bash
# Start development server
npm start

# Start on specific platform
npm run android
npm run ios
npm run web

# Run tests
npm test

# Lint code
npm run lint

# Check for compatibility issues
npx expo-doctor
```

## 📱 Building for Production

```bash
# Build for production
npx expo build:android
npx expo build:ios

# Or using EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

## 🧪 New SDK 53 Features

- **Enhanced Performance**: Prebuilt modules for faster Android builds
- **Better Background Tasks**: Modern APIs for background processing
- **Improved Edge-to-Edge**: Full Android edge-to-edge support
- **React Server Components**: Beta support for server-side rendering
- **New expo-audio**: Stable release replacing expo-av
- **Enhanced TypeScript**: Updated to v5.8.3

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation v7](https://reactnavigation.org/)
- [Expo Router](https://expo.github.io/router/)
- [Expo SDK 53 Changelog](https://expo.dev/changelog/2025-04-30-sdk-53)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Expo team for the amazing SDK 53 release
- React Navigation team for v7 improvements
- Football fans community for inspiration
