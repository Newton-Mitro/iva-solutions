export type Gender = "male" | "female" | "other";
export type Mission = "India" | "Bangladesh";
export type IvacCenter = "Dhaka" | "Chittagong" | "Rajshahi";
export type WebfileType = "primary" | "other";

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

export type AutomationLogStatus =
  | "pending"
  | "running"
  | "success"
  | "warning"
  | "error"
  | "skipped";

export type Webfile = {
  id: string;
  ivacApplicationId: string;
  originalName?: string;
  filePath?: string;
  type: WebfileType;
  status?: string;
};

export type Appointment = {
  id: string;
  ivacApplicationId: string;
  appointmentDate?: string;
  appointmentTime?: string;
  status?: AppointmentAttemptStatus;
};

export type AutomationAccount = {
  id: string;
  applicationId: string;
  email: string;
  mobile: string;
  ivacPassword?: string;
  emailVerifiedAt?: string;
  mobileVerifiedAt?: string;
  lastLoginAt?: string;
  lastLogoutAt?: string;
  accountStatus: AccountStatus;
};

export type Application = {
  id: string;
  fullName: string;
  gender?: Gender;
  passportNumber: string;

  webfiles: Webfile[];
  appointment?: Appointment;
  automationAccount?: AutomationAccount;

  mission?: Mission;
  ivacCenter?: IvacCenter;
  status: ApplicationStatus;
};

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
