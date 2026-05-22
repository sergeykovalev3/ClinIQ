"use client";

import Link from "next/link";
import {
  useRef,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useLenis } from "@/components/layout/LenisProvider";
import { cn } from "@/lib/cn";
import { isHashHref, scrollToHash } from "@/lib/smooth-scroll";
import { useRoundButtonFill } from "@/hooks/useRoundButtonFill";
import { useRoundButtonMagnetic } from "@/hooks/useRoundButtonMagnetic";
import {
  roundMagneticButtonSizes,
  type RoundMagneticButtonSize,
} from "@/components/ui/RoundMagneticButton";

export type RoundMagneticLinkProps = {
  href: string;
  children: ReactNode;
  size?: RoundMagneticButtonSize;
  enabled?: boolean;
  contentClassName?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "children">;

export function RoundMagneticLink({
  href,
  children,
  size = "lg",
  enabled = true,
  className,
  contentClassName,
  onClick,
  ...props
}: RoundMagneticLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const { lenis } = useLenis();
  const contentRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const enabledRef = useRef(enabled);

  enabledRef.current = enabled;

  useRoundButtonFill({ buttonRef: linkRef, fillRef });
  useRoundButtonMagnetic({
    buttonRef: linkRef,
    contentRef,
    enabledRef,
  });

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !isHashHref(href)) return;
    event.preventDefault();
    scrollToHash(lenis, href);
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      onClick={handleClick}
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-fg shadow-[0_16px_48px_-12px_rgba(15,28,40,0.18)]",
        roundMagneticButtonSizes[size],
        className,
      )}
      {...props}
    >
      <span
        ref={fillRef}
        className="absolute inset-0 block rounded-full bg-accent"
        aria-hidden
      />
      <span
        ref={contentRef}
        className={cn(
          "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
          contentClassName,
        )}
        aria-hidden
      >
        {children}
      </span>
    </Link>
  );
}
