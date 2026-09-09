import { Plus } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--app-primary)] text-white hover:bg-[var(--app-primary-hover)] disabled:opacity-60 shadow-sm font-semibold",
  secondary:
    "border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] hover:bg-[var(--app-surface-2)] font-medium",
  danger:
    "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-400",
};

const sizes: Record<"sm" | "md", string> = {
  sm: "px-2.5 py-1.5 text-[10px]",
  md: "px-3.5 py-2.5 text-[11px]",
};

/**
 * Reusable button component with variants
 */
export function Button({
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/20 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

interface AddButtonProps {
  onClick: () => void;
  size?: "sm" | "md";
}

/**
 * Button for adding new records
 */
export function AddButton({ onClick, size = "md" }: AddButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="primary"
      size={size}
      className="flex items-center gap-1"
    >
      <Plus size={size === "sm" ? 9 : 12} /> Add
    </Button>
  );
}
