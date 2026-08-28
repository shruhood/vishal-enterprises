import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { FormField } from "../../components/forms/FormField";
import { FormStatus } from "../../components/forms/FormStatus";
import { apiPost } from "../../lib/api";
import "./Login.css";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      await apiPost("/auth/login", { email, password });
      navigate("/admin");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <Container>
      <div className="ve-login">
        <h1>Admin Login</h1>
        <p className="ve-login__hint">
          Sign in to manage workers, enquiries, and job listings.
        </p>

        <FormStatus variant={status} errorMessage={errorMsg} />

        <form onSubmit={handleSubmit} className="ve-login__form">
          <FormField label="Email" required>
            {(id) => (
              <input
                id={id}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            )}
          </FormField>

          <FormField label="Password" required>
            {(id) => (
              <input
                id={id}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            )}
          </FormField>

          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
