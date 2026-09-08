import {
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  FileText,
  KeyRound,
  Pencil,
  Upload,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import {
  Application,
  Appointment,
  AutomationAccount,
  WebfileDocument,
} from "../../../types/application.type";
import { StatusBadge } from "./Shared";

type Props = {
  application: Application;
  account?: AutomationAccount;
  appointment?: Appointment;
  applicationReady: boolean;
  onEditApplication: () => void;
  onEditAccount: () => void;
};

export default function ApplicationDetailsCard({
  application,
  account,
  appointment,
  applicationReady,
  onEditApplication,
  onEditAccount,
}: Props) {
  const [open, setOpen] = useState(false);

  const webfiles = [
    { label: "Primary", value: application.primary_webfile },
    { label: "Other 1", value: application.other_webfile_one },
    { label: "Other 2", value: application.other_webfile_two },
    { label: "Other 3", value: application.other_webfile_three },
    { label: "Other 4", value: application.other_webfile_four },
  ].filter((item): item is { label: string; value: WebfileDocument } =>
    Boolean(item.value),
  );

  const webfileCount = webfiles.length;

  return (
    <section className="ivac-card overflow-hidden rounded-xl border border-(--app-border)">
      {/* =====================================================
          TOP SUMMARY
      ===================================================== */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ivac-hover w-full px-3 py-2 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          {/* Application icon */}
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--app-surface-2)">
            <FileText size={14} className="ivac-primary" />

            <span
              className={`absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full ring-2 ring-(--app-card) ${
                applicationReady ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </div>

          {/* Identity */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[10px] font-bold">
                {application.fullName || "Selected application"}
              </span>

              <StatusBadge status={application.status} />
            </div>

            <span className="mt-0.5 block truncate text-[9px] ivac-text-muted">
              {application.passportNumber || "No passport"} ·{" "}
              {application.mission || "No mission"} ·{" "}
              {application.ivacCenter || "No IVAC center"}
            </span>
          </div>

          {/* Readiness */}
          <div className="flex shrink-0 items-center gap-1.5">
            {applicationReady && (
              <CheckCircle2 size={13} className="text-emerald-500" />
            )}

            <span
              className={`hidden text-[7px] font-bold sm:block ${
                applicationReady ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {applicationReady ? "READY" : "INCOMPLETE"}
            </span>

            <ChevronDown
              size={13}
              className={`ivac-text-muted transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* =================================================
            QUICK STATS
        ================================================= */}
        <div className="mt-2 grid grid-cols-3 divide-x divide-(--app-border) rounded-lg bg-(--app-surface-2)">
          <QuickStat
            icon={<KeyRound size={10} />}
            label="Account"
            value={account ? "Exist" : "Missing"}
            good={Boolean(account)}
          />

          <QuickStat
            icon={<CalendarDays size={10} />}
            label="Appointment"
            value={
              appointment
                ? appointment.appointmentDate || "Scheduled"
                : "Missing"
            }
            good={Boolean(appointment)}
          />

          <QuickStat
            icon={<FileText size={10} />}
            label="Webfiles"
            value={`${webfileCount}/5`}
            good={Boolean(application.primary_webfile)}
          />
        </div>
      </button>

      {/* =====================================================
          DETAILS
      ===================================================== */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden border-t border-(--app-border)">
          {/* Application details */}
          <div className="flex flex-wrap items-center border-b border-(--app-border) px-3">
            <MetaItem label="Name" value={application.fullName || "-"} />

            <MetaItem
              label="Passport"
              value={application.passportNumber || "-"}
            />

            <MetaItem label="Mission" value={application.mission || "-"} />

            <MetaItem label="IVAC" value={application.ivacCenter || "-"} />

            <MetaItem
              label="Preferred dates"
              value={application.prefer_appointment_dates || "-"}
            />
            <button
              type="button"
              onClick={onEditApplication}
              aria-label="Edit application"
              title="Edit application"
              className="ivac-hover ml-auto rounded-md p-1.5 ivac-text-muted"
            >
              <Pencil size={10} />
            </button>
          </div>

          {/* =================================================
              ACCOUNT
          ================================================= */}
          <DetailSection
            icon={<KeyRound size={11} />}
            title="Application Account"
            accent="text-blue-500"
            action={
              <button
                type="button"
                onClick={onEditAccount}
                aria-label={account ? "Edit IVAC account" : "Add IVAC account"}
                title={account ? "Edit IVAC account" : "Add IVAC account"}
                className="ivac-hover ml-auto rounded-md p-1 ivac-text-muted"
              >
                {account ? <Pencil size={10} /> : <UserRoundPlus size={10} />}
              </button>
            }
          >
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[8px] font-semibold">
                  {account?.email || "Account not configured"}
                </p>

                <p className="mt-0.5 truncate text-[7px] ivac-text-muted">
                  {account?.mobile || "No mobile number"}
                </p>
              </div>

              {account?.accountStatus && (
                <StatusBadge status={account.accountStatus} />
              )}
            </div>
          </DetailSection>

          {/* =================================================
              APPOINTMENT
          ================================================= */}
          <DetailSection
            icon={<CalendarDays size={11} />}
            title="Appointment"
            accent="text-violet-500"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[8px] font-semibold">
                  {appointment?.appointmentDate || "Not scheduled"}
                </p>

                <p className="mt-0.5 text-[7px] ivac-text-muted">
                  {appointment?.appointmentTime || "No time selected"}
                </p>
              </div>

              {appointment?.status && (
                <StatusBadge status={appointment.status} />
              )}
            </div>
          </DetailSection>

          {/* =================================================
              WEBFILES
          ================================================= */}
          <DetailSection
            icon={<FileText size={11} />}
            title={`Webfiles · ${webfileCount}/5`}
            accent="ivac-primary"
          >
            {webfiles.length ? (
              <div className="space-y-0.5">
                {webfiles.map((webfile) => (
                  <div
                    key={webfile.label}
                    className="flex min-w-0 items-center gap-2 border-b border-(--app-border) py-1 last:border-0"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                        webfile.label === "Primary"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "ivac-surface-2 ivac-text-muted"
                      }`}
                    >
                      <FileText size={8} />
                    </span>

                    <span className="w-12 shrink-0 text-[6px] font-bold uppercase ivac-text-muted">
                      {webfile.label}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-[7px] font-medium">
                      {webfile.value.originalName}
                    </span>

                    {webfile.label === "Primary" && (
                      <CheckCircle2
                        size={10}
                        className="shrink-0 text-emerald-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 py-1 text-[7px] ivac-text-muted">
                <Upload size={10} />
                <span>Primary webfile required.</span>
              </div>
            )}
          </DetailSection>
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   QUICK STAT
================================================================ */

function QuickStat({
  icon,
  label,
  value,
  good,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  good: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 px-2 py-1.5">
      <span
        className={`shrink-0 ${good ? "text-emerald-500" : "ivac-text-muted"}`}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[6px] font-bold uppercase tracking-wide ivac-text-muted">
          {label}
        </p>

        <p
          className={`truncate text-[7px] font-semibold ${
            good ? "text-emerald-500" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ===============================================================
   DETAIL SECTION
================================================================ */

function DetailSection({
  icon,
  title,
  accent,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-(--app-border) px-3 py-1.5">
      <div className="mb-1 flex items-center gap-1.5">
        <span className={accent}>{icon}</span>

        <span className="text-[6px] font-bold uppercase tracking-wider ivac-text-muted">
          {title}
        </span>

        {action}
      </div>

      {children}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 px-3 py-1.5 first:pl-0">
      <p className="text-[6px] font-bold uppercase tracking-wider ivac-text-muted">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[8px] font-semibold">{value}</p>
    </div>
  );
}
