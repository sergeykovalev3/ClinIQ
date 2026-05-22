"use client";

import gsap from "gsap";
import Link from "next/link";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { navLinks, site } from "@/lib/site";
import { scrollToHash } from "@/lib/smooth-scroll";
import {
  arcFlatTransform,
  arcFullTransform,
  getPanelHiddenTransform,
  panelVisibleTransform,
} from "@/lib/panel-arc";
import { useLenis } from "@/components/layout/LenisProvider";
import { VerticalPanelArc } from "@/components/ui/VerticalPanelArc";

const PANEL_DURATION = 0.65;
const PANEL_EASE = "power3.inOut";
const ARC_DURATION = 0.65;
const ARC_EASE = "power3.inOut";
const PANEL_CLOSE_DURATION = 0.5;

type NavSidebarProps = {
  open: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
};

export function NavSidebar({
  open,
  onClose,
  onExitComplete,
}: NavSidebarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(open);
  const onExitCompleteRef = useRef(onExitComplete);
  const pendingHrefRef = useRef<string | null>(null);
  const didInitRef = useRef(false);
  const { lenis } = useLenis();

  openRef.current = open;
  onExitCompleteRef.current = onExitComplete;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    const arc = arcRef.current;
    const overlay = overlayRef.current;
    const list = listRef.current;
    if (!root || !panel || !arc || !overlay || !list) return;

    const links = list.querySelectorAll("[data-nav-link]");
    const hidden = getPanelHiddenTransform();

    timelineRef.current?.kill();
    timelineRef.current = null;

    if (!didInitRef.current) {
      gsap.set(panel, hidden);
      gsap.set(arc, arcFlatTransform);
      gsap.set(overlay, { opacity: 0 });
      gsap.set(links, { opacity: 0, y: 24 });
      gsap.set(root, { pointerEvents: "none" });
      didInitRef.current = true;

      if (!open) return;
    }

    if (open) {
      document.documentElement.classList.add("preloader-lock");
      lenis?.stop();
      gsap.set(root, { pointerEvents: "auto" });

      timelineRef.current = gsap
        .timeline()
        .to(overlay, { opacity: 1, duration: 0.45, ease: "power2.out" }, 0)
        .to(
          panel,
          {
            ...panelVisibleTransform,
            duration: PANEL_DURATION,
            ease: PANEL_EASE,
            overwrite: true,
          },
          0,
        )
        .to(
          arc,
          {
            ...arcFullTransform,
            duration: ARC_DURATION,
            ease: ARC_EASE,
            overwrite: true,
          },
          0,
        )
        .to(
          links,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: "power3.out",
            overwrite: true,
          },
          0.2,
        );

      return;
    }

    timelineRef.current = gsap
      .timeline({
        onComplete: () => {
          if (openRef.current) return;
          document.documentElement.classList.remove("preloader-lock");
          lenis?.start();
          gsap.set(root, { pointerEvents: "none" });
          gsap.set(links, { opacity: 0, y: 24 });
          gsap.set(arc, arcFlatTransform);
          gsap.set(panel, hidden);
          const href = pendingHrefRef.current;
          pendingHrefRef.current = null;
          if (href) {
            scrollToHash(lenis, href);
          }
          onExitCompleteRef.current?.();
        },
      })
      .to(overlay, { opacity: 0, duration: 0.35, ease: "power2.in" }, 0)
      .to(
        panel,
        {
          ...hidden,
          duration: PANEL_CLOSE_DURATION,
          ease: PANEL_EASE,
          overwrite: true,
        },
        0,
      )
      .to(
        arc,
        {
          ...arcFlatTransform,
          duration: PANEL_CLOSE_DURATION,
          ease: ARC_EASE,
          overwrite: true,
        },
        0,
      );

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [open, lenis]);

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();
    pendingHrefRef.current = href;
    onClose();
  };

  return (
    <div
      ref={rootRef}
      className={cn("fixed inset-0 z-[80]", !open && "pointer-events-none")}
      aria-hidden={!open}
    >
      <button
        type="button"
        ref={overlayRef}
        className="absolute inset-0 bg-preloader-bg/72 backdrop-blur-sm"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={() => {
          pendingHrefRef.current = null;
          onClose();
        }}
      />
      <aside
        ref={panelRef}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-visible bg-preloader-bg px-10 py-12 text-preloader-fg md:px-14"
        aria-label="Navigation"
      >
        <VerticalPanelArc ref={arcRef} />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="mb-16 flex items-center justify-between">
            <span className="font-display text-lg font-medium text-preloader-fg">
              {site.name}
            </span>
            <span className="h-24 w-24 shrink-0" aria-hidden />
          </div>
          <ul ref={listRef} className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-nav-link
                  tabIndex={open ? 0 : -1}
                  className="font-display text-4xl font-medium tracking-tight text-preloader-fg transition-colors hover:text-accent-bright md:text-5xl"
                  onClick={(event) => handleNavClick(event, link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
