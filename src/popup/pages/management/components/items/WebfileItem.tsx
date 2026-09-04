import { FileCheck, FileWarning, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { RecordItem, text } from "../../../../../types/management.types";
import { getLocalFile } from "../../../../../storage/storage";

interface WebfileItemProps {
  webfile: RecordItem;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Single webfile item in the list
 */
export function WebfileItem({ webfile, onEdit, onDelete }: WebfileItemProps) {
  const [localFile, setLocalFile] = useState<File | null>(null);

  useEffect(() => {
    let active = true;
    void getLocalFile(webfile.id)
      .then((file) => {
        if (active) setLocalFile(file);
      })
      .catch(() => {
        if (active) setLocalFile(null);
      });
    return () => {
      active = false;
    };
  }, [webfile.id]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex items-start justify-between gap-2 rounded-lg bg-(--app-surface-2) px-2 py-1.5 text-[8px]">
      <div className="min-w-0">
        <p className="truncate font-semibold">
          {text(webfile, "webfileNumber")}
        </p>
        <div className="mt-1 flex items-center gap-1">
          {localFile ? (
            <FileCheck size={10} className="ivac-success shrink-0" />
          ) : (
            <FileWarning size={10} className="ivac-warning shrink-0" />
          )}
          <span className={localFile ? "ivac-success" : "ivac-warning"}>
            {localFile ? "Saved locally" : "File not available locally"}
          </span>
        </div>
        {localFile && (
          <p className="mt-0.5 truncate ivac-text-muted" title={localFile.name}>
            {localFile.name} · {formatSize(localFile.size)}
            {localFile.type ? ` · ${localFile.type}` : ""}
          </p>
        )}
        <p
          className="mt-0.5 truncate ivac-text-muted"
          title={text(webfile, "filePath")}
        >
          Path: {text(webfile, "filePath")}
        </p>
      </div>
      <div className="flex shrink-0 gap-0.5">
        <button
          type="button"
          onClick={onEdit}
          className="ivac-hover rounded p-0.5 text-(--app-text-muted)"
        >
          <Pencil size={9} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="ivac-hover rounded p-0.5 text-red-500"
        >
          <Trash2 size={9} />
        </button>
      </div>
    </div>
  );
}
