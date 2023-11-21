import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth as firebaseGetAuth } from 'firebase/auth';
import config from '../config';

const firebaseConfig: FirebaseOptions = {
  apiKey: config.firebase.apiKey,
  authDomain: `${config.firebase.projectId}.firebaseapp.com`,
  appId: config.firebase.appId,
  projectId: config.firebase.projectId,
};

const app = initializeApp(firebaseConfig);

export const getAuth = () => {
  const auth = firebaseGetAuth(app);
  return auth;
};
