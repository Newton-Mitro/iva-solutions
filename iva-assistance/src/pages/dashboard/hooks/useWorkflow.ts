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
    case "application.primaryWebfile":
      return context.application?.primary_webfile?.id;
    case "application.otherWebfileOne":
      return context.application?.other_webfile_one?.id;
    case "application.otherWebfileTwo":
      return context.application?.other_webfile_two?.id;
    case "application.otherWebfileThree":
      return context.application?.other_webfile_three?.id;
    case "application.otherWebfileFour":
      return context.application?.other_webfile_four?.id;
    case "application.preferAppointmentDates":
      return context.application?.prefer_appointment_dates;
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
  context: WorkflowContext = {},
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
  const singleStepId = useRef<string | null>(null);

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
        text?: string;
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
        manualInput?: "otp" | "verification";
        selectionType?: "date" | "text";
        waitForMs: number;
        fileIndex?: number;
      }): Promise<DomActionResult> => {
        const startedAt = Date.now();

        const findElement = () => {
          const candidates = config.selectors.flatMap((selector) =>
            Array.from(document.querySelectorAll(selector)),
          );
          const fileCandidates = candidates.filter(
            (candidate): candidate is HTMLInputElement =>
              candidate instanceof HTMLInputElement &&
              candidate.type === "file",
          );
          const indexedCandidates =
            config.action === "upload-file" && config.fileIndex !== undefined
              ? [fileCandidates[config.fileIndex]].filter(Boolean)
              : candidates;

          return indexedCandidates.find((candidate) => {
            const item = candidate as HTMLElement;
            const isFileUploadTarget =
              config.action === "upload-file" &&
              candidate instanceof HTMLInputElement &&
              candidate.type === "file";
            return (
              (!config.text ||
                item.textContent?.trim().includes(config.text.trim())) &&
              (isFileUploadTarget ||
                candidate === document.body ||
                candidate === document.documentElement ||
                item.offsetParent !== null ||
                candidate instanceof HTMLIFrameElement) &&
              (config.action !== "click" ||
                !(candidate instanceof HTMLButtonElement && candidate.disabled))
            );
          }) as HTMLElement | undefined;
        };

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

        if (
          config.manual &&
          config.manualInput === "otp" &&
          config.value !== undefined
        ) {
          const inputs = config.selectors
            .flatMap((selector) =>
              Array.from(document.querySelectorAll(selector)),
            )
            .filter(
              (candidate): candidate is HTMLInputElement =>
                candidate instanceof HTMLInputElement,
            );

          if (inputs.length === 0) {
            return { found: false, message: "OTP inputs were not found." };
          }

          const digits = config.value.replace(/\D/g, "");
          inputs.slice(0, digits.length).forEach((input, index) => {
            const setter = Object.getOwnPropertyDescriptor(
              HTMLInputElement.prototype,
              "value",
            )?.set;
            setter?.call(input, digits[index]);
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
          });

          return { found: true };
        }

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
            config.action === "select" &&
            (Boolean(config.value) || config.selectionType === "date")
          ) {
            if (config.selectionType === "date") {
              const today = new Date();
              const todayKey = `${today.getFullYear()}-${String(
                today.getMonth() + 1,
              ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
              const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];
              const preferredDates = (config.value ?? "")
                .split(",")
                .map((date) => date.trim())
                .map((date) => {
                  const isoParts = date.match(
                    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/,
                  );
                  const localParts = date.match(
                    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/,
                  );
                  if (!isoParts && !localParts) {
                    return undefined;
                  }

                  const year = Number(isoParts?.[1] ?? localParts?.[3]);
                  const month = Number(isoParts?.[2] ?? localParts?.[1]);
                  const day = Number(isoParts?.[3] ?? localParts?.[2]);
                  return {
                    key: `${year}-${String(month).padStart(2, "0")}-${String(
                      day,
                    ).padStart(2, "0")}`,
                    year,
                    month,
                    day,
                  };
                })
                .filter(
                  (
                    date,
                  ): date is {
                    key: string;
                    year: number;
                    month: number;
                    day: number;
                  } => Boolean(date) && date?.key !== todayKey,
                );

              const getVisibleMonth = () => {
                const monthPattern = new RegExp(
                  `(${monthNames.join("|")})\\s+(\\d{4})`,
                );
                const match = Array.from(document.querySelectorAll("*"))
                  .filter((candidate) => {
                    const item = candidate as HTMLElement;
                    return (
                      item.offsetParent !== null && item.children.length === 0
                    );
                  })
                  .map((candidate) => candidate.textContent?.trim() ?? "")
                  .map((text) => text.match(monthPattern))
                  .find(Boolean);

                if (!match) {
                  return {
                    year: today.getFullYear(),
                    month: today.getMonth() + 1,
                  };
                }

                return {
                  month: monthNames.indexOf(match[1]) + 1,
                  year: Number(match[2]),
                };
              };

              const getDateButton = (date: { key: string; day: number }) =>
                Array.from(
                  document.querySelectorAll<HTMLButtonElement>("button"),
                ).find((candidate) => {
                  const item = candidate as HTMLElement;
                  return (
                    !candidate.disabled &&
                    item.offsetParent !== null &&
                    candidate.textContent?.trim() === String(date.day) &&
                    !candidate.getAttribute("aria-label") &&
                    candidate.dataset.ivacAutomationTried !== "true" &&
                    candidate.dataset.ivacAutomationDate !== date.key
                  );
                });

              const getMonthButton = (direction: "next" | "previous") =>
                document.querySelector<HTMLButtonElement>(
                  `button[aria-label="${direction === "next" ? "Next" : "Previous"} month"]`,
                );

              for (const date of preferredDates) {
                for (let attempt = 0; attempt < 24; attempt += 1) {
                  const visible = getVisibleMonth();
                  const visibleIndex = visible.year * 12 + visible.month;
                  const targetIndex = date.year * 12 + date.month;
                  const dateButton =
                    visibleIndex === targetIndex
                      ? getDateButton(date)
                      : undefined;

                  if (dateButton) {
                    dateButton.dataset.ivacAutomationTried = "true";
                    dateButton.dataset.ivacAutomationDate = date.key;
                    dateButton.click();
                    return { found: true };
                  }

                  if (visibleIndex === targetIndex) {
                    break;
                  }

                  const direction =
                    targetIndex > visibleIndex ? "next" : "previous";
                  const monthButton = getMonthButton(direction);
                  if (!monthButton || monthButton.disabled) {
                    break;
                  }
                  monthButton.click();
                  await new Promise((resolve) => setTimeout(resolve, 150));
                }
              }

              if (!preferredDates.length) {
                const fallbackDate = Array.from(
                  document.querySelectorAll<HTMLButtonElement>("button"),
                ).find(
                  (candidate) =>
                    !candidate.disabled &&
                    candidate.offsetParent !== null &&
                    /^\d{1,2}$/.test(candidate.textContent?.trim() ?? "") &&
                    !candidate.getAttribute("aria-label"),
                );
                if (fallbackDate) {
                  fallbackDate.click();
                  return { found: true };
                }
              }

              return {
                found: false,
                message: "No preferred appointment date is available.",
              };
            }

            if (config.selectionType === "text" && config.value) {
              const textOption = Array.from(
                document.querySelectorAll<HTMLButtonElement>("button"),
              ).find(
                (candidate) =>
                  candidate !== element &&
                  !candidate.disabled &&
                  candidate.offsetParent !== null &&
                  candidate.textContent?.trim().includes(config.value!),
              );

              if (!textOption) {
                return {
                  found: false,
                  message: `Appointment time not found for ${config.value}.`,
                };
              }

              textOption.click();
              return { found: true };
            }

            if (element instanceof HTMLButtonElement && element.disabled) {
              return { found: true };
            }

            element.click();

            const optionStartedAt = Date.now();
            let option: HTMLElement | undefined;
            while (!option && Date.now() - optionStartedAt < config.waitForMs) {
              option = Array.from(
                document.querySelectorAll<HTMLElement>(
                  '[role="option"], [role="menuitem"], [data-value], button',
                ),
              ).find((candidate) => {
                if (
                  candidate === element ||
                  candidate.offsetParent === null ||
                  (candidate instanceof HTMLButtonElement && candidate.disabled)
                ) {
                  return false;
                }

                return candidate.textContent?.trim().includes(config.value!);
              });

              if (!option) {
                await new Promise((resolve) => setTimeout(resolve, 100));
              }
            }

            if (!option) {
              return {
                found: false,
                message: `Option not found for ${config.value}.`,
              };
            }

            option.click();
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
          text: step.text,
          action: step.action,
          value,
          file,
          manual: Boolean(step.manual),
          manualInput: step.manualInput,
          selectionType: step.selectionType,
          fileIndex: step.fileIndex,
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

  function completeSingleStep(
    stepId: string,
    status: WorkflowStep["status"] = "completed",
  ) {
    setSteps((current) =>
      current.map((step) =>
        step.id === stepId ? { ...step, status, progress: 100 } : step,
      ),
    );
    singleStepId.current = null;
    setHumanPrompt(null);
    setRunning(false);
    setPaused(false);
    addLog(`Single step completed: ${stepId}`, "success");
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
    if (singleStepId.current === step.id) {
      completeSingleStep(step.id);
    } else {
      setRunning(advanceStep(step.id));
      setPaused(false);
    }
  }

  function skipStep(stepId: string) {
    const step = steps.find((item) => item.id === stepId);
    if (!step || step.status !== "running") {
      return;
    }

    addLog(`Step skipped: ${step.title}`, "warning");
    if (singleStepId.current === stepId) {
      completeSingleStep(stepId, "skipped");
    } else {
      setRunning(advanceStep(stepId, "skipped"));
      setPaused(false);
    }
  }

  function retryStep(stepId: string) {
    const step = steps.find((item) => item.id === stepId);
    if (!step || step.status !== "failed") {
      return;
    }

    updateStep(stepId, { status: "running", progress: 0 });
    executingStep.current = null;
    setPaused(false);
    setRunning(true);
    addLog(`Retrying step: ${step.title}`, "info");
  }

  function continueStep(stepId: string) {
    const step = steps.find((item) => item.id === stepId);
    if (!step || step.status !== "failed") {
      return;
    }

    addLog(`Continuing after failed step: ${step.title}`, "warning");
    executingStep.current = null;
    if (singleStepId.current === stepId) {
      completeSingleStep(stepId);
    } else {
      setRunning(advanceStep(stepId, "completed"));
      setPaused(false);
    }
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
        `Using application ${context.application?.fullName ?? "(unnamed)"}, account ${context.account?.email ?? "(missing)"}, and ${
          [
            context.application?.primary_webfile,
            context.application?.other_webfile_one,
            context.application?.other_webfile_two,
            context.application?.other_webfile_three,
            context.application?.other_webfile_four,
          ].filter(Boolean).length
        } webfile(s).`,
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

  function startFromStep(stepId: string) {
    if (running) {
      addLog(
        "Stop the current automation before choosing a start step.",
        "warning",
      );
      return;
    }

    const selectedIndex = steps.findIndex((step) => step.id === stepId);
    if (selectedIndex === -1) {
      return;
    }

    const selectedStep = steps[selectedIndex];
    singleStepId.current = null;
    setSteps((current) =>
      current.map((step, index) => ({
        ...step,
        status:
          index < selectedIndex
            ? "skipped"
            : index === selectedIndex
              ? "running"
              : "pending",
        progress: index === selectedIndex ? 0 : index < selectedIndex ? 100 : 0,
      })),
    );
    setStartedFlows((current) => ({
      ...current,
      [workflowPhase]: true,
    }));
    setHumanPrompt(null);
    executingStep.current = null;
    setPaused(false);
    setRunning(true);
    addLog(
      `Starting ${workflowPhase} from step: ${selectedStep.title}`,
      "info",
    );
  }

  function runOnlyStep(stepId: string) {
    if (running) {
      addLog(
        "Stop the current automation before choosing a single step.",
        "warning",
      );
      return;
    }

    const selectedIndex = steps.findIndex((step) => step.id === stepId);
    if (selectedIndex === -1) {
      return;
    }

    const selectedStep = steps[selectedIndex];
    singleStepId.current = stepId;
    setSteps((current) =>
      current.map((step, index) => ({
        ...step,
        status:
          index === selectedIndex
            ? "running"
            : index < selectedIndex
              ? "skipped"
              : "pending",
        progress: index === selectedIndex ? 0 : index < selectedIndex ? 100 : 0,
      })),
    );
    setStartedFlows((current) => ({
      ...current,
      [workflowPhase]: true,
    }));
    setHumanPrompt(null);
    executingStep.current = null;
    setPaused(false);
    setRunning(true);
    addLog(`Running only step: ${selectedStep.title}`, "info");
  }

  function stopFlow() {
    setRunning(false);
    setPaused(false);
    singleStepId.current = null;
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

    if (currentStep.optional && !mappedValue) {
      addLog(`Optional step skipped: ${currentStep.title}`, "info");
      if (singleStepId.current === currentStep.id) {
        completeSingleStep(currentStep.id, "skipped");
      } else {
        advanceStep(currentStep.id, "skipped");
      }
      executingStep.current = null;
      return;
    }

    if (
      (currentStep.action === "fill" ||
        currentStep.action === "upload-file" ||
        currentStep.action === "select" ||
        currentStep.action === "select-option") &&
      !mappedValue &&
      !(
        currentStep.id === "select-appointment-date" &&
        currentStep.selectionType === "date"
      )
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
          if (singleStepId.current === currentStep.id) {
            completeSingleStep(currentStep.id);
          } else {
            advanceStep(currentStep.id);
          }
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
    singleStepId.current = null;
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
    retryStep,
    continueStep,

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
    startFromStep,
    runOnlyStep,
    stopFlow,
    togglePause,
    humanPrompt,
    submitHumanAction,
    reset,
    signOut,
  };
}
