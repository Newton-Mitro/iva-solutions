import {
  Check,
  ChevronDown,
  Circle,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Square,
} from "lucide-react";
import { useState } from "react";
import WorkflowSteps from "./WorkflowSteps";
import { flowTabs } from "../constants";
import { WorkflowPhase, WorkflowStep } from "../../../types/dashboard.types";

type Props = {
  phase: WorkflowPhase;
  steps: WorkflowStep[];
  started: boolean;

  onPhaseChange: (phase: WorkflowPhase) => void;
  onStart: () => void;
  onReset: () => void;
  onStop?: () => void;
};

export default function WorkflowCard({
  phase,
  steps,
  started,
  onPhaseChange,
  onStart,
  onReset,
  onStop,
}: Props) {
  const [open, setOpen] = useState(true);

  const current = flowTabs.find((item) => item.id === phase);
  const phaseIndex = flowTabs.findIndex((item) => item.id === phase);
  const phaseSteps = steps;

  const completedCount = phaseSteps.filter(
    (step) => step.status === "completed",
  ).length;

  const progress =
    phaseSteps.length > 0
      ? Math.round((completedCount / phaseSteps.length) * 100)
      : 0;

  return (
    <section className="ivac-card overflow-hidden rounded-2xl border border-(--app-border) shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="ivac-hover group flex w-full items-center justify-between gap-3 p-3.5 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Flow Icon */}
          <div className="ivac-primary-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <RotateCcw size={16} className="ivac-primary" />
          </div>

          {/* Heading */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold">Automation RUN</h2>
            </div>

            <p className="mt-0.5 truncate text-[9px] ivac-text-muted">
              Indian Visa Application automation
            </p>
          </div>
        </div>

        {/* Header Right */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="ivac-primary-bg ivac-primary rounded-full px-2 py-1 text-[8px] font-bold">
            Phase {phaseIndex + 1}/{flowTabs.length}
          </span>

          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
              open ? "bg-(--app-muted)" : ""
            }`}
          >
            <ChevronDown
              size={15}
              className={`ivac-text-muted transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {/* =========================================================
          CONTENT
      ========================================================== */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-(--app-border)" />

          <div className="space-y-3 p-3.5">
            {/* =====================================================
                PHASE NAVIGATION
            ====================================================== */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {flowTabs.map((tab, index) => {
                const active = tab.id === phase;
                const completed = index < phaseIndex;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onPhaseChange(tab.id)}
                    className={`
                        group flex shrink-0 items-center gap-1.5
                        rounded-lg px-2.5 py-1.5
                        text-[9px] font-bold
                        transition-all duration-150
                        active:scale-95
                        ${
                          active
                            ? "ivac-primary-bg ivac-primary shadow-sm"
                            : completed
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "ivac-surface-2 ivac-text-muted hover:opacity-80"
                        }
                      `}
                  >
                    {completed ? (
                      <Check size={10} strokeWidth={3} />
                    ) : active ? (
                      <Circle size={8} fill="currentColor" strokeWidth={0} />
                    ) : (
                      <Circle size={8} />
                    )}

                    {tab.title}
                  </button>
                );
              })}
            </div>

            {/* =====================================================
                CURRENT FLOW
            ====================================================== */}
            <div className="ivac-primary-bg/40 overflow-hidden rounded-xl border border-(--app-border)">
              {/* Progress strip */}
              <div className="h-0.5 w-full bg-(--app-border)">
                <div
                  className="ivac-primary-bg h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-2.5">
                    <div className="ivac-primary-bg flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                      <Circle
                        size={12}
                        fill="currentColor"
                        strokeWidth={0}
                        className="ivac-primary"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-bold uppercase tracking-wider ivac-primary">
                          Current stage
                        </span>

                        {phaseSteps.length > 0 && (
                          <span className="text-[8px] ivac-text-muted">
                            • {completedCount}/{phaseSteps.length}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-0.5 truncate text-xs font-bold">
                        {current?.title}
                      </h3>

                      <p className="mt-1 text-[9px] leading-4 ivac-text-muted">
                        {getPhaseDescription(phase)}
                      </p>
                    </div>
                  </div>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={onReset}
                    title="Reset workflow"
                    className="ivac-hover flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[8px] font-semibold ivac-text-muted"
                  >
                    <RefreshCw size={11} />
                    Reset
                  </button>
                </div>

                {/* =================================================
                    WORKFLOW STEPS
                ================================================== */}
                {phaseSteps.length > 0 && (
                  <div className="mt-3 rounded-lg border border-(--app-border) bg-(--app-background)/40 p-2.5">
                    <WorkflowSteps steps={phaseSteps} />
                  </div>
                )}

                {/* =================================================
                    CONTROLS
                ================================================== */}
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 rounded-full border border-(--app-border) bg-(--app-muted)/70 p-1.5 shadow-sm backdrop-blur-sm">
                    {/* Start / Pause */}
                    <button
                      type="button"
                      onClick={onStart}
                      title={started ? "Pause automation" : "Start automation"}
                      className={`
                        group relative flex h-10 w-10
                        items-center justify-center
                        rounded-full
                        text-white
                        shadow-md
                        transition-all duration-200
                        hover:scale-105
                        active:scale-90
                        ${
                          started
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/20"
                            : "ivac-primary-bg shadow-(--app-primary)/20"
                        }
                      `}
                    >
                      {started ? (
                        <Pause
                          size={15}
                          fill="currentColor"
                          strokeWidth={0}
                          className="transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <Play
                          size={15}
                          fill="currentColor"
                          strokeWidth={0}
                          className="ml-0.5 transition-transform group-hover:scale-110"
                        />
                      )}
                    </button>

                    {/* Stop */}
                    <button
                      type="button"
                      onClick={onStop}
                      disabled={!started}
                      title="Stop automation"
                      className="
                        group flex h-10 w-10
                        items-center justify-center
                        rounded-full
                        border border-red-500/20
                        bg-red-500/10
                        text-red-500
                        transition-all duration-200
                        hover:scale-105
                        hover:bg-red-500/15
                        hover:shadow-md
                        hover:shadow-red-500/10
                        active:scale-90
                        disabled:cursor-not-allowed
                        disabled:opacity-30
                        dark:text-red-400
                      "
                    >
                      <Square
                        size={12}
                        fill="currentColor"
                        strokeWidth={0}
                        className="transition-transform group-hover:scale-110"
                      />
                    </button>
                  </div>
                </div>

                {/* Running status */}
                {started && (
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                    <span className="text-[8px] font-medium text-emerald-600 dark:text-emerald-400">
                      Automation is running
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   PHASE DESCRIPTION
================================================================ */

function getPhaseDescription(phase: WorkflowPhase): string {
  switch (phase) {
    case "signup":
      return "Create and configure the Indian Visa Application account.";

    case "signin":
      return "Sign in to the registered Indian Visa Application account.";

    case "webfile":
      return "Upload and manage webfiles for the application.";

    case "mission":
      return "Select the mission (consulate/embassy).";

    case "appointment":
      return "Book an appointment for the visa interview.";

    case "payment":
      return "Process payment for the visa application.";

    case "invoice":
      return "Download the invoice for the payment.";

    case "signout":
      return "Sign out from the account.";

    default:
      return "Manage the current automation workflow.";
  }
}
