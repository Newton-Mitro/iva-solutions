import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="relative"
      onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("[data-card-header]")) {
          setOpen((current) => !current);
        }
      }}
    >
      {open ? (
        children
      ) : (
        <div className="ivac-card rounded-xl px-3 py-2">
          <span className="text-xs font-bold">{title}</span>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
        title={`${open ? "Collapse" : "Expand"} ${title}`}
        className={`ivac-hover absolute top-2 z-10 rounded-lg p-1.5 ivac-text-muted ${
          open ? "right-12" : "right-2"
        } ${open ? "bg-(--app-surface)/80" : ""}`}
      >
        <ChevronDown
          size={14}
          className={`ivac-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
