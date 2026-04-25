import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/auth.css";

const brandFeatures = [
  { icon: "📸", text: "Share photos and videos with the people you care about" },
  { icon: "💬", text: "Chat with friends instantly, in real time" },
  { icon: "🔔", text: "Stay updated — never miss a post or message" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // clear error as the user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      await login(form);
      navigate("/home");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Something went wrong — please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <aside className="auth-brand">
        <Link to="/" className="brand-logo">
          <span className="brand-logo-icon">◈</span>
          <span className="brand-logo-text">SocialSphere</span>
        </Link>
        <h1 className="brand-headline">
          Good to see
          <br />
          you again.
        </h1>
        <p className="brand-sub">
          Log in and pick up right where you left off — your posts, friends, and conversations are waiting.
        </p>
        <div className="brand-features">
          {brandFeatures.map((f) => (
            <div key={f.text} className="brand-feature">
              <span className="brand-feature-icon">{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Right form panel */}
      <section className="auth-form-panel">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-subtitle">We've missed you! Enter your details below</p>
          </div>

          {error && (
            <div className="form-error" role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${error ? "input-error" : ""}`}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`form-input ${error ? "input-error" : ""}`}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "Log in"}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Join now — it's free</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
