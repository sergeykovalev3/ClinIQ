import { FormFieldError } from "@/components/ui/FormFieldError";
import { cn } from "@/lib/cn";

type FormLineFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  inputMode?: "text" | "email" | "tel" | "numeric";
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  error?: string;
  onBlur?: () => void;
  className?: string;
};

export function FormLineField({
  id,
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
  maxLength,
  error,
  onBlur,
  className,
}: FormLineFieldProps) {
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <label
      htmlFor={id}
      className={cn(
        "group block border-y border-preloader-fg/14 py-4 transition-[border-color] duration-300 focus-within:border-preloader-fg/40",
        hasError && "border-[#e8a0a0]/45 focus-within:border-[#e8a0a0]/55",
        className,
      )}
    >
      <span className="block text-[10px] font-medium tracking-[0.12em] text-preloader-fg/45 transition-colors duration-300 group-focus-within:text-preloader-fg/65">
        {label}
      </span>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={hasError ? true : undefined}
        aria-describedby={hasError ? errorId : undefined}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full bg-transparent font-sans text-[15px] leading-snug text-preloader-fg outline-none placeholder:text-preloader-fg/28 md:text-base"
      />
      <FormFieldError id={errorId} message={error} />
    </label>
  );
}

type FormLineTextareaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  error?: string;
  onBlur?: () => void;
  className?: string;
};

export function FormLineTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
  error,
  onBlur,
  className,
}: FormLineTextareaProps) {
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <label
      htmlFor={id}
      className={cn(
        "group block border-y border-preloader-fg/14 py-4 transition-[border-color] duration-300 focus-within:border-preloader-fg/40",
        hasError && "border-[#e8a0a0]/45 focus-within:border-[#e8a0a0]/55",
        className,
      )}
    >
      <span className="block text-[10px] font-medium tracking-[0.12em] text-preloader-fg/45 transition-colors duration-300 group-focus-within:text-preloader-fg/65">
        {label}
      </span>
      <textarea
        id={id}
        rows={rows}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={hasError ? true : undefined}
        aria-describedby={hasError ? errorId : undefined}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-none bg-transparent font-sans text-[15px] leading-relaxed text-preloader-fg outline-none placeholder:text-preloader-fg/28 md:text-base"
      />
      <FormFieldError id={errorId} message={error} />
    </label>
  );
}
