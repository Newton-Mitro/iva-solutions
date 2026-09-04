import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { RecordItem, text } from "../../../../../types/management.types";

interface ApplicantItemProps {
  applicant: RecordItem;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Single applicant item in the tree
 */
export function ApplicantItem({
  applicant,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: ApplicantItemProps) {
  return (
    <div>
      <button
        onClick={onSelect}
        className={`ivac-hover flex w-full items-center justify-between rounded-lg p-2 text-left ${isSelected ? "bg-blue-50 dark:bg-blue-950/30" : ""}`}
      >
        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold">
            {text(applicant, "fullName")}
          </span>
          <span className="block truncate text-[9px] ivac-text-muted">
            {text(applicant, "passportNumber")}
          </span>
        </span>
        {isSelected && <ChevronRight size={14} className="shrink-0" />}
      </button>
    </div>
  );
}
