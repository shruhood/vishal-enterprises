import { Container } from "../components/ui/Container";
import { useSeo } from "../lib/seo";
import { companyConfig } from "../config/company";
import "./ContentPage.css";

export function Industries() {
  useSeo({
    title: "Industries",
    description:
      "Industries we serve with workforce solutions — pharmaceuticals, manufacturing, logistics, textiles, packaging and more.",
  });

  return (
    <section className="ve-section ve-content">
      <Container>
        <h1>Industries we serve</h1>
        <p className="ve-content__lead">
          We deploy workforce across a wide range of industrial sectors.
          Each industry has its own safety, shift and documentation
          requirements — our team is familiar with the practical realities
          of running multi-site deployments.
        </p>

        <ul className="ve-chip-list ve-chip-list--lg">
          {companyConfig.industries.map((name) => (
            <li key={name} className="ve-chip">
              {name}
            </li>
          ))}
        </ul>

        <div className="ve-content__block">
          <h2>Don&apos;t see your industry?</h2>
          <p>
            If your sector is not listed above, please get in touch — we
            frequently support adjacent industries and can scope a
            deployment on a case-by-case basis.
          </p>
        </div>
      </Container>
    </section>
  );
}
