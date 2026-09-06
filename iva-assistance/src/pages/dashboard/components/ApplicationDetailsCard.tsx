import { CalendarDays, ChevronDown, FileText, KeyRound } from "lucide-react";
import { useState } from "react";
import {
  Application,
  Appointment,
  AutomationAccount,
} from "../../../types/models";
import { InfoRow, StatusBadge } from "./Shared";

type Props = {
  application: Application;
  account?: AutomationAccount;
  appointment?: Appointment;
};

export default function ApplicationDetailsCard({
  application,
  account,
  appointment,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section className="ivac-card overflow-hidden rounded-xl border border-(--app-border)">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="ivac-hover flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
      >
        <div className="ivac-primary-bg ivac-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
          <FileText size={14} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[11px] font-bold leading-tight">
              Application details
            </h2>

            <StatusBadge status={application.status} />
          </div>

          <p className="mt-0.5 truncate text-[8px] leading-tight ivac-text-muted">
            {application.fullName || "Selected application"}
          </p>
        </div>

        <div className="ivac-surface-2 ivac-text-muted flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden border-t border-(--app-border)">
          {/* Application Information */}
          <div className="grid grid-cols-2 gap-x-3 px-3">
            <InfoRow label="Full name" value={application.fullName || "-"} />
            <InfoRow
              label="Passport"
              value={application.passportNumber || "-"}
            />
            <InfoRow label="Mobile" value={application.mobile || "-"} />
            <InfoRow label="Mission" value={application.mission || "-"} />
            <InfoRow
              label="IVAC center"
              value={application.ivacCenter || "-"}
            />
          </div>

          {/* Account + Appointment */}
          <div className="grid grid-cols-2 gap-2 border-t border-(--app-border) px-3 py-2.5">
            <InfoPanel
              icon={<KeyRound size={11} />}
              title="Application account"
              value={account?.email || "Not added"}
              secondary={account?.mobile || "No mobile"}
              status={account?.accountStatus}
            />

            <InfoPanel
              icon={<CalendarDays size={11} />}
              title="Appointment"
              value={appointment?.appointmentDate || "Not scheduled"}
              secondary={appointment?.appointmentTime || "No time selected"}
              status={appointment?.status}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPanel({
  icon,
  title,
  value,
  secondary,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  secondary: string;
  status?: string;
}) {
  return (
    <div className="ivac-surface-2 min-w-0 rounded-lg p-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="ivac-primary shrink-0">{icon}</span>

        <span className="truncate text-[7px] font-bold uppercase tracking-wider ivac-text-muted">
          {title}
        </span>
      </div>

      <p className="mt-1 truncate text-[9px] font-semibold leading-tight">
        {value}
      </p>

      <p className="mt-0.5 truncate text-[8px] leading-tight ivac-text-muted">
        {secondary}
      </p>

      {status && (
        <div className="mt-1.5">
          <StatusBadge status={status} />
        </div>
      )}
    </div>
  );
}
