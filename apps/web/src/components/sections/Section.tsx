import { type ReactNode } from "react";
import { Container } from "../ui/Container";
import "./Section.css";

type Tone = "light" | "alt" | "dark";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

/**
 * Standard page section with optional eyebrow + heading and consistent
 * vertical rhythm. `tone` drives the alternating background rhythm.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  tone = "light",
  children,
  className,
}: SectionProps) {
  const cls = ["ve-section", `ve-section--${tone}`, className].filter(Boolean).join(" ");
  return (
    <section id={id} className={cls} aria-labelledby={title ? `${id ?? "s"}-title` : undefined}>
      <Container>
        {(eyebrow || title || intro) && (
          <header className="ve-section__head">
            {eyebrow && <p className="ve-section__eyebrow">{eyebrow}</p>}
            {title && (
              <h2 id={title ? `${id ?? "s"}-title` : undefined} className="ve-section__title">
                {title}
              </h2>
            )}
            {intro && <p className="ve-section__intro">{intro}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
