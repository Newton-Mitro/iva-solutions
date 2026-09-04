import {
  AtSign,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  FileCheck,
  FileDown,
  FileText,
  KeyRound,
  Lock,
  LogIn,
  LogOut,
  MapPin,
  MessageSquare,
  Phone,
  Receipt,
  Send,
  ShieldCheck,
  Smartphone,
  User,
  UserCheck,
  UserPlus,
  Upload,
  type LucideIcon,
} from "lucide-react";
import {
  WorkflowPhase,
  WorkflowStep,
  WorkflowStepDefinition,
} from "../../../types/dashboard.types";

/**
 * ============================================================
 * SIGN UP
 * ============================================================
 */

export const signUpWorkflowPhases: WorkflowStepDefinition[] = [
  {
    id: "signup-email",
    phase: "signup",
    title: "Enter email address",
    description:
      "Enter the email address that will be used to create the Indian Visa Application account.",
    icon: AtSign,
  },
  {
    id: "signup-send-email-otp",
    phase: "signup",
    title: "Send email OTP",
    description:
      "Click the button to send the verification OTP to the email address.",
    icon: Send,
  },
  {
    id: "signup-email-otp",
    phase: "signup",
    title: "Enter email OTP",
    description: "Enter the OTP received in the applicant's email.",
    icon: MessageSquare,
    manual: true,
  },
  {
    id: "signup-verify-email-otp",
    phase: "signup",
    title: "Verify email OTP",
    description: "Click the verify button to confirm the email OTP.",
    icon: CheckCircle,
  },
  {
    id: "signup-contact-number",
    phase: "signup",
    title: "Enter contact number",
    description: "Enter the applicant's contact/mobile number.",
    icon: Phone,
  },
  {
    id: "signup-send-mobile-otp",
    phase: "signup",
    title: "Send mobile OTP",
    description: "Click the button to send the mobile verification OTP.",
    icon: Send,
  },
  {
    id: "signup-mobile-otp",
    phase: "signup",
    title: "Enter mobile OTP",
    description: "Enter the OTP received on the applicant's mobile.",
    icon: Smartphone,
    manual: true,
  },
  {
    id: "signup-next",
    phase: "signup",
    title: "Next step",
    description: "Continue to the applicant information section.",
    icon: Check,
  },
  {
    id: "signup-dob",
    phase: "signup",
    title: "Enter date of birth",
    description: "Enter the applicant's date of birth.",
    icon: Calendar,
  },
  {
    id: "signup-passport",
    phase: "signup",
    title: "Enter passport number",
    description: "Enter the applicant's passport number.",
    icon: FileText,
  },
  {
    id: "signup-nid",
    phase: "signup",
    title: "Enter NID number",
    description: "Enter the applicant's NID number.",
    icon: UserCheck,
  },
  {
    id: "signup-surname",
    phase: "signup",
    title: "Enter surname",
    description: "Enter the surname exactly as shown on the passport.",
    icon: User,
  },
  {
    id: "signup-given-name",
    phase: "signup",
    title: "Enter given name",
    description: "Enter the given name exactly as shown on the passport.",
    icon: User,
  },
  {
    id: "signup-submit-information",
    phase: "signup",
    title: "Click Sign Up",
    description: "Submit the applicant's personal information.",
    icon: UserPlus,
  },
  {
    id: "signup-password",
    phase: "signup",
    title: "Enter password",
    description: "Enter the password for the Indian Visa Application account.",
    icon: Lock,
  },
  {
    id: "signup-confirm-password",
    phase: "signup",
    title: "Confirm password",
    description: "Enter the password again to confirm it.",
    icon: KeyRound,
  },
  {
    id: "signup-submit-password",
    phase: "signup",
    title: "Click Sign Up",
    description: "Submit the password and continue.",
    icon: UserPlus,
  },
  {
    id: "signup-consent-1",
    phase: "signup",
    title: "First consent",
    description: "Accept the first consent checkbox.",
    icon: Check,
  },
  {
    id: "signup-consent-2",
    phase: "signup",
    title: "Second consent",
    description: "Accept the second consent checkbox.",
    icon: Check,
  },
  {
    id: "signup-consent-3",
    phase: "signup",
    title: "Third consent",
    description: "Accept the third consent checkbox.",
    icon: Check,
  },
  {
    id: "signup-complete",
    phase: "signup",
    title: "Complete Sign Up",
    description: "Click Sign Up to complete the account registration.",
    icon: CheckCircle,
  },
];

/**
 * ============================================================
 * SIGN IN
 * ============================================================
 */

export const signInWorkflowPhases: WorkflowStepDefinition[] = [
  {
    id: "signin-email",
    phase: "signin",
    title: "Enter email address",
    description:
      "Enter the registered Indian Visa Application account email address.",
    icon: AtSign,
  },
  {
    id: "signin-password",
    phase: "signin",
    title: "Enter password",
    description:
      "Enter the registered Indian Visa Application account password.",
    icon: Lock,
  },
  {
    id: "signin-human-verification",
    phase: "signin",
    title: "Human verification",
    description: "Complete the 'I am not a robot' verification.",
    icon: ShieldCheck,
    manual: true,
  },
  {
    id: "signin-submit",
    phase: "signin",
    title: "Sign In Now",
    description: "Click the Sign In Now button.",
    icon: LogIn,
  },
  {
    id: "signin-mobile-otp",
    phase: "signin",
    title: "Enter mobile OTP",
    description: "Enter the OTP received on the registered mobile number.",
    icon: Smartphone,
    manual: true,
  },
];

/**
 * ============================================================
 * WEBFILE / APPLICATION
 * ============================================================
 */

export const ivacApplicationWorkflowPhases: WorkflowStepDefinition[] = [
  {
    id: "webfile-take-appointment",
    phase: "webfile",
    title: "Take Your Appointment",
    description: "Click the Take Your Appointment button.",
    icon: Calendar,
  },
  {
    id: "webfile-next",
    phase: "webfile",
    title: "Next Step",
    description: "Continue to the Webfile upload section.",
    icon: Check,
  },
  {
    id: "webfile-primary",
    phase: "webfile",
    title: "Upload Primary Applicant Webfile",
    description: "Upload the primary applicant's Webfile.",
    icon: Upload,
  },
  {
    id: "webfile-other",
    phase: "webfile",
    title: "Upload Other Applicant Webfile",
    description:
      "Upload Webfile information for other applicants, if applicable.",
    icon: Upload,
  },
  {
    id: "webfile-confirm-info",
    phase: "webfile",
    title: "Confirm Information",
    description: "Confirm that all entered information is correct.",
    icon: FileCheck,
  },
  {
    id: "webfile-confirm-dialog",
    phase: "webfile",
    title: "Confirm Dialog",
    description: "Confirm the information in the confirmation dialog.",
    icon: CheckCircle,
  },
  {
    id: "webfile-save",
    phase: "webfile",
    title: "Save & Continue",
    description: "Click Save & Continue to proceed.",
    icon: Check,
  },
];

/**
 * ============================================================
 * MISSION / Indian Visa Application CENTER
 * ============================================================
 */

export const missionWorkflowPhases: WorkflowStepDefinition[] = [
  {
    id: "mission-select",
    phase: "mission",
    title: "Select Mission",
    description: "Select Dhaka as the mission.",
    icon: MapPin,
  },
  {
    id: "mission-ivac-center",
    phase: "mission",
    title: "Select Indian Visa Application Center",
    description:
      "Select Indian Visa Application, Dhaka (JFP) as the Indian Visa Application center.",
    icon: MapPin,
  },
  {
    id: "mission-confirm",
    phase: "mission",
    title: "Confirm Mission & Indian Visa Application Center",
    description:
      "Confirm the selected mission and Indian Visa Application center.",
    icon: CheckCircle,
  },
];

/**
 * ============================================================
 * BOOK APPOINTMENT
 * ============================================================
 */

export const bookAppointmentWorkflowPhases: WorkflowStepDefinition[] = [
  {
    id: "appointment-take",
    phase: "appointment",
    title: "Take Your Appointment",
    description: "Click the Take Your Appointment button.",
    icon: Calendar,
  },
  {
    id: "appointment-next",
    phase: "appointment",
    title: "Next Step",
    description: "Continue to the appointment booking section.",
    icon: Check,
  },
  {
    id: "appointment-date",
    phase: "appointment",
    title: "Select Appointment Date",
    description: "Select the desired appointment date.",
    icon: Calendar,
  },
  {
    id: "appointment-time",
    phase: "appointment",
    title: "Select Appointment Time",
    description: "Select the available appointment time.",
    icon: Clock,
  },
  {
    id: "appointment-human-verification",
    phase: "appointment",
    title: "Human Verification",
    description: "Complete the 'I am not a robot' verification.",
    icon: ShieldCheck,
    manual: true,
  },
  {
    id: "appointment-continue",
    phase: "appointment",
    title: "Continue Booking",
    description: "Click Continue Booking to proceed.",
    icon: Check,
  },
];

/**
 * ============================================================
 * PAYMENT
 * ============================================================
 */

export const paymentWorkflowPhases: WorkflowStepDefinition[] = [
  {
    id: "payment-sslcommerz",
    phase: "payment",
    title: "Select SSL Commerz",
    description: "Select SSL Commerz as the payment gateway.",
    icon: CreditCard,
  },
  {
    id: "payment-continue",
    phase: "payment",
    title: "Continue Payment",
    description: "Continue to the payment gateway.",
    icon: Check,
  },
  {
    id: "payment-method",
    phase: "payment",
    title: "Select Payment Method",
    description: "Select the preferred payment method.",
    icon: CreditCard,
  },
  {
    id: "payment-card-number",
    phase: "payment",
    title: "Enter Card Number",
    description: "Enter the payment card number.",
    icon: CreditCard,
    manual: true,
  },
  {
    id: "payment-expiry",
    phase: "payment",
    title: "Enter MM/YY",
    description: "Enter the card expiration month and year.",
    icon: Calendar,
    manual: true,
  },
  {
    id: "payment-cvv",
    phase: "payment",
    title: "Enter CVC/CVV",
    description: "Enter the card security code.",
    icon: Lock,
    manual: true,
  },
  {
    id: "payment-card-holder",
    phase: "payment",
    title: "Enter Card Holder Name",
    description: "Enter the name printed on the payment card.",
    icon: User,
    manual: true,
  },
  {
    id: "payment-bkash",
    phase: "payment",
    title: "Select bKash",
    description: "Select bKash as the mobile banking payment method.",
    icon: Smartphone,
  },
  {
    id: "payment-bkash-process",
    phase: "payment",
    title: "Complete bKash Payment",
    description: "Complete the bKash payment process.",
    icon: Smartphone,
    manual: true,
  },
  {
    id: "payment-complete",
    phase: "payment",
    title: "Continue Payment",
    description: "Complete the payment process.",
    icon: CheckCircle,
  },
];

/**
 * ============================================================
 * INVOICE
 * ============================================================
 */

export const invoiceWorkflowPhases: WorkflowStepDefinition[] = [
  {
    id: "invoice-download",
    phase: "invoice",
    title: "Download Invoice",
    description: "Download the appointment/payment invoice.",
    icon: FileDown,
  },
];

/**
 * ============================================================
 * SIGN OUT
 * ============================================================
 */

export const signOutWorkflowPhases: WorkflowStepDefinition[] = [
  {
    id: "signout",
    phase: "signout",
    title: "Sign Out",
    description: "Sign out from the Indian Visa Application account.",
    icon: LogOut,
  },
];

/**
 * ============================================================
 * FLOW TABS
 * ============================================================
 */

export const flowTabs = [
  {
    id: "signup" as const,
    title: "Sign Up",
  },
  {
    id: "signin" as const,
    title: "Sign In",
  },
  {
    id: "webfile" as const,
    title: "Webfile",
  },
  {
    id: "mission" as const,
    title: "Mission & Indian Visa Application",
  },
  {
    id: "appointment" as const,
    title: "Book Appointment",
  },
  {
    id: "payment" as const,
    title: "Payment",
  },
  {
    id: "invoice" as const,
    title: "Invoice",
  },
  {
    id: "signout" as const,
    title: "Sign Out",
  },
];

export function createWorkflowSteps(phase: WorkflowPhase): WorkflowStep[] {
  return workflowStepsByPhase[phase].map((step) => ({
    ...step,
    status: "pending",
    progress: 0,
  }));
}

export const workflowStepsByPhase: Record<
  WorkflowPhase,
  WorkflowStepDefinition[]
> = {
  signup: signUpWorkflowPhases,
  signin: signInWorkflowPhases,
  webfile: ivacApplicationWorkflowPhases,
  mission: missionWorkflowPhases,
  appointment: bookAppointmentWorkflowPhases,
  payment: paymentWorkflowPhases,
  invoice: invoiceWorkflowPhases,
  signout: signOutWorkflowPhases,
};
