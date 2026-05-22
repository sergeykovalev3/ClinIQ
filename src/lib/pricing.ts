export const pricingHeader = {
  eyebrow: "Pricing",
  headline: "Start free",
  line: "Upgrade when you need more reports.",
} as const;

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "forever",
    line: "One report. Full clarity.",
    features: [
      "1 report upload",
      "Plain-language breakdown",
      "Doctor visit questions",
    ],
    cta: {
      label: "Try for free",
      href: "#upload",
    },
    featured: false,
  },
  {
    id: "plus",
    name: "Plus",
    price: "12",
    period: "per month",
    line: "For ongoing lab follow-ups.",
    features: [
      "Unlimited uploads",
      "Saved question briefs",
      "PDF export",
    ],
    cta: {
      label: "Get Plus",
      href: "#upload",
    },
    featured: true,
  },
] as const;

export const pricingFootnote =
  "Cancel anytime. Decision-support only — not a substitute for your physician.";
