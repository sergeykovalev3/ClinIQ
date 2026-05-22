"use client";

import { useLayoutEffect, useState } from "react";

export const HOW_PIN_MIN_WIDTH = 768;

const HOW_PIN_QUERY = `(min-width: ${HOW_PIN_MIN_WIDTH}px)`;

function readHowPinEnabled() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(HOW_PIN_QUERY).matches;
}

export function useHowPinEnabled() {
  const [enabled, setEnabled] = useState(readHowPinEnabled);

  useLayoutEffect(() => {
    const media = window.matchMedia(HOW_PIN_QUERY);
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return enabled;
}
