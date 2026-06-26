import { STORAGE_KEYS } from "./constants";

export function getDeviceId() {
  const stored = localStorage.getItem(STORAGE_KEYS.deviceId);
  if (stored) return stored;

  const deviceId = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEYS.deviceId, deviceId);
  return deviceId;
}
