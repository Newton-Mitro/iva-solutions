import { ChevronDown, Info, WalletCards } from "lucide-react";
import { useState } from "react";
import { Application } from "../../../../types/models";
import { Payment } from "../../../../types/models";
import { InfoRow, StatusBadge } from "./Shared";

type Props = {
  application: Application;
  payments: Payment[];
};

export default function PaymentCard({ application, payments }: Props) {
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
          <div className="ivac-success-bg flex h-8 w-8 items-center justify-center rounded-lg">
            <WalletCards size={15} className="ivac-success" />
          </div>

          <div>
            <h2 className="text-xs font-bold">Payment</h2>

            <p className="text-[9px] ivac-text-muted">Payment summary</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={application.paymentStatus ?? "pending"} />
          <ChevronDown
            size={17}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open &&
        (payments.length ? (
          <div className="rounded-lg border border-(--app-border) px-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="border-b border-(--app-border) py-1 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold">
                    {payment.gateway}
                  </span>
                  <StatusBadge status={payment.status} />
                </div>
                <InfoRow
                  label="Amount"
                  value={
                    payment.amount != null
                      ? `${payment.currency} ${payment.amount}`
                      : "-"
                  }
                />
                <InfoRow label="Method" value={payment.paymentMethod ?? "-"} />
                <InfoRow
                  label="Transaction"
                  value={payment.transactionId ?? "-"}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="border-t border-(--app-border) pt-2 text-[10px] ivac-text-muted">
            No payment information for this application.
          </p>
        ))}

      {open && (
        <div className="ivac-warning-bg ivac-warning m-3 mt-0 flex items-start gap-2 rounded-lg p-2 text-[9px]">
          <Info size={12} className="mt-0.5 shrink-0" />

          <span>
            Payment requires explicit user confirmation before proceeding.
          </span>
        </div>
      )}
    </section>
  );
}
