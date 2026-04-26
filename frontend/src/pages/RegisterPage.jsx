import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/auth.css";

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);

const brandFeatures = [
  { 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    ), 
    text: "Share your best moments with a vibrant community" 
  },
  { 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ), 
    text: "Connect with people who share your interests" 
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [step, setStep] = useState(1); // 1: Info, 2: Avatar
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.username || !form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("fullName", form.fullName);
      data.append("username", form.username);
      data.append("email", form.email);
      data.append("password", form.password);
      if (avatar) data.append("avatar", avatar);

      await register(data);
      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-brand">
        <Link to="/" className="brand-logo">
          <span className="brand-logo-icon"><LogoIcon /></span>
          <span className="brand-logo-text">SocialSphere</span>
        </Link>
        <h1 className="brand-headline">
          {step === 1 ? "Join the\ncommunity." : "Final step."}
        </h1>
        <p className="brand-sub">
          {step === 1 
            ? "Create your profile, start sharing your stories, and discover what the world is talking about."
            : "First impressions matter! Add a profile picture so people recognize you."}
        </p>
        <div className="brand-features">
          {brandFeatures.map((f, i) => (
            <div key={i} className="brand-feature">
              <span className="brand-feature-icon">{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </aside>

      <section className="auth-form-panel">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <h2 className="auth-form-title">{step === 1 ? "Create account" : "Profile Picture"}</h2>
            <p className="auth-form-subtitle">
              {step === 1 ? "Join thousands of others today" : "Show the world who you are (or skip for now)"}
            </p>
          </div>

          {error && (
            <div className="form-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
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
                  placeholder="johndoe"
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
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn-submit">
                Continue
              </button>
            </form>
          ) : (
            <div className="avatar-step">
              <div className="avatar-preview-large">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" />
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>
              
              <label className="btn-outline" style={{ marginBottom: '24px', cursor: 'pointer', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                {avatar ? "Change Photo" : "Upload Photo"}
              </label>

              <div className="step-actions" style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn-ghost" 
                  onClick={() => setStep(1)} 
                  style={{ flex: 1 }}
                  disabled={loading}
                >
                  Back
                </button>
                <button 
                  className="btn-submit" 
                  onClick={handleSubmit} 
                  style={{ flex: 2, marginTop: 0 }}
                  disabled={loading}
                >
                  {loading ? "Creating account..." : avatar ? "Finish" : "Skip & Finish"}
                </button>
              </div>
            </div>
          )}

          <div className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Log in here</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
