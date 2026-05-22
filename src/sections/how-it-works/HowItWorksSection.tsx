"use client";

import { useLayoutEffect, useState } from "react";
import { useHowPinEnabled } from "@/hooks/useHowPinEnabled";
import { HowItWorksMobile } from "@/sections/how-it-works/HowItWorksMobile";
import { HowItWorksPinned } from "@/sections/how-it-works/HowItWorksPinned";

export function HowItWorksSection() {
  const pinEnabled = useHowPinEnabled();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <section id="how" className="min-h-[50vh] bg-bg" aria-hidden />;
  }

  if (pinEnabled) {
    return <HowItWorksPinned />;
  }

  return <HowItWorksMobile />;
}
