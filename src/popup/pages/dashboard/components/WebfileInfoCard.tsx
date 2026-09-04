import { ChevronDown, CheckCircle2, FileText, Upload } from "lucide-react";
import { useState } from "react";

import type { Webfile } from "../../../../types/models";
import { InfoRow, StatusBadge } from "./Shared";

export default function WebfileInfoCard({ webfiles }: { webfiles: Webfile[] }) {
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

          {/* Title */}
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
                Documents
              </span>

              {webfiles.length > 0 && (
                <span
                  className="
                    rounded-full
                    bg-(--app-surface-2)
                    px-1.5 py-0.5
                    text-[8px]
                    font-semibold
                    ivac-text-muted
                  "
                >
                  {webfiles.length}
                </span>
              )}
            </div>

            <h2 className="truncate text-xs font-bold">Webfiles</h2>

            <p className="mt-0.5 truncate text-[9px] ivac-text-muted">
              Documents for this application
            </p>
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

      {/* Content */}
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
            {webfiles.length > 0 ? (
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
                    Application webfiles
                  </p>
                </div>

                <div className="space-y-1.5">
                  {webfiles.map((webfile) => (
                    <div
                      key={webfile.id}
                      className="
                        rounded-lg
                        border
                        border-(--app-border)
                        p-2.5
                        transition-colors
                        ivac-hover
                      "
                    >
                      {/* Webfile header */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className="
                            flex h-7 w-7
                            shrink-0
                            items-center justify-center
                            rounded-md
                            ivac-surface-2
                            ivac-primary
                          "
                        >
                          <FileText size={13} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[10px] font-bold">
                            {webfile.originalName ?? "Not selected"}
                          </p>

                          <p className="mt-0.5 truncate text-[8px] ivac-text-muted">
                            {webfile.type}
                          </p>
                        </div>

                        <StatusBadge status={webfile.status} />
                      </div>

                      {/* Uploaded state */}
                      {webfile.uploadedAt && (
                        <div
                          className="
                            mt-2
                            flex items-center gap-1.5
                            rounded-md
                            ivac-surface-2
                            px-2 py-1.5
                          "
                        >
                          <CheckCircle2
                            size={11}
                            className="shrink-0 text-emerald-500"
                          />

                          <span className="text-[8px] ivac-text-muted">
                            Uploaded {formatDate(webfile.uploadedAt)}
                          </span>
                        </div>
                      )}

                      {/* Error */}
                      {webfile.errorMessage && (
                        <div
                          className="
                            mt-2
                            rounded-md
                            ivac-warning-bg
                            px-2 py-1.5
                          "
                        >
                          <p className="text-[8px] ivac-warning">
                            {webfile.errorMessage}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty state */
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
                  px-4 py-7
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
                  <Upload size={15} />
                </div>

                <p className="mt-2 text-[10px] font-semibold">No webfiles</p>

                <p
                  className="
                    mt-1
                    max-w-xs
                    text-[9px]
                    leading-4
                    ivac-text-muted
                  "
                >
                  No webfiles have been added for this application yet.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {webfiles.length > 0 && (
            <div
              className="
                border-t
                border-(--app-border)
                px-3 py-2
              "
            >
              <p className="text-[9px] ivac-text-muted">
                {webfiles.length} webfile
                {webfiles.length !== 1 ? "s" : ""} added
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
