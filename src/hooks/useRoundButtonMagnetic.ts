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

const BUTTON_STRENGTH = 0.38;
const ICON_STRENGTH = 0.55;

type MagneticLayer = {
  el: HTMLElement;
  strength: number;
};

type UseRoundButtonMagneticProps = {
  buttonRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  enabledRef: RefObject<boolean>;
};

export function useRoundButtonMagnetic({
  buttonRef,
  contentRef,
  enabledRef,
}: UseRoundButtonMagneticProps) {
  const resetCycleRef = useRef(0);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const content = contentRef.current;
    if (!button || !content) return;

    const layers: MagneticLayer[] = [
      { el: button, strength: BUTTON_STRENGTH },
      { el: content, strength: ICON_STRENGTH },
    ];

    for (const layer of layers) {
      gsap.set(layer.el, { x: 0, y: 0 });
    }

    const quick = layers.map(() => ({
      x: null as gsap.QuickToFunc | null,
      y: null as gsap.QuickToFunc | null,
    }));

    const bindQuickTo = () => {
      layers.forEach((layer, index) => {
        quick[index].x = gsap.quickTo(layer.el, "x", {
          duration: MAGNETIC_DURATION,
          ease: MAGNETIC_EASE,
        });
        quick[index].y = gsap.quickTo(layer.el, "y", {
          duration: MAGNETIC_DURATION,
          ease: MAGNETIC_EASE,
        });
      });
    };

    const clearQuickTo = () => {
      quick.forEach((entry) => {
        entry.x = null;
        entry.y = null;
      });
    };

    const applyOffset = (event: MouseEvent) => {
      if (!enabledRef.current || !quick[0].x || !quick[0].y) return;

      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const radius = rect.width * 0.5;

      layers.forEach((layer, index) => {
        const offset = magneticOffset(dx, dy, radius, layer.strength);
        quick[index].x?.(offset.x);
        quick[index].y?.(offset.y);
      });
    };

    const resetLayers = (animate: boolean) => {
      const cycle = ++resetCycleRef.current;
      clearQuickTo();

      for (const layer of layers) {
        gsap.killTweensOf(layer.el, "x,y");
        if (animate) {
          gsap.to(layer.el, {
            x: 0,
            y: 0,
            duration: MAGNETIC_SPRING_DURATION,
            ease: MAGNETIC_SPRING_EASE,
            overwrite: true,
            onComplete: () => {
              if (resetCycleRef.current !== cycle) return;
              gsap.set(layer.el, { x: 0, y: 0 });
            },
          });
        } else {
          gsap.set(layer.el, { x: 0, y: 0 });
        }
      }
    };

    const onEnter = (event: MouseEvent) => {
      if (!enabledRef.current) return;
      resetCycleRef.current += 1;

      for (const layer of layers) {
        gsap.killTweensOf(layer.el, "x,y");
        gsap.set(layer.el, { x: 0, y: 0 });
      }

      bindQuickTo();
      applyOffset(event);
    };

    const onMove = (event: MouseEvent) => {
      applyOffset(event);
    };

    const onLeave = () => {
      resetLayers(true);
    };

    button.addEventListener("mouseenter", onEnter);
    button.addEventListener("mousemove", onMove);
    button.addEventListener("mouseleave", onLeave);

    return () => {
      button.removeEventListener("mouseenter", onEnter);
      button.removeEventListener("mousemove", onMove);
      button.removeEventListener("mouseleave", onLeave);
      resetLayers(false);
    };
  }, [buttonRef, contentRef, enabledRef]);
}

export function resetRoundButtonMagnetic(
  button: HTMLElement,
  content: HTMLElement,
) {
  gsap.killTweensOf(button, "x,y");
  gsap.killTweensOf(content, "x,y");
  gsap.set(button, { x: 0, y: 0 });
  gsap.set(content, { x: 0, y: 0 });
}
