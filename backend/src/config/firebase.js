import admin from 'firebase-admin';
import { config } from './environment.js';

let db, auth, firebaseApp;

try {
  // Debug: Log environment variables
  console.log('🔍 Debug Firebase config:');
  console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
  console.log('- FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Missing');
  console.log('- FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing');
  console.log('- Config projectId:', config.firebase.projectId);
  console.log('- Config privateKey:', config.firebase.privateKey ? 'Present' : 'Missing');
  console.log('- Config clientEmail:', config.firebase.clientEmail);

  // Check if we have service account credentials
  if (config.firebase.privateKey && config.firebase.clientEmail) {
    console.log('🔄 Initializing Firebase with service account credentials');
    
    const serviceAccount = {
      projectId: config.firebase.projectId || 'microparos-70a6b',
      privateKey: config.firebase.privateKey.replace(/\\n/g, '\n'),
      clientEmail: config.firebase.clientEmail
    };

    console.log('🔍 Service account config:', {
      projectId: serviceAccount.projectId,
      clientEmail: serviceAccount.clientEmail,
      privateKeyLength: serviceAccount.privateKey.length
    });

    // Initialize Firebase Admin with service account
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.projectId
      });
    }
  } else {
    console.log('🔄 Initializing Firebase with default credentials');
    
    // Initialize Firebase Admin with default project
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: config.firebase.projectId || 'microparos-70a6b'
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
