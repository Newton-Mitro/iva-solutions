import { LucideIcon } from "lucide-react";
import React from "react";
import type {
  Application,
  Appointment,
  AutomationAccount,
  Webfile,
} from "./models";
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

export type Status =
  | "completed"
  | "running"
  | "pending"
  | "failed"
  | "paused"
  | "skipped";

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
  manualInput?: "otp" | "verification";
  selectors: string[];
  action: "focus" | "fill" | "click";
  valueKey?: WorkflowValueKey;

  status: "pending" | "running" | "completed" | "failed" | "skipped";

  progress: number;
};

export type WorkflowStepDefinition = {
  id: string;
  phase: WorkflowPhase;
  title: string;
  child?: React.ReactNode;
  icon: LucideIcon;
  manual?: boolean;
  manualInput?: "otp" | "verification";
  selectors: string[];
  action: "focus" | "fill" | "click";
  valueKey?: WorkflowValueKey;
};

export type WorkflowValueKey =
  | "application.email"
  | "application.passportNumber"
  | "application.mobile"
  | "account.email"
  | "account.mobile"
  | "account.ivacPassword"
  | "webfile.primary.webfileNumber";

export type WorkflowContext = {
  application?: Application;
  account?: AutomationAccount;
  webfiles: Webfile[];
  appointment?: Appointment;
};

/**
 * ============================================================
 * SIGN UP
 * ============================================================
 */

export const phaseOneWorkFlow: WorkflowStepDefinition[] = [
  {
    id: "signin-email",
    phase: "phase_one",
    title: "Enter email address",
    icon: AtSign,
    selectors: [
      'input[type="email"]',
      'input[type="text"]',
      'input[name="username"]',
    ],
    action: "fill",
    valueKey: "account.email",
  },
  {
    id: "signin-password",
    phase: "phase_one",
    title: "Enter password",
    icon: Send,
    selectors: ["input[type=password]", "input[name='password']", "input"],
    action: "fill",
    valueKey: "account.ivacPassword",
  },
  // {
  //   id: "signin-otp",
  //   phase: "phase_one",
  //   title: "Enter OTP",
  //   child: "Enter the OTP received in the application account email.",
  //   icon: MessageSquare,
  //   manual: true,
  //   manualInput: "otp",
  //   selectors: [
  //     'input[autocomplete="one-time-code"]',
  //     'input[name="otp"]',
  //     'input[id*="otp" i]',
  //   ],
  //   action: "focus",
  // },
  {
    id: "sign-in",
    phase: "phase_one",
    title: "Sign In",
    icon: CheckCircle,
    selectors: ["input[type=submit]", "input"],
    action: "click",
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
    selectors: ['input[type="email"]', 'input[name="email"]', "#email"],
    action: "fill",
    valueKey: "account.email",
  },
  {
    id: "signin-password",
    phase: "phase_two",
    title: "Enter password",
    icon: Lock,
    selectors: [
      'input[type="password"]',
      'input[name="password"]',
      "#password",
    ],
    action: "fill",
    valueKey: "account.ivacPassword",
  },
  {
    id: "signin-human-verification",
    phase: "phase_two",
    title: "Human verification",
    icon: ShieldCheck,
    manual: true,
    manualInput: "verification",
    selectors: [
      'input[type="checkbox"]',
      '[role="checkbox"]',
      'iframe[title*="captcha" i]',
    ],
    action: "focus",
  },
  {
    id: "signin-submit",
    phase: "phase_two",
    title: "Sign In Now",
    icon: LogIn,
    selectors: ["button[type=submit]", "button"],
    action: "click",
  },
  {
    id: "signin-mobile-otp",
    phase: "phase_two",
    title: "Enter mobile OTP",
    child: "Enter the OTP received on the registered mobile number.",
    icon: Smartphone,
    manual: true,
    manualInput: "otp",
    selectors: [
      'input[autocomplete="one-time-code"]',
      'input[name="otp"]',
      'input[id*="otp" i]',
    ],
    action: "focus",
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
  | "paused"
  | "skipped";

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
