import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8UsgVIkTss7yZ_fKyDVIoykGELgrMrqA",
  authDomain: "folkvizag-b6830.firebaseapp.com",
  projectId: "folkvizag-b6830",
  storageBucket: "folkvizag-b6830.firebasestorage.app",
  messagingSenderId: "95883020949",
  appId: "1:95883020949:web:343a5294bcad79dd51e99c",
  measurementId: "G-ENQE6EDS0T"
};

// Singleton initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Use long polling to avoid WebChannel assertion crashes with Vite HMR on localhost
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const functions = getFunctions(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
