import { Pencil, Trash2 } from "lucide-react";
import { RecordItem, text } from "../../../../../types/management.types";

interface WebfileItemProps {
  webfile: RecordItem;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Single webfile item in the list
 */
export function WebfileItem({ webfile, onEdit, onDelete }: WebfileItemProps) {
  return (
    <div className="flex items-center justify-between gap-1 rounded-lg bg-[var(--app-surface-2)] px-2 py-1.5 text-[8px]">
      <span className="truncate font-semibold">
        {text(webfile, "webfileNumber")}
      </span>
      <div className="flex shrink-0 gap-0.5">
        <button
          onClick={onEdit}
          className="ivac-hover rounded p-0.5 text-[var(--app-text-muted)]"
        >
          <Pencil size={9} />
        </button>
        <button
          onClick={onDelete}
          className="ivac-hover rounded p-0.5 text-red-500"
        >
          <Trash2 size={9} />
        </button>
      </div>
    </div>
  );
}
