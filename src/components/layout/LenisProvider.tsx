"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  connectScrollTriggerLenis,
  disconnectScrollTriggerLenis,
} from "@/lib/scroll-trigger-lenis";

type LenisContextValue = {
  lenis: Lenis | null;
  scroll: number;
};

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scroll: 0,
});

export function useLenis() {
  return useContext(LenisContext);
}

type LenisProviderProps = {
  children: ReactNode;
};

export function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false,
    });

    setLenis(instance);

    const onScroll = () => {
      setScroll(instance.scroll);
    };

    const syncDimensions = () => {
      instance.resize();
    };

    instance.on("scroll", onScroll);
    onScroll();
    syncDimensions();
    connectScrollTriggerLenis(instance);

    const resizeObserver = new ResizeObserver(syncDimensions);
    resizeObserver.observe(document.documentElement);

    window.addEventListener("load", syncDimensions);

    return () => {
      window.removeEventListener("load", syncDimensions);
      resizeObserver.disconnect();
      disconnectScrollTriggerLenis(instance);
      instance.off("scroll", onScroll);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const value = useMemo(() => ({ lenis, scroll }), [lenis, scroll]);

  return (
    <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
  );
}
