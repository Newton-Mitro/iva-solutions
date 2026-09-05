import { useEffect, useMemo, useState } from "react";
import { createWorkflowSteps, workflowStepsByPhase } from "../constants";
import { signOutUser } from "../../../../firebase/auth";
import { WorkflowPhase, WorkflowStep } from "../../../../types/dashboard.types";

type LogType = "success" | "info" | "warning" | "error";

function logInBrowserContent(message: string, type: LogType) {
  if (typeof chrome === "undefined" || !chrome.tabs) {
    return;
  }

  void chrome.tabs
    .query({ active: true })
    .then((tabs) => {
      const pageTabs = tabs.filter(
        (tab) =>
          typeof tab.id === "number" &&
          typeof tab.url === "string" &&
          /^https?:\/\//.test(tab.url),
      );
      const target =
        pageTabs.find((tab) => tab.url?.includes("ivacbd.com")) ?? pageTabs[0];

      if (typeof target?.id !== "number") {
        return;
      }

      const payload = {
        type: "IVAC_WORKFLOW_LOG",
        message,
        level: type,
        time: new Date().toISOString(),
      } as const;

      return chrome.scripting
        .executeScript({
          target: { tabId: target.id },
          world: "MAIN",
          func: (event: typeof payload) => {
            const prefix = `[IVAC automation] ${event.time}`;

            if (event.level === "error") {
              console.error(prefix, event.message);
            } else if (event.level === "warning") {
              console.warn(prefix, event.message);
            } else {
              console.log(prefix, event.message);
            }
          },
          args: [payload],
        })
        .catch(() => chrome.tabs.sendMessage(target.id as number, payload))
        .catch(() => undefined);
    })
    .catch(() => undefined);
}

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

  const [workflowPhase, setWorkflowPhase] =
    useState<WorkflowPhase>("run_phase_one");

  const [steps, setSteps] = useState<WorkflowStep[]>(() =>
    createWorkflowSteps("run_phase_one"),
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
    const consoleMethod =
      type === "error"
        ? console.error
        : type === "warning"
          ? console.warn
          : console.info;
    consoleMethod(`[IVAC automation] ${message}`);
    logInBrowserContent(message, type);

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

    const activeIndex = steps.findIndex((step) => step.status === "running");

    if (activeIndex !== -1) {
      const activeStep = steps[activeIndex];

      if (!activeStep.manual) {
        setRunning(true);
        setPaused(false);
        addLog(`Step resumed: ${activeStep.title}`, "info");
        return;
      }

      const nextIndex = activeIndex + 1;
      const nextStep = steps[nextIndex];

      setSteps((current) =>
        current.map((step, index) => {
          if (index === activeIndex) {
            return { ...step, status: "completed", progress: 100 };
          }

          if (index === nextIndex && nextStep) {
            return { ...step, status: "running", progress: 0 };
          }

          return step;
        }),
      );

      addLog(`Manual step completed: ${activeStep.title}`, "success");

      if (!nextStep) {
        setRunning(false);
        addLog(`${workflowPhase} flow completed`, "success");
      } else if (nextStep.manual) {
        setRunning(false);
        addLog(`Manual action required: ${nextStep.title}`, "warning");
      } else {
        setRunning(true);
        setPaused(false);
        addLog(`Step started: ${nextStep.title}`, "info");
      }

      return;
    }

    const firstPendingIndex = steps.findIndex(
      (step) => step.status === "pending",
    );

    if (firstPendingIndex === -1) {
      addLog(`${workflowPhase} flow is already complete.`, "success");
      return;
    }

    if (!startedFlows[workflowPhase]) {
      setStartedFlows((current) => ({
        ...current,
        [workflowPhase]: true,
      }));

      setRunning(true);
      setPaused(false);

      setSteps((current) =>
        current.map((step, index) =>
          index === firstPendingIndex
            ? {
                ...step,
                status: "running",
                progress: 0,
              }
            : step,
        ),
      );

      addLog(`${workflowPhase} flow started`, "info");
      addLog(`Step started: ${steps[firstPendingIndex].title}`, "info");

      return;
    }

    /**
     * Flow was already started.
     */
    setRunning(true);
    setPaused(false);

    addLog(`${workflowPhase} flow resumed`, "info");
  }

  function stopFlow() {
    setRunning(false);
    setPaused(false);
    addLog(`${workflowPhase} flow stopped`, "warning");
  }

  useEffect(() => {
    if (!running || paused) {
      return;
    }

    const timer = window.setInterval(() => {
      setSteps((current) => {
        const activeIndex = current.findIndex(
          (step) => step.status === "running",
        );

        if (activeIndex === -1) {
          setRunning(false);
          return current;
        }

        const activeStep = current[activeIndex];
        const nextProgress = Math.min(activeStep.progress + 25, 100);

        if (nextProgress < 100) {
          return current.map((step, index) =>
            index === activeIndex ? { ...step, progress: nextProgress } : step,
          );
        }

        addLog(`Step completed: ${activeStep.title}`, "success");

        const nextIndex = activeIndex + 1;
        const nextStep = current[nextIndex];

        if (!nextStep) {
          setRunning(false);
          addLog(`${workflowPhase} flow completed`, "success");
          return current.map((step, index) =>
            index === activeIndex
              ? { ...step, status: "completed", progress: 100 }
              : step,
          );
        }

        if (nextStep.manual) {
          setRunning(false);
          addLog(`Manual action required: ${nextStep.title}`, "warning");
        } else {
          addLog(`Step started: ${nextStep.title}`, "info");
        }

        return current.map((step, index) => {
          if (index === activeIndex) {
            return { ...step, status: "completed", progress: 100 };
          }

          if (index === nextIndex) {
            return { ...step, status: "running", progress: 0 };
          }

          return step;
        });
      });
    }, 700);

    return () => window.clearInterval(timer);
  }, [paused, running, workflowPhase]);

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
    addLog("Signing out of Indian Visa Assistance", "info");

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
    const initialPhase: WorkflowPhase = "run_phase_one";

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
    stopFlow,
    togglePause,
    reset,
    signOut,
  };
}
