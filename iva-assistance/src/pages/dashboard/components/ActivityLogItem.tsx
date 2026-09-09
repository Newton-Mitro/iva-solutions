import { Activity, AlertCircle, CheckCircle2, Clock3 } from "lucide-react";
import type { WorkflowLog } from "../hooks/useWorkflow";

type ActivityLogItemProps = {
  log: WorkflowLog;
  isLast: boolean;
};

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

export function ActivityLogItem({ log, isLast }: ActivityLogItemProps) {
  return (
    <div
      className="
        group relative flex gap-2.5
        rounded-lg px-1 py-2
        transition-colors
        hover:bg-(--app-bg-secondary)
      "
    >
      <div className="relative flex shrink-0 justify-center">
        {getIcon(log.type)}

        {!isLast && (
          <span
            className="
              absolute top-7 -bottom-2.5
              w-px bg-(--app-border)
            "
          />
        )}
      </div>

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

          <span className="text-[7px] ivac-text-muted">{log.time}</span>
        </div>
      </div>
    </div>
  );
}
