import { Check, ChevronDown, FileText, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Application } from "../../../types/models";
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
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const filteredApplications = applications.filter((item) =>
    [
      item.fullName,
      item.email,
      item.mobile,
      item.passportNumber,
      item.visaType,
      item.ivacCenter,
      item.mission,
    ].some((value) =>
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
            <span className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
              Applications
            </span>

            <span className="ivac-primary-bg ivac-primary rounded-full px-1.5 py-0.5 text-[7px] font-bold leading-none">
              {applications.length}
            </span>
          </div>

          <div className="mt-0.5 flex min-w-0 items-center gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[11px] font-bold leading-tight">
                {application?.fullName ?? "No application selected"}
              </h2>

              {application ? (
                <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[8px] leading-tight ivac-text-muted">
                  <span className="truncate">
                    {application.mobile || "No mobile"}
                  </span>
                  <span>·</span>
                  <span className="truncate">
                    {application.passportNumber || "No passport"}
                  </span>
                </div>
              ) : (
                <p className="mt-0.5 truncate text-[8px] leading-tight ivac-text-muted">
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
                className="ivac-input h-7 w-full pr-2 text-[9px]"
                style={{ paddingLeft: "30px" }}
              />
            </div>

            {applications.length > 0 ? (
              filteredApplications.length > 0 ? (
                <div className="max-h-40 space-y-1 overflow-y-auto pr-0.5">
                  {filteredApplications.map((item) => {
                    const selected = item.id === application?.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelect(item.id);
                        }}
                        className={`group flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition ${
                          selected
                            ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30"
                            : "border-transparent ivac-hover"
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                            selected
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                              : "ivac-surface-2 ivac-text-muted"
                          }`}
                        >
                          {selected ? (
                            <Check size={12} />
                          ) : (
                            <FileText size={12} />
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div
                            className={`truncate text-[9px] font-bold leading-tight ${
                              selected ? "text-blue-700 dark:text-blue-300" : ""
                            }`}
                          >
                            {item.fullName || "Unnamed applicant"}
                          </div>

                          <div className="mt-0.5 flex items-center gap-1 text-[7px] leading-tight ivac-text-muted">
                            <span className="truncate">
                              {item.mobile || "No mobile"}
                            </span>
                            <span>·</span>
                            <span className="truncate">
                              {item.passportNumber || "No passport"}
                            </span>
                          </div>

                          <div className="mt-0.5 flex items-center gap-1 text-[7px] leading-tight ivac-text-muted">
                            <MapPin size={7} className="shrink-0" />
                            <span className="truncate">
                              {item.mission || "No mission"}
                            </span>
                            <span>·</span>
                            <span className="truncate">
                              {item.ivacCenter || "No center"}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <StatusBadge status={item.status} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <EmptyState text="No matching applications" />
              )
            ) : (
              <EmptyState
                title="No applications"
                text="Add an application to get started"
              />
            )}
          </div>

          {/* Footer */}
          {applications.length > 0 && (
            <div className="border-t border-(--app-border) px-3 py-1.5">
              <p className="text-[7px] ivac-text-muted">
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

function EmptyState({
  title = "No results",
  text,
}: {
  title?: string;
  text: string;
}) {
  return (
    <div className="flex min-h-20 flex-col items-center justify-center rounded-lg border border-dashed border-(--app-border) px-3 text-center">
      <div className="ivac-surface-2 ivac-text-muted flex h-7 w-7 items-center justify-center rounded-full">
        <FileText size={12} />
      </div>

      <p className="mt-1 text-[9px] font-semibold">{title}</p>

      <p className="mt-0.5 text-[7px] ivac-text-muted">{text}</p>
    </div>
  );
}
