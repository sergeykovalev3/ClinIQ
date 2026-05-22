import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import {
  finishHowPinNavBypass,
  restoreHowPinNav,
  setHowPinNavBypass,
  shouldFastPassHowPin,
} from "@/lib/how-pin-scroll";
import { beginNavScroll, endNavScroll } from "@/lib/nav-scroll";

function syncRevealProgress() {
  ScrollTrigger.refresh();

  ScrollTrigger.getAll().forEach((trigger) => {
    const el = trigger.trigger;
    if (!(el instanceof Element)) return;
    if (!el.matches("[data-reveal-zone]") && !el.querySelector("[data-story-copy]")) {
      return;
    }

    trigger.animation?.progress(trigger.progress);
  });
}

export function jumpToHashTargetDuringOverlay(
  lenis: Lenis,
  target: HTMLElement,
  href: string,
  offset: number,
  onSettled: () => void,
) {
  const targetId = href.slice(1);
  const from = lenis.scroll;
  const to = target.getBoundingClientRect().top + from + offset;
  const bypassPin = shouldFastPassHowPin(from, to, targetId);
  const generation = beginNavScroll();

  if (bypassPin) {
    setHowPinNavBypass(true, { skipRefresh: true });
  }

  lenis.scrollTo(target, { offset, immediate: true, force: true });

  endNavScroll(generation);
  onSettled();

  return bypassPin;
}

export function settleHashNavUnderCurtain(
  lenis: Lenis,
  target: HTMLElement,
  offset: number,
  bypassPin: boolean,
) {
  if (bypassPin) {
    restoreHowPinNav(lenis, target, offset);
  } else {
    lenis.scrollTo(target, { offset, immediate: true, force: true });
    ScrollTrigger.refresh();
  }

  syncRevealProgress();
}

export function restoreHashNavAfterOverlay(
  lenis: Lenis,
  target: HTMLElement,
  offset: number,
  bypassPin: boolean,
  onSettled?: () => void,
) {
  if (bypassPin) {
    finishHowPinNavBypass(lenis, target, offset, onSettled ?? (() => {}));
    return;
  }

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    lenis.scrollTo(target, { offset, immediate: true, force: true });
    syncRevealProgress();
    onSettled?.();
  });
}

export function jumpToHashTarget(
  lenis: Lenis,
  target: HTMLElement,
  href: string,
  offset: number,
  onSettled: () => void,
) {
  const bypassPin = jumpToHashTargetDuringOverlay(
    lenis,
    target,
    href,
    offset,
    () => {},
  );

  restoreHashNavAfterOverlay(lenis, target, offset, bypassPin, onSettled);
}
