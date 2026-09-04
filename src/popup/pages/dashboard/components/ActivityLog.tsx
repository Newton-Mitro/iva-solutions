import { Activity, AlertCircle, CheckCircle2, Clock3 } from "lucide-react";
import { WorkflowLog } from "../hooks/useWorkflow";

type Props = {
  logs: WorkflowLog[];
};

export default function ActivityLog({ logs }: Props) {
  function icon(type: string) {
    if (type === "success") {
      return <CheckCircle2 size={13} className="text-emerald-500" />;
    }

    if (type === "warning") {
      return <AlertCircle size={13} className="text-amber-500" />;
    }

    if (type === "error") {
      return <AlertCircle size={13} className="text-red-500" />;
    }

    return <Activity size={13} className="text-blue-500" />;
  }

  return (
    <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--app-border)] p-3">
        <div>
          <h2 className="text-xs font-bold">Activity Log</h2>

          <p className="text-[9px] ivac-text-muted">Live automation events</p>
        </div>

        <Clock3 size={14} className="ivac-text-muted" />
      </div>

      <div className="max-h-48 overflow-y-auto p-3">
        <div className="space-y-3">
          {logs
            .slice()
            .reverse()
            .map((log, index) => (
              <div key={index} className="flex gap-2">
                <div className="mt-0.5">{icon(log.type)}</div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] leading-4 ivac-text-secondary">
                    {log.message}
                  </p>

                  <p className="mt-0.5 text-[8px] ivac-text-muted">
                    {log.time}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
