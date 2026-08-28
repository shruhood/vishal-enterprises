import { useEffect, useState } from "react";
import { Container } from "../components/ui/Container";
import { useSeo } from "../lib/seo";
import { apiGet } from "../lib/api";
import "./Jobs.css";

interface Job {
  id: string;
  title: string;
  industry: string | null;
  location: string | null;
  skill_level: "skilled" | "semi_skilled" | "unskilled";
  wage: string | null;
  description: string | null;
  created_at: string;
}

const SKILL_LABEL: Record<string, string> = {
  skilled: "Skilled",
  semi_skilled: "Semi-skilled",
  unskilled: "Unskilled",
};

export function Jobs() {
  useSeo({
    title: "Jobs",
    description:
      "Current job openings from Vishal Enterprises — reliable workforce placements across Gujarat and beyond.",
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ jobs: Job[] }>("/jobs")
      .then((data) => setJobs(data.jobs))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <div className="ve-jobs">
        <header className="ve-jobs__header">
          <h1>Current Openings</h1>
          <p className="ve-jobs__lead">
            Browse live job openings we are currently staffing. To apply, call
            the number below or send a manpower enquiry — our team matches you
            to the right role.
          </p>
        </header>

        {loading && <p className="ve-jobs__empty">Loading openings…</p>}
        {error && <p className="ve-jobs__empty ve-jobs__empty--error">{error}</p>}
        {!loading && !error && jobs.length === 0 && (
          <p className="ve-jobs__empty">
            No openings posted right now. Check back soon or send us your
            requirement.
          </p>
        )}

        <ul className="ve-jobs__list">
          {jobs.map((job) => (
            <li key={job.id} className="ve-jobs__card">
              <div className="ve-jobs__card-main">
                <h2 className="ve-jobs__title">{job.title}</h2>
                <div className="ve-jobs__meta">
                  {job.industry && <span className="ve-tag">{job.industry}</span>}
                  {job.location && <span className="ve-tag">{job.location}</span>}
                  <span className="ve-tag ve-tag--skill">
                    {SKILL_LABEL[job.skill_level]}
                  </span>
                </div>
                {job.wage && (
                  <p className="ve-jobs__wage">Wage: {job.wage}</p>
                )}
                {job.description && (
                  <p className="ve-jobs__desc">{job.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
