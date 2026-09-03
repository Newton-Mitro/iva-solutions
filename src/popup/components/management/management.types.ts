import type { FirestoreRecord } from "../../../firebase/data";

export type RecordItem = FirestoreRecord & { id: string };

export type CollectionName =
  | "applicants"
  | "automationAccounts"
  | "ivacApplications"
  | "webfiles";

export type FormMode = "applicant" | "account" | "application" | "webfile";

/**
 * Convert record field to string, defaulting to "-" if missing
 */
export const text = (record: FirestoreRecord, key: string): string =>
  String(record[key] ?? "-");

/**
 * Get collection name from form mode
 */
export const getCollectionFromMode = (mode: FormMode): CollectionName => {
  const map: Record<FormMode, CollectionName> = {
    applicant: "applicants",
    account: "automationAccounts",
    application: "ivacApplications",
    webfile: "webfiles",
  };
  return map[mode];
};
