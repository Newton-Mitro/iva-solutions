import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { LicenseSettings } from "../types/license";

const ref = doc(db, "settings", "license");

const defaults: LicenseSettings = {
  id: "license",
  trialDays: 7,
  validationIntervalHours: 24,
  offlineGracePeriodHours: 24,
  updatedAt: new Date().toISOString()
};

export async function getSettings() {
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, defaults);
    return defaults;
  }
  return { ...defaults, ...(snap.data() as LicenseSettings) };
}

export async function saveSettings(settings: LicenseSettings) {
  await setDoc(ref, settings, { merge: true });
}