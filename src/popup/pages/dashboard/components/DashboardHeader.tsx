import { LayoutDashboard, Settings } from "lucide-react";

export default function DashboardHeader({
  email,
  onRecords,
  onSettings,
}: {
  email: string | null;
  onRecords: () => void;
  onSettings: () => void;
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
          <button
            onClick={onRecords}
            aria-label="Open records"
            className="ivac-hover rounded-lg px-2 py-1.5 text-[10px] font-semibold ivac-primary"
          >
            <LayoutDashboard size={17} />
          </button>
          <button
            onClick={onSettings}
            className="ivac-hover rounded-lg p-2 text-[var(--app-text-muted)]"
            aria-label="Open settings"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
