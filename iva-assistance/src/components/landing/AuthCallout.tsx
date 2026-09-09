import { ArrowRight, UserRound } from "lucide-react";
import type { AuthMode } from "./landing-data";

export function AuthCallout({ onOpen }: { onOpen: (mode: AuthMode) => void }) {
  return (
    <section className="mx-auto mt-10 max-w-[1240px] px-5 pb-16 md:px-8 xl:px-0">
      <div className="grid gap-5 rounded-[28px] border border-[var(--app-border)] bg-[linear-gradient(135deg,var(--app-primary-bg),transparent)] p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div>
          <p className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--app-primary)]">
            <span className="block h-px w-6 bg-[var(--app-warning)]" /> আপনার
            পরবর্তী ধাপ
          </p>
          <h2 className="text-4xl font-normal leading-tight tracking-[-0.05em] text-[var(--app-text)]">
            প্রক্রিয়াটি কি
            <br />
            <i className="not-italic text-[var(--app-primary)]">
              আরও সহজ করবেন?
            </i>
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-[var(--app-text-secondary)]">
            এক মিনিটেরও কম সময়ে account খুলুন। আপনার workspace প্রস্তুত হয়ে
            যাবে।
          </p>
          <button
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--app-primary)] px-5 py-4 text-sm font-bold text-white transition hover:bg-[var(--app-primary-hover)]"
            onClick={() => onOpen("signup")}
          >
            workspace খুলুন <ArrowRight size={17} />
          </button>
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
          <UserRound
            size={42}
            strokeWidth={1.4}
            className="text-[var(--app-primary)]"
          />
          <strong className="mt-4 text-xl font-bold text-[var(--app-text)]">
            নিজের private workspace দিয়ে
            <br />
            শুরু করুন।
          </strong>
          <button
            className="mt-4 border-0 bg-transparent p-0 text-left text-sm font-semibold text-[var(--app-primary)]"
            onClick={() => onOpen("signin")}
          >
            account আছে? সাইন ইন করুন
          </button>
        </div>
      </div>
    </section>
  );
}
