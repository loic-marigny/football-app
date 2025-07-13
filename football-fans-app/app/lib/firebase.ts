// Firebase configuration for FanZone app
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'XXX',
  authDomain: 'XXX',
  projectId: 'XXX',
  storageBucket: 'XXX',
  messagingSenderId: 'XXX',
  appId: 'XXX',
  measurementId: 'XXX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app; 
