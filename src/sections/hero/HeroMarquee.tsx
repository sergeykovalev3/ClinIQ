"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/layout/LenisProvider";
import { heroMarqueeText } from "@/lib/site";
import { readScrollY } from "@/lib/scroll";
import { cn } from "@/lib/cn";

const BASE_SPEED = 0.85;
const SCROLL_BOOST = 1.4;
const MAX_BOOST = 0.65;
const SCROLL_DECAY = 0.9;
const SCROLL_SAMPLE = 0.035;

type HeroMarqueeProps = {
  className?: string;
};

export function HeroMarquee({ className }: HeroMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const boostRef = useRef(0);
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(0);
  const { lenis } = useLenis();

  useEffect(() => {
    lastScrollRef.current = readScrollY(lenis);
    lastTimeRef.current = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const scroll = readScrollY(lenis);
      const dt = Math.max(now - lastTimeRef.current, 1);
      const delta = scroll - lastScrollRef.current;
      if (delta > 0) {
        const sample = delta / dt;
        boostRef.current = Math.min(
          boostRef.current + sample * SCROLL_SAMPLE,
          MAX_BOOST,
        );
      }
      lastScrollRef.current = scroll;
      lastTimeRef.current = now;
    };

    onScroll();
    lenis?.on("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    let frame = 0;
    const tick = () => {
      boostRef.current *= SCROLL_DECAY;
      const speed = BASE_SPEED + boostRef.current * SCROLL_BOOST;
      offsetRef.current -= speed;

      const track = trackRef.current;
      if (track) {
        const loopWidth = track.scrollWidth / 2;
        if (loopWidth > 0 && Math.abs(offsetRef.current) >= loopWidth) {
          offsetRef.current += loopWidth;
        }
        track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      lenis?.off("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [lenis]);

  const label = `${heroMarqueeText} `.repeat(4);

  return (
    <div
      className={cn(
        "pointer-events-none w-full overflow-hidden py-5 md:py-7",
        className,
      )}
      aria-hidden
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <span className="shrink-0 px-[0.06em] font-display text-[clamp(2.75rem,12vw,9.5rem)] font-medium uppercase leading-[0.9] tracking-[-0.04em] text-fg mix-blend-multiply sm:text-[clamp(3.25rem,13vw,9.5rem)]">
          {label}
        </span>
        <span className="shrink-0 px-[0.06em] font-display text-[clamp(2.75rem,12vw,9.5rem)] font-medium uppercase leading-[0.9] tracking-[-0.04em] text-fg mix-blend-multiply sm:text-[clamp(3.25rem,13vw,9.5rem)]">
          {label}
        </span>
      </div>
    </div>
  );
}
