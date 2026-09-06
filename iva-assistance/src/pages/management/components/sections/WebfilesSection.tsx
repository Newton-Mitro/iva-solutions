import { FileText } from "lucide-react";
import { WebfileItem } from "../items/WebfileItem";
import { AddButton } from "../../../../components/ui/Button";
import { RecordItem } from "../../../../types/management.type";

interface WebfilesSectionProps {
  webfiles: RecordItem[];
  onAdd: () => void;
  onEdit: (webfile: RecordItem) => void;
  onDelete: (id: string) => void;
}

/**
 * Display and manage webfiles section
 */
export function WebfilesSection({
  webfiles,
  onAdd,
  onEdit,
  onDelete,
}: WebfilesSectionProps) {
  return (
    <div className="pl-2">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={12} />
          <span className="text-[8px] font-bold">Webfiles</span>
          <span className="text-[7px] ivac-text-muted">{webfiles.length}</span>
        </div>
        <AddButton onClick={onAdd} size="sm" />
      </div>

      <div className="space-y-0.5">
        {webfiles.map((webfile) => (
          <WebfileItem
            key={webfile.id}
            webfile={webfile}
            onEdit={() => onEdit(webfile)}
            onDelete={() => onDelete(webfile.id)}
          />
        ))}
      </div>
    </div>
  );
}
