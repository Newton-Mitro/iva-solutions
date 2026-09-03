import { useMemo, useState } from "react";
import { initialSteps, workflowPhases } from "../constants";
import type { WorkflowPhase } from "../types";
import { signOutUser } from "../../firebase/auth";

type LogType = "success" | "info" | "warning" | "error";

export type WorkflowLog = {
  type: LogType;
  message: string;
  time: string;
};

export function useWorkflow() {
  const [steps, setSteps] = useState(initialSteps);
  const [workflowPhase, setWorkflowPhase] = useState<WorkflowPhase>("signup");

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const [startedFlows, setStartedFlows] = useState<Record<string, boolean>>({});

  const [logs, setLogs] = useState<WorkflowLog[]>([]);

  const progress = useMemo(() => {
    if (!steps.length) return 0;

    const completed = steps.filter(
      (step) => step.status === "completed",
    ).length;

    const current = steps.find((step) => step.status === "running");

    return Math.round(
      ((completed + (current?.progress ?? 0) / 100) / steps.length) * 100,
    );
  }, [steps]);

  const currentStep = useMemo(
    () => steps.find((step) => step.status === "running"),
    [steps],
  );

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

  function startFlow() {
    const phase = workflowPhases.find((item) => item.id === workflowPhase);

    if (!phase) return;

    if (!startedFlows[workflowPhase]) {
      setStartedFlows((current) => ({
        ...current,
        [workflowPhase]: true,
      }));

      setRunning(true);

      addLog(`${phase.title} flow started`, "info");

      return;
    }

    addLog(`${phase.title} checkpoint opened`, "info");
  }

  function goToPhase(phase: WorkflowPhase) {
    setWorkflowPhase(phase);

    addLog(`Workflow stage: ${phase}`, "info");
  }

  async function signOut() {
    addLog("Signing out of IVAC Workspace", "info");

    await signOutUser();
  }

  function reset() {
    setSteps(initialSteps);
    setWorkflowPhase("signup");
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

  return {
    steps,
    setSteps,

    workflowPhase,
    setWorkflowPhase: goToPhase,

    running,
    paused,

    progress,
    currentStep,

    logs,

    startFlow,
    addLog,
    reset,
    togglePause,
    signOut,
  };
}
