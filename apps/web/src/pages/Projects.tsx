import { Section } from "../components/sections/Section";
import { Button } from "../components/ui/Button";
import { useSeo } from "../lib/seo";
import { industries } from "../content/site";
import "./ContentPage.css";

export function Projects() {
  useSeo({
    title: "Projects & Capabilities in Action",
    description:
      "How Vishal Enterprises supports industrial, engineering, infrastructure and construction workforce requirements across sectors.",
    path: "/projects",
  });

  return (
    <Section
      id="projects"
      eyebrow="Capabilities in action"
      title="Where We Deploy Workforce"
      intro="We support workforce requirements across the sectors below. Engagement scope, headcount and timelines are defined per client requirement — we do not publish client names or project values without authorization."
    >
      <ul className="ve-cards ve-cards--6">
        {industries.map((it, i) => (
          <li key={it.title} className="ve-cap-card">
            <span className="ve-cap-card__no">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="ve-cap-card__title">{it.title}</h3>
            <p className="ve-cap-card__desc">{it.desc}</p>
          </li>
        ))}
      </ul>
      <div style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
        <Button as="a" href="/request-workforce" variant="primary">
          Discuss Your Requirement &rarr;
        </Button>
      </div>
    </Section>
  );
}
