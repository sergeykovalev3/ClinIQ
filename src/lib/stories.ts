export const storiesHeader = {
  eyebrow: "Stories",
  headline: "Real clarity, real visits",
  line: "Short scenarios — decision support, not medical advice.",
} as const;

export const stories = [
  {
    id: "annual-labs",
    marker: "Checkup",
    title: "Annual labs, finally clear",
    line: "She uploaded a checkup PDF and walked in with three focused questions.",
    outcome: "Prepared for visit",
    visual: "labs",
  },
  {
    id: "caregiver",
    marker: "Family",
    title: "Helping Mom read her results",
    line: "A caregiver turned confusing numbers into a calm summary before the appointment.",
    outcome: "Knew what to ask",
    visual: "caregiver",
  },
  {
    id: "a1c-trend",
    marker: "Trends",
    title: "A1c without the spiral",
    line: "He saw the trend, not just one number — and stopped guessing before the callback.",
    outcome: "Less anxiety",
    visual: "trend",
  },
] as const;

export type Story = (typeof stories)[number];
export type StoryVisual = Story["visual"];
