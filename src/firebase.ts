// src/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Define the type for Firebase config with index signature
interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  [key: string]: string | undefined; // Add index signature to allow string indexing
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if required Firebase config is available
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;

if (missingKeys.length > 0) {
  console.warn(`Missing required Firebase configuration: ${missingKeys.join(', ')}`);
  console.warn('Firebase analytics will be disabled. Set the missing environment variables for full functionality.');
  
  try {
    // Try to initialize with whatever config we have
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized with partial configuration');
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    // Create a dummy app object to prevent crashes
    app = {} as FirebaseApp;
  }
} else {
  // All required config is available
  app = initializeApp(firebaseConfig);
  
  // Initialize Analytics only if supported and configuration is complete
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.log('Firebase Analytics is not supported in this environment');
    }
  }).catch(error => {
    console.error('Error checking Analytics support:', error);
  });
}

export { app, analytics };