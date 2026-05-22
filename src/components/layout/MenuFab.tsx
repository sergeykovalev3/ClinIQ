"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { MenuToggleIcon } from "@/components/ui/MenuToggleIcon";
import { RoundMagneticButton } from "@/components/ui/RoundMagneticButton";
import { useCompactHeroNav } from "@/hooks/useCompactHeroNav";
import { useMenuFabProgress } from "@/hooks/useMenuFabProgress";
import { NavSidebar } from "@/components/layout/NavSidebar";

const MOTION_DURATION = 0.45;
const SHOW_PROGRESS = 0.4;
const HIDE_PROGRESS = 0.28;

export function MenuFab() {
  const compactHeroNav = useCompactHeroNav();
  const scrollProgress = useMenuFabProgress();
  const scrollDrivenProgress = compactHeroNav ? 1 : scrollProgress;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPresent, setMenuPresent] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const canInteractRef = useRef(false);
  const hysteresisRef = useRef(false);
  const didInitRef = useRef(false);

  const canInteract = (() => {
    if (compactHeroNav) return true;
    const next = hysteresisRef.current
      ? scrollDrivenProgress > HIDE_PROGRESS
      : scrollDrivenProgress > SHOW_PROGRESS;
    hysteresisRef.current = next;
    canInteractRef.current = next;
    return next;
  })();

  const fabActive = compactHeroNav || canInteract || menuOpen || menuPresent;
  const fabOnTop = menuOpen || menuPresent;
  const visualProgress = compactHeroNav ? 1 : fabOnTop ? 1 : scrollDrivenProgress;

  useEffect(() => {
    if (menuOpen) setMenuPresent(true);
  }, [menuOpen]);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell || didInitRef.current) return;

    const initial = compactHeroNav ? 1 : 0;
    gsap.set(shell, {
      transformOrigin: "center center",
      scale: initial,
      opacity: initial,
    });
    didInitRef.current = true;
  }, [compactHeroNav]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    progressRef.current = visualProgress;

    gsap.to(shell, {
      scale: visualProgress,
      opacity: visualProgress,
      duration: compactHeroNav ? 0 : MOTION_DURATION,
      ease: "power2.out",
      overwrite: true,
    });
  }, [compactHeroNav, visualProgress]);

  useEffect(() => {
    if (compactHeroNav) return;
    if (progressRef.current < SHOW_PROGRESS && menuOpen) setMenuOpen(false);
  }, [compactHeroNav, menuOpen, canInteract]);

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
  };

  return (
    <>
      <div
        className={cn(
          "fixed top-7 right-6 md:top-8 md:right-10 lg:right-14",
          fabOnTop ? "z-[90]" : "z-50",
          fabActive ? "pointer-events-auto" : "pointer-events-none",
          compactHeroNav && "max-md:opacity-100",
        )}
      >
        <div ref={shellRef} className={cn(compactHeroNav && "max-md:scale-100")}>
          <RoundMagneticButton
            enabled={fabActive}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            className="h-[clamp(2.75rem,calc(1.375rem+4.25vw),4rem)] w-[clamp(2.75rem,calc(1.375rem+4.25vw),4rem)]"
          >
            <MenuToggleIcon
              open={menuOpen}
              className="text-[clamp(1.15rem,0.4rem+2.35vw,1.65rem)]"
            />
          </RoundMagneticButton>
        </div>
      </div>
      <NavSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onExitComplete={() => setMenuPresent(false)}
      />
    </>
  );
}
