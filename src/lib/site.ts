export const site = {
  name: "ClinIQ",
  tagline:
    "We break down your labs and records so you know what to do next.",
  description:
    "ClinIQ explains medical documents in plain English and helps you prepare for your next doctor visit.",
  disclaimer:
    "Decision-support tool only. Not a substitute for a licensed physician and does not provide a diagnosis.",
} as const;

export const preloaderWords = ["Analyzing", "Clarifying", "ClinIQ"] as const;

export const heroMarqueeText =
  "ClinIQ · Labs · Records · Clarity · Next steps";

export const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "Stories", href: "#stories" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
  { label: "Upload", href: "#upload" },
] as const;

export const images = {
  hero: "/images/intro/hero.png",
} as const;

export const cta = {
  upload: {
    label: "Upload your report",
    href: "#upload",
  },
} as const;
