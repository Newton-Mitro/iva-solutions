import type { ReactNode } from "react";

export function InfoBlock({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--app-primary-bg)] text-[var(--app-primary)]">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[var(--app-text)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--app-text-secondary)]">
        {text}
      </p>
    </div>
  );
}
