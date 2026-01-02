# Firebase Setup Guide

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "asset-management-system")
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Register Web App
1. In your Firebase project, click the web icon (</>) to add a web app
2. Register app with a nickname (e.g., "Asset Manager")
3. Don't enable Firebase Hosting (we're using Vercel)
4. Copy the firebaseConfig object

## Step 3: Configure Environment Variables
1. Open `.env.local` file in your project
2. Replace the placeholder values with your Firebase config:
   - `NEXT_PUBLIC_FIREBASE_API_KEY` → apiKey
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` → authDomain
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` → projectId
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` → storageBucket
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` → messagingSenderId
   - `NEXT_PUBLIC_FIREBASE_APP_ID` → appId

## Step 4: Create Firestore Database
1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to your users
5. Click "Enable"

## Step 5: Set Firestore Rules (Important!)
1. Go to "Firestore Database" → "Rules" tab
2. For development, use these rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /assets/{assetId} {
      allow read, write: if true;  // Change this for production!
    }
  }
}
```
3. For production, implement proper authentication rules

## Step 6: Install Dependencies
```bash
npm install
```

## Step 7: Run the App
```bash
npm run dev
```

## Architecture Notes (For Your Instructor)
- **Loosely Coupled Design**: All Firebase calls are isolated in `lib/api.ts`
- **Easy to Swap**: Change `export const api = assetApi` to `export const api = mockApi` to switch backends
- **Separation**: Frontend components don't know about Firebase, they only call generic API methods
- **Testing**: Use mockApi for unit tests without Firebase dependency

## Switching Backends Later
To replace Firebase with another backend:
1. Keep the same interface in `lib/api.ts`
2. Replace the implementation inside each function
3. No changes needed to components!
