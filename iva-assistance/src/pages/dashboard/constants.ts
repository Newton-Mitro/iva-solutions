import {
  AtSign,
  CheckCircle,
  FileText,
  Lock,
  LogIn,
  MessageSquare,
  Send,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import {
  WorkflowPhase,
  WorkflowStep,
  WorkflowStepDefinition,
} from "../../types/dashboard.types";

/**
 * ============================================================
 * SIGN UP
 * ============================================================
 */

export const signupWorkflow: WorkflowStepDefinition[] = [
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
    description: "Enter the OTP received in the application account email.",
    icon: MessageSquare,
    manual: true,
  },
  {
    id: "signup-passport",
    phase: "signup",
    title: "Enter passport number",
    description: "Enter the passport number for this application.",
    icon: FileText,
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

export const signinWorkflow: WorkflowStepDefinition[] = [
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
];

export function createWorkflowSteps(phase: WorkflowPhase): WorkflowStep[] {
  return (
    workflowStepsByPhase[phase]?.map((step) => ({
      ...step,
      status: "pending",
      progress: 0,
    })) ?? []
  );
}

export const workflowStepsByPhase: Record<
  WorkflowPhase,
  WorkflowStepDefinition[]
> = {
  signup: signupWorkflow,
  signin: signinWorkflow,
  webfile: [],
  mission: [],
  relogin: [],
  appointment: [],
  payment: [],
  invoice: [],
  signout: [],
};
