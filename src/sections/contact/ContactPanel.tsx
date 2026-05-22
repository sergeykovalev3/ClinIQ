"use client";

import { useEffect, useRef } from "react";
import { RoundMagneticLink } from "@/components/ui/RoundMagneticLink";
import { UploadArrowIcon } from "@/components/ui/UploadArrowIcon";
import { usePanelMagnetic } from "@/hooks/usePanelMagnetic";
import { contactEmail } from "@/lib/contact";
import { cta } from "@/lib/site";
import { cn } from "@/lib/cn";

export function ContactPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const magneticEnabledRef = useRef(true);

  useEffect(() => {
    magneticEnabledRef.current = !window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  usePanelMagnetic({
    panelRef,
    enabledRef: magneticEnabledRef,
    strength: 0.12,
  });

  return (
    <div
      ref={panelRef}
      className={cn(
        "rounded-[1.45rem] bg-surface p-6 will-change-transform md:p-8 lg:p-9",
        "shadow-[0_24px_60px_-32px_rgba(15,28,40,0.38)]",
      )}
    >
      <p className="text-[11px] font-medium tracking-normal text-muted">
        Email us
      </p>
      <a
        href={contactEmail.href}
        className="mt-4 block max-w-full break-all font-display text-[clamp(1.75rem,5.5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg transition-colors duration-300 hover:text-accent md:mt-5"
      >
        {contactEmail.label}
      </a>
      <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-muted md:mt-6">
        Typical reply within one business day.
      </p>
      <div className="mt-8 flex items-center gap-4 md:mt-10">
        <RoundMagneticLink
          href={cta.upload.href}
          aria-label={cta.upload.label}
          size="md"
        >
          <UploadArrowIcon className="h-6 w-6 text-bg" />
        </RoundMagneticLink>
        <span className="max-w-[10rem] text-[11px] font-medium leading-snug tracking-normal text-fg">
          {cta.upload.label}
        </span>
      </div>
    </div>
  );
}
