import { Firestore, Settings } from '@google-cloud/firestore';
import { toBool, toInt } from 'lib';

// in production, use the values provided by cloud run context
const options: Settings =
  process.env.NODE_ENV !== 'production'
    ? {
        projectId: process.env.FIRESTORE_PROJECT_ID,
        host: process.env.FIRESTORE_HOST,
        port: toInt(process.env.FIRESTORE_PORT),
        ssl: toBool(process.env.FIRESTORE_SSL),
      }
    : {};

export const db = new Firestore(options);
