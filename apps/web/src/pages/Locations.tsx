import { Container } from "../components/ui/Container";
import { useSeo } from "../lib/seo";
import { companyConfig } from "../config/company";
import "./ContentPage.css";

export function Locations() {
  useSeo({
    title: "Service Areas",
    description:
      "Vishal Enterprises serves industries across Daman, Vapi, Bhilad, Silvassa and surrounding industrial areas.",
    path: "/locations",
  });

  return (
    <section className="ve-section ve-content">
      <Container>
        <h1>Service areas</h1>
        <p className="ve-content__lead">
          We are based out of the Daman, Vapi, Bhilad and Silvassa
          industrial belt and run active deployments in these regions.
          For nearby industrial areas, please contact us with your
          requirement.
        </p>

        <ul className="ve-chip-list ve-chip-list--lg">
          {companyConfig.serviceAreas.map((area) => (
            <li key={area} className="ve-chip">
              {area}
            </li>
          ))}
        </ul>

        <div className="ve-content__block">
          <h2>Why these areas</h2>
          <p>
            The Daman–Vapi–Silvassa corridor is one of the most active
            industrial belts in western India, with significant
            manufacturing, chemical, pharmaceutical and logistics
            activity. Our local presence means faster mobilisation,
            easier on-site coordination, and a workforce familiar with
            the shift patterns and safety expectations of plants in
            this region.
          </p>
        </div>
      </Container>
    </section>
  );
}
