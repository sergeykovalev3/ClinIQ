"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/components/layout/LenisProvider";
import { getMenuFabProgress } from "@/lib/menu-fab-motion";
import { readScrollY } from "@/lib/scroll";

export function useMenuFabProgress() {
  const { lenis } = useLenis();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!lenis) {
      setProgress(0);
      return;
    }

    const update = () => {
      setProgress(getMenuFabProgress(readScrollY(lenis)));
    };

    update();
    lenis.on("scroll", update);
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      lenis.off("scroll", update);
      window.removeEventListener("scroll", update);
    };
  }, [lenis]);

  return progress;
}
