import { Section } from "./Section";
import { Button } from "../ui/Button";
import { siteImages } from "../../content/site";
import "./AboutPreview.css";

export function AboutPreview() {
  return (
    <Section id="about-preview" tone="light">
      <div className="ve-about">
        <img
          className="ve-about__img"
          src={siteImages.about}
          alt="Vishal Enterprises team coordinating industrial workforce"
          loading="lazy"
        />
        <div className="ve-about__body">
          <p className="ve-section__eyebrow">About Vishal Enterprises</p>
          <h2 className="ve-about__title">
            Built Around Workforce. Driven by Reliability.
          </h2>
          <p className="ve-about__text">
            Vishal Enterprises supports organizations with reliable workforce and
            manpower solutions designed for demanding industrial and project
            environments. From workforce sourcing and deployment to site-level
            coordination and ongoing management, we help businesses maintain
            operational continuity while focusing on their core activities.
          </p>
          <Button as="a" href="/about" variant="primary">
            About Vishal Enterprises &rarr;
          </Button>
        </div>
      </div>
    </Section>
  );
}
