"use client";

import type { RefObject } from "react";
import { HeroLocationBadge } from "@/sections/hero/HeroLocationBadge";
import { HeroImage } from "@/sections/hero/HeroImage";
import { HeroMarquee } from "@/sections/hero/HeroMarquee";
import { HeroNav } from "@/sections/hero/HeroNav";
import { HeroScrollCue } from "@/sections/hero/HeroScrollCue";
import { useHeroIntroReveal } from "@/hooks/useHeroIntroReveal";

type HeroSectionProps = {
  heroRef: RefObject<HTMLElement | null>;
  showNav: boolean;
  introRevealed: boolean;
};

export function HeroSection({ heroRef, showNav, introRevealed }: HeroSectionProps) {
  const { badgeRef, scrollCueRef } = useHeroIntroReveal(introRevealed);
  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,#f6f8fb_0%,#eef2f6_48%,#e2e9ef_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_78%_46%_at_50%_92%,#d5dee8_0%,transparent_68%)]"
      />
      <HeroNav visible={showNav} />
      <div className="absolute top-[14%] left-0 z-30 -translate-y-0 sm:top-[18%] md:top-[22%] lg:top-1/2 lg:-translate-y-1/2">
        <div ref={badgeRef}>
          <HeroLocationBadge />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 flex w-full items-end justify-center px-2 sm:px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:px-8">
        <div aria-hidden className="hidden md:block" />
        <HeroImage className="shrink-0 self-end" />
        <div
          ref={scrollCueRef}
          className="hidden items-end md:flex md:pb-[34vh] md:pl-8 lg:pb-[36vh] lg:pl-10"
        >
          <HeroScrollCue />
        </div>
      </div>
      <HeroMarquee className="absolute inset-x-0 bottom-[9vh] z-20 sm:bottom-[10vh] md:bottom-[11vh]" />
    </section>
  );
}
