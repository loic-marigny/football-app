@echo off
echo Football Fans App - Run Commands
echo ==================================
echo 1. Start development server
echo 2. Run on Android
echo 3. Run on iOS
echo 4. Run on Web
echo 5. Clear cache and start
echo ==================================
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo Starting development server...
    npx expo start
) else if "%choice%"=="2" (
    echo Starting on Android...
    npx expo start --android
) else if "%choice%"=="3" (
    echo Starting on iOS...
    npx expo start --ios
) else if "%choice%"=="4" (
    echo Starting on Web...
    npx expo start --web
) else if "%choice%"=="5" (
    echo Clearing cache and starting...
    npx expo start --clear
) else (
    echo Invalid choice. Please run the script again.
)

pause 