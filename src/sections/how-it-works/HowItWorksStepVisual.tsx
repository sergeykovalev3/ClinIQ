import { HowStepPrepareVisual } from "@/sections/how-it-works/HowStepPrepareVisual";
import { HowStepUnderstandVisual } from "@/sections/how-it-works/HowStepUnderstandVisual";
import { HowStepUploadVisual } from "@/sections/how-it-works/HowStepUploadVisual";
import type { howItWorksSteps } from "@/lib/how-it-works";

type HowItWorksStepVisualProps = {
  id: (typeof howItWorksSteps)[number]["id"];
  active: boolean;
  variant?: "pinned" | "stacked";
};

export function HowItWorksStepVisual({
  id,
  active,
  variant = "pinned",
}: HowItWorksStepVisualProps) {
  if (id === "upload") {
    return (
      <HowStepUploadVisual
        active={active}
        className={
          variant === "stacked"
            ? "mx-auto w-full max-w-[min(100%,18rem)]"
            : "max-w-[19rem]"
        }
      />
    );
  }

  if (id === "understand") {
    return (
      <HowStepUnderstandVisual
        className={
          variant === "stacked"
            ? "mx-auto h-[min(52vh,22rem)] w-full max-w-[min(100%,20rem)]"
            : "h-[min(44vh,24rem)] max-w-[24rem]"
        }
      />
    );
  }

  return (
    <HowStepPrepareVisual
      active={active}
      className={
        variant === "stacked" ? "mx-auto w-full max-w-[min(100%,20rem)]" : undefined
      }
    />
  );
}
