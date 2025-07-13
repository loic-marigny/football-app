# Firebase Setup Guide

## Current Issues
The app is experiencing Firebase permission errors because:
1. Firestore security rules are too restrictive
2. Firebase project may not be properly configured

## Quick Fix Steps

### Option 1: Use the Provided Scripts (Recommended)
```bash
# For Windows Command Prompt
deploy-firebase.bat

# For Windows PowerShell
.\deploy-firebase.ps1
```

### Option 2: Manual Deployment
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy the security rules
firebase deploy --only firestore:rules
```

### 2. Alternative: Use Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `footballconnect-d810b`
3. Go to Firestore Database → Rules
4. Replace the existing rules with the content from `firestore.rules`
5. Click "Publish"

### 3. Enable Authentication Methods
1. In Firebase Console, go to Authentication → Sign-in method
2. Enable Email/Password authentication
3. Optionally enable Google, Facebook, or other providers

### 4. Create Firestore Database
1. In Firebase Console, go to Firestore Database
2. Click "Create Database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

## Testing the Fix
After deploying the rules, the app should work without permission errors. The security rules allow:
- Users to read/write their own profiles
- Authenticated users to read other user profiles
- Authenticated users to create/read posts and comments
- Public read access to competitions and teams

## Production Considerations
For production, you may want to:
1. Add more specific validation rules
2. Implement rate limiting
3. Add admin-only collections
4. Set up proper indexes for queries

## Troubleshooting
If you still get permission errors:
1. Check that you're logged in to Firebase CLI with the correct account
2. Verify the project ID in `firebase.json` matches your Firebase project
3. Ensure the database exists and is in the correct region
4. Check that authentication is properly enabled 