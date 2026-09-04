import { LucideIcon } from "lucide-react";

export type Status = "completed" | "running" | "pending" | "failed" | "paused";

export type Step = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: Status;
  progress?: number;
};

export type RelatedRecord = {
  id: string;
  applicantId?: string;
  ivacApplicationId?: string;
  automationAccountId?: string;
  status?: string;
  [key: string]: unknown;
};

export type WorkflowPhase =
  | "signup"
  | "signin"
  | "webfile"
  | "mission"
  | "appointment"
  | "payment"
  | "invoice"
  | "signout";

export type LogEntry = {
  type: "success" | "info" | "warning" | "error";
  message: string;
  time: string;
};

export type WorkflowStep = {
  id: string;
  phase: WorkflowPhase;
  title: string;
  description: string;
  icon: LucideIcon;
  manual?: boolean;

  status: "pending" | "running" | "completed" | "failed";

  progress: number;
};

export type WorkflowStepDefinition = {
  id: string;
  phase: WorkflowPhase;
  title: string;
  description: string;
  icon: LucideIcon;
  manual?: boolean;
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
  description: string;
  icon: LucideIcon;
  status: StepStatus;
  progress?: number;
};
