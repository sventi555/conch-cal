import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth as getFirebaseAuth } from 'firebase-admin/auth';

const app = initializeApp({
  credential: applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

export const getAuth = () => {
  const auth = getFirebaseAuth(app);
  return auth;
};
