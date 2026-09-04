import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, User } from "lucide-react";
import { Applicant } from "../../../../types/models";
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
    const value = search.toLowerCase();

    return applicants.filter(
      (item) =>
        item.fullName.toLowerCase().includes(value) ||
        item.passportNumber.toLowerCase().includes(value) ||
        item.mobile?.includes(value),
    );
  }, [applicants, search]);

  function select(id: string) {
    onSelect(id);
    setOpen(false);
    setSearch("");
  }

  return (
    <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
      <button
        onClick={() => setOpen((current) => !current)}
        className="ivac-hover flex w-full items-center justify-between p-3"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/40">
            <User size={18} />
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-bold">
                {applicant.fullName}
              </h2>

              <StatusBadge status={applicant.status} />
            </div>

            <p className="mt-0.5 truncate text-[10px] ivac-text-muted">
              Passport: {applicant.passportNumber}
            </p>
          </div>
        </div>

        <ChevronDown
          size={17}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-[var(--app-border)]">
          <div className="p-2">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] px-3 py-2">
              <Search size={14} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search applicant..."
                className="w-full bg-transparent text-xs outline-none"
              />
            </div>
          </div>

          <div className="h-56 overflow-y-auto px-2 pb-2">
            <div className="space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => select(item.id)}
                  className={`ivac-hover flex w-full items-center gap-3 rounded-lg p-2.5 text-left ${
                    item.id === applicant.id
                      ? "bg-blue-50 dark:bg-blue-950/30"
                      : ""
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--app-surface-2)]">
                    <User size={14} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-semibold">
                        {item.fullName}
                      </p>

                      <StatusBadge status={item.status} />
                    </div>

                    <p className="truncate text-[9px] ivac-text-muted">
                      {item.passportNumber} · {item.mobile}
                    </p>
                  </div>

                  {item.id === applicant.id && (
                    <Check size={14} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--app-border)] px-3 py-2">
            <p className="text-[9px] ivac-text-muted">
              {filtered.length} applicant
              {filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
