import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Common / Enum-like Types                                                   */
/* -------------------------------------------------------------------------- */

export type Gender = "male" | "female" | "other";
export type VisaType =
  | "tourist"
  | "medical"
  | "business"
  | "student"
  | "employment"
  | "entry"
  | "other";

export type Mission = "India" | "Bangladesh";
export type IvacCenter = "Dhaka" | "Chittagong" | "Rajshahi";
export type WebfileType = "primary" | "other";
export type PaymentMethod = "card" | "mobile_banking" | "bank_transfer";
export type PaymentGateway = "ivac" | "manual";
export type Currency = "BDT" | "USD";

export type AutomationType =
  | "signup"
  | "signin"
  | "webfile"
  | "mission"
  | "appointment"
  | "payment"
  | "invoice"
  | "signout";

export type LogType = "success" | "info" | "warning" | "error";

/* -------------------------------------------------------------------------- */
/* Status Types                                                               */
/* -------------------------------------------------------------------------- */

export type ApplicantStatus = "active" | "inactive" | "blocked";

export type ApplicationStatus =
  | "pending"
  | "webfile"
  | "appointment"
  | "payment"
  | "completed"
  | "cancelled"
  | "failed";

export type AccountStatus = "active" | "suspended" | "blocked";

export type AppointmentAttemptStatus = "pending" | "success" | "failed";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type InvoiceStatus = "pending" | "downloaded" | "failed";

export type AutomationRunStatus =
  | "pending"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type AutomationLogStatus =
  | "pending"
  | "running"
  | "success"
  | "warning"
  | "error"
  | "skipped";

/* -------------------------------------------------------------------------- */
/* Applicant                                                                  */
/* -------------------------------------------------------------------------- */

export type Applicant = {
  id: string;
  fullName: string;
  email?: string;
  mobile?: string;
  gender?: Gender;
  passportNumber: string;
  nidNumber: string;
  status: ApplicantStatus;
};

export type Webfile = {
  id: string;
  ivacApplicationId: string;
  webfileNumber?: string;
  originalName?: string;
  filePath?: string;
  type: WebfileType;
  status?: string;
  uploadedAt?: string;
  errorMessage?: string;
};

export type Appointment = {
  id: string;
  ivacApplicationId: string;
  appointmentDate?: string;
  appointmentTime?: string;
  status?: AppointmentAttemptStatus;
};

export type Payment = {
  id: string;
  ivacApplicationId: string;
  appointmentId?: string;
  transactionId?: string;
  amount?: number;
  currency?: Currency;
  status: PaymentStatus;
};

export type AutomationAccount = {
  id: string;
  applicantId: string;
  email: string;
  mobile: string;
  ivacPassword?: string;
  emailVerifiedAt?: string;
  mobileVerifiedAt?: string;
  lastLoginAt?: string;
  lastLogoutAt?: string;
  accountStatus: AccountStatus;
};

/* -------------------------------------------------------------------------- */
/* IVAC Application                                                           */
/* -------------------------------------------------------------------------- */

export type Application = {
  id: string;

  applicant: Applicant;
  webfiles: Webfile[];
  appointment: Appointment;
  payment: Payment;
  automationAccount?: AutomationAccount;

  visaType?: VisaType;
  mission?: Mission;
  ivacCenter?: IvacCenter;
  status: ApplicationStatus;
};

/* -------------------------------------------------------------------------- */
/* Automation Log                                                             */
/* -------------------------------------------------------------------------- */

export type AutomationLog = {
  id: string;
  automationRunId: string;
  stepOrder: number;
  step: string;
  status: AutomationLogStatus;
  message?: string;
  error?: string;
  metadata?: string;
  startedAt?: string;
  completedAt?: string;
};

/* -------------------------------------------------------------------------- */
/* Workflow                                                                   */
/* -------------------------------------------------------------------------- */

export type WorkflowPhase =
  | "signup"
  | "signin"
  | "webfile"
  | "mission"
  | "relogin"
  | "appointment"
  | "payment"
  | "invoice"
  | "signout";

export type WorkflowStepStatus = "pending" | "running" | "completed" | "failed";

export type WorkflowStepDefinition = {
  id: string;
  phase: WorkflowPhase;
  title: string;
  description: string;
  icon: LucideIcon;
  manual?: boolean;
};

export type WorkflowStep = WorkflowStepDefinition & {
  status: WorkflowStepStatus;
  progress: number;
};

/* -------------------------------------------------------------------------- */
/* Workflow Logs                                                              */
/* -------------------------------------------------------------------------- */

export type WorkflowLog = {
  type: LogType;
  message: string;
  time: string;
};

/* -------------------------------------------------------------------------- */
/* License                                                                     */
/* -------------------------------------------------------------------------- */

export type LicenseType = "trial" | "monthly" | "yearly" | "lifetime";

export type LicenseStatus =
  | "pending"
  | "active"
  | "expired"
  | "suspended"
  | "revoked";

export type ActivationStatus = "active" | "deactivated" | "blocked";

export type License = {
  id: string;

  /**
   * Human-readable license key.
   * Example: IVAC-XXXX-XXXX-XXXX
   */
  licenseKey: string;

  type: LicenseType;
  status: LicenseStatus;

  /**
   * Customer/account that owns the license.
   */
  userId?: string;

  /**
   * Maximum number of devices that can be activated.
   */
  maxActivations: number;

  /**
   * Current number of active devices.
   */
  activeActivations: number;

  startsAt?: string;
  expiresAt?: string;

  /**
   * Lifetime licenses may have no expiration date.
   */
  isLifetime: boolean;

  createdAt: string;
  updatedAt: string;
};

/* -------------------------------------------------------------------------- */
/* License Activation                                                         */
/* -------------------------------------------------------------------------- */

export type LicenseActivation = {
  id: string;
  licenseId: string;

  /**
   * User/account associated with this activation.
   */
  userId?: string;

  /**
   * Unique identifier generated by the extension installation.
   */
  deviceId: string;

  /**
   * Optional device information for administration.
   */
  deviceName?: string;
  platform?: string;
  browser?: string;
  extensionVersion?: string;

  status: ActivationStatus;

  activatedAt: string;
  lastSeenAt?: string;
  deactivatedAt?: string;

  /**
   * Server-generated token used by the extension
   * to authenticate an activated installation.
   */
  activationToken?: string;
};

/* -------------------------------------------------------------------------- */
/* License Validation                                                         */
/* -------------------------------------------------------------------------- */

export type LicenseValidation = {
  id: string;
  licenseId: string;
  activationId?: string;

  valid: boolean;

  /**
   * Why validation succeeded/failed.
   */
  reason?:
    | "valid"
    | "invalid_key"
    | "expired"
    | "suspended"
    | "revoked"
    | "activation_limit"
    | "device_blocked";

  deviceId?: string;
  ipAddress?: string;

  createdAt: string;
};

/* -------------------------------------------------------------------------- */
/* License Event / Audit Log                                                  */
/* -------------------------------------------------------------------------- */

export type LicenseEventType =
  | "created"
  | "activated"
  | "validated"
  | "deactivated"
  | "expired"
  | "suspended"
  | "revoked"
  | "renewed"
  | "activation_blocked";

export type LicenseEvent = {
  id: string;
  licenseId: string;
  activationId?: string;

  type: LicenseEventType;

  message?: string;
  metadata?: string;

  createdAt: string;
};

/* -------------------------------------------------------------------------- */
/* License Settings                                                           */
/* -------------------------------------------------------------------------- */

export type LicenseSettings = {
  id: string;

  /**
   * Default trial period in days.
   */
  trialDays: number;

  /**
   * How often the extension should validate its license.
   */
  validationIntervalHours: number;

  /**
   * Whether the extension can continue working temporarily
   * when the license server is unavailable.
   */
  offlineGracePeriodHours: number;

  updatedAt: string;
};
