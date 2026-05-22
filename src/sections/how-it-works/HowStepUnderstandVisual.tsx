"use client";

import { useEffect, useRef } from "react";
import { translationPairs } from "@/lib/how-it-works";
import { cn } from "@/lib/cn";

type HowStepUnderstandVisualProps = {
  className?: string;
};

export function HowStepUnderstandVisual({ className }: HowStepUnderstandVisualProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const tick = () => {
      offsetRef.current -= 0.35;
      const loopHeight = track.scrollHeight / 2;
      if (loopHeight > 0 && Math.abs(offsetRef.current) >= loopHeight) {
        offsetRef.current += loopHeight;
      }
      track.style.transform = `translate3d(0,${offsetRef.current}px,0)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  const rows = [...translationPairs, ...translationPairs];

  return (
    <div
      className={cn(
        "relative mx-auto h-[min(44vh,24rem)] w-full max-w-[24rem] overflow-hidden",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-bg to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-bg to-transparent"
      />
      <div ref={trackRef} className="flex flex-col gap-3.5 will-change-transform sm:gap-5">
        {rows.map((pair, index) => (
          <div
            key={`${pair.term}-${index}`}
            className="rounded-[1.15rem] border border-border/70 bg-surface/90 px-3.5 py-3 shadow-[0_18px_50px_-36px_rgba(15,28,40,0.5)] backdrop-blur-sm sm:rounded-[1.25rem] sm:px-5 sm:py-4"
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-muted sm:text-[10px] sm:tracking-[0.28em]">
              {pair.term}
            </p>
            <p className="mt-1.5 font-display text-[clamp(1.1rem,5.5vw,2rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg sm:mt-2">
              {pair.plain}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
