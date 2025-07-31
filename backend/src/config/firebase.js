import admin from 'firebase-admin';
import { config } from './environment.js';

let db, auth, firebaseApp;

try {
  // Check if we have service account credentials
  if (config.firebase.privateKey && config.firebase.clientEmail) {
    const serviceAccount = {
      projectId: config.firebase.projectId,
      privateKey: config.firebase.privateKey.replace(/\\n/g, '\n'),
      clientEmail: config.firebase.clientEmail
    };

    // Initialize Firebase Admin with service account
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: config.firebase.projectId
      });
    }
  } else {
    // Initialize Firebase Admin with default project
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: config.firebase.projectId
      });
    }
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
