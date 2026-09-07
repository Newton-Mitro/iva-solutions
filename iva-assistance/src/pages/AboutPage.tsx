import { ArrowLeft, Bot, Code2, Info, ShieldCheck } from "lucide-react";

const softwareDetails = [
  ["Version", "1.0.0"],
  ["Platform", "Browser extension"],
  ["Purpose", "Indian visa application assistance"],
] as const;

export default function AboutPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="ivac-app min-h-screen">
      <header className="sticky top-0 z-40 border-b border-(--app-border) bg-(--app-surface)/95 backdrop-blur">
        <div className="flex h-13 items-center gap-2.5 px-3.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to dashboard"
            className="ivac-hover flex h-7 w-7 items-center justify-center rounded-lg ivac-text-muted"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[12px] font-bold leading-tight">
              About IVA Assistance
            </h1>
            <p className="mt-0.5 text-[8px] ivac-text-muted">
              Software information and developer details
            </p>
          </div>
          <Info size={15} className="ivac-text-muted" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl space-y-3 px-3.5 pb-8 pt-4">
        <section className="ivac-card rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="ivac-primary-bg ivac-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <img src="/icons/icon32.png" alt="" className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wide ivac-primary">
                IVA Solutions
              </p>
              <h2 className="mt-1 text-base font-bold leading-tight">
                Indian Visa Assistance
              </h2>
              <p className="mt-1.5 text-[10px] leading-4 ivac-text-secondary">
                A focused workspace for organizing Indian visa applications and
                appointments in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="ivac-card rounded-xl p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="ivac-primary-bg ivac-primary flex h-6 w-6 items-center justify-center rounded-md">
              <Bot size={12} />
            </div>
            <h2 className="text-[11px] font-bold">Software information</h2>
          </div>
          <div className="divide-y divide-(--app-border-light)">
            {softwareDetails.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-2"
              >
                <span className="text-[9px] ivac-text-muted">{label}</span>
                <span className="text-right text-[9px] font-semibold">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="ivac-card rounded-xl p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="ivac-success-bg ivac-success flex h-6 w-6 items-center justify-center rounded-md">
              <Code2 size={12} />
            </div>
            <h2 className="text-[11px] font-bold">Developer</h2>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold">IVA Solutions</p>
              <p className="mt-0.5 text-[9px] leading-4 ivac-text-muted">
                Building practical tools that make visa application workflows
                easier to manage.
              </p>
            </div>
            <div className="flex items-start gap-2 border-t border-(--app-border-light) pt-2.5">
              <ShieldCheck
                size={13}
                className="mt-0.5 shrink-0 text-emerald-500"
              />
              <p className="text-[9px] leading-4 ivac-text-muted">
                Your application data stays connected to your account and is
                used to provide the workspace features you enable.
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[8px] ivac-text-muted">
          <Info size={10} />
          <span>IVA Assistance - Version 1.0.0</span>
        </div>
      </main>
    </div>
  );
}
