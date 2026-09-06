import {
  Globe2,
  LockKeyhole,
  LucideIcon,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import React from "react";
import type {
  Application,
  Appointment,
  AutomationAccount,
  Webfile,
} from "./models";
import { AtSign, CheckCircle, LogIn, Send } from "lucide-react";

export type StepStatus =
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
  status: StepStatus;
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
  action: "navigate" | "focus" | "fill" | "click";
  url?: string;
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
  action: "navigate" | "focus" | "fill" | "click";
  url?: string;
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
 */ export const phaseOneWorkFlow: WorkflowStepDefinition[] = [
  {
    id: "open-ivac",
    phase: "phase_one",
    title: "Open IVAC website",
    icon: Globe2,
    selectors: [],
    action: "navigate",
    url: "https://appointment.ivacbd.com/signin",
  },

  {
    id: "signin-phone",
    phase: "phase_one",
    title: "Enter phone number",
    icon: Phone,
    selectors: ['input[name="phone"]'],
    action: "fill",
    valueKey: "account.mobile",
  },

  {
    id: "signin-password",
    phase: "phase_one",
    title: "Enter password",
    icon: LockKeyhole,
    selectors: ['input[name="password"]', 'input[type="password"]'],
    action: "fill",
    valueKey: "account.ivacPassword",
  },

  {
    id: "sign-verify-human",
    phase: "phase_one",
    title: "Human verification required",
    icon: ShieldCheck,
    selectors: [
      'input[aria-label="Verify you are human"]',
      'input[type="checkbox"][aria-label*="human" i]',
      'input[type="checkbox"][aria-label*="verify" i]',
    ],
    action: "click",
  },

  {
    id: "sign-in-now",
    phase: "phase_one",
    title: "Sign in",
    icon: LogIn,
    selectors: ['button[type="submit"]', "button"],
    action: "click",
  },
];

/**
 * ============================================================
 * PHASE TWO
 * ============================================================
 */

export const phaseTwoWorkflow: WorkflowStepDefinition[] = [
  {
    id: "open-portfolio",
    phase: "phase_two",
    title: "Open Developer Portfolio",
    icon: UserRound,
    selectors: [],
    action: "navigate",
    url: "https://newton-mitro.github.io/nm-portfolio/",
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
