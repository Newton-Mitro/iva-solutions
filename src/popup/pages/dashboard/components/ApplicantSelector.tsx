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
        className="ivac-hover flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors"
      >
        {/* Applicant content */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Avatar */}
          <div className="ivac-primary-bg ivac-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <User size={15} />
          </div>

          {/* Applicant info */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
                  Applicants
                </span>

                <span className="ivac-primary-bg ivac-primary rounded-full px-1.5 py-0.5 text-[8px] font-bold leading-none">
                  {applicants.length}
                </span>
              </div>
            </div>

            {/* Main row */}
            <div className="mt-0.5 flex min-w-0 items-center gap-3">
              {/* Name + Passport */}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xs font-bold">
                  {applicant.fullName}
                </h2>

                <div className="flex gap-2">
                  <p className="mt-0.5 truncate text-[8px] ivac-text-muted">
                    {applicant.passportNumber}

                    {applicant.mobile && (
                      <>
                        <span className="mx-1">·</span>
                        {applicant.mobile}
                      </>
                    )}
                  </p>
                  <StatusBadge status={applicant.status} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chevron */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full ivac-surface-2 ivac-text-muted">
          <ChevronDown
            size={15}
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
        <div className="min-h-0 overflow-hidden">
          {/* Search */}
          <div className="border-t border-(--app-border) p-2">
            <div className="flex items-center gap-2 rounded-lg border border-(--app-border) ivac-surface-2 px-2.5 py-2 transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10">
              <Search size={13} className="shrink-0 ivac-text-muted" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search applicant..."
                className="min-w-0 flex-1 bg-transparent text-[10px] outline-none placeholder:ivac-text-muted"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="ivac-hover ivac-text-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  aria-label="Clear search"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Applicant list */}
          <div className="h-56 overflow-y-auto px-2 pb-2">
            {filtered.length > 0 ? (
              <>
                <div className="mb-1.5 px-1">
                  <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
                    Available applicants
                  </p>
                </div>

                <div className="space-y-1">
                  {filtered.map((item) => {
                    const selected = item.id === applicant.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => select(item.id)}
                        className={`
          group flex w-full items-center gap-3
          rounded-lg border p-2.5 text-left
          transition-all
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
            flex h-7 w-7 shrink-0
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
                          {selected ? <Check size={13} /> : <User size={13} />}
                        </div>

                        {/* Details */}
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {/* Name + Passport */}
                          <div className="min-w-0 flex-1">
                            <p
                              className={`
                truncate text-[10px] font-bold
                ${selected ? "text-blue-700 dark:text-blue-300" : ""}
              `}
                            >
                              {item.fullName}
                            </p>

                            <p className="mt-0.5 truncate text-[8px] ivac-text-muted">
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
              </>
            ) : (
              /* Empty search state */
              <div className="flex h-full min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-(--app-border) px-4 text-center">
                <div className="ivac-surface-2 ivac-text-muted flex h-9 w-9 items-center justify-center rounded-full">
                  <Search size={15} />
                </div>

                <p className="mt-2 text-[10px] font-semibold">
                  No applicants found
                </p>

                <p className="mt-1 max-w-xs text-[9px] leading-4 ivac-text-muted">
                  Try searching by name, passport number, mobile, or email.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-(--app-border) px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] ivac-text-muted">
                {filtered.length} applicant
                {filtered.length !== 1 ? "s" : ""} found
              </p>

              {search && (
                <p className="max-w-32 truncate text-[8px] ivac-text-muted">
                  Searching: “{search}”
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
