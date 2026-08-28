import { companyConfig } from "../../config/company";
import "./MobileBottomBar.css";

/**
 * Fixed mobile action bar — Call / WhatsApp / Enquire.
 * Only shows actions that have real values in companyConfig; if a contact
 * value is still a placeholder, that action is hidden so we never link to
 * "[COMPANY_PHONE]". Enquire links to the request-workforce page.
 */
export function MobileBottomBar() {
  const { phone, whatsapp } = companyConfig.contact;
  const hasPhone = !phone.startsWith("[");
  const hasWhatsApp = !whatsapp.startsWith("[");
  const telHref = `tel:${phone}`;
  const waHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  return (
    <nav className="ve-mbb" aria-label="Quick contact actions">
      {hasPhone && (
        <a className="ve-mbb__btn" href={telHref}>
          <span className="ve-mbb__icon" aria-hidden="true">☎</span>
          Call
        </a>
      )}
      {hasWhatsApp && (
        <a className="ve-mbb__btn" href={waHref} target="_blank" rel="noopener noreferrer">
          <span className="ve-mbb__icon" aria-hidden="true">💬</span>
          WhatsApp
        </a>
      )}
      <a className="ve-mbb__btn ve-mbb__btn--primary" href="/request-workforce">
        <span className="ve-mbb__icon" aria-hidden="true">✎</span>
        Enquire
      </a>
    </nav>
  );
}
