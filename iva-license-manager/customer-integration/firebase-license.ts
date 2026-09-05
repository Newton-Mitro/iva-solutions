import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  limit,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REPLACE",
  authDomain: "REPLACE",
  projectId: "REPLACE",
  storageBucket: "REPLACE",
  messagingSenderId: "REPLACE",
  appId: "REPLACE",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function validateLicense(licenseKey: string, deviceId?: string) {
  const q = query(
    collection(db, "licenses"),
    where("licenseKey", "==", licenseKey.trim().toUpperCase()),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty)
    return { valid: false as const, reason: "invalid_key" as const };

  const d = snap.docs[0].data();
  if (d.status === "suspended")
    return { valid: false as const, reason: "suspended" as const };
  if (d.status === "revoked")
    return { valid: false as const, reason: "revoked" as const };

  const expires =
    d.expiresAt instanceof Timestamp
      ? d.expiresAt.toDate()
      : d.expiresAt
        ? new Date(d.expiresAt)
        : null;
  if (expires && expires <= new Date())
    return { valid: false as const, reason: "expired" as const };

  // Device validation requires reading licenseActivations. Add the same
  // Firebase config to the customer extension before using this helper.
  if (deviceId) {
    const aq = query(
      collection(db, "licenseActivations"),
      where("licenseId", "==", snap.docs[0].id),
      where("deviceId", "==", deviceId),
      where("status", "==", "active"),
      limit(1),
    );
    if ((await getDocs(aq)).empty)
      return { valid: false as const, reason: "device_not_activated" as const };
  }

  return {
    valid: true as const,
    licenseId: snap.docs[0].id,
    expiresAt: expires?.toISOString(),
    type: d.type,
  };
}
