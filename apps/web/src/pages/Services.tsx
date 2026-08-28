import { Container } from "../components/ui/Container";
import { useSeo } from "../lib/seo";
import { companyConfig } from "../config/company";
import "./ContentPage.css";

export function Services() {
  useSeo({
    title: "Services",
    description:
      "Skilled, semi-skilled and unskilled workforce services for industry — Vishal Enterprises.",
    path: "/services",
  });

  const groups = [
    {
      title: "Skilled workforce",
      desc: "Trained workers for technical, operational and maintenance roles.",
      items: companyConfig.serviceCategories.skilled,
    },
    {
      title: "Semi-skilled workforce",
      desc: "Workers with relevant experience who can work under limited supervision.",
      items: companyConfig.serviceCategories.semiSkilled,
    },
    {
      title: "Unskilled workforce",
      desc: "General labour, helpers and utility workers for production, packaging and housekeeping.",
      items: companyConfig.serviceCategories.unskilled,
    },
  ];

  return (
    <section className="ve-section ve-content">
      <Container>
        <h1>Services</h1>
        <p className="ve-content__lead">
          We provide workforce across three skill tiers. Each deployment is
          matched to your site conditions, statutory requirements and
          shift pattern.
        </p>

        <div className="ve-content__grid">
          {groups.map((g) => (
            <div key={g.title}>
              <h2>{g.title}</h2>
              <p>{g.desc}</p>
              <ul className="ve-content__list">
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ve-content__block">
          <h2>How engagements work</h2>
          <ol className="ve-content__steps">
            <li>
              <strong>Requirement.</strong> Share role, skill mix, headcount
              and shift pattern through our enquiry form or by phone.
            </li>
            <li>
              <strong>Shortlisting.</strong> We shortlist from our verified
              worker pool and present candidates within agreed timelines.
            </li>
            <li>
              <strong>Deployment.</strong> Workers report to site with the
              required documentation. We coordinate site inductions where
              required.
            </li>
            <li>
              <strong>Ongoing support.</strong> A dedicated point of contact
              runs regular site inspections and handles escalations.
            </li>
          </ol>
        </div>
      </Container>
    </section>
  );
}
