import { Section } from "./Section";
import { processSteps } from "../../content/site";
import "./ProcessTimeline.css";

export function ProcessTimeline() {
  return (
    <Section
      id="process"
      eyebrow="How we work"
      title="From Requirement to Deployment"
      intro="A structured, repeatable process that keeps workforce engagement predictable for your operations and project teams."
    >
      <ol className="ve-process">
        {processSteps.map((s) => (
          <li key={s.no} className="ve-process__step">
            <span className="ve-process__no">{s.no}</span>
            <h3 className="ve-process__title">{s.title}</h3>
            <p className="ve-process__desc">{s.desc}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
