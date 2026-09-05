import { Step } from "../../../../types/dashboard.types";
import { StepIcon } from "./Shared";

type Props = {
  steps: Step[];
};

export default function WorkflowSteps({ steps }: Props) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex gap-3">
          {index !== steps.length - 1 && (
            <div
              className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
                step.status === "completed"
                  ? "bg-emerald-400"
                  : "bg-[var(--app-border)]"
              }`}
            />
          )}

          <div className="relative z-10">
            <StepIcon {...step} />
          </div>

          <div
            className={`mb-3 flex-1 rounded-lg border p-2.5 ${
              step.status === "running"
                ? "border-blue-300 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20"
                : "border-[var(--app-border)] bg-[var(--app-surface)]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold">{step.title}</p>

                <p className="mt-0.5 text-[9px] ivac-text-muted">
                  {step.description}
                </p>
              </div>

              <StepStatus status={step.status} />
            </div>

            {step.status === "running" && (
              <div className="mt-2">
                <div className="mb-1 flex justify-between text-[8px] ivac-text-muted">
                  <span>Processing...</span>
                  <span>{step.progress ?? 0}%</span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--app-surface-2)]">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${step.progress ?? 0}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepStatus({ status }: { status: Step["status"] }) {
  const labels = {
    completed: "DONE",
    running: "RUNNING",
    pending: "WAITING",
    paused: "PAUSED",
    failed: "FAILED",
  };

  const classes = {
    completed: "text-emerald-500",
    running: "text-blue-500 animate-pulse",
    pending: "ivac-text-muted",
    paused: "text-amber-500",
    failed: "text-red-500",
  };

  return (
    <span className={`shrink-0 text-[8px] font-bold ${classes[status]}`}>
      {labels[status]}
    </span>
  );
}
