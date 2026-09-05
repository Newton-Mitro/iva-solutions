import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firestore";

export type LicenseRecord = {
  key: string;
  activatedAt: string;
  status: "active";
};

const licenseRef = (userId: string) =>
  doc(db, "users", userId, "license", "current");

export async function getLicense(
  userId: string,
): Promise<LicenseRecord | null> {
  const snapshot = await getDoc(licenseRef(userId));
  return snapshot.exists() ? (snapshot.data() as LicenseRecord) : null;
}

export async function activateLicense(
  userId: string,
  key: string,
): Promise<LicenseRecord> {
  const record: LicenseRecord = {
    key,
    activatedAt: new Date().toISOString(),
    status: "active",
  };
  await setDoc(licenseRef(userId), record);
  return record;
}

export const deactivateLicense = (userId: string) =>
  deleteDoc(licenseRef(userId));
