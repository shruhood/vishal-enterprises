import { useState } from "react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { useSeo } from "../lib/seo";
import { apiPost } from "../lib/api";
import "./RequestWorkforce.css";

export function RequestWorkforce() {
  useSeo({
    title: "Request Workforce",
    description:
      "Tell us your workforce requirement — company, industry, location, headcount and deployment date. Our team responds with a structured proposal.",
    path: "/request-workforce",
  });

  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    industry: "",
    project_location: "",
    job_category: "",
    workers_needed: "",
    workforce_size: "",
    deployment_date: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    try {
      const res = await apiPost<{ ok: boolean; message: string }>("/enquiries", form);
      setStatus("success");
      setServerMsg(res.message);
    } catch (err) {
      setStatus("error");
      if (err instanceof Error) setServerMsg(err.message);
      else setServerMsg("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <section className="ve-section ve-content">
        <Container>
          <div className="ve-rf__done">
            <h1>Requirement Received</h1>
            <p>{serverMsg}</p>
            <Button as="a" href="/" variant="primary">
              Back to Home
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="ve-section ve-content">
      <Container>
        <h1>Tell Us Your Workforce Requirement</h1>
        <p className="ve-content__lead">
          Share your requirement, location and deployment timeline. Our team will
          respond with a structured workforce proposal.
        </p>

        {status === "error" && (
          <p className="ve-rf__error" role="alert">
            {serverMsg}
          </p>
        )}

        <form className="ve-rf" onSubmit={handleSubmit} noValidate>
          <div className="ve-rf__grid">
            <Field label="Company Name" name="company_name" value={form.company_name} onChange={set("company_name")} error={errors.company_name} required />
            <Field label="Contact Person" name="contact_name" value={form.contact_name} onChange={set("contact_name")} error={errors.contact_name} required />
            <Field label="Business Email" name="email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
            <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} required />
            <Field label="Industry" name="industry" value={form.industry} onChange={set("industry")} />
            <Field label="Project Location" name="project_location" value={form.project_location} onChange={set("project_location")} />
            <Field label="Job / Skill Category" name="job_category" value={form.job_category} onChange={set("job_category")} />
            <Field label="Estimated Workforce Size" name="workforce_size" value={form.workforce_size} onChange={set("workforce_size")} />
            <Field label="Required Deployment Date" name="deployment_date" type="date" value={form.deployment_date} onChange={set("deployment_date")} />
            <Field label="Workforce Required (approx. count)" name="workers_needed" type="number" value={form.workers_needed} onChange={set("workers_needed")} />
          </div>

          <div className="ve-rf__full">
            <label htmlFor="message">Requirement Details</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={set("message")}
              placeholder="Describe the roles, shift pattern, duration and any site-specific requirements."
            />
          </div>

          <div className="ve-rf__actions">
            <Button type="submit" variant="primary" disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting…" : "Submit Requirement →"}
            </Button>
          </div>
        </form>
      </Container>
    </section>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  type?: string;
  required?: boolean;
}

function Field({ label, name, value, onChange, error, type = "text", required }: FieldProps) {
  return (
    <div className="ve-rf__field">
      <label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} aria-invalid={!!error} />
      {error && (
        <span className="ve-rf__field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
