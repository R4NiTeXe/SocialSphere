import { useState } from "react";
import { createPost } from "../api/posts.api";
import { useAuth } from "../context/AuthContext.jsx";
import "./CreatePost.css";

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      alert("You can only upload up to 4 images total");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);
    
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newImages.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      images.forEach((img) => formData.append("images", img));

      await createPost(formData);
      setContent("");
      setImages([]);
      setPreviews([]);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post glass">
      <form onSubmit={handleSubmit}>
        <div className="create-post-top">
          <div className="user-avatar-small">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <span>{user?.username?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
          />
        </div>

        {previews.length > 0 && (
          <div className="image-previews-grid">
            {previews.map((preview, index) => (
              <div key={index} className="preview-item">
                <img src={preview} alt="preview" />
                <button type="button" className="remove-preview" onClick={() => removeImage(index)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="create-post-bottom">
          <div className="post-actions">
            <label className="action-btn">
              <input type="file" accept="image/*" multiple onChange={handleFileChange} hidden />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Photo
            </label>
          </div>
          <button type="submit" className="btn-post" disabled={loading || (!content.trim() && images.length === 0)}>
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
