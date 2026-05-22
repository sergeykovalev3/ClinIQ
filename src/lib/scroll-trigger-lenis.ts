import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

let connectedLenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function connectScrollTriggerLenis(lenis: Lenis) {
  if (connectedLenis === lenis) return;

  if (connectedLenis) {
    disconnectScrollTriggerLenis(connectedLenis);
  }

  gsap.registerPlugin(ScrollTrigger);

  lenis.on("scroll", ScrollTrigger.update);

  tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.addEventListener("refresh", () => {
    lenis.resize();
  });

  connectedLenis = lenis;
}

export function disconnectScrollTriggerLenis(lenis: Lenis) {
  if (connectedLenis !== lenis) return;

  lenis.off("scroll", ScrollTrigger.update);

  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  connectedLenis = null;
}
