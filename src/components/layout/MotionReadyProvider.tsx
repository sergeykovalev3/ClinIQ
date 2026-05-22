"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLenis } from "@/components/layout/LenisProvider";

const MotionReadyContext = createContext(false);

export function useMotionReady() {
  return useContext(MotionReadyContext);
}

type MotionReadyProviderProps = {
  active: boolean;
  children: ReactNode;
};

export function MotionReadyProvider({
  active,
  children,
}: MotionReadyProviderProps) {
  const { lenis } = useLenis();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const html = document.documentElement;

    if (!active || !lenis) {
      setReady(false);
      html.classList.remove("motion-ready");
      return;
    }

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;

        ScrollTrigger.refresh();
        ScrollTrigger.update();
        html.classList.add("motion-ready");
        setReady(true);

        timeout = setTimeout(() => {
          if (cancelled) return;
          ScrollTrigger.refresh();
          ScrollTrigger.update();
        }, 400);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (timeout) clearTimeout(timeout);
      html.classList.remove("motion-ready");
      setReady(false);
    };
  }, [active, lenis]);

  return (
    <MotionReadyContext.Provider value={ready}>
      {children}
    </MotionReadyContext.Provider>
  );
}
