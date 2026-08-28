import { NavLink } from "react-router-dom";

export interface NavItem {
  label: string;
  href: string;
}

export const primaryNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Locations", href: "/locations" },
  { label: "Jobs", href: "/jobs" },
  { label: "For Employers", href: "/employers" },
  { label: "For Workers", href: "/workers" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin/login" },
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
              end={item.href === "/"}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
