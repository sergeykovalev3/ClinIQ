export const howItWorksSteps = [
  {
    id: "upload",
    index: "01",
    headline: "Upload",
    line: "Labs, PDFs, photos — drop them in.",
  },
  {
    id: "understand",
    index: "02",
    headline: "Understand",
    line: "Plain language. No medical jargon.",
  },
  {
    id: "prepare",
    index: "03",
    headline: "Prepare",
    line: "Walk in with the right questions.",
  },
] as const;

export const translationPairs = [
  { term: "Hemoglobin A1c", plain: "3-month blood sugar average" },
  { term: "eGFR", plain: "Kidney filter rate" },
  { term: "LDL cholesterol", plain: "Artery-clogging cholesterol" },
  { term: "TSH", plain: "Thyroid activity signal" },
  { term: "CRP", plain: "Inflammation marker" },
] as const;

export const prepareBriefQuestions = [
  "Is my A1c in a range you expect?",
  "Should we adjust anything before my next test?",
  "What symptoms should I watch for?",
] as const;
