import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getFeed } from "../api/posts.api";
import ThemeToggle from "../components/ThemeToggle";
import UserMenu from "../components/UserMenu";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getFeed();
      setPosts(data.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 20px",
          width: "100%",
          maxWidth: "1126px",
          margin: "0 auto",
        }}
      >
        {/* Post Creation Area */}
        <CreatePost onPostCreated={fetchPosts} />

        {/* Feed Area */}
        <div style={{ width: "100%", maxWidth: "var(--max-content-width)" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              Loading your feed...
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
              <span style={{ fontSize: "40px", display: "block", marginBottom: "16px" }}>📭</span>
              <h3>No posts yet</h3>
              <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
                Be the first one to share something with the world!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
