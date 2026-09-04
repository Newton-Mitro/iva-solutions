import { CalendarDays, CheckCircle2, ChevronDown, Clock3 } from "lucide-react";
import { useState } from "react";

import type { Appointment } from "../../../../types/models";
import { InfoRow, StatusBadge } from "./Shared";

type Props = {
  appointments: Appointment[];
};

export default function AppointmentCard({ appointments }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="
        ivac-card
        overflow-hidden
        rounded-xl
        border border-(--app-border)
        shadow-sm
      "
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="
          ivac-hover
          flex w-full
          items-center
          justify-between
          gap-3
          px-3.5 py-3
          text-left
          transition-colors
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Icon */}
          <div
            className="
              ivac-purple-bg
              flex h-8 w-8
              shrink-0
              items-center justify-center
              rounded-lg
            "
          >
            <CalendarDays size={15} className="ivac-purple" />
          </div>

          {/* Title */}
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  ivac-text-muted
                "
              >
                Schedule
              </span>

              {appointments.length > 0 && (
                <span
                  className="
                    rounded-full
                    ivac-purple-bg
                    px-1.5 py-0.5
                    text-[8px]
                    font-semibold
                    ivac-purple
                  "
                >
                  {appointments.length}
                </span>
              )}
            </div>

            <h2 className="truncate text-xs font-bold">Appointment</h2>

            <p className="mt-0.5 truncate text-[9px] ivac-text-muted">
              Appointment availability
            </p>
          </div>
        </div>

        {/* Chevron */}
        <div
          className="
            flex h-7 w-7
            shrink-0
            items-center justify-center
            rounded-full
            ivac-surface-2
            ivac-text-muted
          "
        >
          <ChevronDown
            size={15}
            className={`
              transition-transform
              duration-200
              ${open ? "rotate-180" : ""}
            `}
          />
        </div>
      </button>

      {/* Content */}
      <div
        className={`
          grid
          transition-[grid-template-rows,opacity]
          duration-200
          ease-out
          ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="
              border-t
              border-(--app-border)
              p-2
            "
          >
            {appointments.length > 0 ? (
              <>
                <div className="mb-1.5 px-1">
                  <p
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-wider
                      ivac-text-muted
                    "
                  >
                    Appointment details
                  </p>
                </div>

                <div className="space-y-1.5">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="
                        rounded-lg
                        border
                        border-(--app-border)
                        p-2.5
                        transition-colors
                        ivac-hover
                      "
                    >
                      {/* Appointment header */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="
                            flex h-7 w-7
                            shrink-0
                            items-center justify-center
                            rounded-md
                            ivac-purple-bg
                            ivac-purple
                          "
                        >
                          <CalendarDays size={13} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[10px] font-bold">
                            {capitalize(
                              appointment.appointmentType ?? "regular",
                            )}{" "}
                            appointment
                          </p>

                          <p className="mt-0.5 text-[8px] ivac-text-muted">
                            Appointment schedule
                          </p>
                        </div>

                        <StatusBadge status={appointment.status} />
                      </div>

                      {/* Date / time */}
                      <div
                        className="
                          mt-2
                          grid
                          grid-cols-2
                          gap-1.5
                        "
                      >
                        <div
                          className="
                            flex items-center gap-2
                            rounded-md
                            ivac-surface-2
                            px-2 py-1.5
                          "
                        >
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

                        <div
                          className="
                            flex items-center gap-2
                            rounded-md
                            ivac-surface-2
                            px-2 py-1.5
                          "
                        >
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
                        <div
                          className="
                            mt-2
                            flex items-center gap-1.5
                            rounded-md
                            bg-emerald-50
                            px-2 py-1.5
                            dark:bg-emerald-950/20
                          "
                        >
                          <CheckCircle2
                            size={11}
                            className="
                              shrink-0
                              text-emerald-500
                            "
                          />

                          <span
                            className="
                              text-[8px]
                              text-emerald-700
                              dark:text-emerald-400
                            "
                          >
                            Confirmed {formatDate(appointment.confirmedAt)}
                          </span>
                        </div>
                      )}

                      {/* Error */}
                      {appointment.errorMessage && (
                        <div
                          className="
                            mt-2
                            rounded-md
                            ivac-warning-bg
                            px-2 py-1.5
                          "
                        >
                          <p className="text-[8px] ivac-warning">
                            {appointment.errorMessage}
                          </p>
                        </div>
                      )}

                      {/* Additional information */}
                      <div className="mt-2">
                        <div
                          className="
                            grid
                            grid-cols-2
                            gap-x-4
                            border-t
                            border-(--app-border)
                            pt-2
                          "
                        >
                          <InfoRow
                            label="Type"
                            value={appointment.appointmentType ?? "regular"}
                          />

                          <InfoRow label="Status" value={appointment.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty state */
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-dashed
                  border-(--app-border)
                  px-4 py-7
                  text-center
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-full
                    ivac-surface-2
                    ivac-purple
                  "
                >
                  <CalendarDays size={16} />
                </div>

                <p className="mt-2 text-[10px] font-semibold">No appointment</p>

                <p
                  className="
                    mt-1
                    max-w-xs
                    text-[9px]
                    leading-4
                    ivac-text-muted
                  "
                >
                  No appointment information is available for this application
                  yet.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {appointments.length > 0 && (
            <div
              className="
                border-t
                border-(--app-border)
                px-3 py-2
              "
            >
              <p className="text-[9px] ivac-text-muted">
                {appointments.length} appointment
                {appointments.length !== 1 ? "s" : ""} recorded
              </p>
            </div>
          )}
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
