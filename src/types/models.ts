import type { LucideIcon } from "lucide-react";

export type Applicant = {
  id: string;
  userId?: string;
  surname: string;
  givenName: string;
  fullName: string;
  email?: string;
  mobile?: string;
  dateOfBirth?: string;
  nationality?: string;
  gender?: string;
  photoPath?: string;
  passportNumber: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  nidNumber: string;
  status: string;
};

export type Application = {
  id: string;
  applicantId: string;
  visaType?: string;
  mission?: string;
  ivacCenter?: string;
  webFileNumber?: string;
  applicationNumber?: string;
  status: string;
  paymentStatus?: string;
  appointmentBookingAvailableAt?: string;
  missionConfirmedAt?: string;
  completedAt?: string;
  errorMessage?: string;
};

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  phone?: string;
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
  accountStatus: string;
};

export type Webfile = {
  id: string;
  ivacApplicationId: string;
  webfileNumber: string;
  type: string;
  filePath?: string;
  originalName?: string;
  status: string;
  uploadedAt?: string;
  confirmedAt?: string;
  errorMessage?: string;
};

export type Appointment = {
  id: string;
  ivacApplicationId: string;
  appointmentType?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  confirmedAt?: string;
  errorMessage?: string;
  status: string;
};

export type AppointmentAttempt = {
  id: string;
  ivacApplicationId: string;
  ivacCenter?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  status: string;
  failureReason?: string;
  responseData?: string;
  attemptedAt?: string;
};

export type Payment = {
  id: string;
  ivacApplicationId: string;
  appointmentId?: string;
  gateway: string;
  transactionId?: string;
  paymentMethod?: string;
  amount?: number;
  currency: string;
  status: string;
  paidAt?: string;
  gatewayResponse?: string;
};

export type Invoice = {
  id: string;
  ivacApplicationId: string;
  paymentId?: string;
  invoiceNumber?: string;
  filePath?: string;
  originalName?: string;
  downloadedAt?: string;
};

export type AutomationRun = {
  id: string;
  automationAccountId?: string;
  ivacApplicationId?: string;
  type: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
};

export type AutomationLog = {
  id: string;
  automationRunId: string;
  stepOrder: number;
  step: string;
  status: string;
  message?: string;
  error?: string;
  metadata?: string;
  startedAt?: string;
  completedAt?: string;
};
