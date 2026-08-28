import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { useSeo } from "../lib/seo";
import "./ContentPage.css";

export function Careers() {
  useSeo({
    title: "Careers",
    description:
      "Build your career with Vishal Enterprises across industrial, technical, engineering and project environments. Submit your resume or register as a worker.",
    path: "/careers",
  });

  return (
    <section className="ve-section ve-content">
      <Container>
        <h1>Build Your Career With Vishal Enterprises</h1>
        <p className="ve-content__lead">
          Explore opportunities across industrial, technical, engineering and
          project environments. Register your details and we&apos;ll match you to
          suitable openings as they arise.
        </p>
        <div className="ve-hero__actions">
          <Button as="a" href="/jobs" variant="primary">
            Current Openings
          </Button>
          <Button as="a" href="/workers" variant="secondary">
            Submit Resume
          </Button>
        </div>

        <div className="ve-content__block ve-cta-banner">
          <h2>Why work with us</h2>
          <ul className="ve-content__list">
            <li>Placements across multiple industrial sectors and project sites.</li>
            <li>Roles matched to your skill level and experience.</li>
            <li>Ongoing coordination and support throughout engagements.</li>
            <li>Structured documentation and compliance for site deployment.</li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
