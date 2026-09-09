import { CheckCircle2, FileText, Trash2, Upload } from "lucide-react";
import type { WebfileDocument } from "../../../types/application.type";
import { DetailSection } from "./DetailSection";

type WebfileField =
  | "primary_webfile"
  | "other_webfile_one"
  | "other_webfile_two"
  | "other_webfile_three";

type WebfileItem = {
  field: WebfileField;
  label: string;
  value: WebfileDocument;
};

type WebfileListProps = {
  webfiles: WebfileItem[];
  onRemoveWebfile: (field: WebfileField, file: WebfileDocument) => void;
};

export function WebfileList({ webfiles, onRemoveWebfile }: WebfileListProps) {
  return (
    <DetailSection
      icon={<FileText size={11} />}
      title={`Webfiles · ${webfiles.length}/5`}
      accent="ivac-primary"
    >
      {webfiles.length ? (
        <div className="space-y-0.5">
          {webfiles.map((webfile) => (
            <div
              key={webfile.label}
              className="flex min-w-0 items-center gap-2 border-b border-(--app-border) py-1 last:border-0"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                  webfile.label === "Primary"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "ivac-surface-2 ivac-text-muted"
                }`}
              >
                <FileText size={8} />
              </span>

              <span className="w-12 shrink-0 text-[6px] font-bold uppercase ivac-text-muted">
                {webfile.label}
              </span>

              <span className="min-w-0 flex-1 truncate text-[7px] font-medium">
                {webfile.value.originalName}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `Remove ${webfile.label.toLowerCase()} webfile?`,
                    )
                  ) {
                    onRemoveWebfile(webfile.field, webfile.value);
                  }
                }}
                aria-label={`Remove ${webfile.label} webfile`}
                title={`Remove ${webfile.label} webfile`}
                className="ivac-hover shrink-0 rounded p-1 text-red-500"
              >
                <Trash2 size={9} />
              </button>

              {webfile.label === "Primary" && (
                <CheckCircle2 size={10} className="shrink-0 text-emerald-500" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 py-1 text-[7px] ivac-text-muted">
          <Upload size={10} />
          <span>Primary webfile required.</span>
        </div>
      )}
    </DetailSection>
  );
}
