"use client";

import gsap from "gsap";
import type Lenis from "lenis";
import { useLayoutEffect, useRef, type RefObject } from "react";
import { preloaderWords } from "@/lib/site";
import {
  PRELOADER_ARC_OVERHANG,
  PRELOADER_CURTAIN_DURATION,
  PRELOADER_CURTAIN_EASE,
  PRELOADER_NAV_ENTER_DURATION,
  PRELOADER_NAV_HOLD_DURATION,
} from "@/lib/preloader-motion";

type PreloaderIntroProps = {
  variant?: "intro";
  onReveal: () => void;
  onComplete: () => void;
};

type PreloaderNavProps = {
  variant: "nav";
  lenis: Lenis;
  onJump: (done: () => void) => void;
  onPrepareExit?: () => void;
  onComplete: () => void;
};

type PreloaderProps = PreloaderIntroProps | PreloaderNavProps;

const PRELOADER_BG = "#080b0f";
const PRELOADER_FG = "#f2f6f8";
const LAST_PRELOADER_WORD = preloaderWords[preloaderWords.length - 1];
const preloaderArc =
  "pointer-events-none absolute left-[-5%] z-0 w-[110%] h-[clamp(100px,15.625vw,200px)] rounded-[50%] bg-preloader-bg";

function PreloaderShell({
  slideRef,
  textRef,
  text,
}: {
  slideRef: RefObject<HTMLDivElement | null>;
  textRef: RefObject<HTMLParagraphElement | null>;
  text?: string;
}) {
  return (
    <div
      data-preloader-shell
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] overflow-visible"
    >
      <div
        ref={slideRef}
        data-preloader-slide
        className="pointer-events-auto relative h-[100dvh] w-full overflow-visible will-change-transform"
      >
        <div
          data-preloader-arc-top
          className={`${preloaderArc} top-[calc(clamp(100px,15.625vw,200px)/-2)]`}
          aria-hidden
        />
        <div
          data-preloader-panel
          className="relative z-10 flex h-full w-full items-center justify-center"
          style={{ backgroundColor: PRELOADER_BG }}
        >
          <p
            ref={textRef}
            data-preloader-text
            className="whitespace-nowrap font-display text-[clamp(2rem,6vw,4.5rem)] font-medium tracking-tight"
            style={{ color: PRELOADER_FG }}
          >
            {text}
          </p>
        </div>
        <div
          data-preloader-arc
          className={`${preloaderArc} top-full -mt-[calc(clamp(100px,15.625vw,200px)/2)]`}
          aria-hidden
        />
      </div>
    </div>
  );
}

export function Preloader(props: PreloaderProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const propsRef = useRef(props);

  propsRef.current = props;

  useLayoutEffect(() => {
    const current = propsRef.current;
    const html = document.documentElement;
    html.classList.add("preloader-lock");

    const slide = slideRef.current;
    const text = textRef.current;
    if (!slide || !text || timelineRef.current) return;

    const onReveal =
      current.variant === "nav" ? undefined : current.onReveal;

    const finish = () => {
      document.documentElement.classList.remove("preloader-lock");
      if (current.variant === "nav") {
        current.lenis.start();
      }
      propsRef.current.onComplete();
    };

    const slideTravel = () => {
      const arc = slide.querySelector<HTMLElement>("[data-preloader-arc]");
      const overhang =
        (arc?.getBoundingClientRect().height ?? PRELOADER_ARC_OVERHANG * 2) / 2;

      return slide.getBoundingClientRect().height + overhang;
    };

    const tl = gsap.timeline();
    timelineRef.current = tl;

    if (current.variant === "nav") {
      current.lenis.stop();
      text.textContent = LAST_PRELOADER_WORD;
      gsap.set(slide, { y: slideTravel(), force3D: true });
      gsap.set(text, { opacity: 0, y: 28 });

      tl.to(slide, {
        y: 0,
        duration: PRELOADER_NAV_ENTER_DURATION,
        ease: PRELOADER_CURTAIN_EASE,
        force3D: true,
      });

      tl.fromTo(
        text,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        "<",
      );

      tl.call(() => {
        tl.pause();

        let jumpDone = false;
        let holdDone = false;

        const resumeIfReady = () => {
          if (!jumpDone || !holdDone) return;
          gsap.set(slide, { y: 0, force3D: true });
          if (current.variant === "nav") {
            current.onPrepareExit?.();
          }
          tl.resume();
        };

        gsap.delayedCall(PRELOADER_NAV_HOLD_DURATION, () => {
          holdDone = true;
          resumeIfReady();
        });

        if (current.variant === "nav") {
          current.onJump(() => {
            jumpDone = true;
            resumeIfReady();
          });
        }
      });

      tl.add("curtain");

      tl.call(
        () => {
          gsap.killTweensOf(text);
          gsap.set(text, { opacity: 1, y: 0, force3D: true });
        },
        [],
        "curtain",
      );

      tl.to(
        slide,
        {
          y: () => -slideTravel(),
          duration: PRELOADER_CURTAIN_DURATION,
          ease: PRELOADER_CURTAIN_EASE,
          force3D: true,
          onComplete: finish,
        },
        "curtain",
      );

      return () => {
        tl.kill();
        timelineRef.current = null;
        gsap.set(slide, { clearProps: "transform" });
        html.classList.remove("preloader-lock");
      };
    }

    gsap.set(slide, { y: 0, force3D: true });

    const lastIndex = preloaderWords.length - 1;

    preloaderWords.forEach((word, index) => {
      const isLast = index === lastIndex;

      tl.call(() => {
        text.textContent = word;
      });

      tl.fromTo(
        text,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        "<",
      );

      if (!isLast) {
        tl.to(text, {
          opacity: 0,
          y: -24,
          duration: 0.35,
          ease: "power3.in",
          delay: 0.4,
        });
        return;
      }

      tl.to({}, { duration: 0.38 });

      tl.add("curtain");

      tl.call(
        () => {
          gsap.killTweensOf(text);
          gsap.set(text, { clearProps: "all", opacity: 1 });
          onReveal?.();
        },
        [],
        "curtain",
      );

      tl.to(
        text,
        { opacity: 0, duration: 0.2, ease: "power2.out" },
        "curtain",
      );

      tl.to(
        slide,
        {
          y: () => -slideTravel(),
          duration: PRELOADER_CURTAIN_DURATION,
          ease: PRELOADER_CURTAIN_EASE,
          force3D: true,
          onComplete: finish,
        },
        "curtain",
      );
    });

    return () => {
      tl.kill();
      timelineRef.current = null;
      gsap.set(slide, { clearProps: "transform" });
      html.classList.remove("preloader-lock");
    };
  }, []);

  return (
    <PreloaderShell
      slideRef={slideRef}
      textRef={textRef}
      text={props.variant === "nav" ? LAST_PRELOADER_WORD : undefined}
    />
  );
}
