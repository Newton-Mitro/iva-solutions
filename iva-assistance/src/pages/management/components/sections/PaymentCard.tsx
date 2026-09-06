import { CreditCard } from "lucide-react";
import { InfoCard } from "../../../../components/ui/Card";
import { RecordItem, text } from "../../../../types/management.types";

export function PaymentCard({ payment }: { payment: RecordItem | undefined }) {
  return (
    <div className="pl-2 text-[8px]">
      <InfoCard>
        <div className="flex items-center gap-1.5 font-semibold">
          <CreditCard size={11} />
          <span>Payment</span>
          {payment && (
            <span className="ml-auto">{text(payment, "status")}</span>
          )}
        </div>
        <p className="mt-0.5 truncate ivac-text-muted">
          {payment
            ? `${text(payment, "amount")} ${text(payment, "currency")} · ${text(payment, "transactionId")}`
            : "No payment recorded"}
        </p>
      </InfoCard>
    </div>
  );
}
