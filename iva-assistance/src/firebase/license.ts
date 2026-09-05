import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firestore";

export type LicenseRecord = {
  licenseId: string;
  activationId: string;
  key: string;
  type: string;
  expiresAt?: string;
  activatedAt: string;
  status: "active";
};

type LicenseDocument = {
  licenseKey: string;
  type: string;
  status: string;
  expiresAt?: Timestamp | Date | string | null;
};

type ActivationDocument = {
  licenseId: string;
  userId?: string | null;
  deviceId: string;
  status: "active" | "deactivated" | "blocked";
  activatedAt: Timestamp | Date | string;
};

const licenses = collection(db, "licenses");
const activations = collection(db, "licenseActivations");
const events = collection(db, "licenseEvents");
const deviceStorageKey = "ivac_license_device_id";

const toIso = (value: unknown) => {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : new Date().toISOString();
};

async function getDeviceId() {
  const stored = await chrome.storage.local.get(deviceStorageKey);
  if (typeof stored[deviceStorageKey] === "string") {
    return stored[deviceStorageKey] as string;
  }

  const deviceId = crypto.randomUUID();
  await chrome.storage.local.set({ [deviceStorageKey]: deviceId });
  return deviceId;
}

async function findLicense(key: string) {
  const result = await getDocs(
    query(
      licenses,
      where("licenseKey", "==", key.trim().toUpperCase()),
      limit(1),
    ),
  );
  return result.docs[0] ?? null;
}

function ensureUsableLicense(license: LicenseDocument) {
  if (license.status !== "active") {
    throw new Error(`License is ${license.status}`);
  }

  if (license.expiresAt && new Date(toIso(license.expiresAt)) <= new Date()) {
    throw new Error("License expired");
  }
}

export async function getLicense(
  userId: string,
): Promise<LicenseRecord | null> {
  const deviceId = await getDeviceId();
  const result = await getDocs(
    query(
      activations,
      where("userId", "==", userId),
      where("deviceId", "==", deviceId),
      where("status", "==", "active"),
      limit(1),
    ),
  );

  const activation = result.docs[0];
  if (!activation) return null;

  const license = await getDoc(
    doc(db, "licenses", activation.data().licenseId as string),
  );
  if (!license.exists()) return null;

  try {
    ensureUsableLicense(license.data() as LicenseDocument);
  } catch {
    return null;
  }

  const data = license.data() as LicenseDocument;
  return {
    licenseId: license.id,
    activationId: activation.id,
    key: data.licenseKey,
    type: data.type,
    expiresAt: data.expiresAt ? toIso(data.expiresAt) : undefined,
    activatedAt: toIso((activation.data() as ActivationDocument).activatedAt),
    status: "active",
  };
}

export async function activateLicense(
  userId: string,
  key: string,
): Promise<LicenseRecord> {
  const licenseSnapshot = await findLicense(key);
  if (!licenseSnapshot) throw new Error("Invalid license key");

  const license = licenseSnapshot.data() as LicenseDocument & {
    maxActivations: number;
    activeActivations: number;
  };
  ensureUsableLicense(license);

  const deviceId = await getDeviceId();
  const existing = await getDocs(
    query(
      activations,
      where("licenseId", "==", licenseSnapshot.id),
      where("deviceId", "==", deviceId),
      where("status", "==", "active"),
      limit(1),
    ),
  );
  if (!existing.empty) {
    return getLicense(userId).then((record) => {
      if (!record) throw new Error("Unable to load existing activation");
      return record;
    });
  }

  const active = await getDocs(
    query(
      activations,
      where("licenseId", "==", licenseSnapshot.id),
      where("status", "==", "active"),
    ),
  );
  if (active.size >= license.maxActivations) {
    throw new Error("Activation limit reached");
  }

  const activationRef = doc(activations);
  const eventRef = doc(events);
  const now = new Date().toISOString();
  await runTransaction(db, async (transaction) => {
    transaction.set(activationRef, {
      licenseId: licenseSnapshot.id,
      userId,
      deviceId,
      deviceName: "IVA Assistance",
      browser: "Chrome",
      status: "active",
      activatedAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
    });
    transaction.update(licenseSnapshot.ref, {
      activeActivations: active.size + 1,
      updatedAt: serverTimestamp(),
    });
    transaction.set(eventRef, {
      licenseId: licenseSnapshot.id,
      activationId: activationRef.id,
      type: "activated",
      createdAt: serverTimestamp(),
    });
  });

  return {
    licenseId: licenseSnapshot.id,
    activationId: activationRef.id,
    key: license.licenseKey,
    type: license.type,
    expiresAt: license.expiresAt ? toIso(license.expiresAt) : undefined,
    activatedAt: now,
    status: "active",
  };
}

export async function deactivateLicense(userId: string) {
  const license = await getLicense(userId);
  if (!license) return;

  await runTransaction(db, async (transaction) => {
    const activationRef = doc(db, "licenseActivations", license.activationId);
    const activationSnapshot = await transaction.get(activationRef);
    if (!activationSnapshot.exists()) return;

    const licenseRef = doc(db, "licenses", license.licenseId);
    const licenseSnapshot = await transaction.get(licenseRef);
    const current = licenseSnapshot.data() as { activeActivations?: number };
    transaction.update(activationRef, {
      status: "deactivated",
      deactivatedAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
    });
    transaction.update(licenseRef, {
      activeActivations: Math.max(0, (current.activeActivations ?? 1) - 1),
      updatedAt: serverTimestamp(),
    });
  });
}
