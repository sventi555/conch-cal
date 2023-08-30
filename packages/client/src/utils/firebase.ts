import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth as firebaseGetAuth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {};

const app = initializeApp(firebaseConfig);

export const getAuth = () => {
  return firebaseGetAuth(app);
};
