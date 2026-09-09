/**
 * Reusable input field component
 */
export function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
  placeholder,
  accept,
  value,
  onChange,
  minLength,
  maxLength,
  className = "",
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  accept?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
  maxLength?: number;
  className?: string;
}) {
  return (
    <label className="block text-[11px] font-semibold text-[var(--app-text)]">
      <span className="mb-1 block">{label}</span>
      <input
        className={`ivac-input ${className}`.trim()}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        accept={accept}
        minLength={minLength}
        maxLength={maxLength}
      />
    </label>
  );
}
