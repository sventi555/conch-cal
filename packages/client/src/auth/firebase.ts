import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth as firebaseGetAuth } from 'firebase/auth';

const config: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(config);

export const getAuth = () => {
  const auth = firebaseGetAuth(app);
  return auth;
};
