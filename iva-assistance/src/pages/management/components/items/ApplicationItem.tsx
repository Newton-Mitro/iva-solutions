import { Pencil, Trash2 } from "lucide-react";
import { RecordItem, text } from "../../../../types/management.types";

interface ApplicationItemProps {
  app: RecordItem;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

/**
 * Single application item in the tree
 */
export function ApplicationItem({
  app,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: ApplicationItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`ivac-hover flex w-full items-center justify-between rounded-lg p-2 text-left text-[9px] ${isSelected ? "bg-blue-50 dark:bg-blue-950/30" : "bg-[var(--app-surface-2)]"}`}
    >
      <span className="min-w-0">
        <span className="block truncate font-semibold">
          {text(app, "mission")}
        </span>
        <span className="block truncate text-[8px] ivac-text-muted">
          {text(app, "ivacCenter")}
        </span>
      </span>
      <div className="ml-2 flex shrink-0 gap-0.5">
        <button
          onClick={onEdit}
          className="ivac-hover rounded p-1 text-[var(--app-text-muted)]"
        >
          <Pencil size={10} />
        </button>
        <button
          onClick={onDelete}
          className="ivac-hover rounded p-1 text-red-500"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </button>
  );
}
