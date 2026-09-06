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
  {
    id: "phase-two-otp",
    phase: "phase_two",
    title: "Enter OTP",
    child: "Enter the OTP received for this phase.",
    icon: MessageSquare,
    manual: true,
    manualInput: "otp",
    selectors: [
      'input[autocomplete="one-time-code"]',
      'input[name="otp"]',
      'input[id*="otp" i]',
    ],
    action: "focus",
  },
  {
    id: "phase-two-replace-body",
    phase: "phase_two",
    title: "Replace Body",
    icon: RefreshCw,
    selectors: ["body"],
    action: "replace-html",
    valueKey: "account.ivacPassword",
  },
];
