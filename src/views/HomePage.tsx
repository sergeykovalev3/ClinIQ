"use client";

import { useRef, useState } from "react";
import { MenuFab } from "@/components/layout/MenuFab";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { MotionReadyProvider } from "@/components/layout/MotionReadyProvider";
import { NavTransitionProvider } from "@/components/layout/NavTransitionProvider";
import { Preloader } from "@/components/preloader/Preloader";
import { HeroSection } from "@/sections/hero/HeroSection";
import { HowItWorksSection } from "@/sections/how-it-works/HowItWorksSection";
import { ContactSection } from "@/sections/contact/ContactSection";
import { FormFooterSection } from "@/sections/form-footer/FormFooterSection";
import { PricingSection } from "@/sections/pricing/PricingSection";
import { StoriesSection } from "@/sections/stories/StoriesSection";

export function HomePage() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [ready, setReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  return (
    <>
      <LenisProvider>
        <MotionReadyProvider active={!showPreloader}>
          <NavTransitionProvider>
            <main className="relative z-10 bg-bg text-fg">
              <HeroSection heroRef={heroRef} showNav={ready} introRevealed={ready} />
              <HowItWorksSection />
              <StoriesSection />
              <PricingSection />
              <ContactSection />
              <FormFooterSection />
            </main>
            <MenuFab />
          </NavTransitionProvider>
        </MotionReadyProvider>
      </LenisProvider>
      {showPreloader && (
        <Preloader
          onReveal={() => setReady(true)}
          onComplete={() => setShowPreloader(false)}
        />
      )}
    </>
  );
}
