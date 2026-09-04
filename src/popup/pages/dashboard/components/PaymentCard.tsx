import {
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Info,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import { Application, Payment } from "../../../../types/models";
import { InfoRow, StatusBadge } from "./Shared";

type Props = {
  application: Application;
  payments: Payment[];
};

export default function PaymentCard({ application, payments }: Props) {
  const [open, setOpen] = useState(false);

  const paymentStatus = application.paymentStatus ?? "pending";

  return (
    <section className="ivac-card overflow-hidden rounded-xl border border-(--app-border) shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="ivac-hover group flex w-full items-center justify-between gap-3 p-3.5 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Icon */}
          <div className="ivac-success-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <WalletCards size={16} className="ivac-success" />
          </div>

          {/* Title */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold">Payment</h2>

              {payments.length > 0 && (
                <span className="rounded-full bg-(--app-muted) px-1.5 py-0.5 text-[8px] font-semibold ivac-text-muted">
                  {payments.length}{" "}
                  {payments.length === 1 ? "transaction" : "transactions"}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[9px] ivac-text-muted">
              Payment summary & transaction details
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge status={paymentStatus} />

          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
              open ? "bg-(--app-muted)" : ""
            }`}
          >
            <ChevronDown
              size={15}
              className={`ivac-text-muted transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {/* Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {/* Divider */}
          <div className="border-t border-(--app-border)" />

          {payments.length > 0 ? (
            <div className="space-y-2.5 p-3">
              {payments.map((payment, index) => (
                <div
                  key={payment.id}
                  className="rounded-xl border border-(--app-border) bg-(--app-muted)/30 p-3 transition-colors hover:bg-(--app-muted)/50"
                >
                  {/* Payment heading */}
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--app-background) border border-(--app-border)">
                        <CreditCard size={13} className="ivac-text-muted" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-bold">
                          {payment.gateway || "Payment Gateway"}
                        </p>

                        <p className="text-[8px] ivac-text-muted">
                          Transaction #{index + 1}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={payment.status} />
                  </div>

                  {/* Amount */}
                  {payment.amount != null && (
                    <div className="mb-2.5 flex items-center justify-between rounded-lg bg-(--app-background) px-2.5 py-2">
                      <span className="text-[9px] ivac-text-muted">Amount</span>

                      <span className="text-sm font-extrabold tracking-tight">
                        {payment.currency} {payment.amount}
                      </span>
                    </div>
                  )}

                  {/* Details */}
                  <div className="divide-y divide-(--app-border)/60">
                    <InfoRow
                      label="Method"
                      value={payment.paymentMethod ?? "-"}
                    />

                    <InfoRow
                      label="Transaction ID"
                      value={payment.transactionId ?? "-"}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="p-3">
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-(--app-border) px-4 py-6 text-center">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-(--app-muted)">
                  <CreditCard size={16} className="ivac-text-muted" />
                </div>

                <p className="text-[10px] font-semibold">
                  No payment information
                </p>

                <p className="mt-1 max-w-[220px] text-[9px] leading-relaxed ivac-text-muted">
                  No payment transaction has been recorded for this application
                  yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
