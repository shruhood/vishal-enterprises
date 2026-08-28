import { Container } from "../components/ui/Container";
import { useSeo } from "../lib/seo";
import "./ContentPage.css";

export function About() {
  useSeo({
    title: "About",
    description:
      "About Vishal Enterprises — a government-registered workforce firm serving Daman, Vapi, Bhilad, Silvassa and surrounding industrial areas.",
    path: "/about",
  });

  return (
    <section className="ve-section ve-content">
      <Container>
        <h1>About Vishal Enterprises</h1>
        <p className="ve-content__lead">
          Vishal Enterprises is a workforce solutions firm providing skilled,
          semi-skilled and unskilled manpower to industries across the
          Daman, Vapi, Bhilad and Silvassa industrial belt. We are a
          government-registered firm, and our work is guided by responsible
          management, transparent processes and continuous site support.
        </p>

        <div className="ve-content__grid">
          <div>
            <h2>Who we are</h2>
            <p>
              We supply dependable workforce to manufacturing units,
              warehouses, logistics operations, and facility management
              sites. Our team brings more than a decade of hands-on
              experience in industrial staffing — from understanding
              shift-based production needs to running large multi-site
              deployments.
            </p>
          </div>
          <div>
            <h2>How we work</h2>
            <p>
              Every deployment starts with a clear understanding of the
              employer&apos;s requirement — number of workers, skill mix,
              shift pattern, statutory requirements and site-specific
              conditions. From there, we mobilise workforce, run
              on-site inductions where required, and stay engaged with
              regular inspections and a dedicated point of contact.
            </p>
          </div>
          <div>
            <h2>Compliance</h2>
            <p>
              We operate as a registered workforce firm and support
              statutory compliance including PF and ESIC as applicable.
              Worker documentation, attendance and statutory records
              are maintained in line with prevailing labour regulations.
            </p>
          </div>
          <div>
            <h2>Service areas</h2>
            <p>
              Daman, Vapi, Bhilad, Silvassa and nearby industrial
              areas. For deployments outside these regions, please
              contact us with the requirement and we will assess
              feasibility.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
