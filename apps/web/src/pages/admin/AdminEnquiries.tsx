import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../../lib/api";
import "./AdminTable.css";

interface Enquiry {
  id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string | null;
  message: string;
  status: string;
  created_at: string;
}

const STATUSES = ["new", "contacted", "converted", "closed"];

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ enquiries: Enquiry[] }>("/admin/enquiries?limit=100")
      .then((d) => setEnquiries(d.enquiries))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await apiPatch(`/admin/enquiries/${id}/status`, { status });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  if (loading) return <p>Loading enquiries…</p>;
  if (error) return <p className="ve-admin-error">{error}</p>;

  return (
    <div>
      <h1>Enquiries ({enquiries.length})</h1>
      <table className="ve-admin-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Requirement</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((e) => (
            <tr key={e.id}>
              <td>
                <strong>{e.company_name}</strong>
                <br />
                <small>{e.contact_name}</small>
              </td>
              <td>
                {e.phone}
                {e.email && (
                  <>
                    <br />
                    <small>{e.email}</small>
                  </>
                )}
              </td>
              <td className="ve-admin-table__msg">{e.message}</td>
              <td>
                <select
                  value={e.status}
                  onChange={(ev) => updateStatus(e.id, ev.target.value)}
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
