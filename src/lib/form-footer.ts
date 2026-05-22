export const uploadSectionHeader = {
  eyebrow: "Upload",
  headline: "Your report",
  line: "Share your details and attach labs or records.",
} as const;

export const uploadFormCopy = {
  name: { label: "Name", placeholder: "Full name" },
  email: { label: "Email", placeholder: "you@email.com" },
  phone: { label: "Phone", placeholder: "+1 (555) 000-0000" },
  message: { label: "Message", placeholder: "Anything we should know?" },
  files: {
    label: "Attachments",
    action: "Add files",
    hint: "PDF, JPG, PNG — drag here or browse",
    empty: "No files yet",
  },
  submit: "Send report",
  success: {
    eyebrow: "Received",
    headline: "We'll be in touch",
    line: "Thanks for sharing your report. We typically reply within one business day.",
  },
} as const;

export const uploadAccept =
  "application/pdf,image/jpeg,image/png,image/webp,image/heic";

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
