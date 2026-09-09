import { useEffect, useRef, useState } from "react";
import type { Message } from "../../../types/message.type";
import type { WorkflowStep } from "../../../types/workflow.type";

type ManualStepActionProps = {
  step: WorkflowStep;
  latestMessage?: Message | null;
  onSubmit: (value?: string) => void;
  onSkip?: (stepId: string) => void;
};

export function ManualStepAction({
  step,
  latestMessage,
  onSubmit,
  onSkip,
}: ManualStepActionProps) {
  const [value, setValue] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!latestMessage?.otp || step.manualInput !== "otp") {
      return;
    }

    const now = Date.now();
    const messageTime = latestMessage.timestamp?.toDate
      ? latestMessage.timestamp.toDate().getTime()
      : new Date(String(latestMessage.timestamp)).getTime();

    if (!Number.isFinite(messageTime)) {
      return;
    }

    const inWindow =
      messageTime >= now - 20000 && messageTime <= now + 3 * 60 * 1000;

    if (!inWindow) {
      return;
    }

    const otpDigits = latestMessage.otp.replace(/\D/g, "").slice(0, 6);
    if (!otpDigits) {
      return;
    }

    setValue(otpDigits);
    requestAnimationFrame(() => {
      inputRefs.current[Math.min(otpDigits.length, 6) - 1]?.focus();
    });
  }, [latestMessage, step.manualInput]);

  if (step.manualInput === "verification") {
    return (
      <div className="mt-2 flex gap-1.5">
        <button
          type="button"
          onClick={() => onSubmit()}
          className="rounded-md bg-[var(--app-primary)] px-2 py-1 text-[8px] font-semibold text-white hover:bg-[var(--app-primary-hover)]"
        >
          Continue after verification
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={() => onSkip(step.id)}
            className="rounded-md border border-(--app-border) px-2 py-1 text-[8px] font-semibold ivac-text-muted"
          >
            Skip
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      className="mt-2 flex gap-1"
      onSubmit={(event) => {
        event.preventDefault();
        const otp = value.replace(/\s/g, "");
        if (otp) {
          onSubmit(otp);
        }
      }}
    >
      <div className="flex min-w-0 flex-1 gap-0.5">
        {Array.from({ length: 6 }, (_, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            value={value[index] ?? ""}
            onChange={(event) => {
              const digit = event.target.value.replace(/\D/g, "").slice(-1);
              setValue((current) => {
                const next = current.padEnd(6, " ").split("");
                next[index] = digit;
                return next.join("").trimEnd();
              });

              if (digit && index < 5) {
                inputRefs.current[index + 1]?.focus();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !value[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
              }
            }}
            onPaste={(event) => {
              event.preventDefault();
              const pasted = event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, 6);

              if (!pasted) {
                return;
              }

              setValue(pasted);
              inputRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
            }}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`${step.title} digit ${index + 1}`}
            className="h-6 w-6 rounded-md border border-(--app-border) bg-(--app-background) text-center text-[9px] outline-none focus:border-blue-500"
          />
        ))}
      </div>
      <div className="flex gap-1">
        <button
          type="submit"
          disabled={!value.trim()}
          className="rounded-md bg-[var(--app-primary)] px-2 py-1 text-[8px] font-semibold text-white hover:bg-[var(--app-primary-hover)] disabled:opacity-40"
        >
          Continue
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={() => onSkip(step.id)}
            className="rounded-md border border-(--app-border) px-2 py-1 text-[8px] font-semibold ivac-text-muted"
          >
            Skip
          </button>
        )}
      </div>
    </form>
  );
}
