import { DocumentData, FirestoreDataConverter } from '@google-cloud/firestore';

export const converter = <
  T extends DocumentData,
>(): FirestoreDataConverter<T> => ({
  toFirestore: (data) => data,
  fromFirestore: (snap) => snap.data() as T,
});
