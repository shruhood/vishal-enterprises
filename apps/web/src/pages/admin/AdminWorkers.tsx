import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../../lib/api";
import "./AdminTable.css";

interface Worker {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  skill_level: string;
  status: string;
  location_free: string | null;
  created_at: string;
}

const STATUSES = [
  "registered",
  "verified",
  "available",
  "shortlisted",
  "assigned",
  "inactive",
];

export function AdminWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ workers: Worker[] }>("/admin/workers?limit=100")
      .then((d) => setWorkers(d.workers))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await apiPatch(`/admin/workers/${id}/status`, { status });
      setWorkers((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status } : w))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  if (loading) return <p>Loading workers…</p>;
  if (error) return <p className="ve-admin-error">{error}</p>;

  return (
    <div>
      <h1>Workers ({workers.length})</h1>
      <table className="ve-admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Skill</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((w) => (
            <tr key={w.id}>
              <td>
                <strong>{w.full_name}</strong>
                {w.email && <br />}
                {w.email && <small>{w.email}</small>}
              </td>
              <td>{w.phone}</td>
              <td>{w.skill_level.replace("_", "-")}</td>
              <td>{w.location_free || "—"}</td>
              <td>
                <select
                  value={w.status}
                  onChange={(e) => updateStatus(w.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
