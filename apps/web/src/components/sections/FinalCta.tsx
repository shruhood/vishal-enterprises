import { Button } from "../ui/Button";
import { siteImages } from "../../content/site";
import "./FinalCta.css";

export function FinalCta() {
  return (
    <section className="ve-final" aria-labelledby="final-title">
      <div className="ve-final__media" aria-hidden="true">
        <img src={siteImages.cta} alt="" loading="lazy" className="ve-final__img" />
        <div className="ve-final__overlay" />
      </div>
      <div className="ve-final__inner">
        <h2 id="final-title" className="ve-final__title">
          Need the Right Workforce for Your Next Project?
        </h2>
        <p className="ve-final__sub">
          Tell us your requirement, location and deployment timeline. Our team
          will respond with a structured workforce proposal.
        </p>
        <div className="ve-final__actions">
          <Button as="a" href="/request-workforce" variant="primary">
            Request Workforce &rarr;
          </Button>
          <Button as="a" href="/contact" variant="secondary">
            Contact Our Team &rarr;
          </Button>
        </div>
      </div>
    </section>
  );
}
