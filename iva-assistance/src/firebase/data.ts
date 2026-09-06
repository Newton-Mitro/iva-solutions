import {
  collection,
  onSnapshot,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firestore";

export type CollectionName =
  | "automationAccounts"
  | "webfiles"
  | "ivacApplications"
  | "appointments"
  | "payments"
  | "automationStatus"
  | "automationLogs"
  | "appointmentAttempts"
  | "invoices"
  | "automationRuns";
export type FirestoreRecord = DocumentData & {
  id?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const collectionRef = (userId: string, name: CollectionName) =>
  collection(db, "users", userId, name);

export const subscribeToRecords = <T extends FirestoreRecord>(
  userId: string,
  name: CollectionName,
  listener: (records: Array<T & { id: string }>) => void,
  onError?: (error: Error) => void,
): Unsubscribe =>
  onSnapshot(
    collectionRef(userId, name),
    (snapshot) =>
      listener(
        snapshot.docs.map(
          (item) => ({ id: item.id, ...item.data() }) as T & { id: string },
        ),
      ),
    (error) => onError?.(error),
  );
