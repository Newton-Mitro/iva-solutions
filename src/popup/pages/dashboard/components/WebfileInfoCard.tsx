import { ChevronDown, FileText } from "lucide-react";
import { useState } from "react";
import { Webfile } from "../../../../types/models";
import { InfoRow, StatusBadge } from "./Shared";

export default function WebfileInfoCard({ webfiles }: { webfiles: Webfile[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="ivac-card overflow-hidden rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="ivac-hover flex w-full items-center justify-between p-3 text-left"
      >
        <div className="flex items-center gap-2">
          <FileText size={14} className="ivac-primary" />
          <div>
            <h2 className="text-xs font-bold">Webfiles</h2>
            <p className="text-[9px] ivac-text-muted">
              Documents for this application
            </p>
          </div>
        </div>
        <ChevronDown
          size={17}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open &&
        (webfiles.length ? (
          <div className="divide-y divide-(--app-border) border-t border-(--app-border)">
            {webfiles.map((webfile) => (
              <div key={webfile.id} className="py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[10px] font-semibold">
                    {webfile.webfileNumber}
                  </p>
                  <StatusBadge status={webfile.status} />
                </div>
                <div className="mt-0.5 grid grid-cols-2 gap-x-4">
                  <InfoRow label="Type" value={webfile.type} />
                  <InfoRow
                    label="File"
                    value={webfile.originalName ?? "Not selected"}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="border-t border-(--app-border) pt-2 text-[10px] ivac-text-muted">
            No webfiles have been added for this application.
          </p>
        ))}
    </section>
  );
}
