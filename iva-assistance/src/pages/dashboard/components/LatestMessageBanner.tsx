import type { Message } from "../../../types/message.type";

type LatestMessageAlertProps = {
  latestMessage: Message;
};

export function LatestMessageAlert({ latestMessage }: LatestMessageAlertProps) {
  const messageTime = latestMessage.timestamp
    ? latestMessage.timestamp.toDate
      ? latestMessage.timestamp.toDate().toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date(String(latestMessage.timestamp)).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
    : "";

  return (
    <div className="border-t border-(--app-border) bg-(--app-warning-bg) px-3 py-2.5 text-[9px] text-(--app-text)">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[6px] font-bold uppercase tracking-[0.18em] text-(--app-warning)">
            Latest message
          </p>
          <p className="mt-1 text-[8px] font-semibold">
            {latestMessage.sender === "agent" ? "Agent" : "Client"}
          </p>
        </div>

        <span className="rounded-full bg-(--app-surface) px-1.5 py-0.5 font-bold tracking-wide text-(--app-text) shadow-sm ring-1 ring-(--app-border)">
          OTP {latestMessage.otp || "-"}
        </span>
      </div>

      <p className="mt-1 max-h-10 overflow-hidden text-[9px] leading-relaxed text-(--app-text-secondary)">
        {latestMessage.body || "No message body"}
      </p>

      {messageTime && (
        <p className="mt-1 text-[8px] font-medium text-(--app-text-muted)">
          {messageTime}
        </p>
      )}
    </div>
  );
}
