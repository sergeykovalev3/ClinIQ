"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { RoundMagneticLink } from "@/components/ui/RoundMagneticLink";
import { UploadArrowIcon } from "@/components/ui/UploadArrowIcon";
import { useLenis } from "@/components/layout/LenisProvider";
import { howItWorksSteps } from "@/lib/how-it-works";
import { sectionEyebrow, sectionHeadline, sectionLead, typeCtaCaption } from "@/lib/typography";
import { cta } from "@/lib/site";
import { HowItWorksStepVisual } from "@/sections/how-it-works/HowItWorksStepVisual";
import { cn } from "@/lib/cn";
import { registerHowPinTrigger } from "@/lib/how-pin-scroll";
import { isNavScrolling, subscribeNavScroll } from "@/lib/nav-scroll";

const STEP_COUNT = howItWorksSteps.length;
const SCROLL_PER_STEP = 52;
const PIN_TAIL_SCROLL = 34;
const EXIT_DURATION = 0.52;
const ENTER_DELAY = 0.16;
const ENTER_DURATION = 0.56;
const MOVE_COPY = 28;
const MOVE_VISUAL = 24;
const INDICATOR_ACTIVE = "#0f1c28";
const INDICATOR_INACTIVE = "#5a6d7d";

const ACTIVE_SCROLL = (STEP_COUNT - 1) * SCROLL_PER_STEP;
const TOTAL_PIN_SCROLL = ACTIVE_SCROLL + PIN_TAIL_SCROLL;

export function HowItWorksPinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const displayedStepRef = useRef(0);
  const animatingToRef = useRef<number | null>(null);
  const animStartProgressRef = useRef(0);
  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  const { lenis } = useLenis();
  const [activeStep, setActiveStep] = useState(0);

  useLayoutEffect(() => {
    if (!lenis) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    gsap.registerPlugin(ScrollTrigger);

    const layers = gsap.utils.toArray<HTMLElement>("[data-how-layer]", section);
    const copies = gsap.utils.toArray<HTMLElement>("[data-how-copy]", section);
    const visuals = gsap.utils.toArray<HTMLElement>("[data-how-visual]", section);
    const ghosts = gsap.utils.toArray<HTMLElement>("[data-how-ghost]", section);
    const indicators = gsap.utils.toArray<HTMLElement>("[data-how-indicator]", section);
    const rails = gsap.utils.toArray<HTMLElement>("[data-how-rail]", section);

    gsap.set(layers.slice(1), { autoAlpha: 0, visibility: "hidden" });
    gsap.set(layers[0], { zIndex: 10 });
    gsap.set([copies[0], visuals[0], ghosts[0]], {
      y: 0,
      autoAlpha: 1,
      scale: 1,
    });
    gsap.set(indicators[0], { color: INDICATOR_ACTIVE });
    gsap.set(indicators.slice(1), { color: INDICATOR_INACTIVE });
    gsap.set(rails, { scaleX: 0, transformOrigin: "left center" });

    const syncChrome = (step: number) => {
      indicators.forEach((indicator, index) => {
        gsap.to(indicator, {
          color: index === step ? INDICATOR_ACTIVE : INDICATOR_INACTIVE,
          duration: 0.52,
          ease: "power1.inOut",
          overwrite: true,
        });
      });
      rails.forEach((rail, index) => {
        gsap.to(rail, {
          scaleX: index < step ? 1 : 0,
          duration: 0.56,
          ease: "power1.inOut",
          overwrite: true,
        });
      });
    };

    const resetToStep = (step: number) => {
      layers.forEach((layer, index) => {
        const isActive = index === step;
        gsap.set(layer, {
          autoAlpha: isActive ? 1 : 0,
          visibility: isActive ? "visible" : "hidden",
          zIndex: isActive ? 10 : 0,
        });
        gsap.set([copies[index], ghosts[index]], {
          y: 0,
          autoAlpha: isActive ? 1 : 0,
        });
        gsap.set(visuals[index], {
          y: 0,
          autoAlpha: isActive ? 1 : 0,
          scale: 1,
        });
      });
    };

    const settleAnimation = (step: number) => {
      releaseScrollLock();
      transitionRef.current?.kill();
      animatingToRef.current = null;
      displayedStepRef.current = step;
      resetToStep(step);
      syncChrome(step);
      setActiveStep(step);
      layers.forEach((layer, index) => {
        gsap.set(layer, { zIndex: index === step ? 10 : 0 });
      });
    };

    const stepProgressFromPin = (progress: number) =>
      Math.min(1, (progress * TOTAL_PIN_SCROLL) / ACTIVE_SCROLL);

    const targetStepFromProgress = (progress: number) =>
      Math.min(
        STEP_COUNT - 1,
        Math.max(0, Math.round(stepProgressFromPin(progress) * (STEP_COUNT - 1))),
      );

    const progressForScroll = (progress: number) =>
      pinTrigger!.start + progress * (pinTrigger!.end - pinTrigger!.start);

    const progressForStep = (step: number) => {
      if (STEP_COUNT <= 1) return 0;
      return Math.min(1, (step / (STEP_COUNT - 1)) * (ACTIVE_SCROLL / TOTAL_PIN_SCROLL));
    };

    let scrollHeld = false;

    const releaseScrollLock = () => {
      if (!scrollHeld) return;
      scrollHeld = false;
      lenis.start();
    };

    const holdScrollForTransition = () => {
      if (!pinTrigger || scrollHeld) return;
      const scrollY = progressForScroll(animStartProgressRef.current);
      scrollHeld = true;
      lenis.scrollTo(scrollY, { immediate: true, force: true });
      lenis.stop();
    };

    const snapScrollToStep = (step: number) => {
      if (!pinTrigger) return;
      lenis.scrollTo(progressForScroll(progressForStep(step)), {
        immediate: true,
        force: true,
      });
    };

    let pinTrigger: ScrollTrigger | undefined;

    const syncStepToProgress = (progress: number) => {
      if (isNavScrolling()) return;

      const settled = displayedStepRef.current;
      const current = animatingToRef.current ?? settled;
      const target = targetStepFromProgress(progress);

      if (target === current) return;
      if (animatingToRef.current !== null) return;

      if (Math.abs(target - current) !== 1) {
        settleAnimation(target);
        return;
      }

      goToStep(target);
    };

    const goToStep = (next: number) => {
      if (isNavScrolling()) return;

      const settled = displayedStepRef.current;
      const from = animatingToRef.current ?? settled;

      if (animatingToRef.current !== null) {
        transitionRef.current?.kill();
        releaseScrollLock();
        resetToStep(from);
        displayedStepRef.current = from;
        animatingToRef.current = null;
        setActiveStep(from);
      }

      if (next === from) return;

      if (Math.abs(next - from) !== 1) {
        next = from + Math.sign(next - from);
      }

      if (next === from) return;
      if (animatingToRef.current === next) return;

      animatingToRef.current = next;
      if (pinTrigger) animStartProgressRef.current = pinTrigger.progress;
      holdScrollForTransition();
      syncChrome(next);

      const tl = gsap.timeline({
        onComplete: () => {
          displayedStepRef.current = next;
          animatingToRef.current = null;
          snapScrollToStep(next);
          releaseScrollLock();
          setActiveStep(next);
          gsap.set(layers[from], { zIndex: 0 });
          gsap.set(layers[next], { zIndex: 10 });
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            if (pinTrigger) syncStepToProgress(pinTrigger.progress);
          });
        },
      });

      transitionRef.current = tl;

      gsap.set(layers[next], { zIndex: 20, visibility: "visible", autoAlpha: 1 });
      gsap.set([copies[next], ghosts[next]], { y: MOVE_COPY, autoAlpha: 0 });
      gsap.set(visuals[next], { y: -MOVE_VISUAL, autoAlpha: 0, scale: 0.985 });

      tl.to(
        [copies[from], ghosts[from]],
        { y: -MOVE_COPY, autoAlpha: 0, duration: EXIT_DURATION, ease: "power2.inOut" },
        0,
      );
      tl.to(
        visuals[from],
        {
          y: MOVE_VISUAL,
          autoAlpha: 0,
          scale: 0.985,
          duration: EXIT_DURATION,
          ease: "power2.inOut",
        },
        0,
      );
      tl.set(layers[from], { autoAlpha: 0, visibility: "hidden" }, EXIT_DURATION + ENTER_DELAY);
      tl.to(
        [copies[next], ghosts[next]],
        { y: 0, autoAlpha: 1, duration: ENTER_DURATION, ease: "power2.inOut" },
        EXIT_DURATION + ENTER_DELAY,
      );
      tl.to(
        visuals[next],
        { y: 0, autoAlpha: 1, scale: 1, duration: ENTER_DURATION, ease: "power2.inOut" },
        EXIT_DURATION + ENTER_DELAY,
      );
    };

    const abortActiveTransition = () => {
      transitionRef.current?.kill();
      transitionRef.current = null;
      animatingToRef.current = null;
      releaseScrollLock();
    };

    const unsubscribeNavScroll = subscribeNavScroll({
      onStart: () => {
        abortActiveTransition();
      },
      onEnd: () => {
        if (!pinTrigger) return;
        settleAnimation(targetStepFromProgress(pinTrigger.progress));
      },
    });

    const ctx = gsap.context(() => {
      pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${TOTAL_PIN_SCROLL}%`,
        pin,
        pinSpacing: true,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onEnter: (self) => {
          if (isNavScrolling()) return;
          abortActiveTransition();
          settleAnimation(targetStepFromProgress(self.progress));
        },
        onEnterBack: (self) => {
          if (isNavScrolling()) return;
          abortActiveTransition();
          settleAnimation(targetStepFromProgress(self.progress));
        },
        onLeaveBack: () => {
          if (isNavScrolling() || animatingToRef.current !== null) return;
          settleAnimation(0);
        },
        onUpdate: (self) => {
          syncStepToProgress(self.progress);
        },
      });

      registerHowPinTrigger(pinTrigger);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (!pinTrigger?.isActive) return;
        settleAnimation(targetStepFromProgress(pinTrigger.progress));
      });
    }, section);

    return () => {
      unsubscribeNavScroll();
      registerHowPinTrigger(null);
      releaseScrollLock();
      transitionRef.current?.kill();
      ctx.revert();
    };
  }, [lenis]);

  return (
    <section ref={sectionRef} id="how" className="relative bg-bg">
      <div ref={pinRef} className="relative flex min-h-[100dvh] items-center">
        <Container className="relative w-full py-8 md:py-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8 lg:mb-10">
            <p className={sectionEyebrow()}>How it works</p>
            <div
              className="flex items-center gap-2.5 md:gap-3 lg:gap-4"
              aria-label={`Step ${activeStep + 1} of ${STEP_COUNT}`}
            >
              {howItWorksSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2.5 md:gap-3 lg:gap-4">
                  <span
                    data-how-indicator
                    className="font-display text-[11px] font-medium tracking-[0.18em] md:text-xs"
                  >
                    {step.index}
                  </span>
                  {index < STEP_COUNT - 1 ? (
                    <span className="relative h-px w-6 overflow-hidden bg-border/80 md:w-8 lg:w-12">
                      <span
                        data-how-rail
                        className="absolute inset-0 origin-left scale-x-0 bg-accent"
                      />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[min(58dvh,32rem)] md:min-h-[min(68dvh,38rem)] lg:min-h-[min(72dvh,40rem)]">
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden md:overflow-visible"
              aria-hidden
            >
              {howItWorksSteps.map((step, index) => (
                <span
                  key={`ghost-${step.id}`}
                  data-how-ghost
                  className={cn(
                    "absolute select-none font-display text-[clamp(5rem,22vw,18rem)] font-medium leading-none tracking-[-0.05em] text-fg/[0.04] md:text-[clamp(6rem,28vw,18rem)]",
                    index % 2 === 0
                      ? "-right-[0.1em] top-[2vh]"
                      : "-left-[0.08em] top-[4vh]",
                    index === 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  {step.index}
                </span>
              ))}
            </div>

            {howItWorksSteps.map((step, index) => (
              <div
                key={step.id}
                data-how-layer
                className={cn(
                  "absolute inset-0 grid items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-12",
                  index === 0 ? "visible z-10" : "invisible z-0",
                )}
                aria-hidden={activeStep !== index}
              >
                <div data-how-copy className="relative flex flex-col justify-center">
                  <h2
                    id={index === activeStep ? `how-${step.id}` : undefined}
                    className={sectionHeadline("fg", "mt-0 max-w-[18rem]")}
                  >
                    {step.headline}
                  </h2>
                  <p className={sectionLead("muted", "max-w-[18rem]")}>
                    {step.line}
                  </p>
                  {step.id === "upload" ? (
                    <div className="mt-6 flex items-center gap-4 md:mt-7">
                      <RoundMagneticLink
                        href={cta.upload.href}
                        aria-label={cta.upload.label}
                        size="md"
                      >
                        <UploadArrowIcon className="h-6 w-6 text-bg" />
                      </RoundMagneticLink>
                      <span className={cn(typeCtaCaption, "max-w-[10rem] text-fg")}>
                        {cta.upload.label}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div
                  data-how-visual
                  className="relative flex items-center justify-center lg:justify-end"
                >
                  <HowItWorksStepVisual
                    id={step.id}
                    active={activeStep === index}
                    variant="pinned"
                  />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
