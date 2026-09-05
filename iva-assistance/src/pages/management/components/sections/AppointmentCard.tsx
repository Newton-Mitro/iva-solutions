import { InfoCard } from "../../../../components/ui/Card";
import { RecordItem, text } from "../../../../types/management.types";

interface AppointmentCardProps {
  appointment: RecordItem | undefined;
}

/**
 * Display appointment information card
 */
export function AppointmentCard({ appointment }: AppointmentCardProps) {
  if (!appointment) return null;

  return (
    <div className="pl-2 text-[8px]">
      <InfoCard>
        <p className="font-semibold">Appointment</p>
        <p className="mt-0.5 truncate ivac-text-muted">
          {text(appointment, "appointmentDate")} ·{" "}
          {text(appointment, "appointmentTime")}
        </p>
      </InfoCard>
    </div>
  );
}
