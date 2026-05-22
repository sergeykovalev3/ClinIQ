"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const COLLECT_DELAY_MS = 480;

type HowStepUploadVisualProps = {
  active?: boolean;
  className?: string;
};

export function HowStepUploadVisual({
  active = false,
  className,
}: HowStepUploadVisualProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.25 },
    );

    observer.observe(stack);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !inView) {
      setCollected(false);
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setCollected(true);
      return;
    }

    const timer = window.setTimeout(() => setCollected(true), COLLECT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, inView]);

  return (
    <div
      ref={stackRef}
      data-upload-stack
      data-collected={collected ? "true" : "false"}
      className={cn(
        "group relative mx-auto aspect-[4/5] w-full max-w-[min(100%,22rem)] overflow-visible pb-9 sm:pb-0",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-glow blur-3xl"
      />
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          data-upload-card={index}
          className="absolute inset-0 overflow-hidden rounded-[1.35rem] border border-border/80 bg-surface shadow-[0_24px_60px_-32px_rgba(15,28,40,0.45)]"
        >
          <div className="flex h-11 items-center gap-2 border-b border-border/70 px-4">
            <span className="h-2 w-2 rounded-full bg-accent/70" />
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
          </div>
          <div className="space-y-3 p-5">
            <div className="h-2 w-2/3 rounded-full bg-fg/10" />
            <div className="h-2 w-full rounded-full bg-fg/[0.06]" />
            <div className="h-2 w-5/6 rounded-full bg-fg/[0.06]" />
            <div className="mt-6 h-16 rounded-xl bg-accent/[0.08]" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 rounded-lg bg-fg/[0.05]" />
              <div className="h-8 rounded-lg bg-fg/[0.05]" />
              <div className="h-8 rounded-lg bg-accent/[0.12]" />
            </div>
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border/80 bg-surface/95 px-4 py-2 text-[11px] font-medium tracking-normal text-muted shadow-[0_12px_40px_-24px_rgba(15,28,40,0.35)] backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Ready to read
      </div>
    </div>
  );
}
