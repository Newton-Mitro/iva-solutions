import { useMemo, useState } from "react";
import { createWorkflowSteps, workflowStepsByPhase } from "../constants";
import type { WorkflowPhase, WorkflowStep } from "../types";
import { signOutUser } from "../../firebase/auth";

type LogType = "success" | "info" | "warning" | "error";

export type WorkflowLog = {
  type: LogType;
  message: string;
  time: string;
};

export function useWorkflow() {
  /**
   * ============================================================
   * WORKFLOW STATE
   * ============================================================
   */

  const [workflowPhase, setWorkflowPhase] = useState<WorkflowPhase>("signup");

  const [steps, setSteps] = useState<WorkflowStep[]>(() =>
    createWorkflowSteps("signup"),
  );

  /**
   * ============================================================
   * AUTOMATION STATE
   * ============================================================
   */

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  /**
   * Tracks whether each workflow phase has been started.
   *
   * Example:
   *
   * {
   *   signup: true,
   *   signin: true,
   *   payment: false
   * }
   */
  const [startedFlows, setStartedFlows] = useState<
    Partial<Record<WorkflowPhase, boolean>>
  >({});
  /**
   * ============================================================
   * LOGS
   * ============================================================
   */

  const [logs, setLogs] = useState<WorkflowLog[]>([]);

  /**
   * ============================================================
   * PROGRESS
   * ============================================================
   */

  const progress = useMemo(() => {
    if (!steps.length) {
      return 0;
    }

    const completed = steps.filter(
      (step) => step.status === "completed",
    ).length;

    const current = steps.find((step) => step.status === "running");

    const currentProgress = current?.progress ?? 0;

    return Math.round(
      ((completed + currentProgress / 100) / steps.length) * 100,
    );
  }, [steps]);

  /**
   * ============================================================
   * CURRENT STEP
   * ============================================================
   */

  const currentStep = useMemo(
    () => steps.find((step) => step.status === "running"),
    [steps],
  );

  /**
   * ============================================================
   * ADD LOG
   * ============================================================
   */

  function addLog(message: string, type: LogType = "info") {
    setLogs((previous) => [
      ...previous,
      {
        message,
        type,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    ]);
  }

  /**
   * ============================================================
   * START FLOW
   * ============================================================
   */

  function startFlow() {
    const phaseSteps = workflowStepsByPhase[workflowPhase];

    /**
     * No steps configured for this phase.
     */
    if (!phaseSteps?.length) {
      addLog(`No workflow steps configured for ${workflowPhase}.`, "warning");

      return;
    }

    /**
     * First start.
     */
    if (!startedFlows[workflowPhase]) {
      setStartedFlows((current) => ({
        ...current,
        [workflowPhase]: true,
      }));

      setRunning(true);
      setPaused(false);

      /**
       * Start the first pending step.
       */
      setSteps((current) =>
        current.map((step, index) =>
          index === 0
            ? {
                ...step,
                status: "running",
                progress: 0,
              }
            : step,
        ),
      );

      addLog(`${workflowPhase} flow started`, "info");

      return;
    }

    /**
     * Flow was already started.
     */
    setRunning(true);
    setPaused(false);

    addLog(`${workflowPhase} checkpoint opened`, "info");
  }

  /**
   * ============================================================
   * CHANGE WORKFLOW PHASE / TAB
   * ============================================================
   */

  function goToPhase(phase: WorkflowPhase) {
    /**
     * Change selected tab.
     */
    setWorkflowPhase(phase);

    /**
     * Load the steps belonging to that tab.
     */
    setSteps(createWorkflowSteps(phase));

    /**
     * Stop the current running state.
     */
    setRunning(false);
    setPaused(false);

    addLog(`Workflow stage: ${phase}`, "info");
  }

  /**
   * ============================================================
   * UPDATE STEP
   * ============================================================
   */

  function updateStep(stepId: string, updates: Partial<WorkflowStep>) {
    setSteps((current) =>
      current.map((step) =>
        step.id === stepId
          ? {
              ...step,
              ...updates,
            }
          : step,
      ),
    );
  }

  /**
   * ============================================================
   * COMPLETE STEP
   * ============================================================
   */

  function completeStep(stepId: string) {
    setSteps((current) => {
      const index = current.findIndex((step) => step.id === stepId);

      if (index === -1) {
        return current;
      }

      return current.map((step, stepIndex) => {
        /**
         * Complete current step.
         */
        if (stepIndex === index) {
          return {
            ...step,
            status: "completed",
            progress: 100,
          };
        }

        /**
         * Start next pending step.
         */
        if (stepIndex === index + 1 && step.status === "pending") {
          return {
            ...step,
            status: "running",
            progress: 0,
          };
        }

        return step;
      });
    });

    addLog(`Step completed: ${stepId}`, "success");
  }

  /**
   * ============================================================
   * FAIL STEP
   * ============================================================
   */

  function failStep(stepId: string) {
    updateStep(stepId, {
      status: "failed",
    });

    setRunning(false);

    addLog(`Step failed: ${stepId}`, "error");
  }

  /**
   * ============================================================
   * UPDATE STEP PROGRESS
   * ============================================================
   */

  function updateStepProgress(stepId: string, progress: number) {
    setSteps((current) =>
      current.map((step) =>
        step.id === stepId
          ? {
              ...step,
              progress: Math.min(100, Math.max(0, progress)),
              status: progress >= 100 ? "completed" : "running",
            }
          : step,
      ),
    );
  }

  /**
   * ============================================================
   * SIGN OUT
   * ============================================================
   */

  async function signOut() {
    addLog("Signing out of Indian Visa Application Workspace", "info");

    setRunning(false);
    setPaused(false);

    await signOutUser();
  }

  /**
   * ============================================================
   * RESET
   * ============================================================
   */

  function reset() {
    const initialPhase: WorkflowPhase = "signup";

    setWorkflowPhase(initialPhase);

    setSteps(createWorkflowSteps(initialPhase));

    setRunning(false);
    setPaused(false);

    setStartedFlows({});

    setLogs([
      {
        type: "success",
        message: "Automation reset",
        time: new Date().toLocaleTimeString(),
      },
    ]);
  }

  /**
   * ============================================================
   * PAUSE / RESUME
   * ============================================================
   */

  function togglePause() {
    setPaused((current) => {
      const next = !current;

      addLog(
        next ? "Automation paused" : "Automation resumed",
        next ? "warning" : "success",
      );

      return next;
    });
  }

  /**
   * ============================================================
   * RETURN
   * ============================================================
   */

  return {
    /**
     * Steps
     */
    steps,
    setSteps,
    updateStep,
    updateStepProgress,
    completeStep,
    failStep,

    /**
     * Selected workflow/tab
     */
    workflowPhase,
    setWorkflowPhase: goToPhase,

    /**
     * Automation
     */
    running,
    paused,

    /**
     * Progress
     */
    progress,
    currentStep,

    /**
     * Logs
     */
    logs,
    addLog,

    /**
     * Actions
     */
    startFlow,
    togglePause,
    reset,
    signOut,
  };
}
