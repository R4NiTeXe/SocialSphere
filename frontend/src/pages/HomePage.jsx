import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle";

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="app-container">
      <header className="app-header glass">
        <Link to="/home" className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text gradient-text">SocialSphere</span>
        </Link>
        <div className="header-actions">
          <ThemeToggle />
          <button onClick={handleLogout} className="btn-ghost">
            Log out
          </button>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "64px" }}>👋</span>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>
          Hey, <span className="gradient-text">{user?.fullName}</span>!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "18px" }}>
          You're logged in as @{user?.username}
        </p>
        <div 
          className="card" 
          style={{ 
            marginTop: "24px", 
            maxWidth: "400px",
            background: "var(--bg-elevated)" 
          }}
        >
          <p style={{ color: "var(--text-muted)" }}>
            The full feed and dashboard features are coming soon. For now, enjoy the 
            brand new <strong>Bright Mode</strong>! ✨
          </p>
        </div>
      </main>
    </div>
  );
}
