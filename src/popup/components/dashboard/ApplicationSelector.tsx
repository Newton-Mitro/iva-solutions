import { ChevronDown, FileText } from "lucide-react";
import { Application } from "../../types";
import { InfoRow, StatusBadge } from "../Shared";

type Props = {
  application: Application;
  applications: Application[];
  onSelect: (id: string) => void;
};

export default function ApplicationSelector({
  application,
  applications,
  onSelect,
}: Props) {
  return (
    <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <FileText size={14} className="ivac-primary" />

            <span className="text-[9px] font-semibold uppercase tracking-wide ivac-text-muted">
              Application
            </span>

            <StatusBadge status={application.status} />
          </div>

          <h2 className="truncate text-sm font-bold">{application.visaType}</h2>

          <p className="truncate text-[10px] ivac-text-muted">
            {application.mission} · {application.ivacCenter}
          </p>
        </div>

        <ChevronDown size={17} />
      </div>

      {applications.length > 1 && (
        <div className="border-t border-[var(--app-border)] p-2">
          <div className="space-y-1">
            {applications.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`ivac-hover flex w-full items-center justify-between rounded-lg p-2 text-left ${
                  item.id === application.id
                    ? "bg-blue-50 dark:bg-blue-950/30"
                    : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">
                    {item.visaType ?? "IVAC Application"}
                  </span>

                  <span className="block truncate text-[9px] ivac-text-muted">
                    {item.mission ?? "Mission not selected"} ·{" "}
                    {item.ivacCenter ?? "Center not selected"}
                  </span>
                </span>

                <StatusBadge status={item.status} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-4 border-t border-[var(--app-border)] px-3 py-2">
        <InfoRow label="Web File" value={application.webFileNumber ?? "-"} />

        <InfoRow
          label="Application"
          value={application.applicationNumber ?? "-"}
        />

        <InfoRow label="IVAC Center" value={application.ivacCenter ?? "-"} />

        <InfoRow
          label="Payment"
          value={application.paymentStatus ?? "pending"}
        />
      </div>
    </section>
  );
}
