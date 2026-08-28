import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { ThemeToggle } from "./ThemeToggle";
import { companyConfig } from "../../config/company";
import "./Header.css";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="ve-header">
      <Container>
        <div className="ve-header__row">
          <Link to="/" className="ve-header__brand" aria-label={`${companyConfig.name} home`}>
            <span className="ve-header__brand-mark" aria-hidden="true" />
            <span className="ve-header__brand-name">{companyConfig.name}</span>
          </Link>

          <div className="ve-header__nav-desktop">
            <Navigation />
          </div>

          <div className="ve-header__actions">
            <div className="ve-header__theme-desktop">
              <ThemeToggle />
            </div>
            <div className="ve-header__cta-desktop">
              <Button as="a" href="/request-workforce" variant="primary">
                Request Workforce
              </Button>
            </div>
            <button
              type="button"
              className="ve-header__menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
            >
              <span className="ve-header__menu-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
