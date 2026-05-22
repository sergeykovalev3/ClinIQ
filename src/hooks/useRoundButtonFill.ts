"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, type RefObject } from "react";

const FILL_DURATION = 0.52;
const FILL_EASE = "power3.inOut";
const FILL_MIN_DURATION = 0.08;

function fillDuration(fromY: number, toY: number) {
  const span = Math.abs(toY - fromY) / 100;
  return Math.max(FILL_MIN_DURATION, FILL_DURATION * span);
}

type UseRoundButtonFillProps = {
  buttonRef: RefObject<HTMLElement | null>;
  fillRef: RefObject<HTMLElement | null>;
};

export function useRoundButtonFill({
  buttonRef,
  fillRef,
}: UseRoundButtonFillProps) {
  const filledRef = useRef(false);
  const cycleRef = useRef(0);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const fill = fillRef.current;
    if (!button || !fill) return;

    gsap.set(fill, { yPercent: 100, force3D: true });

    const onEnter = () => {
      const cycle = ++cycleRef.current;
      filledRef.current = false;
      gsap.killTweensOf(fill);
      gsap.fromTo(
        fill,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: FILL_DURATION,
          ease: FILL_EASE,
          overwrite: true,
          onComplete: () => {
            if (cycleRef.current !== cycle) return;
            filledRef.current = true;
          },
        },
      );
    };

    const onLeave = () => {
      cycleRef.current += 1;
      gsap.killTweensOf(fill);
      const y = Number(gsap.getProperty(fill, "yPercent")) || 100;
      const done = filledRef.current || y <= 8;
      filledRef.current = false;

      if (done) {
        gsap.to(fill, {
          yPercent: -100,
          duration: FILL_DURATION,
          ease: FILL_EASE,
          overwrite: true,
          onComplete: () => {
            gsap.set(fill, { yPercent: 100 });
          },
        });
        return;
      }

      gsap.to(fill, {
        yPercent: 100,
        duration: fillDuration(y, 100),
        ease: FILL_EASE,
        overwrite: true,
      });
    };

    button.addEventListener("mouseenter", onEnter);
    button.addEventListener("mouseleave", onLeave);

    return () => {
      button.removeEventListener("mouseenter", onEnter);
      button.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(fill);
      gsap.set(fill, { yPercent: 100 });
      filledRef.current = false;
    };
  }, [buttonRef, fillRef]);
}

export function resetRoundButtonFill(fill: HTMLElement) {
  gsap.killTweensOf(fill);
  gsap.set(fill, { yPercent: 100 });
}
