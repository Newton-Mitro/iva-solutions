export type LicenseType = "trial" | "monthly" | "yearly" | "lifetime";
export type LicenseStatus = "pending" | "active" | "expired" | "suspended" | "revoked";
export type ActivationStatus = "active" | "deactivated" | "blocked";

export type License = {
  id: string;
  licenseKey: string;
  type: LicenseType;
  status: LicenseStatus;
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  maxActivations: number;
  activeActivations: number;
  startsAt?: string;
  expiresAt?: string;
  isLifetime: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LicenseActivation = {
  id: string;
  licenseId: string;
  userId?: string;
  deviceId: string;
  deviceName?: string;
  platform?: string;
  browser?: string;
  extensionVersion?: string;
  status: ActivationStatus;
  activatedAt: string;
  lastSeenAt?: string;
  deactivatedAt?: string;
};

export type LicenseEventType =
  | "created" | "activated" | "validated" | "deactivated"
  | "expired" | "suspended" | "revoked" | "renewed" | "activation_blocked";

export type LicenseEvent = {
  id: string;
  licenseId: string;
  activationId?: string;
  type: LicenseEventType;
  message?: string;
  metadata?: string;
  createdAt: string;
};

export type LicenseSettings = {
  id: string;
  trialDays: number;
  validationIntervalHours: number;
  offlineGracePeriodHours: number;
  updatedAt: string;
};