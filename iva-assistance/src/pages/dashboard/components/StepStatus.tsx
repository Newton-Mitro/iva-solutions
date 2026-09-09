import type { WorkflowStep } from "../../../types/workflow.type";

export function StepStatus({ status }: { status: WorkflowStep["status"] }) {
  const labels = {
    completed: "DONE",
    running: "RUNNING",
    pending: "WAITING",
    paused: "PAUSED",
    failed: "FAILED",
    skipped: "SKIPPED",
  };

  const classes = {
    completed: "text-emerald-500",
    running: "text-blue-500 animate-pulse",
    pending: "ivac-text-muted",
    paused: "text-amber-500",
    failed: "text-red-500",
    skipped: "ivac-text-muted",
  };

  return (
    <span className={`shrink-0 text-[8px] font-bold ${classes[status]}`}>
      {labels[status]}
    </span>
  );
}
