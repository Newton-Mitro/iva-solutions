type MetaItemProps = {
  label: string;
  value: string;
  compact?: boolean;
};

export function MetaItem({ label, value, compact = false }: MetaItemProps) {
  return (
    <div
      className={compact ? "min-w-0" : "min-w-0 flex-1 px-3 py-1.5 first:pl-0"}
    >
      <p className="text-[8px] font-bold uppercase tracking-wider ivac-text-muted">
        {label}
      </p>

      <p
        className={`mt-0.5 truncate ${
          compact ? "text-[9px] font-semibold" : "text-[10px] font-semibold"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
