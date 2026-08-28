import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { useSeo } from "../lib/seo";
import { companyConfig } from "../config/company";
import "./ContentPage.css";

export function Contact() {
  useSeo({
    title: "Contact",
    description:
      "Get in touch with Vishal Enterprises — phone, WhatsApp, email and office address.",
    path: "/contact",
  });

  return (
    <section className="ve-section ve-content">
      <Container>
        <h1>Contact</h1>
        <p className="ve-content__lead">
          Reach out to request workforce for your industry, or to register
          as a worker. We respond to enquiries within one business day.
        </p>

        <div className="ve-content__grid">
          <div>
            <h2>Phone</h2>
            <p>
              For urgent requirements or to follow up on an existing
              enquiry.
            </p>
            <p>
              <a href={`tel:${companyConfig.contact.phone}`}>
                {companyConfig.contact.phone}
              </a>
            </p>
          </div>
          <div>
            <h2>WhatsApp</h2>
            <p>Send requirement details, headcount and location.</p>
            <p>
              <a
                href={`https://wa.me/${companyConfig.contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {companyConfig.contact.whatsapp}
              </a>
            </p>
          </div>
          <div>
            <h2>Email</h2>
            <p>For written enquiries, requirement briefs, or documents.</p>
            <p>
              <a href={`mailto:${companyConfig.contact.email}`}>
                {companyConfig.contact.email}
              </a>
            </p>
          </div>
          <div>
            <h2>Office</h2>
            <p>{companyConfig.contact.address}</p>
          </div>
        </div>

        <div className="ve-content__block ve-cta-banner">
          <h2>Ready to get started?</h2>
          <p>
            If you&apos;re an employer, send a manpower request. If
            you&apos;re a worker, register your details and we&apos;ll be in
            touch.
          </p>
          <div className="ve-hero__actions">
            <Button as="a" href="/employers" variant="primary">
              {companyConfig.messaging.primaryCta}
            </Button>
            <Button as="a" href="/workers" variant="secondary">
              {companyConfig.messaging.secondaryCta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
