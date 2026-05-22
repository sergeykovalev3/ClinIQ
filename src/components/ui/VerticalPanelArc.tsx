import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type VerticalPanelArcProps = {
  className?: string;
};

export const VerticalPanelArc = forwardRef<
  HTMLDivElement,
  VerticalPanelArcProps
>(function VerticalPanelArc({ className }, ref) {
  return (
    <div
      ref={ref}
      data-panel-arc
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-[-5%] -left-[clamp(64px,8vw,90px)] h-[110%] w-[clamp(128px,16vw,180px)] rounded-[50%] bg-preloader-bg will-change-transform",
        className,
      )}
    />
  );
});
