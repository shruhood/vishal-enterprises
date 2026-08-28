import { Container } from "../components/ui/Container";
import { useSeo } from "../lib/seo";

interface PlaceholderProps {
  title: string;
  description: string;
}

/**
 * Temporary stand-in for sections not yet built in this phase
 * (About, Services, Industries, Locations, Jobs, Employers, Workers,
 * Contact). Each becomes a full page with real content/data in a later
 * phase — this keeps routing and the shell complete without building
 * the entire site now.
 */
export function Placeholder({ title, description }: PlaceholderProps) {
  useSeo({ title, description });

  return (
    <section className="ve-section">
      <Container>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>This section is planned for a future development phase.</p>
      </Container>
    </section>
  );
}
