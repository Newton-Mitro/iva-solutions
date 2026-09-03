import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firestore";

export type CollectionName =
  | "applicants"
  | "ivacAccounts"
  | "webfiles"
  | "appointments"
  | "payments"
  | "automationStatus"
  | "automationLogs";
export type FirestoreRecord = DocumentData & {
  id?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const collectionRef = (userId: string, name: CollectionName) =>
  collection(db, "users", userId, name);

export const createRecord = async <T extends FirestoreRecord>(
  userId: string,
  name: CollectionName,
  record: T,
) =>
  addDoc(collectionRef(userId, name), {
    ...record,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const saveRecord = async <T extends FirestoreRecord>(
  userId: string,
  name: CollectionName,
  recordId: string,
  record: T,
) =>
  setDoc(
    doc(collectionRef(userId, name), recordId),
    { ...record, updatedAt: serverTimestamp() },
    { merge: true },
  );

export const subscribeToRecords = <T extends FirestoreRecord>(
  userId: string,
  name: CollectionName,
  listener: (records: Array<T & { id: string }>) => void,
): Unsubscribe =>
  onSnapshot(collectionRef(userId, name), (snapshot) =>
    listener(
      snapshot.docs.map(
        (item) => ({ id: item.id, ...item.data() }) as T & { id: string },
      ),
    ),
  );
