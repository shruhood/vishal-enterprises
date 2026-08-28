import { Section } from "./Section";
import { Button } from "../ui/Button";
import { enterpriseAudiences } from "../../content/site";
import "./EnterpriseCta.css";

export function EnterpriseCta() {
  return (
    <Section
      id="enterprise"
      tone="dark"
      eyebrow="Enterprise readiness"
      title="Built for Enterprise Workforce Requirements"
      intro="Enterprise requirements involve more than manpower availability — documentation, compliance, deployment timelines, workforce continuity and communication are equally important."
    >
      <ul className="ve-enterprise__audiences" aria-label="Who we work with">
        {enterpriseAudiences.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <div className="ve-enterprise__cta">
        <Button as="a" href="/request-workforce" variant="primary">
          Partner with Vishal Enterprises &rarr;
        </Button>
      </div>
    </Section>
  );
}
