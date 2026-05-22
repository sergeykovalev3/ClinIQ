"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useLenis } from "@/components/layout/LenisProvider";
import { readScrollY } from "@/lib/scroll";
import { scrollToHash } from "@/lib/smooth-scroll";

const HIDE_SCROLL = 12;

type HeroScrollCueProps = {
  className?: string;
};

export function HeroScrollCue({ className }: HeroScrollCueProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const hiddenRef = useRef(false);
  const fadeTweenRef = useRef<gsap.core.Tween | null>(null);
  const { lenis } = useLenis();

  useLayoutEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    const tween = gsap.to(icon, {
      y: 8,
      duration: 0.85,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.set(root, { opacity: 1, y: 0, pointerEvents: "auto" });

    const update = () => {
      const shouldHide = readScrollY(lenis) > HIDE_SCROLL;

      if (shouldHide && !hiddenRef.current) {
        hiddenRef.current = true;
        fadeTweenRef.current?.kill();
        fadeTweenRef.current = gsap.to(root, {
          opacity: 0,
          y: -12,
          duration: 0.45,
          ease: "power2.out",
          pointerEvents: "none",
          overwrite: true,
        });
        return;
      }

      if (!shouldHide && hiddenRef.current) {
        hiddenRef.current = false;
        fadeTweenRef.current?.kill();
        fadeTweenRef.current = gsap.to(root, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          pointerEvents: "auto",
          overwrite: true,
        });
      }
    };

    update();
    lenis?.on("scroll", update);
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      lenis?.off("scroll", update);
      window.removeEventListener("scroll", update);
      fadeTweenRef.current?.kill();
    };
  }, [lenis]);

  const handleClick = () => {
    scrollToHash(lenis, "#how");
  };

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={handleClick}
      className={cn(
        "group z-30 hidden flex-col items-center gap-4 text-muted transition-colors hover:text-fg md:flex",
        className,
      )}
    >
      <span className="whitespace-nowrap text-center text-[10px] font-medium tracking-[0.02em] md:text-[11px]">
        Scroll to content
      </span>
      <span ref={iconRef} className="block text-fg/70 group-hover:text-accent" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6 stroke-current stroke-[1.25]"
        >
          <path d="M12 4v14" strokeLinecap="round" />
          <path d="M6 14l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
