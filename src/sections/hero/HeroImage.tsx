import Image from "next/image";
import { cn } from "@/lib/cn";
import { images } from "@/lib/site";

type HeroImageProps = {
  className?: string;
};

export function HeroImage({ className }: HeroImageProps) {
  return (
    <div
      className={cn(
        "relative h-[min(88dvh,920px)] w-[min(96vw,34rem)] sm:h-[min(90dvh,960px)] sm:w-[min(94vw,36rem)] md:h-[min(88dvh,980px)] md:w-[40rem] lg:w-[44rem]",
        className,
      )}
    >
      <Image
        src={images.hero}
        alt="Clinician smiling in a white coat"
        fill
        priority
        className="object-contain object-bottom"
        sizes="(max-width: 767px) 96vw, (max-width: 1024px) 94vw, 704px"
      />
    </div>
  );
}
