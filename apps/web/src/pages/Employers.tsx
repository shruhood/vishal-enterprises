import { type FormEvent, useState } from "react";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { FormField } from "../components/forms/FormField";
import { FormStatus } from "../components/forms/FormStatus";
import { ApiError, apiPost } from "../lib/api";
import { useSeo } from "../lib/seo";
import { companyConfig } from "../config/company";
import "./Employers.css";

type FormState = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  company_name?: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  industry?: string;
  location?: string;
  skill_level?: string;
  workers_needed?: string;
  message?: string;
}

export function Employers() {
  useSeo({
    title: "Request Manpower",
    description:
      "Tell us what workforce you need and we will get back with availability and next steps.",
    path: "/employers",
  });

  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrors({});
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      company_name: String(fd.get("company_name") ?? "").trim(),
      contact_name: String(fd.get("contact_name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      industry: String(fd.get("industry") ?? "").trim(),
      location: String(fd.get("location") ?? "").trim(),
      skill_level: String(fd.get("skill_level") ?? "").trim(),
      workers_needed: Number(fd.get("workers_needed") ?? 1),
      message: String(fd.get("message") ?? "").trim(),
    };

    try {
      const res = await apiPost<{
        ok: boolean;
        message: string;
        enquiry_id: string;
      }>("/enquiries", payload);
      setSuccessMessage(res.message);
      setState("success");
      form.reset();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors((err.fields as FieldErrors) ?? {});
        setState("error");
      } else {
        setState("error");
      }
    }
  }

  return (
    <section className="ve-section ve-employers">
      <Container>
        <div className="ve-employers__intro">
          <h1>Request Manpower</h1>
          <p>
            Share the basics of what you need. Our team will respond with
            availability, indicative timelines and next steps. Submissions are
            reviewed within one business day.
          </p>
        </div>

        {state === "success" ? (
          <FormStatus variant="success">{successMessage}</FormStatus>
        ) : null}
        {state === "error" && Object.keys(errors).length === 0 ? (
          <FormStatus
            variant="error"
            errorMessage="Something went wrong submitting your request. Please try again or call us directly."
          />
        ) : null}

        {state !== "success" ? (
          <form className="ve-form" onSubmit={handleSubmit} noValidate>
            <div className="ve-form__row">
              <FormField
                label="Company name"
                required
                error={errors.company_name}
              >
                {(id, describedBy) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    name="company_name"
                    type="text"
                    autoComplete="organization"
                    maxLength={200}
                    required
                  />
                )}
              </FormField>

              <FormField
                label="Contact person"
                required
                error={errors.contact_name}
              >
                {(id, describedBy) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    name="contact_name"
                    type="text"
                    autoComplete="name"
                    maxLength={200}
                    required
                  />
                )}
              </FormField>
            </div>

            <div className="ve-form__row">
              <FormField
                label="Phone"
                required
                hint="Include country/STD code if outside India"
                error={errors.phone}
              >
                {(id, describedBy) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={20}
                    required
                  />
                )}
              </FormField>

              <FormField
                label="Email"
                hint="Optional"
                error={errors.email}
              >
                {(id, describedBy) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={200}
                  />
                )}
              </FormField>
            </div>

            <div className="ve-form__row">
              <FormField label="Industry" error={errors.industry}>
                {(id, describedBy) => (
                  <select
                    id={id}
                    aria-describedby={describedBy}
                    name="industry"
                    defaultValue=""
                  >
                    <option value="">Select industry</option>
                    {companyConfig.industries.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
              </FormField>

              <FormField label="Location" error={errors.location}>
                {(id, describedBy) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    name="location"
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Daman, Vapi, Silvassa"
                  />
                )}
              </FormField>
            </div>

            <div className="ve-form__row">
              <FormField
                label="Skill level"
                required
                error={errors.skill_level}
              >
                {(id, describedBy) => (
                  <select
                    id={id}
                    aria-describedby={describedBy}
                    name="skill_level"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select skill level
                    </option>
                    <option value="skilled">Skilled</option>
                    <option value="semi_skilled">Semi-skilled</option>
                    <option value="unskilled">Unskilled</option>
                  </select>
                )}
              </FormField>

              <FormField
                label="Workers needed"
                required
                error={errors.workers_needed}
              >
                {(id, describedBy) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    name="workers_needed"
                    type="number"
                    min={1}
                    max={10000}
                    defaultValue={1}
                    required
                  />
                )}
              </FormField>
            </div>

            <FormField
              label="Additional details"
              hint="Shift timings, duration, specific skill requirements, etc."
              error={errors.message}
            >
              {(id, describedBy) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  name="message"
                  maxLength={2000}
                  rows={5}
                />
              )}
            </FormField>

            <Button type="submit" variant="primary" disabled={state === "submitting"}>
              {state === "submitting" ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        ) : null}
      </Container>
    </section>
  );
}
