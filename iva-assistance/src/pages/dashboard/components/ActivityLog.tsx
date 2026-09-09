import { useState } from "react";
import { ActivityLogEmptyState } from "./ActivityLogEmptyState";
import { ActivityLogHeader } from "./ActivityLogHeader";
import { ActivityLogItem } from "./ActivityLogItem";
import type { WorkflowLog } from "../hooks/useWorkflow";

type Props = {
  logs: WorkflowLog[];
  onClearLogs: () => void;
};

export default function ActivityLog({ logs, onClearLogs }: Props) {
  const [open, setOpen] = useState(false);
  const recentLogs = logs.slice().reverse();

  return (
    <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
      <ActivityLogHeader
        logsCount={logs.length}
        open={open}
        onToggle={() => setOpen((current) => !current)}
        onClearLogs={onClearLogs}
      />

      {open && (
        <div className="max-h-56 overflow-y-auto">
          {recentLogs.length > 0 ? (
            <div className="px-3 py-2">
              {recentLogs.map((log, index) => {
                const isLast = index === recentLogs.length - 1;

                return (
                  <ActivityLogItem
                    key={`${log.time}-${index}`}
                    log={log}
                    isLast={isLast}
                  />
                );
              })}
            </div>
          ) : (
            <ActivityLogEmptyState />
          )}
        </div>
      )}
    </section>
  );
}
