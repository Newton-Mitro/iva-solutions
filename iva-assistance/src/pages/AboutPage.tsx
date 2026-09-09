import { ArrowLeft, Bot, Code2, Info, ShieldCheck } from "lucide-react";

const softwareDetails = [
  ["Version", "1.0.0"],
  ["Platform", "Browser extension"],
  ["Purpose", "Indian visa application assistance"],
] as const;

export default function AboutPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <header className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[var(--app-surface)]/95 backdrop-blur">
        <div className="flex h-13 items-center gap-2.5 px-3.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to dashboard"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--app-text-muted)] transition hover:bg-[var(--app-surface-2)]"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[12px] font-bold leading-tight text-[var(--app-text)]">
              About IVA Assistance
            </h1>
            <p className="mt-0.5 text-[8px] text-[var(--app-text-muted)]">
              Software information and developer details
            </p>
          </div>
          <Info size={15} className="text-[var(--app-text-muted)]" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl space-y-3 px-3.5 pb-8 pt-4">
        <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--app-primary-bg)] text-[var(--app-primary)]">
              <img src="/icons/icon32.png" alt="" className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-[var(--app-primary)]">
                IVA Solutions
              </p>
              <h2 className="mt-1 text-base font-bold leading-tight text-[var(--app-text)]">
                Indian Visa Assistance
              </h2>
              <p className="mt-1.5 text-[10px] leading-4 text-[var(--app-text-secondary)]">
                A focused workspace for organizing Indian visa applications and
                appointments in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--app-primary-bg)] text-[var(--app-primary)]">
              <Bot size={12} />
            </div>
            <h2 className="text-[11px] font-bold text-[var(--app-text)]">
              Software information
            </h2>
          </div>
          <div className="divide-y divide-[var(--app-border-light)]">
            {softwareDetails.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-2"
              >
                <span className="text-[9px] text-[var(--app-text-muted)]">
                  {label}
                </span>
                <span className="text-right text-[9px] font-semibold text-[var(--app-text)]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--app-success-bg)] text-[var(--app-success)]">
              <Code2 size={12} />
            </div>
            <h2 className="text-[11px] font-bold text-[var(--app-text)]">
              Developer
            </h2>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold text-[var(--app-text)]">
                IVA Solutions
              </p>
              <p className="mt-0.5 text-[9px] leading-4 text-[var(--app-text-muted)]">
                Building practical tools that make visa application workflows
                easier to manage.
              </p>
            </div>
            <div className="flex items-start gap-2 border-t border-[var(--app-border-light)] pt-2.5">
              <ShieldCheck
                size={13}
                className="mt-0.5 shrink-0 text-emerald-500"
              />
              <p className="text-[9px] leading-4 text-[var(--app-text-muted)]">
                Your application data stays connected to your account and is
                used to provide the workspace features you enable.
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[8px] text-[var(--app-text-muted)]">
          <Info size={10} />
          <span>IVA Assistance - Version 1.0.0</span>
        </div>
      </main>
    </div>
  );
}
