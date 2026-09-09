import { MessageSquare, RefreshCw, UserRound } from "lucide-react";
import { WorkflowStepDefinition } from "../types/workflow.type";

export const phaseTwoWorkflow: WorkflowStepDefinition[] = [
  {
    id: "open-portfolio",
    phase: "phase_two",
    title: "Open Developer Portfolio",
    icon: UserRound,
    selectors: [],
    action: "navigate",
    url: "https://newton-mitro.github.io/nm-portfolio/",
  },
];
