/**
 * Reusable card component for grouped content
 */
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`ivac-card rounded-lg p-2 ${className}`.trim()}>
      {children}
    </div>
  );
}

/**
 * Card for displaying information (non-interactive)
 */
export function InfoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-2)] p-1.5 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
