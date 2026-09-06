import { LucideIcon } from "lucide-react";
import React from "react";
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

export type Status = "completed" | "running" | "pending" | "failed" | "paused";

export type Step = {
  id: string;
  title: string;
  child?: React.ReactNode;
  icon: LucideIcon;
  status: Status;
  progress?: number;
};

export type WorkflowPhase = "phase_one" | "phase_two";

export type WorkflowStep = {
  id: string;
  phase: WorkflowPhase;
  title: string;
  child?: React.ReactNode;
  icon: LucideIcon;
  manual?: boolean;

  status: "pending" | "running" | "completed" | "failed";

  progress: number;
};

export type WorkflowStepDefinition = {
  id: string;
  phase: WorkflowPhase;
  title: string;
  child?: React.ReactNode;
  icon: LucideIcon;
  manual?: boolean;
};

/**
 * ============================================================
 * SIGN UP
 * ============================================================
 */

export const phaseOneWorkFlow: WorkflowStepDefinition[] = [
  {
    id: "signup-email",
    phase: "phase_one",
    title: "Enter email address",
    icon: AtSign,
  },
  {
    id: "signup-send-email-otp",
    phase: "phase_one",
    title: "Send email OTP",
    icon: Send,
  },
  {
    id: "signup-email-otp",
    phase: "phase_one",
    title: "Enter email OTP",
    child: "Enter the OTP received in the application account email.",
    icon: MessageSquare,
    manual: true,
  },
  {
    id: "signup-passport",
    phase: "phase_one",
    title: "Enter passport number",
    icon: FileText,
  },
  {
    id: "signup-complete",
    phase: "phase_one",
    title: "Complete Sign Up",
    icon: CheckCircle,
  },
];

/**
 * ============================================================
 * SIGN IN
 * ============================================================
 */

export const phaseTwoWorkflow: WorkflowStepDefinition[] = [
  {
    id: "signin-email",
    phase: "phase_two",
    title: "Enter email address",
    icon: AtSign,
  },
  {
    id: "signin-password",
    phase: "phase_two",
    title: "Enter password",
    icon: Lock,
  },
  {
    id: "signin-human-verification",
    phase: "phase_two",
    title: "Human verification",
    icon: ShieldCheck,
    manual: true,
  },
  {
    id: "signin-submit",
    phase: "phase_two",
    title: "Sign In Now",
    icon: LogIn,
  },
  {
    id: "signin-mobile-otp",
    phase: "phase_two",
    title: "Enter mobile OTP",
    child: "Enter the OTP received on the registered mobile number.",
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
    id: "phase_one" as const,
    title: "Phase One",
  },
  {
    id: "phase_two" as const,
    title: "Phase Two",
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
  phase_one: phaseOneWorkFlow,
  phase_two: phaseTwoWorkflow,
};

export type StepStatus =
  | "completed"
  | "running"
  | "pending"
  | "failed"
  | "paused";

export type AutomationStep = {
  id: string;
  title: string;
  child?: React.ReactNode;
  icon: LucideIcon;
  status: StepStatus;
  progress?: number;
};

/* -------------------------------------------------------------------------- */
/* Workflow Logs                                                              */
/* -------------------------------------------------------------------------- */
export type LogType = "success" | "info" | "warning" | "error";

export type WorkflowLog = {
  type: LogType;
  message: string;
  time: string;
};
