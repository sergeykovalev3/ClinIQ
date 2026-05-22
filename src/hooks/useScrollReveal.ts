"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import { useMotionReady } from "@/components/layout/MotionReadyProvider";
import { useLenis } from "@/components/layout/LenisProvider";

type UseScrollRevealOptions = {
  y?: number;
  stagger?: number;
  scrub?: number;
  start?: string;
  end?: string;
  completeOnPageEnd?: boolean;
};

const PAGE_END_THRESHOLD_PX = 8;

const defaultOptions: Required<UseScrollRevealOptions> = {
  y: 40,
  stagger: 0.1,
  scrub: 0.42,
  start: "top 88%",
  end: "top 52%",
  completeOnPageEnd: false,
};

export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {},
) {
  const ref = useRef<T>(null);
  const optionsRef = useRef(options);
  const { lenis } = useLenis();
  const motionReady = useMotionReady();

  optionsRef.current = options;

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !lenis || !motionReady) return;

    const {
      y,
      stagger,
      scrub,
      start,
      end,
      completeOnPageEnd,
    } = { ...defaultOptions, ...optionsRef.current };

    const zones = gsap.utils.toArray<HTMLElement>("[data-reveal-zone]", root);

    if (!zones.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      zones.forEach((zone) => {
        const items = zone.querySelectorAll("[data-reveal], [data-reveal-rule]");
        gsap.set(items, { opacity: 1, scaleX: 1, clearProps: "transform" });
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const timelines: gsap.core.Timeline[] = [];

    const syncPageEnd = () => {
      if (!completeOnPageEnd) return;

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (lenis.scroll < maxScroll - PAGE_END_THRESHOLD_PX) return;

      timelines.forEach((timeline) => {
        timeline.progress(1);
      });
    };

    const ctx = gsap.context(() => {
      zones.forEach((zone) => {
        const rules = gsap.utils.toArray<HTMLElement>("[data-reveal-rule]", zone);
        const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]", zone);

        if (targets.length) {
          gsap.set(targets, { opacity: 0, y, force3D: true });
        }

        if (rules.length) {
          gsap.set(rules, {
            scaleX: 0,
            transformOrigin: "left center",
            force3D: true,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: zone,
            start,
            end,
            scrub,
            onUpdate: syncPageEnd,
          },
        });

        timelines.push(tl);

        rules.forEach((rule) => {
          tl.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5, ease: "none" },
            0,
          );
        });

        if (targets.length) {
          tl.fromTo(
            targets,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger,
              ease: "none",
            },
            rules.length ? 0.22 : 0,
          );
        }
      });
    }, root);

    lenis.on("scroll", syncPageEnd);
    ScrollTrigger.addEventListener("refresh", syncPageEnd);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      syncPageEnd();
    });

    return () => {
      lenis.off("scroll", syncPageEnd);
      ScrollTrigger.removeEventListener("refresh", syncPageEnd);
      ctx.revert();
    };
  }, [lenis, motionReady]);

  return ref;
}
