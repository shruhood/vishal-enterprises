import { Link } from "react-router-dom";
import { Container } from "../ui/Container";
import { companyConfig } from "../../config/company";
import { primaryNavItems } from "./Navigation";
import "./Footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ve-footer">
      <Container>
        <div className="ve-footer__grid">
          <div>
            <div className="ve-footer__brand">{companyConfig.name}</div>
            <p className="ve-footer__tagline">{companyConfig.messaging.headline}</p>
            <p className="ve-footer__legal">{companyConfig.legal.registration}</p>
          </div>

          <div>
            <h2 className="ve-footer__heading">Navigate</h2>
            <ul className="ve-footer__list">
              {primaryNavItems.map((item) => (
                <li key={item.href}>
                  <Link to={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="ve-footer__heading">Service Areas</h2>
            <ul className="ve-footer__list">
              {companyConfig.serviceAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="ve-footer__heading">Contact</h2>
            <ul className="ve-footer__list">
              <li>{companyConfig.contact.phone}</li>
              <li>{companyConfig.contact.whatsapp}</li>
              <li>{companyConfig.contact.email}</li>
              <li>{companyConfig.contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="ve-footer__bottom">
          <span>
            © {year} {companyConfig.name}. All rights reserved.
          </span>
        </div>
      </Container>
    </footer>
  );
}
