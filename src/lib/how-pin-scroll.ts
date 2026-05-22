import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";

let howPinTrigger: ScrollTriggerInstance | null = null;
let navBypassDepth = 0;

type ApplyHowPinBypassOptions = {
  deferLayoutSync?: boolean;
  skipRefresh?: boolean;
};

function applyHowPinBypassState(options?: ApplyHowPinBypassOptions) {
  if (!howPinTrigger) return;

  if (navBypassDepth > 0) {
    howPinTrigger.disable(true);
    if (options?.skipRefresh) return;
    ScrollTrigger.refresh();
    return;
  }

  howPinTrigger.enable(false);

  if (options?.deferLayoutSync) return;

  ScrollTrigger.refresh();
  howPinTrigger.update();
}

export function registerHowPinTrigger(trigger: ScrollTriggerInstance | null) {
  howPinTrigger = trigger;
  if (!trigger) return;
  applyHowPinBypassState();
}

export function isHowPinNavBypassActive() {
  return navBypassDepth > 0;
}

export function getHowPinScrollRange() {
  if (!howPinTrigger) return null;
  return { start: howPinTrigger.start, end: howPinTrigger.end };
}

export function crossesHowPinRange(from: number, to: number) {
  const range = getHowPinScrollRange();
  if (!range) return false;
  const min = Math.min(from, to);
  const max = Math.max(from, to);
  return min < range.end && max > range.start;
}

export function shouldFastPassHowPin(from: number, to: number, targetId?: string) {
  if (targetId === "how") return false;

  const range = getHowPinScrollRange();
  if (!range || !crossesHowPinRange(from, to)) return false;

  const goingDown = to > from;
  if (goingDown && to > range.end) return true;
  if (!goingDown && to <= range.start && from > range.start) return true;
  return false;
}

export function setHowPinNavBypass(
  enabled: boolean,
  options?: ApplyHowPinBypassOptions,
) {
  if (enabled) {
    navBypassDepth += 1;
    if (navBypassDepth === 1) {
      applyHowPinBypassState(options);
    }
    return;
  }

  navBypassDepth = Math.max(0, navBypassDepth - 1);
  if (navBypassDepth === 0) {
    applyHowPinBypassState(options);
  }
}

export function finishHowPinNavBypass(
  lenis: Lenis,
  anchor: HTMLElement,
  offset: number,
  onSettled: () => void,
) {
  restoreHowPinNav(lenis, anchor, offset);

  requestAnimationFrame(onSettled);
}

export function restoreHowPinNav(
  lenis: Lenis,
  anchor: HTMLElement,
  offset: number,
) {
  const snapToTarget = () => {
    lenis.scrollTo(anchor, { offset, immediate: true, force: true });
  };

  snapToTarget();
  ScrollTrigger.refresh();
  snapToTarget();
  setHowPinNavBypass(false, { deferLayoutSync: true });
  ScrollTrigger.refresh();
  snapToTarget();
  howPinTrigger?.update();
  snapToTarget();
}
