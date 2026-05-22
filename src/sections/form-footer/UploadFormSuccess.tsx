import { uploadFormCopy } from "@/lib/form-footer";
import { cn } from "@/lib/cn";
import { cardHeadline, sectionEyebrow, sectionLead } from "@/lib/typography";

type UploadFormSuccessProps = {
  visible: boolean;
  className?: string;
};

export function UploadFormSuccess({ visible, className }: UploadFormSuccessProps) {
  const { eyebrow, headline, line } = uploadFormCopy.success;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "border-y border-preloader-fg/14 py-10 md:py-12",
        "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0",
        className,
      )}
    >
      <p
        className={cn(
          sectionEyebrow("preloader", "tracking-[0.12em] text-preloader-fg/45"),
          "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
          visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
        style={{ transitionDelay: visible ? "120ms" : "0ms" }}
      >
        {eyebrow}
      </p>
      <h3
        className={cn(
          cardHeadline("preloader-fg", "max-w-[12ch]"),
          "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
        style={{ transitionDelay: visible ? "220ms" : "0ms" }}
      >
        {headline}
      </h3>
      <p
        className={cn(
          sectionLead("preloader", "max-w-[20rem]"),
          "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
        style={{ transitionDelay: visible ? "300ms" : "0ms" }}
      >
        {line}
      </p>
    </div>
  );
}
