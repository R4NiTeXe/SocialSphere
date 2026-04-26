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
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        bio: user.bio || "",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("bio", formData.bio);
      if (avatar) data.append("avatar", avatar);

      const response = await updateProfile(data);
      setUser(response.data);
      setIsEditing(false);
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ background: "var(--bg-primary)" }}>
      <header className="app-header glass">
        <Link to="/home" className="logo">
          <span className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </span>
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
          <div className="profile-content">
            <div className="profile-avatar-container">
              <div className="profile-avatar-large">
                {avatarPreview ? (
                  <img src={avatarPreview.startsWith('blob:') ? avatarPreview : `${avatarPreview}?t=${new Date().getTime()}`} alt={user?.username} />
                ) : (
                  <span>{user?.username?.charAt(0).toUpperCase()}</span>
                )}
                {isEditing && (
                  <label className="avatar-upload-overlay">
                    <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </label>
                )}
              </div>
            </div>
            
            {!isEditing ? (
              <div className="profile-details">
                <div className="profile-header-row">
                  <h1 className="profile-name">{user?.fullName}</h1>
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                    </svg>
                    Edit Profile
                  </button>
                </div>
                <p className="profile-username">@{user?.username}</p>
                <p className="profile-bio">{user?.bio || "No bio yet"}</p>
                
                {message && <p className="success-message">{message}</p>}
                
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
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength="160"
                  />
                </div>
                <div className="edit-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save" disabled={loading}>
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
