import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy,
  query, runTransaction, serverTimestamp, Timestamp, updateDoc, where
} from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";
import type { License, LicenseActivation, LicenseEvent, LicenseStatus, LicenseType } from "../types/license";
import { generateLicenseKey } from "../utils/license-key";
import { getSettings } from "./settings.service";

const licensesRef = collection(db, "licenses");
const activationsRef = collection(db, "licenseActivations");
const eventsRef = collection(db, "licenseEvents");

function toIso(value: unknown) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : new Date().toISOString();
}

function mapLicense(id: string, d: Record<string, unknown>): License {
  return { ...d, id, createdAt: toIso(d.createdAt), updatedAt: toIso(d.updatedAt), startsAt: d.startsAt ? toIso(d.startsAt) : undefined, expiresAt: d.expiresAt ? toIso(d.expiresAt) : undefined } as License;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function expiry(type: LicenseType, start: Date, trialDays: number) {
  if (type === "lifetime") return null;
  if (type === "trial") {
    const d = new Date(start);
    d.setDate(d.getDate() + trialDays);
    return d;
  }
  return addMonths(start, type === "monthly" ? 1 : 12);
}

export async function listLicenses() {
  const snap = await getDocs(query(licensesRef, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => mapLicense(d.id, d.data()));
}

export async function getLicense(id: string) {
  const snap = await getDoc(doc(db, "licenses", id));
  return snap.exists() ? mapLicense(snap.id, snap.data()) : null;
}

export async function createLicense(input: {
  type: LicenseType;
  maxActivations: number;
  customerName?: string;
  customerEmail?: string;
}) {
  const settings = await getSettings();
  const now = new Date();
  const expires = expiry(input.type, now, settings.trialDays);
  const licenseKey = generateLicenseKey();

  const data = {
    licenseKey,
    type: input.type,
    status: "active",
    customerName: input.customerName?.trim() || null,
    customerEmail: input.customerEmail?.trim() || null,
    maxActivations: Math.max(1, Math.floor(input.maxActivations)),
    activeActivations: 0,
    startsAt: now,
    expiresAt: expires,
    isLifetime: input.type === "lifetime",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: auth.currentUser?.uid || null
  };

  const ref = await addDoc(licensesRef, data);
  await addDoc(eventsRef, {
    licenseId: ref.id,
    type: "created",
    message: `Created ${input.type} license`,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.uid || null
  });

  return { ...data, id: ref.id, licenseKey, createdAt: now.toISOString(), updatedAt: now.toISOString(), startsAt: now.toISOString(), expiresAt: expires?.toISOString(), isLifetime: input.type === "lifetime" } as License;
}

export async function updateLicenseStatus(id: string, status: LicenseStatus) {
  await updateDoc(doc(db, "licenses", id), { status, updatedAt: serverTimestamp() });
  await addDoc(eventsRef, {
    licenseId: id,
    type: status === "suspended" ? "suspended" : status === "revoked" ? "revoked" : "validated",
    message: `Status changed to ${status}`,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.uid || null
  });
}

export async function renewLicense(id: string, months: 1 | 12) {
  const license = await getLicense(id);
  if (!license || license.isLifetime) return;
  const base = license.expiresAt && new Date(license.expiresAt) > new Date() ? new Date(license.expiresAt) : new Date();
  const expiresAt = addMonths(base, months);
  await updateDoc(doc(db, "licenses", id), {
    status: "active",
    expiresAt,
    updatedAt: serverTimestamp()
  });
  await addDoc(eventsRef, {
    licenseId: id,
    type: "renewed",
    message: `Renewed for ${months} month(s)`,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.uid || null
  });
}

export async function deleteLicense(id: string) {
  await deleteDoc(doc(db, "licenses", id));
}

export async function listActivations(licenseId?: string) {
  const q = licenseId
    ? query(activationsRef, where("licenseId", "==", licenseId), orderBy("activatedAt", "desc"))
    : query(activationsRef, orderBy("activatedAt", "desc"), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    ...(d.data() as Omit<LicenseActivation, "id">),
    id: d.id,
    activatedAt: toIso(d.data().activatedAt),
    lastSeenAt: d.data().lastSeenAt ? toIso(d.data().lastSeenAt) : undefined,
    deactivatedAt: d.data().deactivatedAt ? toIso(d.data().deactivatedAt) : undefined
  })) as LicenseActivation[];
}

export async function deactivateActivation(id: string) {
  const activationRef = doc(db, "licenseActivations", id);
  await runTransaction(db, async (tx) => {
    const activationSnap = await tx.get(activationRef);
    if (!activationSnap.exists()) throw new Error("Activation not found");
    const activation = activationSnap.data() as LicenseActivation;
    if (activation.status !== "active") return;
    const licenseRef = doc(db, "licenses", activation.licenseId);
    const licenseSnap = await tx.get(licenseRef);
    if (!licenseSnap.exists()) throw new Error("License not found");
    const license = licenseSnap.data() as License;
    tx.update(activationRef, { status: "deactivated", deactivatedAt: serverTimestamp(), lastSeenAt: serverTimestamp() });
    tx.update(licenseRef, { activeActivations: Math.max(0, (license.activeActivations || 0) - 1), updatedAt: serverTimestamp() });
  });
}

export async function listEvents(licenseId?: string) {
  const q = licenseId
    ? query(eventsRef, where("licenseId", "==", licenseId), orderBy("createdAt", "desc"), limit(100))
    : query(eventsRef, orderBy("createdAt", "desc"), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    ...(d.data() as Omit<LicenseEvent, "id">),
    id: d.id,
    createdAt: toIso(d.data().createdAt)
  })) as LicenseEvent[];
}

/**
 * Customer-side activation/validation can use these functions directly.
 * For real multi-user deployments, the rules should require the customer's
 * Firebase Auth UID and license ownership.
 */
export async function activateLicense(licenseKey: string, deviceId: string, deviceInfo?: Partial<LicenseActivation>) {
  const q = query(licensesRef, where("licenseKey", "==", licenseKey.trim().toUpperCase()), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) throw new Error("Invalid license key");

  const licenseDoc = snap.docs[0];
  const license = licenseDoc.data() as License;

  if (license.status !== "active") throw new Error(`License is ${license.status}`);
  if (license.expiresAt && new Date(toIso(license.expiresAt)) <= new Date()) {
    await updateDoc(licenseDoc.ref, { status: "expired", updatedAt: serverTimestamp() });
    throw new Error("License expired");
  }

  const existingQ = query(activationsRef, where("licenseId", "==", licenseDoc.id), where("deviceId", "==", deviceId), limit(1));
  const existing = await getDocs(existingQ);
  if (!existing.empty) return existing.docs[0].id;

  const activeQ = query(activationsRef, where("licenseId", "==", licenseDoc.id), where("status", "==", "active"));
  const active = await getDocs(activeQ);
  if (active.size >= license.maxActivations) throw new Error("Activation limit reached");

  const ref = await addDoc(activationsRef, {
    licenseId: licenseDoc.id,
    userId: auth.currentUser?.uid || null,
    deviceId,
    deviceName: deviceInfo?.deviceName || null,
    platform: deviceInfo?.platform || null,
    browser: deviceInfo?.browser || "Chrome",
    extensionVersion: deviceInfo?.extensionVersion || null,
    status: "active",
    activatedAt: serverTimestamp(),
    lastSeenAt: serverTimestamp()
  });

  await updateDoc(licenseDoc.ref, {
    activeActivations: active.size + 1,
    updatedAt: serverTimestamp()
  });

  await addDoc(eventsRef, {
    licenseId: licenseDoc.id,
    activationId: ref.id,
    type: "activated",
    createdAt: serverTimestamp()
  });

  return ref.id;
}

export async function validateLicense(licenseKey: string, deviceId?: string) {
  const q = query(licensesRef, where("licenseKey", "==", licenseKey.trim().toUpperCase()), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return { valid: false as const, reason: "invalid_key" as const };

  const licenseDoc = snap.docs[0];
  const license = mapLicense(licenseDoc.id, licenseDoc.data());
  if (license.status === "suspended") return { valid: false as const, reason: "suspended" as const };
  if (license.status === "revoked") return { valid: false as const, reason: "revoked" as const };
  if (license.expiresAt && new Date(license.expiresAt) <= new Date()) {
    await updateDoc(licenseDoc.ref, { status: "expired", updatedAt: serverTimestamp() });
    return { valid: false as const, reason: "expired" as const };
  }

  if (deviceId) {
    const q2 = query(activationsRef, where("licenseId", "==", license.id), where("deviceId", "==", deviceId), where("status", "==", "active"), limit(1));
    if ((await getDocs(q2)).empty) return { valid: false as const, reason: "device_not_activated" as const };
  }

  return { valid: true as const, license };
}