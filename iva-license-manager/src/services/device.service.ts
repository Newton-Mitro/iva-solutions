const KEY = "ivac_license_device_id";

export async function getDeviceId() {
  const result = await chrome.storage.local.get(KEY);
  if (result[KEY]) return result[KEY] as string;
  const id = crypto.randomUUID();
  await chrome.storage.local.set({ [KEY]: id });
  return id;
}

export async function getDeviceInfo() {
  return {
    deviceId: await getDeviceId(),
    deviceName: navigator.platform || "Unknown",
    platform: navigator.platform || "Unknown",
    browser: "Chrome"
  };
}