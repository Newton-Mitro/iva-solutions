import type { ReactNode } from "react";

type SummaryStatProps = {
  icon: ReactNode;
  label: string;
  value: string;
  good: boolean;
};

export function SummaryStat({ icon, label, value, good }: SummaryStatProps) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 px-2 py-1.5">
      <span
        className={`shrink-0 ${good ? "text-emerald-500" : "ivac-text-muted"}`}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[8px] font-bold uppercase tracking-wide ivac-text-muted">
          {label}
        </p>

        <p
          className={`truncate text-[9px] font-semibold ${
            good ? "text-emerald-500" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
