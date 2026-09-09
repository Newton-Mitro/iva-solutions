import { ArrowRight, Check } from "lucide-react";
import type { LicenseType } from "./landing-data";

export function PackageCard({
  type,
  name,
  price,
  detail,
  features,
  accent,
  onChoose,
}: {
  type: LicenseType;
  name: string;
  price: string;
  detail: string;
  features: string[];
  accent: string;
  onChoose: () => void;
}) {
  const duration =
    type === "monthly" ? "৩০ দিন" : type === "yearly" ? "৩৬৫ দিন" : "আজীবন";
  const isFeatured = accent === "featured";

  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm ${
        isFeatured
          ? "border-[var(--app-primary)] bg-[var(--app-surface)]"
          : "border-[var(--app-border)] bg-[var(--app-surface-2)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-lg font-bold text-[var(--app-text)]">{name}</span>
        {type === "yearly" && (
          <span className="rounded-full bg-[var(--app-primary)] px-2 py-1 text-[10px] font-bold text-white">
            সেরা সাশ্রয়
          </span>
        )}
      </div>

      <h3 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-[var(--app-text)]">
        {price}
        <small className="ml-1 text-sm font-medium text-[var(--app-text-secondary)]">
          / {duration}
        </small>
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--app-text-secondary)]">
        {detail}
      </p>

      <div className="my-5 h-px bg-[var(--app-border)]" />

      <div className="space-y-3 text-sm text-[var(--app-text-secondary)]">
        <span className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--app-text-muted)]">
          প্যাকেজে যা থাকছে
        </span>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <Check size={12} strokeWidth={2.5} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--app-primary)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--app-primary-hover)]"
        onClick={onChoose}
      >
        {type === "monthly" ? "মাসিক প্যাকেজ নিন" : "বার্ষিক প্যাকেজ নিন"}
        <ArrowRight size={15} />
      </button>
    </article>
  );
}
