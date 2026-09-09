import { Info, Settings, UserPlus } from "lucide-react";
import { DashboardHeaderActionButton } from "./DashboardHeaderActionButton";

export default function DashboardHeader({
  email,
  onRecords,
  onSettings,
  onAbout,
}: {
  email: string | null;
  onRecords: () => void;
  onSettings: () => void;
  onAbout: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[var(--app-surface)]">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center">
            <img
              src="/icons/icon32.png"
              alt="Indian Visa Assistance"
              className="h-8 w-8"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--app-text)]">
              Indian Visa Assistance
            </h1>
            <p className="text-[9px] text-[var(--app-text-muted)]">
              Application & Appointment Booking Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="hidden max-w-28 truncate text-[9px] text-[var(--app-text-muted)] sm:block">
            {email}
          </span>
          <DashboardHeaderActionButton
            icon={UserPlus}
            label="Open records"
            onClick={onRecords}
          />
          <DashboardHeaderActionButton
            icon={Settings}
            label="Open settings"
            onClick={onSettings}
          />
          <DashboardHeaderActionButton
            icon={Info}
            label="Open about page"
            onClick={onAbout}
          />
        </div>
      </div>
    </header>
  );
}
