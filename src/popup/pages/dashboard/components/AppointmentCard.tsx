import { CalendarDays, CheckCircle2, ChevronDown, Clock3 } from "lucide-react";
import { useState } from "react";

import type { Appointment } from "../../../../types/models";
import { InfoRow, StatusBadge } from "./Shared";

type Props = {
  appointment?: Appointment;
};

export default function AppointmentCard({ appointment }: Props) {
  const [open, setOpen] = useState(false);

  const status = appointment?.status ?? "pending";

  return (
    <section className="ivac-card overflow-hidden rounded-xl border border-(--app-border) shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="ivac-hover flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors"
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Icon */}
          <div className="ivac-purple-bg flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <CalendarDays size={15} className="ivac-purple" />
          </div>

          {/* Title */}
          <div className="min-w-0">
            <h2 className="truncate text-xs font-bold">Appointment</h2>

            <p className="mt-0.5 truncate text-[9px] ivac-text-muted">
              Appointment availability
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge status={status} />

          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
              open ? "bg-(--app-muted)" : ""
            }`}
          >
            <ChevronDown
              size={15}
              className={`ivac-text-muted transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {/* Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-(--app-border) p-2">
            {appointment ? (
              <>
                {/* Section title */}
                <div className="mb-1.5 px-1">
                  <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
                    Appointment details
                  </p>
                </div>

                {/* Appointment */}
                <div className="rounded-lg border border-(--app-border) p-2.5 transition-colors ivac-hover">
                  {/* Appointment header */}
                  <div className="flex items-center gap-2.5">
                    <div className="ivac-purple-bg ivac-purple flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
                      <CalendarDays size={13} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-bold">
                        {capitalize(appointment.appointmentType ?? "regular")}{" "}
                        appointment
                      </p>

                      <p className="mt-0.5 text-[8px] ivac-text-muted">
                        Appointment schedule
                      </p>
                    </div>

                    <StatusBadge status={appointment.status} />
                  </div>

                  {/* Date / Time */}
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {/* Date */}
                    <div className="ivac-surface-2 flex items-center gap-2 rounded-md px-2 py-1.5">
                      <CalendarDays
                        size={11}
                        className="shrink-0 ivac-purple"
                      />

                      <div className="min-w-0">
                        <p className="text-[7px] uppercase tracking-wide ivac-text-muted">
                          Date
                        </p>

                        <p className="truncate text-[9px] font-semibold">
                          {appointment.appointmentDate ?? "Not scheduled"}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="ivac-surface-2 flex items-center gap-2 rounded-md px-2 py-1.5">
                      <Clock3 size={11} className="shrink-0 ivac-purple" />

                      <div className="min-w-0">
                        <p className="text-[7px] uppercase tracking-wide ivac-text-muted">
                          Time
                        </p>

                        <p className="truncate text-[9px] font-semibold">
                          {appointment.appointmentTime ?? "Not scheduled"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Confirmed */}
                  {appointment.confirmedAt && (
                    <div className="mt-2 flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1.5 dark:bg-emerald-950/20">
                      <CheckCircle2
                        size={11}
                        className="shrink-0 text-emerald-500"
                      />

                      <span className="text-[8px] text-emerald-700 dark:text-emerald-400">
                        Confirmed {formatDate(appointment.confirmedAt)}
                      </span>
                    </div>
                  )}

                  {/* Error */}
                  {appointment.errorMessage && (
                    <div className="ivac-warning-bg mt-2 rounded-md px-2 py-1.5">
                      <p className="text-[8px] ivac-warning">
                        {appointment.errorMessage}
                      </p>
                    </div>
                  )}

                  {/* Additional information */}
                  <div className="mt-2">
                    <div className="grid grid-cols-2 gap-x-4 border-t border-(--app-border) pt-2">
                      <InfoRow
                        label="Type"
                        value={appointment.appointmentType ?? "regular"}
                      />

                      <InfoRow label="Status" value={appointment.status} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-(--app-border) px-4 py-6 text-center">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-(--app-muted)">
                  <CalendarDays size={16} className="ivac-text-muted" />
                </div>

                <p className="text-[10px] font-semibold">
                  No appointment information
                </p>

                <p className="mt-1 max-w-[220px] text-[9px] leading-relaxed ivac-text-muted">
                  No appointment has been scheduled for this application yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
