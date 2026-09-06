import { useEffect, useMemo, useRef, useState } from "react";
import {
  createWorkflowSteps,
  WorkflowContext,
  WorkflowPhase,
  WorkflowStep,
  WorkflowValueKey,
  workflowStepsByPhase,
} from "../../../types/dashboard.types";
import { signOutUser } from "../../../firebase/auth";

type HumanPrompt = {
  stepId: string;
  kind: "otp" | "verification";
};

type DomActionResult = {
  found: boolean;
  requiresHuman?: boolean;
  message?: string;
};

function getWorkflowValue(
  context: WorkflowContext,
  key: WorkflowValueKey,
): string | undefined {
  switch (key) {
    case "application.passportNumber":
      return context.application?.passportNumber;
    case "account.email":
      return context.account?.email;
    case "account.mobile":
      return context.account?.mobile;
    case "account.ivacPassword":
      return context.account?.ivacPassword;
  }
}

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

export function useWorkflow(context: WorkflowContext = { webfiles: [] }) {
  /**
   * ============================================================
   * WORKFLOW STATE
   * ============================================================
   */

  const [workflowPhase, setWorkflowPhase] =
    useState<WorkflowPhase>("phase_one");

  const [steps, setSteps] = useState<WorkflowStep[]>(() =>
    createWorkflowSteps("phase_one"),
  );

  /**
   * ============================================================
   * AUTOMATION STATE
   * ============================================================
   */

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [humanPrompt, setHumanPrompt] = useState<HumanPrompt | null>(null);
  const executingStep = useRef<string | null>(null);

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
      (step) => step.status === "completed" || step.status === "skipped",
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

  async function executeDomAction(
    step: WorkflowStep,
    value?: string,
  ): Promise<DomActionResult> {
    if (typeof chrome === "undefined" || !chrome.tabs || !chrome.scripting) {
      return { found: false, message: "Browser automation is unavailable." };
    }

    const tabs = await chrome.tabs.query({ active: true });
    const target = tabs.find(
      (tab) => typeof tab.id === "number" && /^https?:\/\//.test(tab.url ?? ""),
    );

    if (typeof target?.id !== "number") {
      return { found: false, message: "No active web page was found." };
    }

    if (step.action === "navigate") {
      if (!step.url) {
        return {
          found: false,
          message: `No URL configured for ${step.title}.`,
        };
      }

      await new Promise<void>((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) {
            return;
          }

          settled = true;
          chrome.tabs.onUpdated.removeListener(handleUpdate);
          window.clearTimeout(timeout);
          resolve();
        };
        const handleUpdate = (
          tabId: number,
          changeInfo: chrome.tabs.OnUpdatedInfo,
        ) => {
          if (tabId === target.id && changeInfo.status === "complete") {
            finish();
          }
        };
        const timeout = window.setTimeout(finish, 30000);

        chrome.tabs.onUpdated.addListener(handleUpdate);
        void chrome.tabs.update(target.id as number, { url: step.url });
      });
      return { found: true };
    }

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: target.id },
      world: "MAIN",
      func: async (config: {
        selectors: string[];
        action: "navigate" | "focus" | "fill" | "click";
        value?: string;
        manual: boolean;
        waitForMs: number;
      }): Promise<DomActionResult> => {
        const startedAt = Date.now();

        const findElement = () =>
          config.selectors
            .flatMap((selector) =>
              Array.from(document.querySelectorAll(selector)),
            )
            .find((candidate) => {
              const item = candidate as HTMLElement;
              return (
                item.offsetParent !== null ||
                candidate instanceof HTMLIFrameElement
              );
            }) as HTMLElement | undefined;

        while (
          document.readyState !== "complete" &&
          Date.now() - startedAt < config.waitForMs
        ) {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }

        let element = findElement();
        while (!element && Date.now() - startedAt < config.waitForMs) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          element = findElement();
        }

        if (!element) {
          return {
            found: false,
            message: `Element not found after waiting ${Math.round(config.waitForMs / 1000)} seconds.`,
          };
        }

        element.scrollIntoView({ block: "center", behavior: "smooth" });

        if (config.value !== undefined) {
          const input = element as HTMLInputElement;
          const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value",
          )?.set;
          setter?.call(input, config.value);
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          input.blur();

          if (config.action === "click") {
            element.click();
          }

          return { found: true };
        }

        element.focus();

        if (config.manual) {
          return { found: true, requiresHuman: true };
        }

        if (config.action === "click") {
          element.click();
        }

        return { found: true };
      },
      args: [
        {
          selectors: step.selectors,
          action: step.action,
          value,
          manual: Boolean(step.manual),
          waitForMs: 20000,
        },
      ],
    });

    return (
      result?.result ?? { found: false, message: "The page did not respond." }
    );
  }

  function advanceStep(
    stepId: string,
    terminalStatus: WorkflowStep["status"] = "completed",
  ): boolean {
    const index = steps.findIndex((step) => step.id === stepId);
    const nextStep = index >= 0 ? steps[index + 1] : undefined;

    setSteps((current) =>
      current.map((step, stepIndex) => {
        if (stepIndex === index) {
          return { ...step, status: terminalStatus, progress: 100 };
        }

        if (stepIndex === index + 1 && nextStep) {
          return { ...step, status: "running", progress: 0 };
        }

        return step;
      }),
    );
    setHumanPrompt(null);

    if (!nextStep) {
      setRunning(false);
      addLog(`${workflowPhase} flow completed`, "success");
      return false;
    }

    addLog(`Step started: ${nextStep.title}`, "info");
    return true;
  }

  async function submitHumanAction(value?: string) {
    if (!humanPrompt) {
      return;
    }

    const step = steps.find((item) => item.id === humanPrompt.stepId);
    if (!step) {
      return;
    }

    const result = await executeDomAction(step, value);
    if (!result.found) {
      addLog(result.message ?? `Element not found for ${step.title}.`, "error");
      failStep(step.id);
      return;
    }

    if (result.requiresHuman && humanPrompt.kind !== "verification") {
      addLog(
        `Enter the requested value before continuing: ${step.title}.`,
        "warning",
      );
      return;
    }

    addLog(`Human action completed: ${step.title}`, "success");
    setRunning(advanceStep(step.id));
    setPaused(false);
  }

  function skipStep(stepId: string) {
    const step = steps.find((item) => item.id === stepId);
    if (!step || step.status !== "running") {
      return;
    }

    addLog(`Step skipped: ${step.title}`, "warning");
    setRunning(advanceStep(stepId, "skipped"));
    setPaused(false);
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

      addLog(`Waiting for human action: ${activeStep.title}`, "warning");
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
      addLog(
        `Using application ${context.application?.fullName ?? "(unnamed)"}, account ${context.account?.email ?? "(missing)"}, and ${context.webfiles.length} webfile(s).`,
        "info",
      );

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
    if (
      !running ||
      paused ||
      !currentStep ||
      executingStep.current === currentStep.id
    ) {
      return;
    }
    executingStep.current = currentStep.id;

    if (currentStep.manual && currentStep.manualInput === "otp") {
      setRunning(false);
      setPaused(true);
      setHumanPrompt({ stepId: currentStep.id, kind: "otp" });
      addLog(`Waiting for human action: ${currentStep.title}`, "warning");
      executingStep.current = null;
      return;
    }

    const mappedValue = currentStep.valueKey
      ? getWorkflowValue(context, currentStep.valueKey)
      : undefined;

    if (currentStep.action === "fill" && !mappedValue) {
      addLog(`No data available for ${currentStep.title}.`, "error");
      failStep(currentStep.id);
      executingStep.current = null;
      return;
    }

    void executeDomAction(currentStep, mappedValue)
      .then((result) => {
        if (!result.found) {
          addLog(
            result.message ?? `Element not found for ${currentStep.title}.`,
            "error",
          );
          failStep(currentStep.id);
        } else if (result.requiresHuman && currentStep.manualInput) {
          setRunning(false);
          setPaused(true);
          setHumanPrompt({
            stepId: currentStep.id,
            kind: currentStep.manualInput,
          });
          addLog(`Human action required: ${currentStep.title}`, "warning");
        } else {
          addLog(`Step completed: ${currentStep.title}`, "success");
          advanceStep(currentStep.id);
        }
        executingStep.current = null;
      })
      .catch((error: unknown) => {
        addLog(
          error instanceof Error
            ? error.message
            : `Step failed: ${currentStep.title}.`,
          "error",
        );
        failStep(currentStep.id);
        executingStep.current = null;
      });
  }, [context, currentStep, paused, running]);

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
    setHumanPrompt(null);

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
    setHumanPrompt(null);

    await signOutUser();
  }

  /**
   * ============================================================
   * RESET
   * ============================================================
   */

  function reset() {
    const initialPhase: WorkflowPhase = "phase_one";

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
    skipStep,

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
    humanPrompt,
    submitHumanAction,
    reset,
    signOut,
  };
}
