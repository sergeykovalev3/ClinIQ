"use client";

import { Container } from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { pricingFootnote, pricingHeader, pricingPlans } from "@/lib/pricing";
import { sectionEyebrow, sectionHeadline, sectionLead } from "@/lib/typography";
import { PricingCard } from "@/sections/pricing/PricingCard";

export function PricingSection() {
  const sectionRef = useScrollReveal<HTMLElement>({
    y: 48,
    stagger: 0.12,
    scrub: 0.42,
    start: "top 88%",
    end: "top 48%",
  });

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="bg-bg py-20 md:py-28 lg:py-32"
    >
      <Container>
        <div data-reveal-zone className="mb-12 md:mb-16 lg:mb-20">
          <p data-reveal className={sectionEyebrow()}>
            {pricingHeader.eyebrow}
          </p>
          <h2 data-reveal className={sectionHeadline("fg", "max-w-[10ch]")}>
            {pricingHeader.headline}
          </h2>
          <p data-reveal className={sectionLead("muted", "max-w-[22rem]")}>
            {pricingHeader.line}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
          {pricingPlans.map((plan) => (
            <div key={plan.id} data-reveal-zone className="h-full">
              <div data-reveal className="h-full">
                <PricingCard plan={plan} />
              </div>
            </div>
          ))}
        </div>

        <div data-reveal-zone className="mt-10 md:mt-12">
          <p
            data-reveal
            className="max-w-[32rem] text-[11px] leading-relaxed tracking-normal text-muted md:text-xs"
          >
            {pricingFootnote}
          </p>
        </div>
      </Container>
    </section>
  );
}
