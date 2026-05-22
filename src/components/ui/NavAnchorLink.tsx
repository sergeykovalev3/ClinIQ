"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useLenis } from "@/components/layout/LenisProvider";
import { isHashHref, scrollToHash } from "@/lib/smooth-scroll";

type NavAnchorLinkProps = ComponentProps<typeof Link>;

export function NavAnchorLink({
  href,
  onClick,
  ...props
}: NavAnchorLinkProps) {
  const { lenis } = useLenis();
  const hrefString = typeof href === "string" ? href : "";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !isHashHref(hrefString)) return;
    event.preventDefault();
    scrollToHash(lenis, hrefString);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
