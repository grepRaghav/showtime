import { type FormEvent, useState } from "react";
import { api, type User } from "../lib/api";

export default function Login({
  onLogin,
  onSwitchToSignup,
}: {
  onLogin: (user: User) => void;
  onSwitchToSignup?: () => void;
}) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await api.login(email, password);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-heading">
          <span className="eyebrow">SHOWTIME / AUTH</span>
          <h1>Sign in</h1>
          <p>Access events, bookings and payment records.</p>
        </div>

        <form onSubmit={submit} className="form">
          <label>
            EMAIL
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            PASSWORD
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button className="primary-button" disabled={loading}>
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </button>
        </form>

        <div className="login-demo">
          {onSwitchToSignup && (
            <div style={{ marginBottom: "0.75rem" }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60a5fa",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontWeight: 600,
                }}
              >
                Create Account
              </button>
            </div>
          )}
          DEMO ACCESS<br />
          <code>admin@example.com</code><br />
          <code>password123</code>
        </div>
      </div>
    </div>
  );
}
