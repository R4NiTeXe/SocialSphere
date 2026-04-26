import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile, getUserProfile, toggleFollow } from "../api/user.api";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, setUser: setCurrentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  const [formData, setFormData] = useState({ fullName: "", bio: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [username, currentUser]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const targetUsername = username || currentUser?.username;
      if (!targetUsername) return;

      const response = await getUserProfile(targetUsername);
      setProfileUser(response.data);
      setIsOwnProfile(response.data.username === currentUser?.username);
      
      setFormData({
        fullName: response.data.fullName,
        bio: response.data.bio || "",
      });
      setAvatarPreview(response.data.avatar || "");
      setCoverPreview(response.data.coverImage || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleFollow = async () => {
    try {
      const response = await toggleFollow(profileUser._id);
      setProfileUser({
        ...profileUser,
        isFollowing: response.data.isFollowing,
        followersCount: response.data.isFollowing 
          ? profileUser.followersCount + 1 
          : profileUser.followersCount - 1
      });
    } catch (error) {
      console.error("Error toggling follow:", error);
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
      if (coverImage) data.append("coverImage", coverImage);

      const response = await updateProfile(data);
      setCurrentUser(response.data);
      setProfileUser(response.data);
      setIsEditing(false);
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileUser) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="app-container" style={{ background: "var(--bg-primary)" }}>
      <Header />

      <main className="profile-main">
        <div className="profile-card glass">
          <div 
            className="profile-cover"
            style={{ 
              backgroundImage: coverPreview ? `url(${coverPreview})` : 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {isOwnProfile && isEditing && (
              <label className="cover-upload-btn">
                <input type="file" accept="image/*" onChange={handleCoverChange} hidden />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Change Cover
              </label>
            )}
          </div>
          <div className="profile-content">
            <div className="profile-avatar-container">
              <div className="profile-avatar-large">
                {avatarPreview ? (
                  <img src={avatarPreview.startsWith('blob:') ? avatarPreview : `${avatarPreview}?t=${new Date().getTime()}`} alt={profileUser?.username} />
                ) : (
                  <span>{profileUser?.username?.charAt(0).toUpperCase()}</span>
                )}
                {isOwnProfile && isEditing && (
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
                  <div>
                    <h1 className="profile-name">{profileUser?.fullName}</h1>
                    <p className="profile-username">@{profileUser?.username}</p>
                  </div>
                  
                  {isOwnProfile ? (
                    <button className="btn-edit" onClick={() => setIsEditing(true)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                      </svg>
                      Edit Profile
                    </button>
                  ) : (
                    <div className="profile-actions">
                      <button 
                        className={`btn-follow ${profileUser?.isFollowing ? 'following' : ''}`} 
                        onClick={handleFollow}
                      >
                        {profileUser?.isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <Link 
                        to="/messages" 
                        state={{ recipient: profileUser }} 
                        className="btn-message"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        Message
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="profile-stats">
                  <div className="stat">
                    <strong>{profileUser?.followingCount || 0}</strong> Following
                  </div>
                  <div className="stat">
                    <strong>{profileUser?.followersCount || 0}</strong> Followers
                  </div>
                </div>

                <p className="profile-bio">{profileUser?.bio || "No bio yet"}</p>
                
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
