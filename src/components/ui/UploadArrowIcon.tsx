import { cn } from "@/lib/cn";

type UploadArrowIconProps = {
  className?: string;
};

export function UploadArrowIcon({ className }: UploadArrowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-7 w-7 stroke-current stroke-[1.35]", className)}
      aria-hidden
    >
      <path d="M12 4v11" strokeLinecap="round" />
      <path d="M8 9l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 20h14" strokeLinecap="round" />
    </svg>
  );
}
