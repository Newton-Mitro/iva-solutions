import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, User, X } from "lucide-react";

import type { Applicant } from "../../../../types/models";
import { StatusBadge } from "./Shared";

type Props = {
  applicant: Applicant;
  applicants: Applicant[];
  onSelect: (id: string) => void;
};

export default function ApplicantSelector({
  applicant,
  applicants,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return applicants;

    return applicants.filter((item) =>
      [item.fullName, item.passportNumber, item.mobile, item.email]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(value)),
    );
  }, [applicants, search]);

  function select(id: string) {
    onSelect(id);
    setOpen(false);
    setSearch("");
  }

  return (
    <section className="ivac-card overflow-hidden rounded-xl border border-(--app-border) shadow-sm">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="ivac-hover flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
      >
        {/* Icon */}
        <div className="ivac-primary-bg ivac-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
          <User size={14} />
        </div>

        {/* Applicant Info */}
        <div className="min-w-0 flex-1">
          {/* Label */}
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
              Applicants
            </span>

            <span className="ivac-primary-bg ivac-primary rounded-full px-1.5 py-0.5 text-[7px] font-bold leading-none">
              {applicants.length}
            </span>
          </div>

          {/* Selected applicant */}
          <div className="mt-0.5 flex min-w-0 items-center gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[11px] font-bold leading-tight">
                {applicant.fullName}
              </h2>

              <p className="mt-0.5 truncate text-[8px] leading-tight ivac-text-muted">
                {applicant.passportNumber}

                {applicant.mobile && (
                  <>
                    <span className="mx-1">·</span>
                    {applicant.mobile}
                  </>
                )}
              </p>
            </div>

            {/* Status */}
            <div className="ml-auto shrink-0">
              <StatusBadge status={applicant.status} />
            </div>
          </div>
        </div>

        {/* Chevron */}
        <div className="ivac-surface-2 ivac-text-muted flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden border-t border-(--app-border)">
          {/* Search */}
          <div className="p-2">
            <div className="flex h-8 items-center gap-2 rounded-lg border border-(--app-border) ivac-surface-2 px-2 transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10">
              <Search size={12} className="shrink-0 ivac-text-muted" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search applicant..."
                className="min-w-0 flex-1 bg-transparent text-[9px] outline-none placeholder:ivac-text-muted"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="ivac-hover ivac-text-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  aria-label="Clear search"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          </div>

          {/* Applicant List */}
          <div className="max-h-52 overflow-y-auto px-2 pb-2">
            {filtered.length > 0 ? (
              <div className="space-y-1">
                {filtered.map((item) => {
                  const selected = item.id === applicant.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => select(item.id)}
                      className={`
                        group flex w-full items-center gap-2
                        rounded-lg border px-2 py-1.5
                        text-left transition-all
                        ${
                          selected
                            ? `
                              border-blue-200
                              bg-blue-50
                              dark:border-blue-900
                              dark:bg-blue-950/30
                            `
                            : `
                              border-transparent
                              ivac-hover
                            `
                        }
                      `}
                    >
                      {/* Avatar */}
                      <div
                        className={`
                          flex h-6 w-6 shrink-0
                          items-center justify-center
                          rounded-md
                          ${
                            selected
                              ? `
                                bg-blue-100
                                text-blue-600
                                dark:bg-blue-900/40
                                dark:text-blue-400
                              `
                              : `
                                ivac-surface-2
                                ivac-text-muted
                              `
                          }
                        `}
                      >
                        {selected ? <Check size={12} /> : <User size={12} />}
                      </div>

                      {/* Details */}
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <p
                            className={`
                              truncate text-[9px] font-bold leading-tight
                              ${
                                selected
                                  ? "text-blue-700 dark:text-blue-300"
                                  : ""
                              }
                            `}
                          >
                            {item.fullName}
                          </p>

                          <p className="mt-0.5 truncate text-[7px] leading-tight ivac-text-muted">
                            {item.passportNumber}

                            {item.mobile && (
                              <>
                                <span className="mx-1">·</span>
                                {item.mobile}
                              </>
                            )}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="ml-auto shrink-0">
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-(--app-border) px-4 text-center">
                <div className="ivac-surface-2 ivac-text-muted flex h-8 w-8 items-center justify-center rounded-full">
                  <Search size={13} />
                </div>

                <p className="mt-1.5 text-[9px] font-semibold">
                  No applicants found
                </p>

                <p className="mt-0.5 text-[8px] ivac-text-muted">
                  Try another name, passport, mobile, or email.
                </p>
              </div>
            )}
          </div>

          {/* Compact Result Count */}
          {filtered.length > 0 && (
            <div className="border-t border-(--app-border) px-3 py-1.5">
              <p className="text-[7px] ivac-text-muted">
                {filtered.length} of {applicants.length} applicants
                {search ? " matched" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
