import { type FormEvent, useState } from "react";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { FormField } from "../components/forms/FormField";
import { FormStatus } from "../components/forms/FormStatus";
import { ApiError, apiPost } from "../lib/api";
import { useSeo } from "../lib/seo";
import "./Workers.css";

type FormState = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  full_name?: string;
  phone?: string;
  email?: string;
  location?: string;
  skill_level?: string;
  experience_years?: string;
  skills?: string;
}

export function Workers() {
  useSeo({
    title: "Register as a Worker",
    description:
      "Register with Vishal Enterprises to be considered for skilled, semi-skilled and unskilled workforce opportunities in Daman, Vapi, Bhilad and Silvassa.",
    path: "/workers",
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

    const pf = fd.get("pf_applicable") === "on";
    const esic = fd.get("esic_applicable") === "on";
    const expRaw = String(fd.get("experience_years") ?? "").trim();
    const expNum = expRaw === "" ? null : Number(expRaw);

    const payload = {
      full_name: String(fd.get("full_name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      location: String(fd.get("location") ?? "").trim(),
      skill_level: String(fd.get("skill_level") ?? "").trim(),
      experience_years: expNum,
      skills: String(fd.get("skills") ?? "").trim(),
      pf_applicable: pf,
      esic_applicable: esic,
    };

    try {
      const res = await apiPost<{
        ok: boolean;
        message: string;
        worker_id: string;
        skills_recorded: number;
      }>("/workers/register", payload);
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
    <section className="ve-section ve-workers">
      <Container>
        <div className="ve-workers__intro">
          <h1>Register as a Worker</h1>
          <p>
            Add your details below and our team will get in touch when a
            suitable opening arises. Fields marked with <span aria-hidden="true">*</span>{" "}
            are required.
          </p>
          <ul className="ve-workers__highlights">
            <li>Continuous workforce opportunities across manufacturing, logistics and facility management</li>
            <li>PF &amp; ESIC support as applicable</li>
            <li>Regular site inspections and a dedicated point of contact</li>
          </ul>
        </div>

        {state === "success" ? (
          <FormStatus variant="success">{successMessage}</FormStatus>
        ) : null}
        {state === "error" && Object.keys(errors).length === 0 ? (
          <FormStatus
            variant="error"
            errorMessage="Something went wrong submitting your registration. Please try again or call us directly."
          />
        ) : null}

        {state !== "success" ? (
          <form className="ve-form" onSubmit={handleSubmit} noValidate>
            <div className="ve-form__row">
              <FormField
                label="Full name"
                required
                error={errors.full_name}
              >
                {(id, describedBy) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    maxLength={200}
                    required
                  />
                )}
              </FormField>

              <FormField label="Phone" required error={errors.phone}>
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
            </div>

            <div className="ve-form__row">
              <FormField label="Email" hint="Optional" error={errors.email}>
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

              <FormField label="Location" hint="Town / city you can report to" error={errors.location}>
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
              <FormField label="Skill level" required error={errors.skill_level}>
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

              <FormField label="Experience (years)" error={errors.experience_years}>
                {(id, describedBy) => (
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    name="experience_years"
                    type="number"
                    min={0}
                    max={60}
                    defaultValue={0}
                  />
                )}
              </FormField>
            </div>

            <FormField
              label="Skills"
              hint="Comma separated — e.g. Welder, Forklift, Packaging"
              error={errors.skills}
            >
              {(id, describedBy) => (
                <input
                  id={id}
                  aria-describedby={describedBy}
                  name="skills"
                  type="text"
                  maxLength={500}
                />
              )}
            </FormField>

            <fieldset className="ve-form__fieldset">
              <legend>Statutory Benefits (optional)</legend>
              <label className="ve-form__check">
                <input type="checkbox" name="pf_applicable" />
                <span>PF applicable</span>
              </label>
              <label className="ve-form__check">
                <input type="checkbox" name="esic_applicable" />
                <span>ESIC applicable</span>
              </label>
            </fieldset>

            <Button type="submit" variant="primary" disabled={state === "submitting"}>
              {state === "submitting" ? "Submitting..." : "Register"}
            </Button>
          </form>
        ) : null}
      </Container>
    </section>
  );
}
