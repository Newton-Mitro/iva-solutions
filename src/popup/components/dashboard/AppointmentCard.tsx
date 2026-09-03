import { CalendarDays } from "lucide-react";

type Props = {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onLog: (message: string) => void;
};

export default function AppointmentCard({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onLog,
}: Props) {
  const dates = ["10 Sep 2026", "12 Sep 2026", "15 Sep 2026"];

  const times = ["09:00 AM", "11:30 AM", "02:00 PM"];

  return (
    <section className="ivac-card rounded-xl p-3 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="ivac-purple-bg flex h-8 w-8 items-center justify-center rounded-lg">
          <CalendarDays size={15} className="ivac-purple" />
        </div>

        <div>
          <h2 className="text-xs font-bold">Appointment</h2>

          <p className="text-[9px] ivac-text-muted">Appointment availability</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="text-[9px] font-semibold">
          Appointment date
          <select
            value={selectedDate}
            onChange={(event) => {
              onDateChange(event.target.value);

              onLog(`Appointment date selected: ${event.target.value}`);
            }}
            className="ivac-input mt-1"
          >
            <option value="">Select date</option>

            {dates.map((date) => (
              <option key={date}>{date}</option>
            ))}
          </select>
        </label>

        <label className="text-[9px] font-semibold">
          Appointment time
          <select
            value={selectedTime}
            onChange={(event) => {
              onTimeChange(event.target.value);

              onLog(`Appointment time selected: ${event.target.value}`);
            }}
            className="ivac-input mt-1"
          >
            <option value="">Select time</option>

            {times.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
