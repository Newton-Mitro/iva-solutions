import { ArrowRight, RefreshCw } from "lucide-react";
import WorkflowSteps from "./WorkflowSteps";
import { Step, WorkflowPhase } from "../../types";
import { flowTabs, workflowPhases } from "../../constants";

type Props = {
  phase: WorkflowPhase;
  steps: Step[];
  started: boolean;
  onPhaseChange: (phase: WorkflowPhase) => void;
  onStart: () => void;
  onReset: () => void;
};

export default function WorkflowCard({
  phase,
  steps,
  started,
  onPhaseChange,
  onStart,
  onReset,
}: Props) {
  const current = workflowPhases.find((item) => item.id === phase);

  const phaseIndex = flowTabs.findIndex((item) => item.id === phase);

  const phaseSteps = steps.filter(
    (step) => step.id.startsWith(`${phase}-`) || phase === "signup",
  );

  return (
    <section className="ivac-card rounded-xl p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide ivac-text-muted">
            Indian Visa Application process
          </p>

          <h2 className="mt-0.5 text-sm font-bold">
            Indian Visa Application flows
          </h2>
        </div>

        <span className="ivac-primary-bg rounded-full px-2 py-1 text-[9px] font-bold ivac-primary">
          {phaseIndex + 1} / {flowTabs.length}
        </span>
      </div>

      <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
        {flowTabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onPhaseChange(tab.id)}
            className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[9px] font-bold ${
              tab.id === phase
                ? "bg-blue-600 text-white"
                : index < phaseIndex
                  ? "bg-emerald-100 text-emerald-700"
                  : "ivac-surface-2 ivac-text-muted"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900 dark:bg-blue-950/20">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Current Automation Flow
            </p>

            <h3 className="mt-1 text-sm font-bold text-blue-950 dark:text-blue-100">
              {current?.title}
            </h3>

            <p className="mt-1 text-[10px] leading-4 text-blue-800 dark:text-blue-200">
              {current?.description}
            </p>
          </div>

          <button
            onClick={onReset}
            className="ivac-hover flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[9px] font-medium ivac-text-muted"
          >
            <RefreshCw size={11} />
            Reset
          </button>
        </div>

        {phase === "signup" && (
          <div className="mt-3">
            <WorkflowSteps steps={phaseSteps} />
          </div>
        )}

        {phase === "signin" && (
          <ManualNotice>
            Human verification and mobile OTP must be completed manually in the
            portal.
          </ManualNotice>
        )}

        {phase === "mission" && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ReadOnlyField label="Mission" value="Dhaka" />

            <ReadOnlyField
              label="Indian Visa Application Center"
              value="Indian Visa Application, Dhaka (JFP)"
            />
          </div>
        )}

        {phase === "relogin" && (
          <ManualNotice>
            Please sign in again at 6:00 PM before booking becomes available.
          </ManualNotice>
        )}

        {phase === "webfile" && (
          <ManualNotice>
            Upload the primary Webfile and any additional Webfiles, confirm the
            information, then choose Save & Continue.
          </ManualNotice>
        )}

        {phase === "payment" && (
          <ManualNotice>
            Payment requires explicit user confirmation. Card security
            information should be entered by the user directly.
          </ManualNotice>
        )}

        <button
          onClick={onStart}
          className="mt-3 w-full rounded-lg bg-blue-600 py-2.5 text-[10px] font-bold text-white hover:bg-blue-700"
        >
          {started ? "Continue flow" : "Start flow"}

          <ArrowRight size={12} className="ml-1 inline" />
        </button>
      </div>
    </section>
  );
}

function ManualNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-md bg-amber-50 p-2 text-[9px] text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
      {children}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="text-[9px] font-semibold text-blue-900 dark:text-blue-100">
      {label}

      <input className="ivac-input mt-1" value={value} readOnly />
    </label>
  );
}
