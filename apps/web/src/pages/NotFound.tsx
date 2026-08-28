import { Link } from "react-router-dom";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { useSeo } from "../lib/seo";
import "./NotFound.css";

export function NotFound() {
  useSeo({
    title: "Page Not Found",
    description: "The page you are looking for doesn't exist.",
  });

  return (
    <section className="ve-section ve-notfound">
      <Container>
        <p className="ve-notfound__code">404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for doesn&apos;t exist or has moved.</p>
        <div className="ve-hero__actions">
          <Button as="a" href="/" variant="primary">
            Back to home
          </Button>
          <Link to="/contact" className="ve-notfound__link">
            Contact us
          </Link>
        </div>
      </Container>
    </section>
  );
}
