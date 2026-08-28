import { Section } from "./Section";
import { capabilities } from "../../content/site";
import "./Capabilities.css";

export function Capabilities() {
  return (
    <Section
      id="capabilities"
      eyebrow="What we do"
      title="Our Capabilities"
      intro="Workforce and manpower solutions designed for industrial and project environments — structured, scalable and operationally supported."
    >
      <ul className="ve-cards ve-cards--6">
        {capabilities.map((c) => (
          <li key={c.no} className="ve-cap-card">
            <span className="ve-cap-card__no">{c.no}</span>
            <h3 className="ve-cap-card__title">{c.title}</h3>
            <p className="ve-cap-card__desc">{c.desc}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
