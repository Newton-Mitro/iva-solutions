import { FirestoreRecord } from "../firebase/data";

export type RecordItem = FirestoreRecord & { id: string };

/**
 * Convert record field to string, defaulting to "-" if missing
 */
export const text = (record: FirestoreRecord, key: string): string =>
  String(record[key] ?? "-");

export type CollectionName =
  | "automationAccounts"
  | "ivacApplications"
  | "webfiles";

export type FormMode = "account" | "application" | "webfile";

/**
 * Get collection name from form mode
 */
export const getCollectionFromMode = (mode: FormMode): CollectionName => {
  const map: Record<FormMode, CollectionName> = {
    account: "automationAccounts",
    application: "ivacApplications",
    webfile: "webfiles",
  };
  return map[mode];
};
