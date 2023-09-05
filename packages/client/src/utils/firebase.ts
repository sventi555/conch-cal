import { FirebaseOptions, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth as firebaseGetAuth } from 'firebase/auth';

// Connect to the auth emulator if we are in dev mode.
// May want to change this to an explicit env var down the line.
let config: FirebaseOptions;

if (import.meta.env.DEV) {
  config = { apiKey: 'test' };
} else {
  config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  };
}

const app = initializeApp(config);
const auth = firebaseGetAuth(app);

if (import.meta.env.DEV) {
  connectAuthEmulator(
    auth,
    import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL || 'http://127.0.0.1:9099',
    { disableWarnings: true },
  );
}

export const getAuth = () => {
  return auth;
};
