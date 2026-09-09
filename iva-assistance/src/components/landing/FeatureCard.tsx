import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--app-primary-bg)] text-[var(--app-primary)]">
        {icon}
      </div>
      <h3 className="text-[18px] font-bold text-[var(--app-text)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--app-text-secondary)]">
        {text}
      </p>
      <button className="mt-5 inline-flex items-center gap-2 border-0 bg-transparent p-0 text-sm font-semibold text-[var(--app-primary)]">
        দেখুন <ArrowRight size={14} />
      </button>
    </article>
  );
}
