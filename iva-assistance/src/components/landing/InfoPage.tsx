import type { ReactNode } from "react";

export function InfoPage({
  eyebrow,
  title,
  children,
  onBack,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  onBack: () => void;
}) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 pb-18 pt-8 md:px-8 xl:px-0">
      <button
        className="mb-6 border-0 bg-transparent p-0 text-sm font-semibold text-[var(--app-text-secondary)] transition hover:text-[var(--app-text)]"
        onClick={onBack}
      >
        ← overview-এ ফিরুন
      </button>
      <p className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--app-primary)]">
        <span className="block h-px w-6 bg-[var(--app-warning)]" /> {eyebrow}
      </p>
      <h1 className="max-w-[900px] text-[clamp(40px,5vw,72px)] font-normal leading-[0.96] tracking-[-0.065em] text-[var(--app-text)]">
        {title}
      </h1>
      <div className="mt-8">{children}</div>
    </section>
  );
}
