"use client";

import { useEffect, useRef } from "react";
import { RoundMagneticLink } from "@/components/ui/RoundMagneticLink";
import { UploadArrowIcon } from "@/components/ui/UploadArrowIcon";
import { usePanelMagnetic } from "@/hooks/usePanelMagnetic";
import type { pricingPlans } from "@/lib/pricing";
import { cn } from "@/lib/cn";

type PricingPlan = (typeof pricingPlans)[number];

type PricingCardProps = {
  plan: PricingPlan;
};

export function PricingCard({ plan }: PricingCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const magneticEnabledRef = useRef(true);

  useEffect(() => {
    magneticEnabledRef.current = !window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  usePanelMagnetic({
    panelRef: cardRef,
    enabledRef: magneticEnabledRef,
    strength: 0.12,
  });

  return (
    <article
      ref={cardRef}
      className={cn(
        "relative flex flex-col rounded-[1.45rem] bg-surface p-6 will-change-transform md:p-8 lg:p-9",
        plan.featured
          ? "bg-gradient-to-b from-accent/[0.05] to-surface shadow-[0_28px_70px_-32px_rgba(29,158,140,0.26)]"
          : "shadow-[0_24px_60px_-32px_rgba(15,28,40,0.38)]",
      )}
    >
      {plan.featured ? (
        <span className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1.5 text-[11px] font-medium tracking-normal text-on-accent md:right-6 md:top-6">
          Popular
        </span>
      ) : null}

      <p className="text-[11px] font-medium tracking-normal text-muted">
        {plan.name}
      </p>

      <div className="mt-5 flex items-start gap-0.5 font-display md:mt-6">
        <span className="mt-[0.35em] text-[clamp(1.25rem,3vw,1.75rem)] font-medium leading-none text-muted">
          $
        </span>
        <span className="text-[clamp(3.5rem,14vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-fg">
          {plan.price}
        </span>
      </div>

      <p className="mt-2 text-sm tracking-normal text-muted md:text-base">
        {plan.period}
      </p>

      <p className="mt-5 max-w-[16rem] font-display text-[clamp(1.25rem,3.2vw,1.65rem)] font-medium leading-[1.12] tracking-[-0.03em] text-fg md:mt-6">
        {plan.line}
      </p>

      <ul className="mt-6 flex flex-1 flex-col gap-3 md:mt-8 md:gap-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            <span className="text-sm leading-snug text-fg/90 md:text-[15px]">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-4 md:mt-10">
        <RoundMagneticLink
          href={plan.cta.href}
          aria-label={plan.cta.label}
          size="md"
        >
          <UploadArrowIcon className="h-6 w-6 text-bg" />
        </RoundMagneticLink>
        <span className="max-w-[9rem] text-[11px] font-medium leading-snug tracking-normal text-fg">
          {plan.cta.label}
        </span>
      </div>
    </article>
  );
}
