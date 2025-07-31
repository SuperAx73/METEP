import admin from 'firebase-admin';
import { config } from './environment.js';

let db, auth, firebaseApp;

// Validate required Firebase configuration
if (!config.firebase.projectId || !config.firebase.privateKey || !config.firebase.clientEmail) {
  console.warn('🚧 Firebase configuration is incomplete. Please check your environment variables.');
  console.warn('Required: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
  
  // Create mock implementations for development
  const mockDb = {
    collection: () => ({
      add: () => Promise.resolve({ id: 'mock-id' }),
      doc: () => ({
        get: () => Promise.resolve({ exists: false }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      }),
      where: () => ({
        get: () => Promise.resolve({ docs: [] })
      }),
      get: () => Promise.resolve({ docs: [] })
    })
  };

  const mockAuth = {
    verifyIdToken: () => Promise.resolve({ uid: 'mock-uid', email: 'test@test.com' })
  };

  db = mockDb;
  auth = mockAuth;
  firebaseApp = null;
} else {
  const serviceAccount = {
    projectId: config.firebase.projectId,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.startsWith('"')
      ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
      : config.firebase.privateKey?.replace(/\\n/gm, "\n")
    clientEmail: config.firebase.clientEmail
  };

  // Initialize Firebase Admin
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: config.firebase.projectId
    });
  }

  db = admin.firestore();
  auth = admin.auth();
  firebaseApp = admin;
}

export { db, auth };
export default firebaseApp;
