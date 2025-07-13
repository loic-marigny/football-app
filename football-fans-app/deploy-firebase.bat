@echo off
echo Deploying Firebase Firestore Rules...
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Firebase CLI not found. Installing...
    npm install -g firebase-tools
    if %errorlevel% neq 0 (
        echo Failed to install Firebase CLI
        pause
        exit /b 1
    )
)

REM Login to Firebase
echo Logging in to Firebase...
firebase login
if %errorlevel% neq 0 (
    echo Failed to login to Firebase
    pause
    exit /b 1
)

REM Deploy Firestore rules
echo Deploying Firestore rules...
firebase deploy --only firestore:rules
if %errorlevel% neq 0 (
    echo Failed to deploy Firestore rules
    pause
    exit /b 1
)

echo.
echo Firebase rules deployed successfully!
echo The app should now work without permission errors.
pause 