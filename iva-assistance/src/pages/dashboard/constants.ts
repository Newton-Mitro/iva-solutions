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
    id: "signup-passport",
    phase: "run_phase_one",
    title: "Enter passport number",
    description: "Enter the applicant's passport number.",
    icon: FileText,
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
