import { type ReactNode } from "react";
import "./FormStatus.css";

interface FormStatusProps {
  variant: "idle" | "submitting" | "success" | "error";
  errorMessage?: string;
  children?: ReactNode;
}

/**
 * Surfaces form-level submission state. Renders nothing when idle,
 * a banner when there is something to say, and exposes the result
 * message in a screen-reader-friendly way when complete.
 */
export function FormStatus({ variant, errorMessage, children }: FormStatusProps) {
  if (variant === "idle" || variant === "submitting") {
    if (variant === "submitting") {
      return (
        <p className="ve-form-status ve-form-status--submitting" aria-live="polite">
          Submitting your details...
        </p>
      );
    }
    return null;
  }
  if (variant === "success") {
    return (
      <div className="ve-form-status ve-form-status--success" role="status" aria-live="polite">
        {children ?? "Submitted successfully."}
      </div>
    );
  }
  return (
    <div className="ve-form-status ve-form-status--error" role="alert">
      {errorMessage ?? "Submission failed. Please try again."}
    </div>
  );
}
