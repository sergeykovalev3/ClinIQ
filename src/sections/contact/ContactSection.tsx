"use client";

import { Container } from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { contactHeader } from "@/lib/contact";
import { sectionEyebrow, sectionHeadline, sectionLead } from "@/lib/typography";
import { ContactPanel } from "@/sections/contact/ContactPanel";

export function ContactSection() {
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
      id="contact"
      className="relative overflow-visible bg-bg pt-20 md:pt-28 lg:pt-32"
    >
      <Container className="relative z-10 pb-20 md:pb-24 lg:pb-28">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 xl:gap-20">
          <div data-reveal-zone className="flex flex-col justify-end">
            <p data-reveal className={sectionEyebrow()}>
              {contactHeader.eyebrow}
            </p>
            <h2 data-reveal className={sectionHeadline("fg", "max-w-[9ch]")}>
              {contactHeader.headline}
            </h2>
            <p data-reveal className={sectionLead("muted", "max-w-[22rem]")}>
              {contactHeader.line}
            </p>
          </div>

          <div data-reveal-zone>
            <div data-reveal>
              <ContactPanel />
            </div>
          </div>
        </div>
      </Container>

      <div
        data-contact-arc
        aria-hidden
        className="pointer-events-none absolute left-[-5%] z-[1] h-[clamp(100px,15.625vw,200px)] w-[110%] -translate-y-1/2 rounded-[50%] bg-bg"
      />
    </section>
  );
}
