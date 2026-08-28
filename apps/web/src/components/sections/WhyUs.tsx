import { Section } from "./Section";
import { whyItems } from "../../content/site";
import "./WhyUs.css";

export function WhyUs() {
  return (
    <Section
      id="why"
      eyebrow="Why Vishal Enterprises"
      title="Why Organizations Choose Vishal Enterprises"
      intro="A workforce partner measured by reliability and operational discipline, not promises."
    >
      <ul className="ve-why">
        {whyItems.map((w) => (
          <li key={w.title} className="ve-why__item">
            <h3 className="ve-why__title">{w.title}</h3>
            <p className="ve-why__desc">{w.desc}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
