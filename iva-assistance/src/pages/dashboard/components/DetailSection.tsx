import type { ReactNode } from "react";

type DetailSectionProps = {
  icon: ReactNode;
  title: string;
  accent: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DetailSection({
  icon,
  title,
  accent,
  action,
  children,
}: DetailSectionProps) {
  return (
    <div className="border-t border-(--app-border) px-3 py-1.5">
      <div className="mb-1 flex items-center gap-1.5">
        <span className={accent}>{icon}</span>

        <span className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
          {title}
        </span>

        {action}
      </div>

      {children}
    </div>
  );
}
