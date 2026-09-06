import { Check, Pause, X } from "lucide-react";
import { AutomationStep } from "../../../types/dashboard.types";

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "ivac-success-bg ivac-success",
    inactive: "ivac-surface-2 ivac-text-muted",
    blocked: "ivac-danger-bg ivac-danger",
    // Application Status
    pending: "ivac-warning-bg ivac-warning",
    webfile: "ivac-primary-bg ivac-primary",
    appointment: "ivac-primary-bg ivac-primary",
    payment: "ivac-primary-bg ivac-primary",
    completed: "ivac-success-bg ivac-success",
    cancelled: "ivac-danger-bg ivac-danger",
    failed: "ivac-danger-bg ivac-danger",
    // Account Status
    suspended: "ivac-warning-bg ivac-warning",
    // Appointment Status
    success: "ivac-success-bg ivac-success",
    // Payment Status
    processing: "ivac-primary-bg ivac-primary",
    paid: "ivac-success-bg ivac-success",
    refunded: "ivac-surface-2 ivac-text-muted",
    // Automation Run Status
    running: "ivac-primary-bg ivac-primary",
    paused: "ivac-warning-bg ivac-warning",
    // Automation Log Status
    warning: "ivac-warning-bg ivac-warning",
    error: "ivac-danger-bg ivac-danger",
    skipped: "ivac-surface-2 ivac-text-muted",
    // Invoice Status
    downloaded: "ivac-success-bg ivac-success",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${styles[status] ?? "ivac-surface-2 ivac-text-muted"}`}
    >
      {status}
    </span>
  );
}

export function StepIcon({ status, icon: Icon }: AutomationStep) {
  if (status === "completed")
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check size={15} />
      </div>
    );
  if (status === "running")
    return (
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
        <Icon size={15} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-amber-400 ring-2 ring-[var(--app-surface)]" />
      </div>
    );
  if (status === "failed")
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
        <X size={15} />
      </div>
    );
  if (status === "paused")
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
        <Pause size={14} />
      </div>
    );
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)]">
      <Icon size={14} />
    </div>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[10px] text-[var(--app-text-muted)]">{label}</span>
      <span className="text-right text-[10px] font-medium text-[var(--app-text)]">
        {value}
      </span>
    </div>
  );
}
