import { KeyRound, Pencil, Trash2 } from "lucide-react";
import { RecordItem, text } from "../../../../../types/management.types";

interface AccountSectionProps {
  account: RecordItem | undefined;
  onEdit: () => void;
  onCreate: () => void;
  onDelete: () => void;
}

/**
 * Display and manage automation account section
 */
export function AccountSection({
  account,
  onEdit,
  onCreate,
  onDelete,
}: AccountSectionProps) {
  return (
    <div className="pl-2">
      <div className="flex items-center justify-between rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] p-2">
        <div className="flex items-center gap-2 min-w-0">
          <KeyRound size={13} className="shrink-0" />
          <span className="text-[9px] font-bold truncate">
            {account
              ? text(account, "email")
              : "No Indian Visa Application account"}
          </span>
        </div>
        <div className="flex gap-1 shrink-0">
          {account ? (
            <>
              <button
                onClick={onEdit}
                className="ivac-hover rounded p-1 text-[var(--app-text-muted)]"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={onDelete}
                className="ivac-hover rounded p-1 text-red-500"
              >
                <Trash2 size={11} />
              </button>
            </>
          ) : (
            <button
              onClick={onCreate}
              className="ivac-hover text-[9px] font-semibold text-blue-600"
            >
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
