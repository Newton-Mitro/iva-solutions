import type { Message } from "../../../types/message.type";
import type { WorkflowStep } from "../../../types/workflow.type";
import { StepIcon } from "./Shared";
import { ManualStepAction } from "./HumanAction";
import { StepStatus } from "./StepStatus";

type WorkflowStepItemProps = {
  step: WorkflowStep;
  index: number;
  total: number;
  started?: boolean;
  latestMessage?: Message | null;
  onHumanAction?: (value?: string) => void;
  onStartFromStep?: (stepId: string) => void;
  onRunOnlyStep?: (stepId: string) => void;
  onSkip?: (stepId: string) => void;
  onRetry?: (stepId: string) => void;
  onContinue?: (stepId: string) => void;
};

export function WorkflowStepItem({
  step,
  index,
  total,
  started = false,
  latestMessage,
  onHumanAction,
  onStartFromStep,
  onRunOnlyStep,
  onSkip,
  onRetry,
  onContinue,
}: WorkflowStepItemProps) {
  return (
    <div key={step.id} data-step-id={step.id} className="relative flex gap-3">
      {index !== total - 1 && (
        <div
          className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-px ${
            step.status === "completed" || step.status === "skipped"
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

            <p className="mt-0.5 text-[9px] ivac-text-muted">{step.child}</p>
          </div>

          <StepStatus status={step.status} />
        </div>

        {!started && step.status !== "running" && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {onStartFromStep && (
              <button
                type="button"
                onClick={() => onStartFromStep(step.id)}
                className="rounded-md border border-[var(--app-primary)]/30 px-2 py-1 text-[8px] font-semibold text-[var(--app-primary)] hover:bg-[var(--app-primary)]/10"
              >
                Start here
              </button>
            )}
            {onRunOnlyStep && (
              <button
                type="button"
                onClick={() => onRunOnlyStep(step.id)}
                className="rounded-md border border-emerald-500/30 px-2 py-1 text-[8px] font-semibold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
              >
                Run only
              </button>
            )}
          </div>
        )}

        {step.status === "running" && (
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-[8px] ivac-text-muted">
              <span>Processing...</span>
              <span>{step.progress ?? 0}%</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--app-surface-2)]">
              <div
                className="h-full rounded-full bg-[var(--app-primary)] transition-all"
                style={{
                  width: `${step.progress ?? 0}%`,
                }}
              />
            </div>
          </div>
        )}

        {step.status === "running" && step.manualInput && onHumanAction && (
          <ManualStepAction
            step={step}
            latestMessage={latestMessage}
            onSubmit={onHumanAction}
            onSkip={onSkip}
          />
        )}

        {step.status === "running" && !step.manualInput && onSkip && (
          <button
            type="button"
            onClick={() => onSkip(step.id)}
            className="mt-2 rounded-md border border-(--app-border) px-2 py-1 text-[8px] font-semibold ivac-text-muted"
          >
            Skip
          </button>
        )}

        {step.status === "failed" && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry(step.id)}
                className="rounded-md bg-blue-600 px-2 py-1 text-[8px] font-semibold text-white"
              >
                Retry
              </button>
            )}
            {onContinue && (
              <button
                type="button"
                onClick={() => onContinue(step.id)}
                className="rounded-md border border-amber-500/30 px-2 py-1 text-[8px] font-semibold text-amber-600 dark:text-amber-400"
              >
                Continue
              </button>
            )}
            {onSkip && (
              <button
                type="button"
                onClick={() => onSkip(step.id)}
                className="rounded-md border border-(--app-border) px-2 py-1 text-[8px] font-semibold ivac-text-muted"
              >
                Skip
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
