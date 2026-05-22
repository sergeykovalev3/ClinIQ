"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { NavAnchorLink } from "@/components/ui/NavAnchorLink";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/cn";

type HeroNavProps = {
  visible: boolean;
};

export function HeroNav({ visible }: HeroNavProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!visible || !navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", delay: 0.12 },
    );
  }, [visible]);

  return (
    <nav
      ref={navRef}
      data-hero-nav
      className={cn(
        "absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-6 opacity-0 sm:px-6 sm:py-7 md:px-10 md:py-8 lg:px-14",
        !visible && "invisible",
      )}
      aria-label="Primary"
    >
      <Link
        href="/"
        className="font-display text-xl font-medium tracking-[-0.03em] text-fg transition-colors hover:text-accent sm:text-2xl md:text-[2.125rem] lg:text-[2.375rem]"
      >
        {site.name}
      </Link>
      <div className="hidden items-center gap-6 md:flex md:gap-8 lg:gap-10">
        {navLinks.map((link) => (
          <NavAnchorLink
            key={link.href}
            href={link.href}
            className="text-[11px] font-medium tracking-normal text-fg/75 transition-colors hover:text-accent"
          >
            {link.label}
          </NavAnchorLink>
        ))}
      </div>
    </nav>
  );
}
