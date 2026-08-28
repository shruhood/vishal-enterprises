import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { companyConfig } from "../config/company";
import { useSeo } from "../lib/seo";
import "./Home.css";

export function Home() {
  useSeo({
    title: "Reliable Workforce Solutions for Industry",
    description: companyConfig.messaging.subheadline,
  });

  return (
    <>
      <section className="ve-hero">
        <Container>
          <div className="ve-hero__content">
            <span className="ve-hero__eyebrow">Government Registered Workforce Firm</span>
            <h1 className="ve-hero__headline">{companyConfig.messaging.headline}</h1>
            <p className="ve-hero__subheadline">{companyConfig.messaging.subheadline}</p>
            <div className="ve-hero__actions">
              <Button as="a" href="/employers" variant="primary">
                {companyConfig.messaging.primaryCta}
              </Button>
              <Button as="a" href="/workers" variant="secondary">
                {companyConfig.messaging.secondaryCta}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="ve-trust" aria-label="Trust indicators">
        <Container>
          <ul className="ve-trust__list">
            <li>10+ Years of Management Experience</li>
            <li>Government Registered Firm</li>
            <li>PF &amp; ESIC Support as Applicable</li>
            <li>Continuous Workforce Inspection</li>
          </ul>
        </Container>
      </section>

      <section className="ve-section" aria-labelledby="service-areas-heading">
        <Container>
          <h2 id="service-areas-heading" className="ve-section__heading">
            Service Areas
          </h2>
          <p className="ve-section__intro">
            Serving industries across the following regions, with continuous workforce
            support.
          </p>
          <ul className="ve-chip-list">
            {companyConfig.serviceAreas.map((area) => (
              <li key={area} className="ve-chip">
                {area}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="ve-section ve-section--alt" aria-labelledby="cta-heading">
        <Container>
          <div className="ve-cta-banner">
            <h2 id="cta-heading">Need Workforce, or Looking for Work?</h2>
            <p>
              Reach out to request manpower for your industry, or register as a worker to
              be considered for available opportunities.
            </p>
            <div className="ve-hero__actions">
              <Button as="a" href="/employers" variant="primary">
                {companyConfig.messaging.primaryCta}
              </Button>
              <Button as="a" href="/workers" variant="secondary">
                {companyConfig.messaging.secondaryCta}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
