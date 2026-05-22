import { cn } from "@/lib/cn";

export const typeEyebrow =
  "text-[10px] font-medium tracking-[0.02em] text-muted md:text-[11px]";

export const typeSectionHeadline =
  "font-display text-[clamp(2.75rem,10vw,7rem)] font-medium uppercase leading-[0.88] tracking-[-0.04em]";

export const typeSectionHeadlineSpacing = "mt-3 md:mt-4";

export const typeSectionLead =
  "text-sm leading-relaxed text-muted md:text-base";

export const typeSectionLeadSpacing = "mt-4 md:mt-5";

export const typeCardTitle =
  "font-display text-[clamp(2rem,7vw,4.75rem)] font-medium leading-[0.92] tracking-[-0.03em] text-fg";

export const typeCardTitleSpacing = "mt-3 md:mt-4";

export const typeCardEyebrow =
  "text-[11px] font-medium tracking-[0.02em] text-muted md:text-xs";

export const typeAccentCaption =
  "text-xs font-medium tracking-[0.02em] text-accent";

export const typeCtaCaption =
  "text-[11px] font-medium leading-snug tracking-normal";

export function sectionHeadline(tone: "fg" | "preloader-fg" = "fg", className?: string) {
  return cn(
    typeSectionHeadline,
    typeSectionHeadlineSpacing,
    tone === "preloader-fg" ? "text-preloader-fg" : "text-fg",
    className,
  );
}

export function sectionLead(tone: "muted" | "preloader" = "muted", className?: string) {
  return cn(
    typeSectionLead,
    typeSectionLeadSpacing,
    tone === "preloader" ? "text-preloader-fg/65" : "text-muted",
    className,
  );
}

export function sectionEyebrow(tone: "muted" | "preloader" = "muted", className?: string) {
  return cn(
    typeEyebrow,
    tone === "preloader" ? "text-preloader-fg/55" : undefined,
    className,
  );
}

export function cardHeadline(tone: "fg" | "preloader-fg" = "fg", className?: string) {
  return cn(
    typeCardTitle,
    typeCardTitleSpacing,
    "uppercase leading-[0.9] tracking-[-0.04em]",
    tone === "preloader-fg" ? "text-preloader-fg" : "text-fg",
    className,
  );
}
