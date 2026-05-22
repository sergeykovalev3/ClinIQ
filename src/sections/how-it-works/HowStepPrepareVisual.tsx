"use client";

import { useEffect, useRef, useState } from "react";
import { prepareBriefQuestions } from "@/lib/how-it-works";
import { usePanelMagnetic } from "@/hooks/usePanelMagnetic";
import { cn } from "@/lib/cn";

const REVEAL_DELAY_MS = 480;

type HowStepPrepareVisualProps = {
  active?: boolean;
  className?: string;
};

export function HowStepPrepareVisual({
  active = false,
  className,
}: HowStepPrepareVisualProps) {
  const briefRef = useRef<HTMLDivElement>(null);
  const magneticEnabledRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const brief = briefRef.current;
    if (!brief) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.25 },
    );

    observer.observe(brief);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !inView) {
      setRevealed(false);
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setRevealed(true);
      return;
    }

    const timer = window.setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, inView]);

  useEffect(() => {
    magneticEnabledRef.current =
      revealed &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [revealed]);

  usePanelMagnetic({
    panelRef: briefRef,
    enabledRef: magneticEnabledRef,
    strength: 0.14,
  });

  return (
    <div className={cn("relative mx-auto w-full max-w-[min(100%,24rem)]", className)}>
      <div
        ref={briefRef}
        data-prepare-brief
        data-revealed={revealed ? "true" : "false"}
        className="relative overflow-hidden rounded-[1.45rem] border border-border/80 bg-surface shadow-[0_24px_60px_-32px_rgba(15,28,40,0.45)] will-change-transform"
      >
        <div
          data-prepare-header
          className="border-b border-border/70 px-3.5 py-3.5 sm:px-5 sm:py-4 md:px-6"
        >
          <p className="text-[10px] font-medium tracking-normal text-muted sm:text-[11px]">
            For your visit
          </p>
          <p className="mt-1.5 font-display text-[clamp(1.15rem,5vw,1.75rem)] font-medium leading-[1.1] tracking-[-0.03em] text-fg sm:mt-2">
            Your question brief
          </p>
        </div>

        <div className="space-y-0 px-3.5 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6">
          {prepareBriefQuestions.map((question, index) => (
            <div
              key={question}
              data-prepare-item={index}
              className="relative flex gap-2.5 pb-4 last:pb-0 sm:gap-4 sm:pb-5"
            >
              <span
                data-prepare-dot
                aria-hidden
                className="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-accent/10 sm:mt-1 sm:h-[1.375rem] sm:w-[1.375rem]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <p className="min-w-0 font-display text-[clamp(0.875rem,3.8vw,1.15rem)] font-medium leading-[1.25] tracking-[-0.02em] text-fg sm:leading-[1.2]">
                {question}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-border/70 px-3.5 py-3.5 sm:px-5 sm:py-4 md:px-6">
          <div
            data-prepare-badge
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-bg/80 px-3.5 py-2 text-[11px] font-medium tracking-normal text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            3 questions ready
          </div>
        </div>
      </div>
    </div>
  );
}
