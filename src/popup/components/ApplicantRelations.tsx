import { StatusBadge } from "./Shared";
import type { RelatedRecord } from "../types";

export default function ApplicantRelations({
  account,
  webfiles,
  appointment,
  payment,
  invoice,
  runCount,
}: {
  account?: RelatedRecord;
  webfiles: RelatedRecord[];
  appointment?: RelatedRecord;
  payment?: RelatedRecord;
  invoice?: RelatedRecord;
  runCount: number;
}) {
  return (
    <section className="ivac-card rounded-xl p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide ivac-text-muted">
            Related records
          </p>
          <h2 className="mt-0.5 text-sm font-bold">Applicant process</h2>
        </div>
        <StatusBadge status={String(account?.status ?? "pending")} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <RelationTile
          label="IVAC account"
          value={
            account ? String(account.email ?? "Connected") : "Not connected"
          }
        />
        <RelationTile label="Webfiles" value={`${webfiles.length} linked`} />
        <RelationTile
          label="Appointment"
          value={
            appointment
              ? String(appointment.status ?? "Pending")
              : "Not selected"
          }
        />
        <RelationTile
          label="Payment"
          value={payment ? String(payment.status ?? "Pending") : "Not started"}
        />
        <RelationTile
          label="Invoice"
          value={
            invoice
              ? String(invoice.invoiceNumber ?? "Available")
              : "Not issued"
          }
        />
      </div>
      <div className="mt-2 flex items-center justify-between rounded-lg border border-[var(--app-border)] px-2.5 py-2">
        <span className="text-[9px] ivac-text-muted">Automation runs</span>
        <span className="text-[10px] font-bold ivac-primary">
          {runCount} linked
        </span>
      </div>
      {webfiles.length > 0 && (
        <div className="mt-2 space-y-1">
          {webfiles.map((webfile) => (
            <div
              key={webfile.id}
              className="flex items-center justify-between gap-2 rounded-md bg-[var(--app-surface-2)] px-2 py-1.5"
            >
              <span className="truncate text-[9px]">
                {String(
                  webfile.originalName ?? webfile.webfileNumber ?? "Webfile",
                )}
              </span>
              <span className="text-[8px] font-bold ivac-success">
                {String(webfile.status ?? "pending")}
              </span>
            </div>
          ))}
        </div>
      )}
      {appointment && (
        <RelationDetail
          label="Appointment"
          value={`${String(appointment.appointmentDate ?? "Date pending")} · ${String(appointment.appointmentTime ?? "Time pending")}`}
        />
      )}
      {payment && (
        <RelationDetail
          label="Payment"
          value={`${String(payment.gateway ?? "Gateway pending")} · ${String(payment.amount ?? "Amount pending")} ${String(payment.currency ?? "")}`}
        />
      )}
      {invoice && (
        <RelationDetail
          label="Invoice"
          value={String(
            invoice.invoiceNumber ??
              invoice.originalName ??
              "Invoice available",
          )}
        />
      )}
    </section>
  );
}

function RelationTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="ivac-surface-2 rounded-lg p-2">
      <p className="text-[9px] ivac-text-muted">{label}</p>
      <p className="mt-1 truncate text-[10px] font-semibold">{value}</p>
    </div>
  );
}

function RelationDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-2 rounded-lg border border-[var(--app-border)] px-2.5 py-2">
      <p className="text-[9px] ivac-text-muted">{label}</p>
      <p className="mt-0.5 truncate text-[10px] font-semibold">{value}</p>
    </div>
  );
}
