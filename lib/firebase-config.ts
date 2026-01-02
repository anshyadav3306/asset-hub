import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDh1bl5moA8jDu8OqGaTzwaIXrH6m0BnHI",
  authDomain: "asset-management-system-70cbb.firebaseapp.com",
  projectId: "asset-management-system-70cbb",
  storageBucket: "asset-management-system-70cbb.firebasestorage.app",
  messagingSenderId: "241274588118",
  appId: "1:241274588118:web:47e889cfa9100212973277",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }
