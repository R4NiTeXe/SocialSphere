import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/index.css";
import "../App.css";

export default function LandingPage() {
  const [serverReady, setServerReady] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then(() => {
        setServerReady(true);
        setChecking(false);
      })
      .catch(() => {
        setServerReady(false);
        setChecking(false);
      });
  }, []);

  return (
    <div className="app-container">
      {/* Top navigation bar */}
      <header className="app-header glass">
        <Link to="/" className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text gradient-text">SocialSphere</span>
        </Link>
        <div className="header-actions">
          <ThemeToggle />
          <Link to="/login">
            <button className="btn-ghost">Log in</button>
          </Link>
          <Link to="/register">
            <button className="btn-primary">Join now</button>
          </Link>
        </div>
      </header>

      {/* Main hero section */}
      <main className="hero">
        <div className="hero-tag">✨ Connect · Share · Discover</div>

        <h1 className="hero-title">
          A place to share your
          <br />
          <span className="gradient-text">story with the world.</span>
        </h1>

        <p className="hero-subtitle">
          Post photos, chat with friends, follow people you love, and see
          what's happening around you — all in one place.
        </p>

        <div className="cta-group">
          <Link to="/register">
            <button className="btn-primary btn-lg">Get started — it's free</button>
          </Link>
          <Link to="/login">
            <button className="btn-outline btn-lg">Log in</button>
          </Link>
        </div>

        <div className="status-pill">
          {checking && (
            <>
              <span className="status-dot dot-loading" />
              <span>Connecting to the world…</span>
            </>
          )}
          {!checking && serverReady && (
            <>
              <span className="status-dot dot-online" />
              <span>We're connected and ready!</span>
            </>
          )}
          {!checking && !serverReady && (
            <>
              <span className="status-dot dot-offline" />
              <span>Oops! We're having trouble connecting. Try again soon!</span>
            </>
          )}
        </div>

        <div className="features-grid">
          <div className="feature-card card">
            <span className="feature-icon">📸</span>
            <h3>Share photos & videos</h3>
            <p>Post what's on your mind. Add a caption, tag friends, and share the moment.</p>
          </div>
          <div className="feature-card card">
            <span className="feature-icon">💬</span>
            <h3>Chat with friends</h3>
            <p>Send messages instantly. Your conversations happen in real time.</p>
          </div>
          <div className="feature-card card">
            <span className="feature-icon">📊</span>
            <h3>See your activity</h3>
            <p>Find out who's liking your posts, following you, and engaging with your content.</p>
          </div>
          <div className="feature-card card">
            <span className="feature-icon">🔔</span>
            <h3>Never miss a moment</h3>
            <p>Get notified the second something interesting happens on your profile.</p>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <span className="muted">Made with ❤️ · SocialSphere © 2026</span>
      </footer>
    </div>
  );
}
