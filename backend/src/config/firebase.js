import admin from 'firebase-admin';
import { config } from './environment.js';

let db, auth, firebaseApp;

try {
  // Initialize Firebase Admin with project ID
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: config.firebase.projectId || 'microparos-70a6b'
    });
  }

  db = admin.firestore();
  auth = admin.auth();
  firebaseApp = admin;
  
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('🚨 Error initializing Firebase Admin SDK:', error);
  throw error;
}

export { db, auth };
export default firebaseApp;
