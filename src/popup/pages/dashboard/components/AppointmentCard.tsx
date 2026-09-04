import { CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Appointment } from "../../../../types/models";
import { InfoRow, StatusBadge } from "./Shared";

type Props = {
  appointments: Appointment[];
};

export default function AppointmentCard({ appointments }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="ivac-hover flex w-full items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2">
          <div className="ivac-purple-bg flex h-8 w-8 items-center justify-center rounded-lg">
            <CalendarDays size={15} className="ivac-purple" />
          </div>

          <div>
            <h2 className="text-xs font-bold">Appointment</h2>

            <p className="text-[9px] ivac-text-muted">
              Appointment availability
            </p>
          </div>
        </div>
        <ChevronDown
          size={17}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        (appointments.length ? (
          <div className="divide-y divide-[var(--app-border)] border-t border-[var(--app-border)]">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="py-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold">
                    {appointment.appointmentType ?? "regular"} appointment
                  </span>
                  <StatusBadge status={appointment.status} />
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <InfoRow
                    label="Date"
                    value={appointment.appointmentDate ?? "-"}
                  />
                  <InfoRow
                    label="Time"
                    value={appointment.appointmentTime ?? "-"}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="border-t border-[var(--app-border)] pt-2 text-[10px] ivac-text-muted">
            No appointment information for this application.
          </p>
        ))}
    </section>
  );
}
