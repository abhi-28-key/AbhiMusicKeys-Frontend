import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// Using environment variables for better security
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAmjUl-SMulUAAbsbz7TdmMutEmD0ywjso",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "abhimusickeys.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "abhimusickeys",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "abhimusickeys.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "919559366819",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:919559366819:web:1d1582c167cc989cbab716"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 