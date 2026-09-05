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

export const phaseOneWorkflow: WorkflowStepDefinition[] = [
  {
    id: "signup-email",
    phase: "run_phase_one",
    title: "Enter email address",
    description:
      "Enter the email address that will be used to create the Indian Visa Application account.",
    icon: AtSign,
  },
  {
    id: "signup-send-email-otp",
    phase: "run_phase_one",
    title: "Send email OTP",
    description:
      "Click the button to send the verification OTP to the email address.",
    icon: Send,
  },
  {
    id: "signup-email-otp",
    phase: "run_phase_one",
    title: "Enter email OTP",
    description: "Enter the OTP received in the applicant's email.",
    icon: MessageSquare,
    manual: true,
  },
  {
    id: "signup-verify-email-otp",
    phase: "run_phase_one",
    title: "Verify email OTP",
    description: "Click the verify button to confirm the email OTP.",
    icon: CheckCircle,
  },
  {
    id: "signup-contact-number",
    phase: "run_phase_one",
    title: "Enter contact number",
    description: "Enter the applicant's contact/mobile number.",
    icon: Phone,
  },
  {
    id: "signup-send-mobile-otp",
    phase: "run_phase_one",
    title: "Send mobile OTP",
    description: "Click the button to send the mobile verification OTP.",
    icon: Send,
  },
  {
    id: "signup-mobile-otp",
    phase: "run_phase_one",
    title: "Enter mobile OTP",
    description: "Enter the OTP received on the applicant's mobile.",
    icon: Smartphone,
    manual: true,
  },
  {
    id: "signup-next",
    phase: "run_phase_one",
    title: "Next step",
    description: "Continue to the applicant information section.",
    icon: Check,
  },
  {
    id: "signup-dob",
    phase: "run_phase_one",
    title: "Enter date of birth",
    description: "Enter the applicant's date of birth.",
    icon: Calendar,
  },
  {
    id: "signup-passport",
    phase: "run_phase_one",
    title: "Enter passport number",
    description: "Enter the applicant's passport number.",
    icon: FileText,
  },
  {
    id: "signup-nid",
    phase: "run_phase_one",
    title: "Enter NID number",
    description: "Enter the applicant's NID number.",
    icon: UserCheck,
  },
  {
    id: "signup-surname",
    phase: "run_phase_one",
    title: "Enter surname",
    description: "Enter the surname exactly as shown on the passport.",
    icon: User,
  },
  {
    id: "signup-given-name",
    phase: "run_phase_one",
    title: "Enter given name",
    description: "Enter the given name exactly as shown on the passport.",
    icon: User,
  },
  {
    id: "signup-submit-information",
    phase: "run_phase_one",
    title: "Click Sign Up",
    description: "Submit the applicant's personal information.",
    icon: UserPlus,
  },
  {
    id: "signup-password",
    phase: "run_phase_one",
    title: "Enter password",
    description: "Enter the password for the Indian Visa Application account.",
    icon: Lock,
  },
  {
    id: "signup-confirm-password",
    phase: "run_phase_one",
    title: "Confirm password",
    description: "Enter the password again to confirm it.",
    icon: KeyRound,
  },
  {
    id: "signup-submit-password",
    phase: "run_phase_one",
    title: "Click Sign Up",
    description: "Submit the password and continue.",
    icon: UserPlus,
  },
  {
    id: "signup-consent-1",
    phase: "run_phase_one",
    title: "First consent",
    description: "Accept the first consent checkbox.",
    icon: Check,
  },
  {
    id: "signup-consent-2",
    phase: "run_phase_one",
    title: "Second consent",
    description: "Accept the second consent checkbox.",
    icon: Check,
  },
  {
    id: "signup-consent-3",
    phase: "run_phase_one",
    title: "Third consent",
    description: "Accept the third consent checkbox.",
    icon: Check,
  },
  {
    id: "signup-complete",
    phase: "run_phase_one",
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

export const phaseTwoWorkFlow: WorkflowStepDefinition[] = [
  {
    id: "signin-email",
    phase: "run_phase_two",
    title: "Enter email address",
    description:
      "Enter the registered Indian Visa Application account email address.",
    icon: AtSign,
  },
  {
    id: "signin-password",
    phase: "run_phase_two",
    title: "Enter password",
    description:
      "Enter the registered Indian Visa Application account password.",
    icon: Lock,
  },
  {
    id: "signin-human-verification",
    phase: "run_phase_two",
    title: "Human verification",
    description: "Complete the 'I am not a robot' verification.",
    icon: ShieldCheck,
    manual: true,
  },
  {
    id: "signin-submit",
    phase: "run_phase_two",
    title: "Sign In Now",
    description: "Click the Sign In Now button.",
    icon: LogIn,
  },
  {
    id: "signin-mobile-otp",
    phase: "run_phase_two",
    title: "Enter mobile OTP",
    description: "Enter the OTP received on the registered mobile number.",
    icon: Smartphone,
    manual: true,
  },
];

/**
 * ============================================================
 * FLOW TABS
 * ============================================================
 */

export const flowTabs = [
  {
    id: "run_phase_one" as const,
    title: "Run Phase 1",
  },
  {
    id: "run_phase_two" as const,
    title: "Run Phase 2",
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
  run_phase_one: phaseOneWorkflow,
  run_phase_two: phaseTwoWorkFlow,
};
