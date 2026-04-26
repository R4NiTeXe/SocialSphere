import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toggleLike, addComment, deletePost, toggleCommentLike, addCommentReply } from "../api/posts.api";
import "./PostCard.css";

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isLiked = post.likes.includes(user?._id);
  const isOwner = post.owner?._id === user?._id;

  const handleLike = async () => {
    try {
      await toggleLike(post._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    try {
      await addComment(post._id, commentContent);
      setCommentContent("");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      await toggleCommentLike(post._id, commentId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyContent.trim()) return;
    try {
      await addCommentReply(post._id, commentId, replyContent);
      setReplyContent("");
      setReplyTo(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="post-card glass">
      <div className="post-card-header">
        <div className="post-header-left">
          <Link to={`/profile/${post.owner?.username}`} className="post-avatar">
            {post.owner?.avatar ? (
              <img src={post.owner.avatar} alt={post.owner.username} />
            ) : (
              <span>{post.owner?.username?.charAt(0).toUpperCase()}</span>
            )}
          </Link>
          <div className="post-meta">
            <Link to={`/profile/${post.owner?.username}`} className="post-author">
              {post.owner?.fullName || "User"}
            </Link>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        
        {isOwner && (
          <div className="post-header-right">
            {!showDeleteConfirm ? (
              <button className="btn-icon delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            ) : (
              <div className="delete-confirm">
                <span>Delete?</span>
                <button className="confirm-yes" onClick={handleDelete}>Yes</button>
                <button className="confirm-no" onClick={() => setShowDeleteConfirm(false)}>No</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        <p className="post-text">{post.content}</p>
        
        {post.images && post.images.length > 0 && (
          <div className={`post-media-grid images-${post.images.length}`}>
            {post.images.map((img, idx) => (
              <div key={idx} className="post-media-item">
                <img src={img} alt={`Post content ${idx}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="post-card-footer">
        <button 
          className={`post-action ${isLiked ? 'liked' : ''}`} 
          onClick={handleLike}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>{post.likes?.length || 0}</span>
        </button>
        
        <button 
          className={`post-action ${showComments ? 'active' : ''}`} 
          onClick={() => setShowComments(!showComments)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="post-comments-section">
          <form className="comment-form" onSubmit={handleComment}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button type="submit" disabled={!commentContent.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>

          <div className="comments-list">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="comment-thread">
                <div className="comment-item">
                  <div className="comment-avatar">
                    {comment.owner?.avatar ? (
                      <img src={comment.owner.avatar} alt={comment.owner.username} />
                    ) : (
                      <span>{comment.owner?.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="comment-main">
                    <div className="comment-bubble">
                      <span className="comment-author">{comment.owner?.fullName}</span>
                      <p className="comment-text">{comment.content}</p>
                    </div>
                    <div className="comment-actions">
                      <button 
                        className={`btn-comment-action ${comment.likes.includes(user?._id) ? 'liked' : ''}`}
                        onClick={() => handleCommentLike(comment._id)}
                      >
                        Like {comment.likes.length > 0 && comment.likes.length}
                      </button>
                      <button 
                        className="btn-comment-action"
                        onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                      >
                        Reply
                      </button>
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    </div>
                    
                    {replyTo === comment._id && (
                      <div className="reply-form">
                        <input
                          type="text"
                          placeholder={`Reply to ${comment.owner?.fullName}...`}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          autoFocus
                        />
                        <button onClick={() => handleReply(comment._id)} disabled={!replyContent.trim()}>
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {comment.replies?.length > 0 && (
                  <div className="replies-list">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="comment-item reply-item">
                        <div className="comment-avatar small">
                          {reply.owner?.avatar ? (
                            <img src={reply.owner.avatar} alt={reply.owner.username} />
                          ) : (
                            <span>{reply.owner?.username?.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="comment-main">
                          <div className="comment-bubble">
                            <span className="comment-author">{reply.owner?.fullName}</span>
                            <p className="comment-text">{reply.content}</p>
                          </div>
                          <div className="comment-actions">
                            <span className="comment-date">{formatDate(reply.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
