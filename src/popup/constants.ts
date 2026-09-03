import {
  CalendarDays,
  CreditCard,
  FileCheck2,
  FileText,
  ShieldCheck,
  User,
} from "lucide-react";
import type { Step, WorkflowPhase } from "./types";

export const workflowPhases: Array<{
  id: WorkflowPhase;
  title: string;
  description: string;
  action: string;
}> = [
  {
    id: "signup",
    title: "Create IVAC account",
    description:
      "Email OTP, mobile OTP, applicant details, password and consent",
    action: "Start sign up",
  },
  {
    id: "signin",
    title: "Sign in to IVAC",
    description: "Email, password, human verification and mobile OTP",
    action: "Open sign in",
  },
  {
    id: "webfile",
    title: "Upload Webfiles",
    description:
      "Upload primary and additional Webfiles, then confirm the form",
    action: "Prepare Webfiles",
  },
  {
    id: "mission",
    title: "Confirm mission",
    description: "Choose Dhaka and IVAC, Dhaka (JFP)",
    action: "Confirm mission",
  },
  {
    id: "relogin",
    title: "Re-login at 6:00 PM",
    description:
      "The portal requires a fresh sign-in before appointment booking",
    action: "Mark reminder",
  },
  {
    id: "appointment",
    title: "Book appointment",
    description: "Choose date and time, verify human check, continue booking",
    action: "Find appointment",
  },
  {
    id: "payment",
    title: "Complete payment",
    description: "SSLCommerz card or bKash, then download the invoice",
    action: "Review payment",
  },
  {
    id: "signout",
    title: "Sign out",
    description: "End the IVAC portal session after the workflow",
    action: "Sign out",
  },
];

export const flowTabs = [
  { id: "signup" as const, title: "Sign Up" },
  { id: "signin" as const, title: "Sign In" },
  { id: "webfile" as const, title: "Webfile / Mission / Center" },
  { id: "appointment" as const, title: "Book Appointment" },
  { id: "payment" as const, title: "Payment" },
];

export const initialSteps: Step[] = [
  {
    id: "applicant",
    title: "Applicant",
    description: "Verify applicant information",
    icon: User,
    status: "completed",
  },
  {
    id: "application",
    title: "Application",
    description: "Prepare visa application",
    icon: FileText,
    status: "completed",
  },
  {
    id: "signin",
    title: "Sign In",
    description: "Sign in to IVAC portal",
    icon: ShieldCheck,
    status: "completed",
  },
  {
    id: "fill",
    title: "Fill Application",
    description: "Fill application form",
    icon: FileCheck2,
    status: "running",
    progress: 72,
  },
  {
    id: "appointment",
    title: "Appointment",
    description: "Find appointment slot",
    icon: CalendarDays,
    status: "pending",
  },
  {
    id: "payment",
    title: "Payment",
    description: "Complete payment",
    icon: CreditCard,
    status: "pending",
  },
];
