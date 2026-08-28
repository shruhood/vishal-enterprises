import { Button } from "../ui/Button";
import { siteImages, trustIndicators } from "../../content/site";
import "./Hero.css";

const heroCapabilities = [
  "Industrial Workforce",
  "Skilled Personnel",
  "Project Deployment",
  "Workforce Management",
];

export function Hero() {
  return (
    <section className="ve-hero" aria-labelledby="hero-title">
      <div className="ve-hero__media" aria-hidden="true">
        <img
          src={siteImages.hero}
          alt=""
          loading="eager"
          fetchPriority="high"
          className="ve-hero__img"
        />
        <div className="ve-hero__overlay" />
      </div>

      <div className="ve-hero__inner">
        <div className="ve-hero__content">
          <p className="ve-hero__eyebrow">Industrial Workforce &amp; Manpower Solutions</p>
          <h1 id="hero-title" className="ve-hero__title">
            Powering Industry with People
          </h1>
          <p className="ve-hero__sub">
            Workforce solutions built for industrial performance — supporting
            manufacturing, engineering, infrastructure and project-driven
            organizations with reliable manpower and continuous support.
          </p>
          <div className="ve-hero__actions">
            <Button as="a" href="/request-workforce" variant="primary">
              Request Workforce &rarr;
            </Button>
            <Button as="a" href="/services" variant="secondary">
              Explore Services &rarr;
            </Button>
          </div>

          <ul className="ve-hero__caps" aria-label="Core capabilities">
            {heroCapabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <aside className="ve-hero__panel" aria-hidden="true">
          <p className="ve-hero__panel-label">Built for demanding industries</p>
          <ul>
            {trustIndicators.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
