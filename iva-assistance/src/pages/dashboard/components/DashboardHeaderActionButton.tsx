import type { LucideIcon } from "lucide-react";

type DashboardHeaderActionButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

export function DashboardHeaderActionButton({
  icon: Icon,
  label,
  onClick,
}: DashboardHeaderActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="ivac-hover rounded-lg p-2 text-[var(--app-text-muted)]"
      aria-label={label}
      title={label}
    >
      <Icon size={17} />
    </button>
  );
}
