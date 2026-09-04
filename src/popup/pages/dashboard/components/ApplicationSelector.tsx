import { Check, ChevronDown, FileText, MapPin } from "lucide-react";
import { useState } from "react";

import type { Application } from "../../../../types/models";
import { StatusBadge } from "./Shared";

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
    <section
      className="
        ivac-card
        overflow-hidden
        rounded-xl
        border border-(--app-border)
        shadow-sm
      "
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="
          ivac-hover
          flex w-full
          items-center
          justify-between
          gap-3
          px-3.5 py-3
          text-left
          transition-colors
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Icon */}
          <div
            className="
              flex h-8 w-8
              shrink-0
              items-center justify-center
              rounded-lg
              ivac-primary-bg
              ivac-primary
            "
          >
            <FileText size={15} />
          </div>

          {/* Application info */}
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  ivac-text-muted
                "
              >
                Application
              </span>

              {application && <StatusBadge status={application.status} />}
            </div>

            <h2 className="truncate text-xs font-bold">
              {application?.visaType ?? "No application selected"}
            </h2>

            <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[9px] ivac-text-muted">
              {application ? (
                <>
                  <MapPin size={9} className="shrink-0" />

                  <span className="truncate">
                    {application.mission ?? "Mission not selected"}
                  </span>

                  <span>·</span>

                  <span className="truncate">
                    {application.ivacCenter ?? "Center not selected"}
                  </span>
                </>
              ) : (
                <span>Add an application for this applicant</span>
              )}
            </div>
          </div>
        </div>

        {/* Chevron */}
        <div
          className="
            flex h-7 w-7
            shrink-0
            items-center justify-center
            rounded-full
            ivac-surface-2
            ivac-text-muted
          "
        >
          <ChevronDown
            size={15}
            className={`
              transition-transform
              duration-200
              ${open ? "rotate-180" : ""}
            `}
          />
        </div>
      </button>

      {/* Dropdown */}
      <div
        className={`
          grid
          transition-[grid-template-rows,opacity]
          duration-200
          ease-out
          ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className="
              border-t
              border-(--app-border)
              p-2
            "
          >
            {applications.length > 0 ? (
              <>
                <div className="mb-1.5 px-1">
                  <p
                    className="
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-wider
                      ivac-text-muted
                    "
                  >
                    Available applications
                  </p>
                </div>

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
                          group
                          flex w-full
                          items-center
                          justify-between
                          gap-3
                          rounded-lg
                          border
                          p-2.5
                          text-left
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
                        <div className="flex min-w-0 items-center gap-2.5">
                          {/* Selection / document icon */}
                          <div
                            className={`
                              flex h-7 w-7
                              shrink-0
                              items-center justify-center
                              rounded-md
                              ${
                                selected
                                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                                  : "ivac-surface-2 ivac-text-muted"
                              }
                            `}
                          >
                            {selected ? (
                              <Check size={13} />
                            ) : (
                              <FileText size={13} />
                            )}
                          </div>

                          {/* Details */}
                          <div className="min-w-0">
                            <span
                              className={`
                                block
                                truncate
                                text-[10px]
                                font-bold
                                ${
                                  selected
                                    ? "text-blue-700 dark:text-blue-300"
                                    : ""
                                }
                              `}
                            >
                              {item.visaType ?? "Indian Visa Application"}
                            </span>

                            <span className="mt-0.5 flex items-center gap-1 truncate text-[8px] ivac-text-muted">
                              <span className="truncate">
                                {item.mission ?? "Mission not selected"}
                              </span>

                              <span>·</span>

                              <span className="truncate">
                                {item.ivacCenter ?? "Center not selected"}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="shrink-0">
                          <StatusBadge status={item.status} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-dashed
                  border-(--app-border)
                  px-4 py-6
                  text-center
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-full
                    ivac-surface-2
                    ivac-text-muted
                  "
                >
                  <FileText size={16} />
                </div>

                <p className="mt-2 text-[10px] font-semibold">
                  No applications
                </p>

                <p
                  className="
                    mt-1
                    max-w-xs
                    text-[9px]
                    leading-4
                    ivac-text-muted
                  "
                >
                  No visa application has been added for this applicant yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
