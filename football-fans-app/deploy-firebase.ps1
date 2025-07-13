Write-Host "Deploying Firebase Firestore Rules..." -ForegroundColor Green
Write-Host ""

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version 2>$null
    Write-Host "Firebase CLI version: $firebaseVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Firebase CLI" -ForegroundColor Red
        Read-Host "Press Enter to continue"
        exit 1
    }
}

# Login to Firebase
Write-Host "Logging in to Firebase..." -ForegroundColor Yellow
firebase login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to login to Firebase" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

# Deploy Firestore rules
Write-Host "Deploying Firestore rules..." -ForegroundColor Yellow
firebase deploy --only firestore:rules
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to deploy Firestore rules" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "Firebase rules deployed successfully!" -ForegroundColor Green
Write-Host "The app should now work without permission errors." -ForegroundColor Green
Read-Host "Press Enter to continue" 