"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, type RefObject } from "react";
import {
  magneticOffset,
  MAGNETIC_DURATION,
  MAGNETIC_EASE,
  MAGNETIC_SPRING_DURATION,
  MAGNETIC_SPRING_EASE,
} from "@/lib/magnetic";

type UsePanelMagneticProps = {
  panelRef: RefObject<HTMLElement | null>;
  enabledRef: RefObject<boolean>;
  strength?: number;
};

export function usePanelMagnetic({
  panelRef,
  enabledRef,
  strength = 0.3,
}: UsePanelMagneticProps) {
  const resetCycleRef = useRef(0);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    gsap.set(panel, { x: 0, y: 0 });

    let quickX: gsap.QuickToFunc | null = null;
    let quickY: gsap.QuickToFunc | null = null;

    const bindQuickTo = () => {
      quickX = gsap.quickTo(panel, "x", {
        duration: MAGNETIC_DURATION,
        ease: MAGNETIC_EASE,
      });
      quickY = gsap.quickTo(panel, "y", {
        duration: MAGNETIC_DURATION,
        ease: MAGNETIC_EASE,
      });
    };

    const clearQuickTo = () => {
      quickX = null;
      quickY = null;
    };

    const applyOffset = (event: MouseEvent) => {
      if (!enabledRef.current || !quickX || !quickY) return;

      const rect = panel.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const radius = Math.max(rect.width, rect.height) * 0.55;
      const offset = magneticOffset(dx, dy, radius, strength);

      quickX(offset.x);
      quickY(offset.y);
    };

    const resetPanel = (animate: boolean) => {
      const cycle = ++resetCycleRef.current;
      clearQuickTo();
      gsap.killTweensOf(panel, "x,y");

      if (animate) {
        gsap.to(panel, {
          x: 0,
          y: 0,
          duration: MAGNETIC_SPRING_DURATION,
          ease: MAGNETIC_SPRING_EASE,
          overwrite: true,
          onComplete: () => {
            if (resetCycleRef.current !== cycle) return;
            gsap.set(panel, { x: 0, y: 0 });
          },
        });
      } else {
        gsap.set(panel, { x: 0, y: 0 });
      }
    };

    const onEnter = (event: MouseEvent) => {
      if (!enabledRef.current) return;
      resetCycleRef.current += 1;
      gsap.killTweensOf(panel, "x,y");
      gsap.set(panel, { x: 0, y: 0 });
      bindQuickTo();
      applyOffset(event);
    };

    const onMove = (event: MouseEvent) => {
      applyOffset(event);
    };

    const onLeave = () => {
      resetPanel(true);
    };

    panel.addEventListener("mouseenter", onEnter);
    panel.addEventListener("mousemove", onMove);
    panel.addEventListener("mouseleave", onLeave);

    return () => {
      panel.removeEventListener("mouseenter", onEnter);
      panel.removeEventListener("mousemove", onMove);
      panel.removeEventListener("mouseleave", onLeave);
      resetPanel(false);
    };
  }, [panelRef, enabledRef, strength]);
}
