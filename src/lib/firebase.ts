
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Analytics } from "firebase/analytics";

// Firebase configuration will be loaded from environment variables
// Ensure these are set in .env.local for local development
// and in hosting provider's environment variable settings for production.
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
// };

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;

// Hardcode to false as Firebase is being removed for now
const isFirebaseConfigured = false;

if (typeof window !== "undefined") {
  if (isFirebaseConfigured) {
    // This block will not execute with isFirebaseConfigured = false
    // import { initializeApp, getApps } from 'firebase/app';
    // import { getAuth } from 'firebase/auth';
    // import { getFirestore } from 'firebase/firestore';
    // import { getAnalytics as getFirebaseAnalytics, isSupported } from "firebase/analytics"; // Renamed to avoid conflict

    // const firebaseConfigReal = {
    //   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    //   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    //   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    //   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    //   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    //   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    //   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    // };

    // if (getApps().length === 0) {
    //   app = initializeApp(firebaseConfigReal);
    //   auth = getAuth(app);
    //   db = getFirestore(app);
    //   isSupported().then((supported) => {
    //     if (supported && firebaseConfigReal.measurementId) {
    //       analytics = getFirebaseAnalytics(app);
    //     }
    //   });
    // } else {
    //   app = getApps()[0];
    //   auth = getAuth(app);
    //   db = getFirestore(app);
    //   isSupported().then((supported) => {
    //     if (supported && firebaseConfigReal.measurementId) {
    //       try {
    //         analytics = getFirebaseAnalytics(app);
    //       } catch (error) {
    //         console.warn("Could not get Analytics instance, it might not have been initialized or config is missing:", error);
    //       }
    //     }
    //   });
    // }
  } else {
    console.warn(
      "Firebase integration is currently disabled. Authentication and Firestore features will not be available."
    );
    // Provide mock/empty objects if Firebase is not configured to prevent app crashes
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
    analytics = undefined;
  }
} else {
  // Server-side rendering or non-browser environments
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
  analytics = undefined;
}

export { app, auth, db, analytics, isFirebaseConfigured };
