import dotenv from 'dotenv';

dotenv.config();

// Debug: Log environment variables
console.log('🔍 Debug Environment config:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('- FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'Present' : 'Missing');
console.log('- FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  },
  cors: {
    origin: process.env.FRONTEND_URL || [
      'http://localhost:5173',
      'https://metep-git-actualizaciones-axiels-projects.vercel.app',
      'https://metep.vercel.app',
      'https://metep-git-main-axiels-projects.vercel.app'
    ]
  }
};

console.log('🔍 Final config:', {
  nodeEnv: config.nodeEnv,
  firebaseProjectId: config.firebase.projectId,
  firebasePrivateKey: config.firebase.privateKey ? 'Present' : 'Missing',
  firebaseClientEmail: config.firebase.clientEmail
});