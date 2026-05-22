import { cn } from "@/lib/cn";

type FormFieldErrorProps = {
  id: string;
  message?: string;
  className?: string;
};

export function FormFieldError({ id, message, className }: FormFieldErrorProps) {
  const visible = Boolean(message);

  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        visible ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
    >
      <div className="overflow-hidden">
        <p
          id={id}
          role="alert"
          aria-live="polite"
          className={cn(
            "mt-2 text-[11px] leading-snug text-[#e8a0a0] transition-opacity duration-300 ease-out",
            visible ? "opacity-100" : "opacity-0",
          )}
        >
          {message ?? ""}
        </p>
      </div>
    </div>
  );
}
