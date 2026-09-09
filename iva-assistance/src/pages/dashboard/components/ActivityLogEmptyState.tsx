import { Info } from "lucide-react";

export function ActivityLogEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
      <div
        className="
          flex h-9 w-9 items-center justify-center
          rounded-full bg-(--app-bg-secondary)
          ring-1 ring-(--app-border)
        "
      >
        <Info size={15} className="ivac-text-muted" />
      </div>

      <p className="mt-2 text-[9px] font-semibold">No activity yet</p>

      <p className="mt-0.5 max-w-44 text-[8px] leading-3.5 ivac-text-muted">
        Automation events will appear here when the workflow starts.
      </p>
    </div>
  );
}
