import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { WorkflowPhase, WorkflowStep } from "../../../types/dashboard.types";

const phaseLabels: Record<WorkflowPhase, string> = {
  signup: "Sign Up",
  signin: "Sign In",
  webfile: "Webfile",
  mission: "Mission",
  relogin: "Re-login",
  appointment: "Appointment",
  payment: "Payment",
  invoice: "Invoice",
  signout: "Sign Out",
};

type Props = {
  phase: WorkflowPhase;
  steps: WorkflowStep[];
  progress: number;
  currentStep?: WorkflowStep;
};

export default function StepProgress({
  phase,
  steps,
  progress,
  currentStep,
}: Props) {
  const completed = steps.filter((step) => step.status === "completed").length;

  return (
    <section className="ivac-card border-x-0 border-t-0 rounded-none px-4 py-3 shadow-sm sm:border-x sm:rounded-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[8px] font-bold uppercase tracking-[0.16em] ivac-primary">
            Step progress
          </p>
          <h2 className="mt-0.5 truncate text-sm font-bold">
            {currentStep?.title ?? `${phaseLabels[phase]} flow`}
          </h2>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold ivac-primary">{progress}%</p>
          <p className="text-[8px] ivac-text-muted">
            {completed}/{steps.length || 0} complete
          </p>
        </div>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-(--app-surface-2)">
        <div
          className="ivac-primary-bg h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-0.5">
        {steps.slice(0, 8).map((step) => {
          const Icon =
            step.status === "completed"
              ? CheckCircle2
              : step.status === "running"
                ? PlayCircle
                : Circle;

          return (
            <div
              key={step.id}
              title={step.title}
              className={`flex h-6 min-w-6 items-center justify-center rounded-full border px-1.5 text-[8px] font-bold ${
                step.status === "completed"
                  ? "border-emerald-400 bg-emerald-500/10 text-emerald-600"
                  : step.status === "running"
                    ? "border-blue-400 ivac-primary-bg ivac-primary"
                    : "border-(--app-border) ivac-text-muted"
              }`}
            >
              <Icon size={11} />
            </div>
          );
        })}
        {steps.length > 8 && (
          <span className="px-1 text-[8px] ivac-text-muted">
            +{steps.length - 8} more
          </span>
        )}
      </div>
    </section>
  );
}
