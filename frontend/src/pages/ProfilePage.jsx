import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile } from "../api/user.api";
import UserMenu from "../components/UserMenu";
import ThemeToggle from "../components/ThemeToggle";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await updateProfile(formData);
      setUser(response.data);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ background: "var(--bg-primary)" }}>
      <header className="app-header glass">
        <Link to="/home" className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text gradient-text">SocialSphere</span>
        </Link>
        <div className="header-actions">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-card glass">
          <div className="profile-cover"></div>
          <div className="profile-info-section">
            <div className="profile-avatar-large">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <span>{user?.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            
            {!isEditing ? (
              <div className="profile-details">
                <div className="profile-header-row">
                  <h1 className="profile-name">{user?.fullName}</h1>
                  <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                </div>
                <p className="profile-username">@{user?.username}</p>
                <p className="profile-bio">{user?.bio || "No bio yet. Add one to let people know more about you!"}</p>
                
                {message && <p className="success-message">{message}</p>}
                
                <div className="profile-stats">
                  <div className="stat">
                    <strong>0</strong> <span>Following</span>
                  </div>
                  <div className="stat">
                    <strong>0</strong> <span>Followers</span>
                  </div>
                </div>
              </div>
            ) : (
              <form className="profile-edit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Bio (max 160 characters)</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength="160"
                  />
                </div>
                <div className="edit-actions">
                  <button type="button" className="btn-ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
