import { Pause, Play, RefreshCw, Square } from "lucide-react";

import WorkflowSteps from "./WorkflowSteps";

import type { WorkflowPhase, WorkflowStep } from "../../types";

import { flowTabs } from "../../constants";

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
  /**
   * Current tab information
   */
  const current = flowTabs.find((item) => item.id === phase);

  /**
   * Current tab position
   */
  const phaseIndex = flowTabs.findIndex((item) => item.id === phase);

  /**
   * Steps are already scoped to the selected phase
   * by useWorkflow().
   */
  const phaseSteps = steps;

  return (
    <section className="ivac-card rounded-xl p-3 shadow-sm">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="mb-3 flex items-center justify-between">
        <div className="min-w-0">
          <p className="ivac-text-muted text-[9px] font-semibold uppercase tracking-wide">
            Indian Visa Application process
          </p>

          <h2 className="mt-0.5 text-sm font-bold">
            Indian Visa Application flows
          </h2>
        </div>

        <span className="ivac-primary-bg ivac-primary shrink-0 rounded-full px-2 py-1 text-[9px] font-bold">
          {phaseIndex + 1} / {flowTabs.length}
        </span>
      </div>

      {/* =====================================================
          FLOW TABS
      ====================================================== */}
      <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
        {flowTabs.map((tab, index) => {
          const active = tab.id === phase;
          const completed = index < phaseIndex;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onPhaseChange(tab.id)}
              className={`
                shrink-0 rounded-lg px-2.5 py-1.5
                text-[9px] font-bold
                transition-colors
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : completed
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : "ivac-surface-2 ivac-text-muted"
                }
              `}
            >
              {tab.title}
            </button>
          );
        })}
      </div>

      {/* =====================================================
          CURRENT FLOW
      ====================================================== */}
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
              {getPhaseDescription(phase)}
            </p>
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            title="Reset workflow"
            className="
              ivac-hover
              flex shrink-0 items-center gap-1
              rounded-md px-2 py-1
              text-[9px] font-medium
              ivac-text-muted
            "
          >
            <RefreshCw size={11} />
            Reset
          </button>
        </div>

        {/* ===================================================
            WORKFLOW STEPS
        ==================================================== */}
        {phaseSteps.length > 0 && (
          <div className="mt-3">
            <WorkflowSteps steps={phaseSteps} />
          </div>
        )}

        {/* ===================================================
            SIGN IN NOTICE
        ==================================================== */}
        {phase === "signin" && (
          <ManualNotice>
            Human verification and mobile OTP must be completed manually in the
            portal.
          </ManualNotice>
        )}

        {/* ===================================================
            MISSION
        ==================================================== */}
        {phase === "mission" && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ReadOnlyField label="Mission" value="Dhaka" />

            <ReadOnlyField
              label="Indian Visa Application Center"
              value="Indian Visa Application, Dhaka (JFP)"
            />
          </div>
        )}

        {/* ===================================================
            WEBFILE
        ==================================================== */}
        {phase === "webfile" && (
          <ManualNotice>
            Upload the primary Webfile and any additional Webfiles, confirm the
            information, then choose Save & Continue.
          </ManualNotice>
        )}

        {/* ===================================================
            APPOINTMENT
        ==================================================== */}
        {phase === "appointment" && (
          <ManualNotice>
            Appointment date, time selection and human verification may require
            manual interaction with the portal.
          </ManualNotice>
        )}

        {/* ===================================================
            PAYMENT
        ==================================================== */}
        {phase === "payment" && (
          <ManualNotice>
            Payment requires explicit user confirmation. Card security
            information should be entered directly by the user.
          </ManualNotice>
        )}

        {/* ===================================================
            INVOICE
        ==================================================== */}
        {phase === "invoice" && (
          <ManualNotice>
            The invoice will be downloaded after successful payment and
            appointment confirmation.
          </ManualNotice>
        )}

        {/* ===================================================
            SIGN OUT
        ==================================================== */}
        {phase === "signout" && (
          <ManualNotice>
            Signing out will end the current Indian Visa Application session.
          </ManualNotice>
        )}

        {/* ===================================================
            CONTROLS
        ==================================================== */}
        <div className="mt-4 flex justify-center">
          <div
            className="
              flex items-center gap-2
              rounded-full
              border border-slate-200/80
              bg-slate-100/70
              p-1.5
              shadow-sm shadow-slate-900/5
              backdrop-blur-sm
              dark:border-slate-700/60
              dark:bg-slate-800/60
            "
          >
            {/* =============================================
                START / PAUSE
            ============================================== */}
            <button
              type="button"
              onClick={onStart}
              title={started ? "Pause automation" : "Start automation"}
              className={`
                group
                flex h-10 w-10
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
                    : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25"
                }
              `}
            >
              {started ? (
                <Pause
                  size={15}
                  fill="currentColor"
                  strokeWidth={0}
                  className="
                    transition-transform
                    group-hover:scale-110
                  "
                />
              ) : (
                <Play
                  size={15}
                  fill="currentColor"
                  strokeWidth={0}
                  className="
                    ml-0.5
                    transition-transform
                    group-hover:scale-110
                  "
                />
              )}
            </button>

            {/* =============================================
                STOP
            ============================================== */}
            <button
              type="button"
              onClick={onStop}
              disabled={!started}
              title="Stop automation"
              className="
                group
                flex h-10 w-10
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
                disabled:opacity-40
                dark:text-red-400
              "
            >
              <Square
                size={13}
                fill="currentColor"
                strokeWidth={0}
                className="
                  transition-transform
                  duration-200
                  group-hover:scale-110
                "
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ============================================================
 * PHASE DESCRIPTION
 * ============================================================
 */

function getPhaseDescription(phase: WorkflowPhase): string {
  switch (phase) {
    case "signup":
      return "Create and configure the Indian Visa Application account.";

    case "signin":
      return "Sign in to the registered Indian Visa Application account.";

    case "webfile":
      return "Upload and confirm applicant Webfile information.";

    case "mission":
      return "Select the mission and Indian Visa Application center.";

    case "appointment":
      return "Select the appointment date and available time.";

    case "payment":
      return "Complete the appointment payment process.";

    case "invoice":
      return "Download the appointment/payment invoice.";

    case "signout":
      return "Sign out from the Indian Visa Application account.";

    default:
      return "Manage the current automation workflow.";
  }
}

/**
 * ============================================================
 * MANUAL NOTICE
 * ============================================================
 */

function ManualNotice({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        mt-3 rounded-md
        bg-amber-50 p-2
        text-[9px]
        text-amber-800
        dark:bg-amber-950/30
        dark:text-amber-300
      "
    >
      {children}
    </div>
  );
}

/**
 * ============================================================
 * READ ONLY FIELD
 * ============================================================
 */

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label
      className="
        text-[9px]
        font-semibold
        text-blue-900
        dark:text-blue-100
      "
    >
      {label}

      <input className="ivac-input mt-1" value={value} readOnly />
    </label>
  );
}
