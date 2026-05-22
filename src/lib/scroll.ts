import type Lenis from "lenis";

export function readScrollY(lenis: Lenis | null) {
  if (!lenis) return window.scrollY;
  return Math.max(
    lenis.scroll,
    lenis.actualScroll,
    lenis.targetScroll,
    window.scrollY,
    document.documentElement.scrollTop,
  );
}
