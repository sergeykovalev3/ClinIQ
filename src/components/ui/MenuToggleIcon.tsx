"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const ICON_DURATION = 0.48;
const ICON_EASE = "power3.inOut";

type MenuToggleIconProps = {
  open: boolean;
  className?: string;
  lineClassName?: string;
};

export function MenuToggleIcon({
  open,
  className,
  lineClassName,
}: MenuToggleIconProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);
  const openRef = useRef(open);
  const didInitRef = useRef(false);

  openRef.current = open;

  const measureShift = () => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!top || !bottom) return 4.5;

    const topCenter = top.offsetTop + top.offsetHeight / 2;
    const bottomCenter = bottom.offsetTop + bottom.offsetHeight / 2;

    return (bottomCenter - topCenter) / 2;
  };

  const animate = (isOpen: boolean) => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!top || !bottom) return;

    const shift = measureShift();

    gsap.to(top, {
      y: isOpen ? shift : 0,
      rotate: isOpen ? 45 : 0,
      duration: ICON_DURATION,
      ease: ICON_EASE,
      overwrite: true,
    });
    gsap.to(bottom, {
      y: isOpen ? -shift : 0,
      rotate: isOpen ? -45 : 0,
      duration: ICON_DURATION,
      ease: ICON_EASE,
      overwrite: true,
    });
  };

  useLayoutEffect(() => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!top || !bottom) return;

    if (!didInitRef.current) {
      gsap.set([top, bottom], {
        transformOrigin: "50% 50%",
        force3D: true,
      });
      didInitRef.current = true;
    }

    animate(open);
  }, [open]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onResize = () => {
      const top = topRef.current;
      const bottom = bottomRef.current;
      if (!top || !bottom) return;

      const shift = measureShift();
      const isOpen = openRef.current;

      gsap.set(top, {
        y: isOpen ? shift : 0,
        rotate: isOpen ? 45 : 0,
      });
      gsap.set(bottom, {
        y: isOpen ? -shift : 0,
        rotate: isOpen ? -45 : 0,
      });
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  const line = cn("block h-px w-[1em] shrink-0 bg-bg", lineClassName);

  return (
    <span
      ref={rootRef}
      className={cn(
        "inline-flex flex-col items-center justify-center gap-[0.28em]",
        className,
      )}
      aria-hidden
    >
      <span ref={topRef} className={line} />
      <span ref={bottomRef} className={line} />
    </span>
  );
}
