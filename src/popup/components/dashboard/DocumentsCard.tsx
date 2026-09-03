import { CheckCircle2, FileText } from "lucide-react";

export default function DocumentsCard() {
  const documents = ["Passport", "Applicant Photo"];

  return (
    <section className="ivac-card rounded-xl p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={15} />

          <h2 className="text-xs font-bold">Documents</h2>
        </div>

        <span className="text-[9px] ivac-text-muted">
          {documents.length} / {documents.length}
        </span>
      </div>

      <div className="space-y-1.5">
        {documents.map((document) => (
          <div
            key={document}
            className="flex items-center gap-2 rounded-lg bg-[var(--app-surface-2)] p-2"
          >
            <CheckCircle2 size={14} className="text-emerald-500" />

            <span className="flex-1 text-[10px]">{document}</span>

            <span className="text-[8px] font-bold text-emerald-500">READY</span>
          </div>
        ))}
      </div>
    </section>
  );
}
