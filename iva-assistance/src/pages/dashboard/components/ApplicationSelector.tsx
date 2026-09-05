import { Check, ChevronDown, FileText, MapPin } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "./Shared";
import { Application } from "../../../types/models";

type Props = {
  application: Application | undefined;
  applications: Application[];
  onSelect: (id: string) => void;
};

export default function ApplicationSelector({
  application,
  applications,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);

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
          <FileText size={14} />
        </div>

        {/* Application info */}
        <div className="min-w-0 flex-1">
          {/* Label + count */}
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
              Applications
            </span>

            <span className="ivac-primary-bg ivac-primary rounded-full px-1.5 py-0.5 text-[7px] font-bold leading-none">
              {applications.length}
            </span>
          </div>

          {/* Application */}
          <div className="mt-0.5 flex min-w-0 items-center gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[11px] font-bold leading-tight">
                {application?.visaType ?? "No application selected"}
              </h2>

              {application ? (
                <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[8px] leading-tight ivac-text-muted">
                  <MapPin size={8} className="shrink-0" />

                  <span className="truncate">
                    {application.mission ?? "Mission not selected"}
                  </span>

                  <span className="shrink-0">·</span>

                  <span className="truncate">
                    {application.ivacCenter ?? "Center not selected"}
                  </span>
                </div>
              ) : (
                <p className="mt-0.5 truncate text-[8px] leading-tight ivac-text-muted">
                  Add an application for this applicant
                </p>
              )}
            </div>

            {/* Status */}
            {application && (
              <div className="ml-auto shrink-0">
                <StatusBadge status={application.status} />
              </div>
            )}
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
          <div className="p-2">
            {applications.length > 0 ? (
              <div className="max-h-48 overflow-y-auto">
                <div className="space-y-1">
                  {applications.map((item) => {
                    const selected = item.id === application?.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelect(item.id);
                          setOpen(false);
                        }}
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
                        {/* Icon */}
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
                          {selected ? (
                            <Check size={12} />
                          ) : (
                            <FileText size={12} />
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          {/* Visa type */}
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
                            {item.visaType ?? "Indian Visa Application"}
                          </p>

                          {/* Location */}
                          <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[7px] leading-tight ivac-text-muted">
                            <MapPin size={7} className="shrink-0" />

                            <span className="truncate">
                              {item.mission ?? "Mission not selected"}
                            </span>

                            <span className="shrink-0">·</span>

                            <span className="truncate">
                              {item.ivacCenter ?? "Center not selected"}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="ml-auto shrink-0">
                          <StatusBadge status={item.status} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-(--app-border) px-4 text-center">
                <div className="ivac-surface-2 ivac-text-muted flex h-8 w-8 items-center justify-center rounded-full">
                  <FileText size={13} />
                </div>

                <p className="mt-1.5 text-[9px] font-semibold">
                  No applications
                </p>

                <p className="mt-0.5 text-[8px] ivac-text-muted">
                  No visa application has been added yet.
                </p>
              </div>
            )}
          </div>

          {/* Compact count */}
          {applications.length > 0 && (
            <div className="border-t border-(--app-border) px-3 py-1.5">
              <p className="text-[7px] ivac-text-muted">
                {applications.length} application
                {applications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
