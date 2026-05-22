import type Lenis from "lenis";
import { jumpToHashTarget } from "@/lib/hash-nav";
import {
  requestNavTransition,
  type ScrollToHashOptions,
} from "@/lib/nav-transition";

export type { ScrollToHashOptions };

export function getHashTarget(href: string) {
  if (!href.startsWith("#")) return null;
  const id = href.slice(1);
  if (!id) return null;
  return document.getElementById(id);
}

export function isHashHref(href: string) {
  return href.startsWith("#");
}

export function scrollToHash(
  lenis: Lenis | null,
  href: string,
  options?: ScrollToHashOptions,
) {
  const target = getHashTarget(href);
  if (!target) return false;

  if (typeof window !== "undefined") {
    window.history.pushState(null, "", href);
  }

  if (!lenis) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
    options?.onComplete?.();
    return true;
  }

  if (requestNavTransition({ href, options })) {
    return true;
  }

  jumpToHashTarget(lenis, target, href, options?.offset ?? 0, () => {
    options?.onComplete?.();
  });
  return true;
}
