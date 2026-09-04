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
    "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 font-bold",
  secondary:
    "border border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-surface-2)] font-semibold",
  danger: "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20",
};

const sizes: Record<"sm" | "md", string> = {
  sm: "px-1.5 py-0.5 text-[8px]",
  md: "px-2 py-1.5 text-[9px]",
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
      className={`rounded ${sizes[size]} ${variants[variant]} ${className}`.trim()}
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
