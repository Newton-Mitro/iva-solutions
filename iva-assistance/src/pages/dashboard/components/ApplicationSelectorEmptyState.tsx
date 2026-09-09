import { FileText } from "lucide-react";

type ApplicationSelectorEmptyStateProps = {
  title?: string;
  text: string;
};

export function ApplicationSelectorEmptyState({
  title = "No results",
  text,
}: ApplicationSelectorEmptyStateProps) {
  return (
    <div className="flex min-h-20 flex-col items-center justify-center rounded-lg border border-dashed border-(--app-border) px-3 text-center">
      <div className="ivac-surface-2 ivac-text-muted flex h-7 w-7 items-center justify-center rounded-full">
        <FileText size={12} />
      </div>

      <p className="mt-1 text-[9px] font-semibold">{title}</p>

      <p className="mt-0.5 text-[7px] ivac-text-muted">{text}</p>
    </div>
  );
}
