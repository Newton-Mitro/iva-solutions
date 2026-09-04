import { ChevronDown, FileText } from "lucide-react";
import { useState } from "react";
import { Application } from "../../../../types/models";
import { StatusBadge } from "./Shared";

type Props = {
  application: Application | undefined;
  applications: Application[];
  onSelect: (id: string) => void;
};

export default function ApplicationSelector({
  application,
  applications,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="ivac-hover flex w-full items-center justify-between p-3 text-left"
      >
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <FileText size={14} className="ivac-primary" />

            <span className="text-[9px] font-semibold uppercase tracking-wide ivac-text-muted">
              Application
            </span>

            {application && <StatusBadge status={application.status} />}
          </div>

          <h2 className="truncate text-sm font-bold">
            {application?.visaType ?? "No application selected"}
          </h2>

          <p className="truncate text-[10px] ivac-text-muted">
            {application
              ? `${application.mission ?? "Mission not selected"} · ${application.ivacCenter ?? "Center not selected"}`
              : "Add an application for this applicant"}
          </p>
        </div>
        <ChevronDown
          size={17}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && applications.length > 0 && (
        <div className="border-t border-(--app-border) p-2">
          <div className="space-y-1">
            {applications.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`ivac-hover flex w-full items-center justify-between rounded-lg p-2 text-left ${
                  item.id === application?.id
                    ? "bg-blue-50 dark:bg-blue-950/30"
                    : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">
                    {item.visaType ?? "Indian Visa Application Application"}
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
    </section>
  );
}
