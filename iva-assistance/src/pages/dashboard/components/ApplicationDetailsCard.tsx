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
  applicationReady: boolean;
};

export default function ApplicationDetailsCard({
  application,
  account,
  appointment,
  applicationReady,
}: Props) {
  const [open, setOpen] = useState(false);

  const readyStyles = applicationReady
    ? {
        card: "border-emerald-500/30 bg-emerald-500/[0.025]",
        icon: "bg-emerald-500/10 text-emerald-500",
        accent: "text-emerald-500",
      }
    : {
        card: "border-red-500/30 bg-red-500/[0.025]",
        icon: "bg-red-500/10 text-red-500",
        accent: "text-red-500",
      };

  return (
    <section
      className={`
        ivac-card overflow-hidden rounded-xl border
        transition-colors duration-200
        ${readyStyles.card}
      `}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="ivac-hover flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
      >
        {/* Status Icon */}
        <div
          className={`
            flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
            ${readyStyles.icon}
          `}
        >
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

        {/* Ready / Not Ready Indicator */}
        <span
          className={`
            shrink-0 rounded-md px-1.5 py-0.5
            text-[7px] font-bold uppercase tracking-wide
            ${readyStyles.icon}
          `}
        >
          {applicationReady ? "Ready" : "Not ready"}
        </span>

        {/* Expand Button */}
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
              accentClass={readyStyles.accent}
            />

            <InfoPanel
              icon={<CalendarDays size={11} />}
              title="Appointment"
              value={appointment?.appointmentDate || "Not scheduled"}
              secondary={appointment?.appointmentTime || "No time selected"}
              status={appointment?.status}
              accentClass={readyStyles.accent}
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
  accentClass,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  secondary: string;
  status?: string;
  accentClass: string;
}) {
  return (
    <div className="ivac-surface-2 min-w-0 rounded-lg p-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className={`shrink-0 ${accentClass}`}>{icon}</span>

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
