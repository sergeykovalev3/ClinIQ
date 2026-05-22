"use client";

import { useLayoutEffect, useState } from "react";

export const COMPACT_NAV_MAX_WIDTH = 767;

const COMPACT_NAV_QUERY = `(max-width: ${COMPACT_NAV_MAX_WIDTH}px)`;

function readCompactNav() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(COMPACT_NAV_QUERY).matches;
}

export function useCompactHeroNav() {
  const [compact, setCompact] = useState(readCompactNav);

  useLayoutEffect(() => {
    const media = window.matchMedia(COMPACT_NAV_QUERY);
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return compact;
}
