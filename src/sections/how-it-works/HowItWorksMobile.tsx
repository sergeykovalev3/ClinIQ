"use client";

import { Container } from "@/components/ui/Container";
import { RoundMagneticLink } from "@/components/ui/RoundMagneticLink";
import { UploadArrowIcon } from "@/components/ui/UploadArrowIcon";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { howItWorksSteps } from "@/lib/how-it-works";
import {
  sectionEyebrow,
  sectionHeadline,
  sectionLead,
  typeCardEyebrow,
  typeCtaCaption,
} from "@/lib/typography";
import { cta } from "@/lib/site";
import { HowItWorksStepVisual } from "@/sections/how-it-works/HowItWorksStepVisual";
import { cn } from "@/lib/cn";

export function HowItWorksMobile() {
  const sectionRef = useScrollReveal<HTMLElement>({
    y: 40,
    stagger: 0.12,
    scrub: 0.42,
    start: "top 90%",
    end: "top 58%",
  });

  return (
    <section
      ref={sectionRef}
      id="how"
      className="relative bg-bg py-16 sm:py-20"
    >
      <Container>
        <p className={sectionEyebrow()}>How it works</p>

        <ol className="mt-10 flex flex-col gap-12 sm:mt-12 sm:gap-14">
          {howItWorksSteps.map((step) => (
            <li
              key={step.id}
              className={cn(step.id === "upload" && "overflow-visible")}
            >
              <article data-reveal-zone>
                <p data-reveal className={typeCardEyebrow}>
                  {step.index}
                </p>
                <h2 data-reveal className={sectionHeadline("fg", "max-w-[20rem]")}>
                  {step.headline}
                </h2>
                <p data-reveal className={sectionLead("muted", "max-w-[20rem]")}>
                  {step.line}
                </p>

                {step.id === "upload" ? (
                  <div data-reveal className="mt-6 flex items-center gap-4">
                    <RoundMagneticLink
                      href={cta.upload.href}
                      aria-label={cta.upload.label}
                      size="md"
                    >
                      <UploadArrowIcon className="h-6 w-6 text-bg" />
                    </RoundMagneticLink>
                    <span className={cn(typeCtaCaption, "max-w-[10rem] text-fg")}>
                      {cta.upload.label}
                    </span>
                  </div>
                ) : null}

                <div data-reveal className="mt-8 flex justify-center sm:mt-10">
                  <HowItWorksStepVisual
                    id={step.id}
                    active
                    variant="stacked"
                  />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
