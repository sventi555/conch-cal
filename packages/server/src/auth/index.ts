import { initializeApp } from 'firebase-admin/app';
import { getAuth as getFirebaseAuth } from 'firebase-admin/auth';

const app = initializeApp();

export const getAuth = () => {
  const auth = getFirebaseAuth(app);
  return auth;
};
