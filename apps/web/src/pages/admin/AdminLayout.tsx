import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../lib/api";
import "./AdminLayout.css";

export function AdminLayout() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    apiGet<{ authenticated: boolean }>("/auth/me")
      .then((d) => setAuthed(d.authenticated))
      .catch(() => setAuthed(false));
  }, []);

  async function logout() {
    await apiPost("/auth/logout", {}).catch(() => {});
    navigate("/admin/login");
  }

  if (authed === null) {
    return <div className="ve-admin__loading">Checking session…</div>;
  }
  if (authed === false) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="ve-admin">
      <aside className="ve-admin__nav">
        <div className="ve-admin__brand">Vishal Admin</div>
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/workers">Workers</Link>
          <Link to="/admin/enquiries">Enquiries</Link>
          <Link to="/admin/jobs">Jobs</Link>
          <button onClick={logout} className="ve-admin__logout">
            Log out
          </button>
        </nav>
      </aside>
      <main className="ve-admin__main">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminDashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Vishal Enterprises admin panel.</p>
      <ul className="ve-admin__cards">
        <li>
          <Link to="/admin/workers">Manage Workers</Link>
        </li>
        <li>
          <Link to="/admin/enquiries">Review Enquiries</Link>
        </li>
        <li>
          <Link to="/admin/jobs">Manage Job Listings</Link>
        </li>
      </ul>
    </div>
  );
}
