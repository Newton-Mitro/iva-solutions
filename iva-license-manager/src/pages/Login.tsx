import { FormEvent, useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { createAccount, login, type UserRole } from "../services/auth.service";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("Client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await createAccount({
          email,
          password,
          user_name: userName,
          phone,
          role,
        });
      } else {
        await login(email, password);
      }
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-logo">
          <ShieldCheck size={28} />
        </div>
        <h1>IVA License Manager</h1>
        <p>
          {mode === "login"
            ? "Sign in with your Firebase admin account."
            : "Create a Firebase account with a role."}
        </p>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <>
              <label>
                User name
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </label>
              <label>
                Role
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Client">Client</option>
                </select>
              </label>
            </>
          )}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="primary-button full" disabled={loading}>
            <KeyRound size={15} />
            {loading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
          <button
            type="button"
            className="secondary-button full"
            onClick={() => {
              setMode((current) => (current === "login" ? "signup" : "login"));
              setError("");
            }}
          >
            {mode === "login" ? "Create account" : "Back to sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
