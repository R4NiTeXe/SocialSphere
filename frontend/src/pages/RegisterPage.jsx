import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/auth.css";

const brandFeatures = [
  { icon: "🌍", text: "Connect with people from around the world" },
  { icon: "📸", text: "Share your photos, videos, and everyday moments" },
  { icon: "📊", text: "See how your posts are doing with your activity stats" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, username, email, password } = form;
    if (!fullName || !username || !email || !password) {
      setError("Please fill in all the fields");
      return;
    }
    if (password.length < 6) {
      setError("Password needs to be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(form);
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
          Join millions of
          <br />
          people sharing
          <br />
          their world.
        </h1>
        <p className="brand-sub">
          Create your free account in under a minute and start connecting with people, sharing moments, and building your community.
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
            <h2 className="auth-form-title">Join SocialSphere</h2>
            <p className="auth-form-subtitle">It's free and takes less than a minute</p>
          </div>

          {error && (
            <div className="form-error" role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Alex Johnson"
                value={form.fullName}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="alexj"
                value={form.username}
                onChange={handleChange}
                className="form-input"
              />
            </div>

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
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password <span className="label-hint">(at least 6 characters)</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "Join now"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
