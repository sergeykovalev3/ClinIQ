export const uploadFieldLimits = {
  name: 80,
  email: 254,
  phone: 14,
  message: 2000,
} as const;

export const uploadNameMinLength = 2;

export const uploadValidationCopy = {
  nameRequired: "Enter your name",
  nameTooShort: "Enter at least 2 characters",
  nameInvalid: "Use letters and spaces only",
  emailRequired: "Enter your email",
  emailInvalid: "Enter a valid email address",
  phoneRequired: "Enter your phone number",
  phoneIncomplete: "Enter a complete 10-digit US number",
  messageTooLong: `Keep your message under ${uploadFieldLimits.message} characters`,
  filesRequired: "Add at least one file",
} as const;

export type UploadFormField = "name" | "email" | "phone" | "message";

export type UploadFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type UploadFormErrors = Partial<Record<UploadFormField, string>>;

const namePattern = /^[a-zA-Z]+(?:[a-zA-Z\s.'-]*[a-zA-Z])?$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function sanitizeNameInput(value: string): string {
  return value.replace(/[^a-zA-Z\s.'-]/g, "").slice(0, uploadFieldLimits.name);
}

export function sanitizeEmailInput(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9@._%+-]/g, "")
    .slice(0, uploadFieldLimits.email);
}

export function extractUsPhoneDigits(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (digits.length > 10 && digits.startsWith("1")) {
    digits = digits.slice(1, 11);
  }

  return digits.slice(0, 10);
}

export function formatUsPhone(digits: string): string {
  const d = extractUsPhoneDigits(digits);

  if (!d.length) return "";

  if (d.length <= 3) return `(${d}`;

  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;

  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function sanitizePhoneInput(value: string): string {
  return formatUsPhone(extractUsPhoneDigits(value));
}

export function sanitizeMessageInput(value: string): string {
  return value.slice(0, uploadFieldLimits.message);
}

export function validateUploadField(
  field: UploadFormField,
  values: UploadFormValues,
): string | undefined {
  switch (field) {
    case "name": {
      const trimmed = values.name.trim();

      if (!trimmed) return uploadValidationCopy.nameRequired;
      if (trimmed.length < uploadNameMinLength) {
        return uploadValidationCopy.nameTooShort;
      }
      if (!namePattern.test(trimmed)) return uploadValidationCopy.nameInvalid;
      return undefined;
    }
    case "email": {
      const trimmed = values.email.trim();

      if (!trimmed) return uploadValidationCopy.emailRequired;
      if (!emailPattern.test(trimmed)) return uploadValidationCopy.emailInvalid;
      return undefined;
    }
    case "phone": {
      const digits = extractUsPhoneDigits(values.phone);

      if (!digits.length) return uploadValidationCopy.phoneRequired;
      if (digits.length !== 10) return uploadValidationCopy.phoneIncomplete;
      return undefined;
    }
    case "message": {
      if (values.message.length > uploadFieldLimits.message) {
        return uploadValidationCopy.messageTooLong;
      }
      return undefined;
    }
    default:
      return undefined;
  }
}

export function validateUploadForm(values: UploadFormValues): {
  valid: boolean;
  errors: UploadFormErrors;
} {
  const fields: UploadFormField[] = ["name", "email", "phone", "message"];
  const errors: UploadFormErrors = {};

  fields.forEach((field) => {
    const message = validateUploadField(field, values);
    if (message) errors[field] = message;
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateUploadFiles(fileCount: number): string | undefined {
  if (fileCount < 1) return uploadValidationCopy.filesRequired;
  return undefined;
}
