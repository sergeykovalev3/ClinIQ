"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { useLenis } from "@/components/layout/LenisProvider";
import { cn } from "@/lib/cn";
import { isHashHref, scrollToHash } from "@/lib/smooth-scroll";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
};

export function MagneticLink({
  href,
  children,
  className,
  variant = "primary",
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { lenis } = useLenis();

  const onMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    node.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const onLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = "translate(0px, 0px)";
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isHashHref(href)) return;
    event.preventDefault();
    scrollToHash(lenis, href);
  };

  return (
    <Link
      ref={ref}
      href={href}
      onClick={handleClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-[background-color,color,box-shadow] duration-300",
        variant === "primary" &&
          "bg-accent text-on-accent shadow-[0_0_40px_-8px_var(--color-accent-glow)] hover:bg-accent-bright",
        variant === "ghost" &&
          "border border-border text-fg/90 hover:border-accent/40 hover:text-accent",
        className,
      )}
    >
      {children}
    </Link>
  );
}
