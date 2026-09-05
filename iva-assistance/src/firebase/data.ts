import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type Unsubscribe,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firestore";

export type CollectionName =
  | "applicants"
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

export const deleteRecord = (
  userId: string,
  name: CollectionName,
  recordId: string,
) => deleteDoc(doc(collectionRef(userId, name), recordId));

type Relation = { collection: CollectionName; field: string };

const relations: Partial<Record<CollectionName, Relation[]>> = {
  applicants: [
    { collection: "automationAccounts", field: "applicantId" },
    { collection: "ivacApplications", field: "applicantId" },
  ],
  automationAccounts: [
    { collection: "automationRuns", field: "automationAccountId" },
  ],
  ivacApplications: [
    { collection: "webfiles", field: "ivacApplicationId" },
    { collection: "appointments", field: "ivacApplicationId" },
    { collection: "appointmentAttempts", field: "ivacApplicationId" },
    { collection: "payments", field: "ivacApplicationId" },
    { collection: "invoices", field: "ivacApplicationId" },
    { collection: "automationRuns", field: "ivacApplicationId" },
    { collection: "automationStatus", field: "ivacApplicationId" },
    { collection: "automationStatus", field: "applicationId" },
  ],
  appointments: [{ collection: "payments", field: "appointmentId" }],
  payments: [{ collection: "invoices", field: "paymentId" }],
  automationRuns: [{ collection: "automationLogs", field: "automationRunId" }],
};

export const deleteRecordWithCascade = async (
  userId: string,
  name: CollectionName,
  recordId: string,
) => {
  const visited = new Set<string>();

  const remove = async (collectionName: CollectionName, id: string) => {
    const key = `${collectionName}:${id}`;
    if (visited.has(key)) return;
    visited.add(key);

    for (const relation of relations[collectionName] ?? []) {
      const children = await getDocs(
        query(
          collectionRef(userId, relation.collection),
          where(relation.field, "==", id),
        ),
      );
      await Promise.all(
        children.docs.map((child) => remove(relation.collection, child.id)),
      );
    }

    await deleteInBatches(userId, collectionName, id);
  };

  await remove(name, recordId);
};

const deleteInBatches = async (
  userId: string,
  name: CollectionName,
  recordId: string,
) => {
  const batch = writeBatch(db);
  batch.delete(doc(collectionRef(userId, name), recordId));
  await batch.commit();
};

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
