import { useRef, useState } from "react";
import { WorkflowStep } from "../../../types/dashboard.types";
import { StepIcon } from "./Shared";

type Props = {
  steps: WorkflowStep[];
  onHumanAction?: (value?: string) => void;
  onSkip?: (stepId: string) => void;
};

export default function WorkflowSteps({ steps, onHumanAction, onSkip }: Props) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex gap-3">
          {index !== steps.length - 1 && (
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

                <p className="mt-0.5 text-[9px] ivac-text-muted">
                  {step.child}
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

            {step.status === "running" && step.manualInput && onHumanAction && (
              <HumanAction
                step={step}
                onSubmit={onHumanAction}
                onSkip={onSkip}
              />
            )}

            {step.status === "running" && !step.manualInput && onSkip && (
              <button
                type="button"
                onClick={() => onSkip(step.id)}
                className="mt-2 rounded-md border border-(--app-border) px-2.5 py-1.5 text-[9px] font-semibold ivac-text-muted"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function HumanAction({
  step,
  onSubmit,
  onSkip,
}: {
  step: WorkflowStep;
  onSubmit: (value?: string) => void;
  onSkip?: (stepId: string) => void;
}) {
  const [value, setValue] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  if (step.manualInput === "verification") {
    return (
      <div className="mt-2 flex gap-1.5">
        <button
          type="button"
          onClick={() => onSubmit()}
          className="rounded-md bg-blue-600 px-2.5 py-1.5 text-[9px] font-semibold text-white"
        >
          Continue after verification
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={() => onSkip(step.id)}
            className="rounded-md border border-(--app-border) px-2.5 py-1.5 text-[9px] font-semibold ivac-text-muted"
          >
            Skip
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      className="mt-2 flex gap-1.5"
      onSubmit={(event) => {
        event.preventDefault();
        const otp = value.replace(/\s/g, "");
        if (otp) {
          onSubmit(otp);
        }
      }}
    >
      <div className="flex min-w-0 flex-1 gap-1">
        {Array.from({ length: 6 }, (_, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            value={value[index] ?? ""}
            onChange={(event) => {
              const digit = event.target.value.replace(/\D/g, "").slice(-1);
              setValue((current) => {
                const next = current.padEnd(6, " ").split("");
                next[index] = digit;
                return next.join("").trimEnd();
              });

              if (digit && index < 5) {
                inputRefs.current[index + 1]?.focus();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !value[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
              }
            }}
            onPaste={(event) => {
              event.preventDefault();
              const pasted = event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, 6);

              if (!pasted) {
                return;
              }

              setValue(pasted);
              inputRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
            }}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`${step.title} digit ${index + 1}`}
            className="h-7 w-7 rounded-md border border-(--app-border) bg-(--app-background) text-center text-[10px] outline-none focus:border-blue-500"
          />
        ))}
      </div>
      <div className="flex gap-1.5">
        <button
          type="submit"
          disabled={!value.trim()}
          className="rounded-md bg-blue-600 px-2.5 py-1.5 text-[9px] font-semibold text-white disabled:opacity-40"
        >
          Continue
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={() => onSkip(step.id)}
            className="rounded-md border border-(--app-border) px-2.5 py-1.5 text-[9px] font-semibold ivac-text-muted"
          >
            Skip
          </button>
        )}
      </div>
    </form>
  );
}

function StepStatus({ status }: { status: WorkflowStep["status"] }) {
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
