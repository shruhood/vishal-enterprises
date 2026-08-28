import { Section } from "./Section";
import { safetyItems } from "../../content/site";
import "./SafetyCompliance.css";

export function SafetyCompliance() {
  return (
    <Section
      id="safety"
      tone="alt"
      eyebrow="Assurance"
      title="Safety. Compliance. Workforce Readiness."
      intro="We understand that enterprise workforce requirements go beyond headcount — documentation, verification and site compliance are part of the engagement."
    >
      <ul className="ve-safety">
        {safetyItems.map((item) => (
          <li key={item} className="ve-safety__item">
            <span className="ve-safety__tick" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}
