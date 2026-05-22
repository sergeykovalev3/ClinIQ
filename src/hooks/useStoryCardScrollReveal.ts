"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, type RefObject } from "react";
import { useMotionReady } from "@/components/layout/MotionReadyProvider";
import { useLenis } from "@/components/layout/LenisProvider";

const COPY_Y = 56;
const VISUAL_X = 72;
const SCRUB = 1;

type UseStoryCardScrollRevealOptions = {
  reversed?: boolean;
};

export function useStoryCardScrollReveal(
  rootRef: RefObject<HTMLElement | null>,
  options: UseStoryCardScrollRevealOptions = {},
) {
  const { reversed = false } = options;
  const { lenis } = useLenis();
  const motionReady = useMotionReady();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !lenis || !motionReady) return;

    const copy = gsap.utils.toArray<HTMLElement>("[data-story-copy]", root);
    const visual = root.querySelector<HTMLElement>("[data-story-visual]");
    const rule = root.querySelector<HTMLElement>("[data-story-rule]");

    if (!copy.length && !visual && !rule) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set([...copy, visual, rule].filter(Boolean), {
        opacity: 1,
        scaleX: 1,
        clearProps: "transform",
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set(copy, { opacity: 0, y: COPY_Y, force3D: true });

      if (visual) {
        gsap.set(visual, {
          opacity: 0,
          x: reversed ? -VISUAL_X : VISUAL_X,
          scale: 0.92,
          force3D: true,
        });
      }

      if (rule) {
        gsap.set(rule, { scaleX: 0, transformOrigin: "left center", force3D: true });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "top 28%",
          scrub: SCRUB,
        },
      });

      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.55, ease: "none" },
          0,
        );
      }

      if (copy.length) {
        tl.fromTo(
          copy,
          { opacity: 0, y: COPY_Y },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "none",
          },
          rule ? 0.28 : 0,
        );
      }

      if (visual) {
        tl.fromTo(
          visual,
          {
            opacity: 0,
            x: reversed ? -VISUAL_X : VISUAL_X,
            scale: 0.92,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
            ease: "none",
          },
          copy.length ? 0.55 : rule ? 0.28 : 0,
        );
      }
    }, root);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [lenis, motionReady, reversed]);
}
