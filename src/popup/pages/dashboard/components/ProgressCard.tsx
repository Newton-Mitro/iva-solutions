import { CheckCircle2, ChevronDown, Circle, Pause, Play } from "lucide-react";
import { useState } from "react";
import { Step } from "../../../../types/dashboard.types";

type Props = {
  progress: number;
  currentStep?: Step;
  steps: Step[];
  running: boolean;
  paused: boolean;
};

export default function ProgressCard({
  progress,
  currentStep,
  steps,
  running,
  paused,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const currentIndex = currentStep
    ? steps.findIndex((step) => step.id === currentStep.id) + 1
    : 0;

  const isComplete = !currentStep && progress >= 100;

  const status = paused
    ? "Paused"
    : running
      ? "Running"
      : isComplete
        ? "Completed"
        : "Stopped";

  const statusClass = paused
    ? "text-amber-600 bg-amber-500/10 dark:text-amber-400"
    : running
      ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
      : isComplete
        ? "ivac-primary bg-(--app-primary)/10"
        : "ivac-text-muted bg-(--app-muted)";

  return (
    <section
      className="
        ivac-card overflow-hidden rounded-2xl
        border border-(--app-border)
        shadow-sm
        transition-shadow duration-200
        hover:shadow-md
      "
    >
      {/* =========================================================
          HEADER — ALWAYS VISIBLE
      ========================================================== */}
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="
          ivac-hover flex w-full items-center
          justify-between gap-3
          p-3.5 text-left
          transition-colors
        "
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Status icon */}
          <div
            className={`
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-xl
              ${
                isComplete
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : running
                    ? "ivac-primary-bg ivac-primary"
                    : paused
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "ivac-surface-2 ivac-text-muted"
              }
            `}
          >
            {isComplete ? (
              <CheckCircle2 size={17} />
            ) : running ? (
              <Play size={15} fill="currentColor" strokeWidth={0} />
            ) : paused ? (
              <Pause size={15} fill="currentColor" strokeWidth={0} />
            ) : (
              <Circle size={16} />
            )}
          </div>

          {/* Title */}
          <div className="min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
              Automation Progress
            </p>

            <h2 className="mt-0.5 truncate text-xs font-bold">
              {currentStep?.title ?? "Automation Complete"}
            </h2>
          </div>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="text-right">
            <div className="text-base font-extrabold tracking-tight ivac-primary">
              {Math.round(progress)}%
            </div>

            <span
              className={`
                inline-flex items-center rounded-full
                px-1.5 py-0.5
                text-[7px] font-bold
                ${statusClass}
              `}
            >
              {status}
            </span>
          </div>

          {/* Chevron */}
          <div
            className="
              flex h-6 w-6 items-center justify-center
              rounded-lg
              bg-(--app-surface-2)
              ivac-text-muted
            "
          >
            <ChevronDown
              size={14}
              className={`
                transition-transform duration-200
                ${expanded ? "rotate-180" : ""}
              `}
            />
          </div>
        </div>
      </button>

      {/* =========================================================
          EXPANDABLE CONTENT
      ========================================================== */}
      <div
        className={`
          grid transition-[grid-template-rows,opacity]
          duration-250 ease-out
          ${
            expanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-(--app-border) px-3.5 pb-3.5 pt-3">
            {/* =====================================================
                PROGRESS
            ====================================================== */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[8px] font-semibold ivac-text-muted">
                  Overall progress
                </span>

                <span className="text-[8px] font-medium ivac-text-muted">
                  {currentStep
                    ? `Step ${currentIndex} of ${steps.length}`
                    : "All steps completed"}
                </span>
              </div>

              {/* Progress track */}
              <div
                className="
                  relative h-2 overflow-hidden
                  rounded-full bg-(--app-surface-2)
                "
              >
                <div
                  className={`
                    relative h-full rounded-full
                    transition-all duration-500 ease-out
                    ${isComplete ? "bg-emerald-500" : "ivac-primary-bg"}
                  `}
                  style={{
                    width: `${Math.min(100, Math.max(0, progress))}%`,
                  }}
                >
                  {/* Running shine */}
                  {running && progress > 0 && progress < 100 && (
                    <div className="absolute inset-0 animate-pulse bg-white/15" />
                  )}
                </div>
              </div>
            </div>

            {/* =====================================================
                STEP INDICATORS
            ====================================================== */}
            {steps.length > 0 && (
              <div className="mt-3 flex items-center gap-1">
                {steps.map((step, index) => {
                  const stepNumber = index + 1;

                  const completed = currentStep
                    ? stepNumber < currentIndex
                    : true;

                  const active = currentStep?.id === step.id;

                  return (
                    <div
                      key={step.id}
                      className="flex min-w-0 flex-1 items-center gap-1"
                    >
                      <div
                        title={step.title}
                        className={`
                          h-1.5 w-full overflow-hidden rounded-full
                          transition-all duration-300
                          ${
                            completed
                              ? "bg-emerald-500"
                              : active
                                ? "ivac-primary-bg"
                                : "bg-(--app-surface-2)"
                          }
                        `}
                      />

                      {index < steps.length - 1 && (
                        <span className="hidden text-[7px] ivac-text-muted sm:block">
                          {stepNumber}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* =====================================================
                FOOTER
            ====================================================== */}
            <div
              className="
                mt-3 flex items-center justify-between
                border-t border-(--app-border)
                pt-2.5
              "
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className={`
                    h-1.5 w-1.5 shrink-0 rounded-full
                    ${
                      running
                        ? "animate-pulse bg-emerald-500"
                        : paused
                          ? "bg-amber-500"
                          : isComplete
                            ? "bg-emerald-500"
                            : "bg-(--app-text-muted)"
                    }
                  `}
                />

                <span className="truncate text-[8px] font-medium ivac-text-muted">
                  {paused
                    ? "Automation paused"
                    : running
                      ? "Automation is running"
                      : isComplete
                        ? "Workflow completed"
                        : "Automation stopped"}
                </span>
              </div>

              <span className="shrink-0 text-[8px] font-semibold ivac-text-muted">
                {steps.length} {steps.length === 1 ? "step" : "steps"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
