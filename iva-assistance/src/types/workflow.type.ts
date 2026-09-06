import { LucideIcon } from "lucide-react";
import React from "react";

import type {
  Application,
  Appointment,
  AutomationAccount,
  Webfile,
} from "./application.type";

import { phaseOneWorkFlow } from "../workflows/phase-one-workflow";
import { phaseTwoWorkflow } from "../workflows/phase-two-workflow";

/* -------------------------------------------------------------------------- */
/* Workflow                                                                    */
/* -------------------------------------------------------------------------- */

export type WorkflowPhase = "phase_one" | "phase_two";

export type WorkflowAction =
  | "navigate"
  | "focus"
  | "fill"
  | "click"
  | "upload-file"
  | "select"
  | "select-option"
  | "check"
  | "uncheck"
  | "replace-text"
  | "replace-html"
  | "wait"
  | "capture";

/* -------------------------------------------------------------------------- */
/* Workflow Step Definition                                                    */
/* -------------------------------------------------------------------------- */

export type WorkflowStepDefinition = {
  id: string;
  phase: WorkflowPhase;
  title: string;

  /**
   * Optional custom UI rendered with the step.
   */
  child?: React.ReactNode;

  /**
   * Lucide icon displayed for the step.
   */
  icon: LucideIcon;

  /**
   * If true, the step requires user interaction.
   */
  manual?: boolean;

  /**
   * Type of manual input required.
   */
  manualInput?: "otp" | "verification";

  /**
   * CSS selectors used to locate the target element.
   */
  selectors: string[];

  /**
   * Optional visible text used to identify an element.
   *
   * Example:
   * text: "Book Appointment"
   */
  text?: string;

  /**
   * Action executed by the workflow engine.
   */
  action: WorkflowAction;

  /**
   * URL used by navigate actions.
   */
  url?: string;

  /**
   * Application/account/context value used by the step.
   */
  valueKey?: WorkflowValueKey;

  /**
   * Optional timeout for waiting for an element/state.
   *
   * Defaults should be handled by the workflow executor.
   */
  timeout?: number;

  /**
   * Whether the step can be skipped when its target
   * element is not present.
   */
  optional?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Runtime Workflow Step                                                       */
/* -------------------------------------------------------------------------- */

export type WorkflowStep = WorkflowStepDefinition & {
  status: StepStatus;
  progress: number;
};

/* -------------------------------------------------------------------------- */
/* Workflow Value Keys                                                         */
/* -------------------------------------------------------------------------- */

export type WorkflowValueKey =
  // Application
  | "application.email"
  | "application.passportNumber"
  | "application.mobile"

  // Account
  | "account.email"
  | "account.mobile"
  | "account.ivacPassword"

  // Webfile
  | "webfile.primary.webfileNumber"
  | "webfile.primary.fileId"
  | "webfile.other.webfileNumbers"
  | "webfile.other.fileIds"
  | "appointment.primaryWebfile"
  | "appointment.otherWebfiles"

  // Appointment configuration
  | "appointment.mission"
  | "appointment.missionId"
  | "appointment.ivacCenter"
  | "appointment.ivacCenterId"

  // Appointment slot
  | "appointment.date"
  | "appointment.time"

  // Appointment result
  | "appointment.details"
  | "appointment.confirmationNumber";

/* -------------------------------------------------------------------------- */
/* Workflow Context                                                            */
/* -------------------------------------------------------------------------- */

export type WorkflowContext = {
  application?: Application;

  account?: AutomationAccount;

  webfiles: Webfile[];

  appointment?: Appointment;
};

/* -------------------------------------------------------------------------- */
/* Workflow Tabs                                                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Workflow Status                                                             */
/* -------------------------------------------------------------------------- */

export type StepStatus =
  | "completed"
  | "running"
  | "pending"
  | "failed"
  | "paused"
  | "skipped";

/* -------------------------------------------------------------------------- */
/* Create Runtime Steps                                                        */
/* -------------------------------------------------------------------------- */

export function createWorkflowSteps(phase: WorkflowPhase): WorkflowStep[] {
  return (
    workflowStepsByPhase[phase]?.map((step) => ({
      ...step,
      status: "pending",
      progress: 0,
    })) ?? []
  );
}

/* -------------------------------------------------------------------------- */
/* Workflow Definitions By Phase                                               */
/* -------------------------------------------------------------------------- */

export const workflowStepsByPhase: Record<
  WorkflowPhase,
  WorkflowStepDefinition[]
> = {
  phase_one: phaseOneWorkFlow,
  phase_two: phaseTwoWorkflow,
};

/* -------------------------------------------------------------------------- */
/* Automation Step                                                             */
/* -------------------------------------------------------------------------- */

export type AutomationStep = {
  id: string;
  title: string;
  child?: React.ReactNode;
  icon: LucideIcon;
  status: StepStatus;
  progress?: number;
};

/* -------------------------------------------------------------------------- */
/* Workflow Logs                                                               */
/* -------------------------------------------------------------------------- */

export type LogType = "success" | "info" | "warning" | "error";

export type WorkflowLog = {
  type: LogType;
  message: string;
  time: string;
};
