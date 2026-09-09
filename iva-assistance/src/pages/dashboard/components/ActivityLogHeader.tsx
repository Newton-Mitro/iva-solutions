import { Activity, ChevronDown, Clock3, Trash2 } from "lucide-react";

type ActivityLogHeaderProps = {
  logsCount: number;
  open: boolean;
  onToggle: () => void;
  onClearLogs: () => void;
};

export function ActivityLogHeader({
  logsCount,
  open,
  onToggle,
  onClearLogs,
}: ActivityLogHeaderProps) {
  return (
    <div
      className="
        ivac-hover flex w-full items-center justify-between
        border-b border-(--app-border)
        px-3 py-2.5 text-left
        transition-colors
      "
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
      >
        <div
          className="
            flex h-7 w-7 shrink-0 items-center justify-center
            rounded-lg bg-blue-500/10
            ring-1 ring-blue-500/10
          "
        >
          <Activity size={14} className="text-blue-500" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[11px] font-bold tracking-tight">
              Activity Log
            </h2>

            {logsCount > 0 && (
              <span
                className="
                  rounded-full bg-(--app-bg-secondary)
                  px-1.5 py-0.5
                  text-[8px] font-semibold
                  ivac-text-muted
                "
              >
                {logsCount}
              </span>
            )}
          </div>

          <p className="mt-0.5 text-[8px] ivac-text-muted">
            Live automation events
          </p>
        </div>
      </button>

      <div className="flex items-center gap-1.5">
        <Clock3 size={12} className="ivac-text-muted" />

        {logsCount > 0 && (
          <button
            type="button"
            onClick={onClearLogs}
            aria-label="Clear activity logs"
            title="Clear activity logs"
            className="ivac-hover rounded p-1 ivac-text-muted"
          >
            <Trash2 size={12} />
          </button>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={open ? "Collapse activity log" : "Expand activity log"}
          className="ivac-hover rounded p-1 ivac-text-muted"
        >
          <ChevronDown
            size={15}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
