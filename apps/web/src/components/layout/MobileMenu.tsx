import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { primaryNavItems } from "./Navigation";
import { Button } from "../ui/Button";
import { companyConfig } from "../../config/company";
import "./MobileMenu.css";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape and trap basic focus inside the panel while open
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ve-mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="ve-mobile-menu__backdrop" onClick={onClose} />
      <div className="ve-mobile-menu__panel" ref={panelRef}>
        <div className="ve-mobile-menu__header">
          <span className="ve-mobile-menu__title">Menu</span>
          <button
            type="button"
            className="ve-mobile-menu__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <ul className="ve-mobile-menu__list">
          {primaryNavItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  "ve-mobile-menu__link" + (isActive ? " is-active" : "")
                }
                end={item.href === "/"}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="ve-mobile-menu__actions">
          <Button as="a" href="/employers" variant="primary" onClick={onClose}>
            {companyConfig.messaging.primaryCta}
          </Button>
          <Button as="a" href="/workers" variant="secondary" onClick={onClose}>
            {companyConfig.messaging.secondaryCta}
          </Button>
        </div>
      </div>
    </div>
  );
}
