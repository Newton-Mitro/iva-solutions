import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Common / Enum-like Types                                                   */
/* -------------------------------------------------------------------------- */

export type Gender = "male" | "female" | "other";
export type Nationality = "Bangladeshi" | "Indian" | "Other";
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
export type WebfileType = "primary" | "additional";
export type AppointmentType = "regular" | "urgent";
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
/* User                                                                       */
/* -------------------------------------------------------------------------- */

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  phone?: string;
};

/* -------------------------------------------------------------------------- */
/* Applicant                                                                  */
/* -------------------------------------------------------------------------- */

export type Applicant = {
  id: string;
  userId?: string;
  surname: string;
  givenName: string;
  fullName: string;
  email?: string;
  mobile?: string;
  dateOfBirth?: string;
  nationality?: Nationality;
  gender?: Gender;
  photoPath?: string;
  passportNumber: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  nidNumber: string;
  status: ApplicantStatus;
};

/* -------------------------------------------------------------------------- */
/* IVAC Application                                                           */
/* -------------------------------------------------------------------------- */

export type Application = {
  id: string;
  applicantId: string;
  visaType?: VisaType;
  mission?: Mission;
  ivacCenter?: IvacCenter;
  webFileNumber?: string;
  applicationNumber?: string;
  status: ApplicationStatus;
  paymentStatus?: PaymentStatus;
  appointmentBookingAvailableAt?: string;
  missionConfirmedAt?: string;
  completedAt?: string;
  errorMessage?: string;
};

/* -------------------------------------------------------------------------- */
/* Automation Account                                                         */
/* -------------------------------------------------------------------------- */

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
/* Webfile                                                                    */
/* -------------------------------------------------------------------------- */

export type Webfile = {
  id: string;
  ivacApplicationId: string;
  webfileNumber: string;
  type: WebfileType;
  filePath?: string;
  originalName?: string;
  uploadedAt?: string;
  confirmedAt?: string;
  errorMessage?: string;
};

/* -------------------------------------------------------------------------- */
/* Appointment                                                                */
/* -------------------------------------------------------------------------- */

export type Appointment = {
  id: string;
  ivacApplicationId: string;
  appointmentType?: AppointmentType;
  appointmentDate?: string;
  appointmentTime?: string;
  confirmedAt?: string;
  errorMessage?: string;
};

/* -------------------------------------------------------------------------- */
/* Appointment Attempt                                                        */
/* -------------------------------------------------------------------------- */

export type AppointmentAttempt = {
  id: string;
  ivacApplicationId: string;
  ivacCenter?: IvacCenter;
  appointmentDate?: string;
  appointmentTime?: string;
  status: AppointmentAttemptStatus;
  failureReason?: string;
  responseData?: string;
  attemptedAt?: string;
};

/* -------------------------------------------------------------------------- */
/* Payment                                                                    */
/* -------------------------------------------------------------------------- */

export type Payment = {
  id: string;
  ivacApplicationId: string;
  appointmentId?: string;
  gateway: PaymentGateway;
  transactionId?: string;
  paymentMethod?: PaymentMethod;
  amount?: number;
  currency: Currency;
  status: PaymentStatus;
  paidAt?: string;
  gatewayResponse?: string;
};

/* -------------------------------------------------------------------------- */
/* Invoice                                                                    */
/* -------------------------------------------------------------------------- */

export type Invoice = {
  id: string;
  ivacApplicationId: string;
  paymentId?: string;
  invoiceNumber?: string;
  filePath?: string;
  originalName?: string;
  status: InvoiceStatus;
  downloadedAt?: string;
};

/* -------------------------------------------------------------------------- */
/* Automation Run                                                             */
/* -------------------------------------------------------------------------- */

export type AutomationRun = {
  id: string;
  automationAccountId?: string;
  ivacApplicationId?: string;
  type: AutomationType;
  status: AutomationRunStatus;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
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
