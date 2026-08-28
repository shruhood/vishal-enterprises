import { type ReactNode, useId } from "react";
import "./FormField.css";

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: (id: string, describedBy: string | undefined) => ReactNode;
}

/**
 * Wraps a labelled form input. Wires up the htmlFor/for relationship
 * and an aria-describedby hint/error message. The child render-prop
 * receives the input id and an optional `describedBy` id to apply.
 */
export function FormField({
  label,
  required,
  hint,
  error,
  children,
}: FormFieldProps) {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const hintId = hint ? `${baseId}-hint` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={"ve-field" + (error ? " ve-field--error" : "")}>
      <label className="ve-field__label" htmlFor={inputId}>
        {label}
        {required ? <span aria-hidden="true" className="ve-field__required"> *</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="ve-field__hint">
          {hint}
        </p>
      ) : null}
      {children(inputId, describedBy)}
      {error ? (
        <p id={errorId} className="ve-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
