"use client";

import { Container } from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { uploadSectionHeader } from "@/lib/form-footer";
import { sectionEyebrow, sectionHeadline, sectionLead } from "@/lib/typography";
import { FormSiteFooter } from "@/sections/form-footer/FormSiteFooter";
import { UploadForm } from "@/sections/form-footer/UploadForm";

export function FormFooterSection() {
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
      id="upload"
      className="relative bg-upload-bg text-preloader-fg"
    >
      <div className="flex min-h-[100dvh] flex-col">
        <Container className="flex flex-1 flex-col justify-between py-16 md:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14 xl:gap-20">
            <div data-reveal-zone>
              <p data-reveal className={sectionEyebrow("preloader")}>
                {uploadSectionHeader.eyebrow}
              </p>
              <h2 data-reveal className={sectionHeadline("preloader-fg", "max-w-[11ch]")}>
                {uploadSectionHeader.headline}
              </h2>
              <p data-reveal className={sectionLead("preloader", "max-w-[18rem]")}>
                {uploadSectionHeader.line}
              </p>
            </div>

            <div data-reveal-zone>
              <div data-reveal>
                <UploadForm className="lg:max-w-none" />
              </div>
            </div>
          </div>

          <FormSiteFooter />
        </Container>
      </div>
    </section>
  );
}
