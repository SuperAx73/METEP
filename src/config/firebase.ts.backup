import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validate Firebase configuration
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

if (!apiKey || apiKey === 'your-api-key') {
  throw new Error('Firebase API Key is missing or invalid. Please check your .env file and ensure VITE_FIREBASE_API_KEY is set to your actual Firebase Web API Key from the Firebase Console.');
}

if (!authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
  throw new Error('Firebase configuration is incomplete. Please check your .env file and ensure all Firebase environment variables are properly set.');
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;