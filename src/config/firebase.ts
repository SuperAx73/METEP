import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración directa con credenciales reales
const firebaseConfig = {
  apiKey: "AIzaSyDVNI60P1CurCz2Z7uxTrv0gtGFrRjKj5E",
  authDomain: "microparos-70a6b.firebaseapp.com",
  projectId: "microparos-70a6b",
  storageBucket: "microparos-70a6b.appspot.com",
  messagingSenderId: "836038704396",
  appId: "1:836038704396:web:36b9d0d7516877ee9a9d29"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;