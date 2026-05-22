"use client";

import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { FormFieldError } from "@/components/ui/FormFieldError";
import { RoundMagneticButton } from "@/components/ui/RoundMagneticButton";
import { UploadArrowIcon } from "@/components/ui/UploadArrowIcon";
import {
  formatFileSize,
  uploadAccept,
  uploadFormCopy,
} from "@/lib/form-footer";
import {
  sanitizeEmailInput,
  sanitizeMessageInput,
  sanitizeNameInput,
  sanitizePhoneInput,
  uploadFieldLimits,
  validateUploadField,
  validateUploadFiles,
  validateUploadForm,
  type UploadFormErrors,
  type UploadFormField,
} from "@/lib/upload-form";
import { FormLineField, FormLineTextarea } from "@/sections/form-footer/FormLineField";
import { UploadFormSuccess } from "@/sections/form-footer/UploadFormSuccess";
import { cn } from "@/lib/cn";

type UploadFormProps = {
  className?: string;
};

function mergeFiles(current: File[], incoming: FileList | File[]) {
  const map = new Map(current.map((file) => [`${file.name}-${file.size}`, file]));

  Array.from(incoming).forEach((file) => {
    map.set(`${file.name}-${file.size}`, file);
  });

  return Array.from(map.values());
}

export function UploadForm({ className }: UploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<UploadFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<UploadFormField, boolean>>>(
    {},
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [filesError, setFilesError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);

  const values = { name, email, phone, message };
  const showFilesError = submitAttempted ? filesError : undefined;

  const pickFiles = () => inputRef.current?.click();

  const addFiles = (incoming: FileList | File[]) => {
    setFiles((current) => {
      const next = mergeFiles(current, incoming);
      if (next.length > 0) setFilesError(undefined);
      return next;
    });
  };

  const removeFile = (index: number) => {
    setFiles((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      if (submitAttempted) {
        setFilesError(validateUploadFiles(next.length));
      }
      return next;
    });
  };

  const showFieldError = (field: UploadFormField) => {
    if (!touched[field] && !submitAttempted) return undefined;
    return errors[field];
  };

  const touchField = (field: UploadFormField) => {
    setTouched((current) => ({ ...current, [field]: true }));
    const message = validateUploadField(field, values);
    setErrors((current) => {
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const updateField = (field: UploadFormField, nextValue: string) => {
    switch (field) {
      case "name":
        setName(nextValue);
        break;
      case "email":
        setEmail(nextValue);
        break;
      case "phone":
        setPhone(nextValue);
        break;
      case "message":
        setMessage(nextValue);
        break;
    }

    if (!touched[field] && !submitAttempted) return;

    const nextValues = { ...values, [field]: nextValue };
    const message = validateUploadField(field, nextValues);
    setErrors((current) => {
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitted) return;

    setSubmitAttempted(true);
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
    });

    const result = validateUploadForm(values);
    const nextFilesError = validateUploadFiles(files.length);

    if (!result.valid || nextFilesError) {
      setErrors(result.errors);
      setFilesError(nextFilesError);

      const firstInvalid = (["name", "email", "phone", "message"] as const).find(
        (field) => result.errors[field],
      );

      if (firstInvalid) {
        document.getElementById(`upload-${firstInvalid}`)?.focus();
        return;
      }

      if (nextFilesError) {
        document.getElementById("upload-files")?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        pickFiles();
      }

      return;
    }

    console.log("[ClinIQ upload]", {
      name: name.trim(),
      email: email.trim(),
      phone,
      message: message.trim(),
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    });

    setErrors({});
    setFilesError(undefined);
    setSubmitted(true);
  };

  const onDrop = (event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  };

  return (
    <div className={cn("grid w-full max-w-[34rem]", className)}>
      <form
        onSubmit={onSubmit}
        noValidate
        aria-hidden={submitted}
        onDragEnter={() => setDragging(true)}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node)) return;
          setDragging(false);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className={cn(
          "col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none",
          submitted
            ? "pointer-events-none -translate-y-2 opacity-0"
            : "translate-y-0 opacity-100",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={uploadAccept}
          className="sr-only"
          onChange={() => {
            if (inputRef.current?.files) addFiles(inputRef.current.files);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />

        <div className="space-y-0">
          <FormLineField
            id="upload-name"
            label={uploadFormCopy.name.label}
            placeholder={uploadFormCopy.name.placeholder}
            autoComplete="name"
            maxLength={uploadFieldLimits.name}
            value={name}
            error={showFieldError("name")}
            onBlur={() => touchField("name")}
            onChange={(value) => updateField("name", sanitizeNameInput(value))}
          />
          <FormLineField
            id="upload-email"
            type="text"
            inputMode="email"
            label={uploadFormCopy.email.label}
            placeholder={uploadFormCopy.email.placeholder}
            autoComplete="email"
            maxLength={uploadFieldLimits.email}
            value={email}
            error={showFieldError("email")}
            onBlur={() => touchField("email")}
            onChange={(value) => updateField("email", sanitizeEmailInput(value))}
          />
          <FormLineField
            id="upload-phone"
            type="tel"
            inputMode="tel"
            label={uploadFormCopy.phone.label}
            placeholder={uploadFormCopy.phone.placeholder}
            autoComplete="tel"
            maxLength={uploadFieldLimits.phone}
            value={phone}
            error={showFieldError("phone")}
            onBlur={() => touchField("phone")}
            onChange={(value) => updateField("phone", sanitizePhoneInput(value))}
          />
          <FormLineTextarea
            id="upload-message"
            label={uploadFormCopy.message.label}
            placeholder={uploadFormCopy.message.placeholder}
            maxLength={uploadFieldLimits.message}
            value={message}
            error={showFieldError("message")}
            onBlur={() => touchField("message")}
            onChange={(value) => updateField("message", sanitizeMessageInput(value))}
            rows={4}
          />
        </div>

        <div
          id="upload-files"
          className={cn(
            "mt-8 border-y border-preloader-fg/14 py-5 transition-[border-color,background-color] duration-300",
            dragging && "border-accent/40 bg-accent/[0.06]",
            showFilesError && "border-[#e8a0a0]/45",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium tracking-[0.12em] text-preloader-fg/45">
                {uploadFormCopy.files.label}
              </p>
              <p className="mt-2 text-[11px] tracking-normal text-preloader-fg/45">
                {uploadFormCopy.files.hint}
              </p>
            </div>
            <button
              type="button"
              onClick={pickFiles}
              className="shrink-0 cursor-pointer text-[11px] font-medium tracking-normal text-accent-bright transition-opacity duration-300 hover:opacity-80"
            >
              {uploadFormCopy.files.action}
            </button>
          </div>
          <FormFieldError id="upload-files-error" message={showFilesError} />
        </div>

        <div className="mt-6">
          {files.length === 0 ? (
            <p className="text-[11px] tracking-normal text-preloader-fg/35">
              {uploadFormCopy.files.empty}
            </p>
          ) : (
            <ul className="space-y-0">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center gap-4 border-b border-preloader-fg/10 py-4 last:border-b-0"
                >
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-[15px] font-medium tracking-[-0.02em] text-preloader-fg">
                      {file.name}
                    </p>
                    <p className="mt-1 text-[11px] tracking-normal text-preloader-fg/45">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="shrink-0 cursor-pointer text-[11px] font-medium tracking-normal text-preloader-fg/45 transition-colors duration-300 hover:text-preloader-fg"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 flex items-center gap-4 md:mt-12">
          <RoundMagneticButton type="submit" aria-label={uploadFormCopy.submit} size="md">
            <UploadArrowIcon className="h-6 w-6 text-bg" />
          </RoundMagneticButton>
          <span className="max-w-[10rem] text-[11px] font-medium leading-snug tracking-normal text-preloader-fg">
            {uploadFormCopy.submit}
          </span>
        </div>
      </form>

      <div className="pointer-events-none col-start-1 row-start-1 w-full self-start">
        <UploadFormSuccess visible={submitted} />
      </div>
    </div>
  );
}
