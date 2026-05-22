"use client";

import { Container } from "@/components/ui/Container";
import { RoundMagneticLink } from "@/components/ui/RoundMagneticLink";
import { UploadArrowIcon } from "@/components/ui/UploadArrowIcon";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { stories, storiesHeader } from "@/lib/stories";
import { cta } from "@/lib/site";
import { cn } from "@/lib/cn";
import { sectionEyebrow, sectionHeadline, sectionLead, typeCtaCaption } from "@/lib/typography";
import { StoryCard } from "@/sections/stories/StoryCard";

export function StoriesSection() {
  const sectionRef = useScrollReveal<HTMLElement>({
    y: 48,
    stagger: 0.14,
    scrub: 1,
    start: "top 88%",
    end: "top 48%",
  });

  return (
    <section ref={sectionRef} id="stories" className="bg-bg py-20 md:py-28">
      <Container>
        <div
          data-reveal-zone
          className="mb-12 md:mb-16 lg:mb-20"
        >
          <p data-reveal className={sectionEyebrow()}>
            {storiesHeader.eyebrow}
          </p>
          <h2 data-reveal className={sectionHeadline("fg", "max-w-[12ch]")}>
            {storiesHeader.headline}
          </h2>
          <p data-reveal className={sectionLead("muted", "max-w-[24rem]")}>
            {storiesHeader.line}
          </p>
        </div>

        <div>
          {stories.map((story, index) => (
            <StoryCard key={story.id} story={story} reversed={index % 2 === 1} />
          ))}
        </div>

        <div data-reveal-zone className="mt-4">
          <div
            data-reveal-rule
            className="h-px w-full origin-left bg-border/70"
            aria-hidden
          />
          <div data-reveal className="flex items-center gap-4 pt-12 md:pt-16">
            <RoundMagneticLink
              href={cta.upload.href}
              aria-label={cta.upload.label}
              size="md"
            >
              <UploadArrowIcon className="h-6 w-6 text-bg" />
            </RoundMagneticLink>
            <span className={cn(typeCtaCaption, "max-w-[12rem] text-fg")}>
              {cta.upload.label}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
