import { useState, useEffect } from "react";
import { fetchPosts } from "../api/posts.api";
import Header from "../components/Header";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import "./HomePage.css";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetchPosts();
      setPosts(response.data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />

      <main className="app-main">
        <div className="feed-container">
          <CreatePost onPostCreated={loadPosts} />
          
          <div className="posts-feed">
            {loading ? (
              <div className="loading-feed">Loading posts...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} post={post} onUpdate={loadPosts} />
              ))
            ) : (
              <div className="empty-feed glass">
                <p>No posts yet. Be the first to share something!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
