import { useEffect, useMemo, useRef, useState } from "react";
import {
  createWorkflowSteps,
  WorkflowContext,
  WorkflowPhase,
  WorkflowStep,
  WorkflowValueKey,
  workflowStepsByPhase,
} from "../../../types/workflow.type";
import { signOutUser } from "../../../firebase/auth";
import {
  deleteWorkflowLogs,
  deleteWorkflowPhase,
  getLocalFile,
  getWorkflowLogs,
  getWorkflowPhase,
  saveWorkflowLogs,
  saveWorkflowPhase,
} from "../../../storage/storage";

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
    case "application.email":
      return (
        context.account?.email ?? context.application?.automationAccount?.email
      );
    case "application.mobile":
      return (
        context.account?.mobile ??
        context.application?.automationAccount?.mobile
      );
    case "application.passportNumber":
      return context.application?.passportNumber;
    case "account.email":
      return context.account?.email;
    case "account.mobile":
      return context.account?.mobile;
    case "account.ivacPassword":
      return context.account?.ivacPassword;
    case "webfile.primary.fileId":
    case "appointment.primaryWebfile":
      return context.webfiles.find((webfile) => webfile.type === "primary")?.id;
    case "webfile.other.fileIds":
    case "appointment.otherWebfiles":
      return context.webfiles
        .filter((webfile) => webfile.type === "other")
        .map((webfile) => webfile.id)
        .join(",");
    case "appointment.mission":
    case "appointment.missionId":
      return context.application?.mission;
    case "appointment.ivacCenter":
    case "appointment.ivacCenterId":
      return context.application?.ivacCenter;
    case "appointment.date":
      return context.application?.appointment?.appointmentDate;
    case "appointment.time":
      return context.application?.appointment?.appointmentTime;
    case "appointment.details":
      return context.application?.appointment?.id;
    case "appointment.confirmationNumber":
      return context.application?.appointment?.id;
    default:
      return undefined;
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

export function useWorkflow(
  context: WorkflowContext = { webfiles: [] },
  persistence?: { userId?: string; applicationId?: string },
) {
  /**
   * ============================================================
   * WORKFLOW STATE
   * ============================================================
   */

  const [workflowPhase, setWorkflowPhase] =
    useState<WorkflowPhase>("phase_one");

  const [stepsByPhase, setStepsByPhase] = useState<
    Record<WorkflowPhase, WorkflowStep[]>
  >(() => ({
    phase_one: createWorkflowSteps("phase_one"),
    phase_two: createWorkflowSteps("phase_two"),
  }));
  const [logs, setLogs] = useState<WorkflowLog[]>([]);

  const persistenceKey =
    persistence?.userId && persistence.applicationId
      ? `${persistence.userId}:${persistence.applicationId}`
      : null;
  const hydratedPersistenceKey = useRef<string | null>(null);
  const skipPersistence = useRef(new Set<string>());
  const skipLogsPersistence = useRef(new Set<string>());

  useEffect(() => {
    let cancelled = false;

    hydratedPersistenceKey.current = null;
    setLogs([]);
    if (!persistenceKey || !persistence?.userId || !persistence.applicationId) {
      setStepsByPhase({
        phase_one: createWorkflowSteps("phase_one"),
        phase_two: createWorkflowSteps("phase_two"),
      });
      return () => {
        cancelled = true;
      };
    }

    const phases: WorkflowPhase[] = ["phase_one", "phase_two"];
    void Promise.all([
      Promise.all(
        phases.map((phase) =>
          getWorkflowPhase(
            persistence.userId as string,
            persistence.applicationId as string,
            phase,
          ),
        ),
      ),
      getWorkflowLogs(
        persistence.userId as string,
        persistence.applicationId as string,
      ),
    ])
      .then(([storedPhases, storedLogs]) => {
        if (cancelled) {
          return;
        }

        const next = Object.fromEntries(
          phases.map((phase, index) => {
            const stored = storedPhases[index];
            const storedById = new Map(stored?.map((step) => [step.id, step]));
            return [
              phase,
              createWorkflowSteps(phase).map((step) => ({
                ...step,
                ...storedById.get(step.id),
              })),
            ];
          }),
        ) as Record<WorkflowPhase, WorkflowStep[]>;

        setStepsByPhase(next);
        setLogs(storedLogs ?? []);
        hydratedPersistenceKey.current = persistenceKey;
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error("Unable to load workflow progress.", error);
          hydratedPersistenceKey.current = persistenceKey;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [persistence?.applicationId, persistence?.userId, persistenceKey]);

  useEffect(() => {
    if (
      !persistenceKey ||
      hydratedPersistenceKey.current !== persistenceKey ||
      !persistence?.userId ||
      !persistence.applicationId
    ) {
      return;
    }

    (Object.keys(stepsByPhase) as WorkflowPhase[]).forEach((phase) => {
      const phaseKey = `${persistenceKey}:${phase}`;
      if (skipPersistence.current.delete(phaseKey)) {
        return;
      }

      void saveWorkflowPhase(
        persistence.userId as string,
        persistence.applicationId as string,
        phase,
        stepsByPhase[phase],
      ).catch((error: unknown) =>
        console.error("Unable to save workflow progress.", error),
      );
    });
  }, [
    persistence?.applicationId,
    persistence?.userId,
    persistenceKey,
    stepsByPhase,
  ]);

  useEffect(() => {
    if (
      !persistenceKey ||
      hydratedPersistenceKey.current !== persistenceKey ||
      !persistence?.userId ||
      !persistence.applicationId
    ) {
      return;
    }

    if (skipLogsPersistence.current.delete(persistenceKey)) {
      return;
    }

    void saveWorkflowLogs(
      persistence.userId,
      persistence.applicationId,
      logs,
    ).catch((error: unknown) =>
      console.error("Unable to save workflow logs.", error),
    );
  }, [persistence?.applicationId, persistence?.userId, persistenceKey, logs]);

  const steps = stepsByPhase[workflowPhase];

  function setSteps(
    next: WorkflowStep[] | ((current: WorkflowStep[]) => WorkflowStep[]),
  ) {
    setStepsByPhase((current) => ({
      ...current,
      [workflowPhase]:
        typeof next === "function" ? next(current[workflowPhase]) : next,
    }));
  }

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

  async function clearLogs() {
    if (persistenceKey && persistence?.userId && persistence.applicationId) {
      skipLogsPersistence.current.add(persistenceKey);
      await deleteWorkflowLogs(persistence.userId, persistence.applicationId);
    }

    setLogs([]);
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

    let file: { name: string; type: string; data: string } | undefined;
    if (step.action === "upload-file") {
      if (!value) {
        return {
          found: false,
          message: `No file configured for ${step.title}.`,
        };
      }

      const localFile = await getLocalFile(value);
      if (!localFile) {
        return { found: false, message: `File not found for ${step.title}.` };
      }

      const bytes = new Uint8Array(await localFile.arrayBuffer());
      let binary = "";
      for (const byte of bytes) {
        binary += String.fromCharCode(byte);
      }

      file = {
        name: localFile.name,
        type: localFile.type,
        data: btoa(binary),
      };
    }

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: target.id },
      world: "MAIN",
      func: async (config: {
        selectors: string[];
        action:
          | "navigate"
          | "focus"
          | "fill"
          | "click"
          | "upload-file"
          | "select"
          | "select-option"
          | "check"
          | "uncheck"
          | "replace-text"
          | "replace-html"
          | "wait"
          | "capture";
        value?: string;
        file?: { name: string; type: string; data: string };
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
                candidate === document.body ||
                candidate === document.documentElement ||
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

        if (config.action === "wait" || config.action === "capture") {
          return { found: true };
        }

        if (config.action === "upload-file") {
          const input = element as HTMLInputElement;
          if (input.type !== "file" || !config.file) {
            return { found: false, message: "Target is not a file input." };
          }

          const binary = atob(config.file.data);
          const bytes = Uint8Array.from(binary, (character) =>
            character.charCodeAt(0),
          );
          const uploadedFile = new File([bytes], config.file.name, {
            type: config.file.type,
          });
          const transfer = new DataTransfer();
          transfer.items.add(uploadedFile);
          input.files = transfer.files;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          return { found: true };
        }

        if (config.action === "select" || config.action === "select-option") {
          if (element instanceof HTMLSelectElement) {
            const option = Array.from(element.options).find(
              (candidate) =>
                candidate.value === config.value ||
                candidate.text.trim() === config.value?.trim(),
            );
            if (!option) {
              return {
                found: false,
                message: `Option not found for ${config.value ?? "select"}.`,
              };
            }

            element.value = option.value;
            element.dispatchEvent(new Event("input", { bubbles: true }));
            element.dispatchEvent(new Event("change", { bubbles: true }));
            return { found: true };
          }

          if (
            element instanceof HTMLInputElement &&
            (element.type === "radio" || element.type === "checkbox")
          ) {
            const optionMatches =
              element.value === config.value ||
              element.getAttribute("aria-label") === config.value;
            if (!optionMatches) {
              return {
                found: false,
                message: `Option not found for ${config.value ?? "select"}.`,
              };
            }

            if (!element.checked) {
              element.click();
            }
            return { found: true };
          }

          return {
            found: false,
            message: "Target is not a selectable option.",
          };
        }

        if (config.action === "check" || config.action === "uncheck") {
          const input = element as HTMLInputElement;
          if (input.type !== "checkbox") {
            return { found: false, message: "Target is not a checkbox." };
          }

          const shouldBeChecked = config.action === "check";
          if (input.checked !== shouldBeChecked) {
            input.click();
          }
          return { found: true };
        }

        if (config.value !== undefined && config.action === "replace-html") {
          element.innerHTML = config.value;
          return { found: true };
        }

        if (config.value !== undefined && config.action === "replace-text") {
          element.textContent = config.value;
          return { found: true };
        }

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
          file,
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
      const reason = result.message ?? `Element not found for ${step.title}.`;
      addLog(reason, "error");
      failStep(step.id, reason);
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

    if (
      (currentStep.action === "fill" ||
        currentStep.action === "upload-file" ||
        currentStep.action === "select" ||
        currentStep.action === "select-option") &&
      !mappedValue
    ) {
      const reason = `No data available for ${currentStep.title} (${currentStep.valueKey ?? "value"}).`;
      addLog(reason, "error");
      failStep(currentStep.id, reason);
      executingStep.current = null;
      return;
    }

    if (
      (currentStep.action === "replace-html" ||
        currentStep.action === "replace-text") &&
      mappedValue === undefined
    ) {
      const reason = `No replacement value available for ${currentStep.title} (${currentStep.valueKey ?? "value"}).`;
      addLog(reason, "error");
      failStep(currentStep.id, reason);
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
          failStep(
            currentStep.id,
            result.message ?? "The target element was not found.",
          );
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
        failStep(
          currentStep.id,
          error instanceof Error
            ? error.message
            : `Step failed: ${currentStep.title}.`,
        );
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

  function failStep(stepId: string, reason = "Unknown failure.") {
    updateStep(stepId, {
      status: "failed",
    });

    setRunning(false);

    addLog(`Step failed: ${stepId}. Reason: ${reason}`, "error");
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

  async function reset() {
    const selectedPhase = workflowPhase;

    if (persistenceKey && persistence?.userId && persistence.applicationId) {
      const phaseKey = `${persistenceKey}:${selectedPhase}`;
      skipPersistence.current.add(phaseKey);
      await deleteWorkflowPhase(
        persistence.userId,
        persistence.applicationId,
        selectedPhase,
      );
    }

    setSteps(createWorkflowSteps(selectedPhase));

    setRunning(false);
    setPaused(false);
    setHumanPrompt(null);
    executingStep.current = null;

    setStartedFlows((current) => ({
      ...current,
      [selectedPhase]: false,
    }));

    addLog(`${selectedPhase} flow reset`, "success");
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
    clearLogs,

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
