import { Info, WalletCards } from "lucide-react";
import { Application } from "../../../../types/models";
import { InfoRow, StatusBadge } from "./Shared";

type Props = {
  application: Application;
};

export default function PaymentCard({ application }: Props) {
  return (
    <section className="ivac-card rounded-xl p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="ivac-success-bg flex h-8 w-8 items-center justify-center rounded-lg">
            <WalletCards size={15} className="ivac-success" />
          </div>

          <div>
            <h2 className="text-xs font-bold">Payment</h2>

            <p className="text-[9px] ivac-text-muted">Payment summary</p>
          </div>
        </div>

        <StatusBadge status={application.paymentStatus ?? "pending"} />
      </div>

      <div className="rounded-lg border border-[var(--app-border)] px-3">
        <InfoRow label="Application Fee" value="৳ 800.00" />

        <div className="border-t border-[var(--app-border)]" />

        <InfoRow label="Convenience Fee" value="৳ 100.00" />

        <div className="border-t border-[var(--app-border)]" />

        <InfoRow label="Total" value="৳ 900.00" />
      </div>

      <div className="ivac-warning-bg ivac-warning mt-2 flex items-start gap-2 rounded-lg p-2 text-[9px]">
        <Info size={12} className="mt-0.5 shrink-0" />

        <span>
          Payment requires explicit user confirmation before proceeding.
        </span>
      </div>
    </section>
  );
}
