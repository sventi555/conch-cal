import { Transaction } from 'firebase-admin/firestore';
import { db } from '../../db/ index';

export const useTransaction = <T>(
  transaction: Transaction | undefined,
  handler: (transaction: Transaction) => Promise<T>,
) => {
  if (transaction != null) {
    return handler(transaction);
  } else {
    return db.runTransaction(handler);
  }
};
