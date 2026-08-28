import { useEffect, useState, type FormEvent } from "react";
import { apiGet, apiPost, apiDelete } from "../../lib/api";
import { Button } from "../../components/ui/Button";
import "./AdminTable.css";

interface Job {
  id: string;
  title: string;
  industry: string | null;
  location: string | null;
  skill_level: string;
  wage: string | null;
  is_published: number;
  created_at: string;
}

const SKILL_LEVELS = ["skilled", "semi_skilled", "unskilled"];

export function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState("skilled");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [wage, setWage] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);

  async function load() {
    try {
      const d = await apiGet<{ jobs: Job[] }>("/admin/jobs?include_unpublished=true");
      setJobs(d.jobs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await apiPost("/admin/jobs", {
        title,
        skill_level: skill,
        industry: industry || undefined,
        location: location || undefined,
        wage: wage || undefined,
        description: description || undefined,
        is_published: published,
      });
      setTitle("");
      setIndustry("");
      setLocation("");
      setWage("");
      setDescription("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }

  async function togglePublish(job: Job) {
    try {
      await apiPost(`/admin/jobs/${job.id}`, {
        is_published: job.is_published ? 0 : 1,
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this job?")) return;
    try {
      await apiDelete(`/admin/jobs/${id}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (loading) return <p>Loading jobs…</p>;

  return (
    <div>
      <h1>Job Listings ({jobs.length})</h1>
      {error && <p className="ve-admin-error">{error}</p>}

      <details className="ve-admin-create">
        <summary>{creating ? "Creating…" : "＋ Add new job"}</summary>
        <form onSubmit={handleCreate} className="ve-admin-create__form">
          <label>
            Title *
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Skill level *
            <select value={skill} onChange={(e) => setSkill(e.target.value)}>
              {SKILL_LEVELS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", "-")}
                </option>
              ))}
            </select>
          </label>
          <label>
            Industry
            <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Construction" />
          </label>
          <label>
            Location
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Vapi" />
          </label>
          <label>
            Wage
            <input value={wage} onChange={(e) => setWage(e.target.value)} placeholder="e.g. ₹18000/month" />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>
          <label className="ve-admin-create__check">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish immediately
          </label>
          <Button type="submit" disabled={creating}>
            {creating ? "Saving…" : "Save job"}
          </Button>
        </form>
      </details>

      <table className="ve-admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Industry</th>
            <th>Location</th>
            <th>Wage</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td>
                <strong>{j.title}</strong>
                <br />
                <small>{j.skill_level.replace("_", "-")}</small>
              </td>
              <td>{j.industry || "—"}</td>
              <td>{j.location || "—"}</td>
              <td>{j.wage || "—"}</td>
              <td>{j.is_published ? "✓ Yes" : "✗ No"}</td>
              <td>
                <button onClick={() => togglePublish(j)} className="ve-admin-btn">
                  {j.is_published ? "Unpublish" : "Publish"}
                </button>{" "}
                <button onClick={() => remove(j.id)} className="ve-admin-btn ve-admin-btn--danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
