import { NavLink } from "react-router-dom";

export interface NavItem {
  label: string;
  href: string;
}

// B2B-focused public navigation. Admin removed from public nav (it lives
// behind /admin/login, not in the marketing menu).
export const primaryNavItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Projects", href: "/projects" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary">
      <ul className="ve-nav-list">
        {primaryNavItems.map((item) => (
          <li key={item.href}>
            <NavLink
              to={item.href}
              onClick={onNavigate}
              className={({ isActive }) => "ve-nav-link" + (isActive ? " is-active" : "")}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
