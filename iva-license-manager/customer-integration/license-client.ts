import { getDeviceId } from "./device";
import { validateLicense } from "./firebase-license";

export async function checkIvacLicense(licenseKey: string) {
  const deviceId = await getDeviceId();
  return validateLicense(licenseKey, deviceId);
}