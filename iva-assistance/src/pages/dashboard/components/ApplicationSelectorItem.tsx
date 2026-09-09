import { Check, FileText, MapPin } from "lucide-react";
import type { Application } from "../../../types/application.type";
import { StatusBadge } from "./Shared";

type ApplicationSelectorItemProps = {
  item: Application;
  selected: boolean;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function ApplicationSelectorItem({
  item,
  selected,
  onSelect,
  onClose,
}: ApplicationSelectorItemProps) {
  return (
    <button
      key={item.id}
      type="button"
      onClick={() => {
        onSelect(item.id);
        onClose();
      }}
      className={`group flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition ${
        selected
          ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30"
          : "border-transparent ivac-hover"
      }`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
          selected
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
            : "ivac-surface-2 ivac-text-muted"
        }`}
      >
        {selected ? <Check size={12} /> : <FileText size={12} />}
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={`truncate text-[11px] font-bold leading-tight ${
            selected ? "text-blue-700 dark:text-blue-300" : ""
          }`}
        >
          {item.fullName || "Unnamed applicant"}
        </div>

        <div className="mt-0.5 flex items-center gap-1 text-[9px] leading-tight ivac-text-muted">
          <span className="truncate">
            {item.passportNumber || "No passport"}
          </span>
        </div>

        <div className="mt-0.5 flex items-center gap-1 text-[9px] leading-tight ivac-text-muted">
          <MapPin size={9} className="shrink-0" />
          <span className="truncate">{item.mission || "No mission"}</span>
          <span>·</span>
          <span className="truncate">{item.ivacCenter || "No center"}</span>
        </div>
      </div>

      <div className="shrink-0">
        <StatusBadge status={item.status} />
      </div>
    </button>
  );
}
