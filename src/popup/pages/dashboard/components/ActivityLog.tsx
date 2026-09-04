import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Info,
} from "lucide-react";
import { useState } from "react";
import { WorkflowLog } from "../hooks/useWorkflow";

type Props = {
  logs: WorkflowLog[];
};

export default function ActivityLog({ logs }: Props) {
  const [open, setOpen] = useState(false);

  function getIcon(type: string) {
    switch (type) {
      case "success":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/15">
            <CheckCircle2 size={12} className="text-emerald-500" />
          </div>
        );

      case "warning":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/15">
            <AlertCircle size={12} className="text-amber-500" />
          </div>
        );

      case "error":
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/15">
            <AlertCircle size={12} className="text-red-500" />
          </div>
        );

      default:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/15">
            <Activity size={12} className="text-blue-500" />
          </div>
        );
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case "success":
        return "Success";
      case "warning":
        return "Warning";
      case "error":
        return "Error";
      default:
        return "Activity";
    }
  }

  const recentLogs = logs.slice().reverse();

  return (
    <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="
          ivac-hover flex w-full items-center justify-between
          border-b border-(--app-border)
          px-3 py-2.5 text-left
          transition-colors
        "
      >
        <div className="flex min-w-0 items-center gap-2.5">
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

              {logs.length > 0 && (
                <span
                  className="
                    rounded-full bg-(--app-bg-secondary)
                    px-1.5 py-0.5
                    text-[8px] font-semibold
                    ivac-text-muted
                  "
                >
                  {logs.length}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[8px] ivac-text-muted">
              Live automation events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock3 size={12} className="ivac-text-muted" />

          <ChevronDown
            size={15}
            className={`
              ivac-text-muted
              transition-transform duration-200
              ${open ? "rotate-180" : ""}
            `}
          />
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="max-h-56 overflow-y-auto">
          {recentLogs.length > 0 ? (
            <div className="px-3 py-2">
              {recentLogs.map((log, index) => {
                const isLast = index === recentLogs.length - 1;

                return (
                  <div
                    key={index}
                    className="
                      group relative flex gap-2.5
                      rounded-lg px-1 py-2
                      transition-colors
                      hover:bg-(--app-bg-secondary)
                    "
                  >
                    {/* Timeline */}
                    <div className="relative flex shrink-0 justify-center">
                      {getIcon(log.type)}

                      {!isLast && (
                        <span
                          className="
                            absolute top-7 bottom-[-10px]
                            w-px bg-(--app-border)
                          "
                        />
                      )}
                    </div>

                    {/* Event */}
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className="
                            text-[9px] font-medium leading-4
                            ivac-text-secondary
                            group-hover:text-(--app-text)
                            transition-colors
                          "
                        >
                          {log.message}
                        </p>

                        <span
                          className="
                            shrink-0 rounded-full
                            bg-(--app-bg-secondary)
                            px-1.5 py-0.5
                            text-[7px] font-medium
                            ivac-text-muted
                          "
                        >
                          {getTypeLabel(log.type)}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1">
                        <Clock3 size={9} className="shrink-0 ivac-text-muted" />

                        <span className="text-[7px] ivac-text-muted">
                          {log.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty state */
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
          )}
        </div>
      )}
    </section>
  );
}
