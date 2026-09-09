import type { Message } from "../../../types/message.type";
import type { WorkflowStep } from "../../../types/workflow.type";
import { WorkflowStepItem } from "./WorkflowStepItem";

type Props = {
  steps: WorkflowStep[];
  started?: boolean;
  latestMessage?: Message | null;
  onHumanAction?: (value?: string) => void;
  onStartFromStep?: (stepId: string) => void;
  onRunOnlyStep?: (stepId: string) => void;
  onSkip?: (stepId: string) => void;
  onRetry?: (stepId: string) => void;
  onContinue?: (stepId: string) => void;
};

export default function WorkflowSteps({
  steps,
  started = false,
  latestMessage,
  onHumanAction,
  onStartFromStep,
  onRunOnlyStep,
  onSkip,
  onRetry,
  onContinue,
}: Props) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <WorkflowStepItem
          key={step.id}
          step={step}
          index={index}
          total={steps.length}
          started={started}
          latestMessage={latestMessage}
          onHumanAction={onHumanAction}
          onStartFromStep={onStartFromStep}
          onRunOnlyStep={onRunOnlyStep}
          onSkip={onSkip}
          onRetry={onRetry}
          onContinue={onContinue}
        />
      ))}
    </div>
  );
}
