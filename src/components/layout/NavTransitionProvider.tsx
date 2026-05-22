"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLenis } from "@/components/layout/LenisProvider";
import { Preloader } from "@/components/preloader/Preloader";
import {
  jumpToHashTargetDuringOverlay,
  settleHashNavUnderCurtain,
} from "@/lib/hash-nav";
import {
  registerNavTransitionRunner,
  type NavTransitionRequest,
} from "@/lib/nav-transition";
import { getHashTarget } from "@/lib/smooth-scroll";

type ActiveNavTransition = {
  href: string;
  target: HTMLElement;
  offset: number;
  onComplete?: () => void;
};

type NavTransitionContextValue = {
  transitioning: boolean;
};

const NavTransitionContext = createContext<NavTransitionContextValue>({
  transitioning: false,
});

export function useNavTransition() {
  return useContext(NavTransitionContext);
}

type NavTransitionProviderProps = {
  children: ReactNode;
};

export function NavTransitionProvider({ children }: NavTransitionProviderProps) {
  const { lenis } = useLenis();
  const [active, setActive] = useState<ActiveNavTransition | null>(null);
  const busyRef = useRef(false);
  const activeRef = useRef<ActiveNavTransition | null>(null);
  const bypassPinRef = useRef(false);

  activeRef.current = active;

  const finishTransition = useCallback(() => {
    const current = activeRef.current;
    bypassPinRef.current = false;

    setActive(null);
    busyRef.current = false;
    current?.onComplete?.();
  }, []);

  const runTransition = useCallback(
    (request: NavTransitionRequest) => {
      if (!lenis || busyRef.current) return false;

      const target = getHashTarget(request.href);
      if (!target) return false;

      bypassPinRef.current = false;
      busyRef.current = true;
      setActive({
        href: request.href,
        target,
        offset: request.options?.offset ?? 0,
        onComplete: request.options?.onComplete,
      });
      return true;
    },
    [lenis],
  );

  useLayoutEffect(() => {
    registerNavTransitionRunner(runTransition);
    return () => registerNavTransitionRunner(null);
  }, [runTransition]);

  return (
    <NavTransitionContext.Provider value={{ transitioning: active !== null }}>
      {children}
      {active && lenis ? (
        <Preloader
          key={active.href}
          variant="nav"
          lenis={lenis}
          onJump={(done) => {
            const current = activeRef.current;
            if (!current) {
              done();
              return;
            }
            bypassPinRef.current = jumpToHashTargetDuringOverlay(
              lenis,
              current.target,
              current.href,
              current.offset,
              done,
            );
          }}
          onPrepareExit={() => {
            const current = activeRef.current;
            if (!current) return;
            settleHashNavUnderCurtain(
              lenis,
              current.target,
              current.offset,
              bypassPinRef.current,
            );
          }}
          onComplete={finishTransition}
        />
      ) : null}
    </NavTransitionContext.Provider>
  );
}
