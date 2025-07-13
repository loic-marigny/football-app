// Firebase configuration for FanZone app
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'XXX',
  authDomain: 'footballconnect-d810b.firebaseapp.com',
  projectId: 'footballconnect-d810b',
  storageBucket: 'footballconnect-d810b.appspot.com',
  messagingSenderId: '260551810739',
  appId: '1:260551810739:web:7de0bebc39e1040fa45ac6',
  measurementId: 'G-GV8T8QMPX7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app; 
