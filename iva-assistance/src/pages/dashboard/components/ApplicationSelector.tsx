import { ChevronDown, FileText, Search } from "lucide-react";
import { useState } from "react";
import { Application } from "../../../types/application.type";
import { ApplicationSelectorEmptyState } from "./ApplicationSelectorEmptyState";
import { ApplicationSelectorItem } from "./ApplicationSelectorItem";
import { StatusBadge } from "./Shared";

type Props = {
  application?: Application;
  applications: Application[];
  onSelect: (id: string) => void;
};

export default function ApplicationSelector({
  application,
  applications,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const filteredApplications = applications.filter((item) =>
    [item.fullName, item.passportNumber, item.ivacCenter, item.mission].some(
      (value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
    ),
  );

  return (
    <section className="ivac-card overflow-hidden rounded-xl border border-(--app-border) shadow-sm">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="ivac-hover flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition"
      >
        <div className="ivac-primary-bg ivac-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
          <FileText size={14} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider ivac-text-muted">
              Applications
            </span>

            <span className="ivac-primary-bg ivac-primary rounded-full px-1.5 py-0.5 text-[8px] font-bold leading-none">
              {applications.length}
            </span>
          </div>

          <div className="mt-0.5 flex min-w-0 items-center gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[13px] font-bold leading-tight">
                {application?.fullName ?? "No application selected"}
              </h2>

              {application ? (
                <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[9px] leading-tight ivac-text-muted">
                  <span>·</span>
                  <span className="truncate">
                    {application.passportNumber || "No passport"}
                  </span>
                </div>
              ) : (
                <p className="mt-0.5 truncate text-[9px] leading-tight ivac-text-muted">
                  Select an application to start
                </p>
              )}
            </div>

            {application && (
              <div className="shrink-0">
                <StatusBadge status={application.status} />
              </div>
            )}
          </div>
        </div>

        <div className="ivac-surface-2 ivac-text-muted flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden border-t border-(--app-border)">
          <div className="p-2">
            {/* Search */}
            <div className="relative mb-2">
              <Search
                size={11}
                strokeWidth={2}
                className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 ivac-text-muted"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applications..."
                aria-label="Search applications"
                className="ivac-input h-8 w-full pr-2 text-[10px]"
                style={{ paddingLeft: "30px" }}
              />
            </div>

            {applications.length > 0 ? (
              filteredApplications.length > 0 ? (
                <div className="max-h-40 space-y-1 overflow-y-auto pr-0.5">
                  {filteredApplications.map((item) => {
                    const selected = item.id === application?.id;

                    return (
                      <ApplicationSelectorItem
                        key={item.id}
                        item={item}
                        selected={selected}
                        onSelect={onSelect}
                        onClose={() => setOpen(false)}
                      />
                    );
                  })}
                </div>
              ) : (
                <ApplicationSelectorEmptyState text="No matching applications" />
              )
            ) : (
              <ApplicationSelectorEmptyState
                title="No applications"
                text="Add an application to get started"
              />
            )}
          </div>

          {/* Footer */}
          {applications.length > 0 && (
            <div className="border-t border-(--app-border) px-3 py-1.5">
              <p className="text-[9px] ivac-text-muted">
                {applications.length}{" "}
                {applications.length === 1 ? "application" : "applications"}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
