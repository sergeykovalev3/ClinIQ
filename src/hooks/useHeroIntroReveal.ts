"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  HERO_INTRO_OFFSET_Y,
  HERO_INTRO_STAGGER,
  PRELOADER_CURTAIN_DURATION,
  PRELOADER_CURTAIN_EASE,
} from "@/lib/preloader-motion";

export function useHeroIntroReveal(revealed: boolean) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useLayoutEffect(() => {
    const badge = badgeRef.current;
    const scrollCue = scrollCueRef.current;
    if (!badge || !scrollCue) return;

    gsap.set([badge, scrollCue], {
      y: HERO_INTRO_OFFSET_Y,
      opacity: 0,
      force3D: true,
    });
  }, []);

  useEffect(() => {
    if (!revealed || playedRef.current) return;

    const badge = badgeRef.current;
    const scrollCue = scrollCueRef.current;
    if (!badge || !scrollCue) return;

    playedRef.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set([badge, scrollCue], { y: 0, opacity: 1, clearProps: "transform" });
      return;
    }

    gsap.to(badge, {
      y: 0,
      opacity: 1,
      duration: PRELOADER_CURTAIN_DURATION,
      ease: PRELOADER_CURTAIN_EASE,
      force3D: true,
    });

    gsap.to(scrollCue, {
      y: 0,
      opacity: 1,
      duration: PRELOADER_CURTAIN_DURATION,
      ease: PRELOADER_CURTAIN_EASE,
      delay: HERO_INTRO_STAGGER,
      force3D: true,
    });
  }, [revealed]);

  return { badgeRef, scrollCueRef };
}
