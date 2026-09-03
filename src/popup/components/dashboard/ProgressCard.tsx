import { Step } from "../../types";

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
  const currentIndex = currentStep
    ? steps.findIndex((step) => step.id === currentStep.id) + 1
    : 0;

  return (
    <section className="ivac-card rounded-xl p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide ivac-text-muted">
            Automation Progress
          </p>

          <h2 className="mt-0.5 text-sm font-bold">
            {currentStep ? currentStep.title : "Automation Complete"}
          </h2>
        </div>

        <span className="text-lg font-bold ivac-primary">{progress}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--app-surface-2)]">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[9px] ivac-text-muted">
        <span>
          {currentStep
            ? `Step ${currentIndex} of ${steps.length}`
            : "All steps completed"}
        </span>

        <span>{paused ? "Paused" : running ? "Running" : "Stopped"}</span>
      </div>
    </section>
  );
}
