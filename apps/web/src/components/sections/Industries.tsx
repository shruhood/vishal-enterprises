import { Section } from "./Section";
import { industries, siteImages } from "../../content/site";
import "./Industries.css";

export function Industries() {
  return (
    <Section
      id="industries"
      tone="dark"
      eyebrow="Sectors we serve"
      title="Industries We Support"
      intro="Workforce solutions aligned to the operational realities of each sector — from continuous plant operations to project-driven deployments."
    >
      <div className="ve-ind">
        <ul className="ve-ind__grid">
          {industries.map((it) => (
            <li key={it.title} className="ve-ind__card">
              <h3 className="ve-ind__title">{it.title}</h3>
              <p className="ve-ind__desc">{it.desc}</p>
            </li>
          ))}
        </ul>
        <img
          className="ve-ind__img"
          src={siteImages.industries}
          alt="Industrial workforce on a project site"
          loading="lazy"
        />
      </div>
    </Section>
  );
}
