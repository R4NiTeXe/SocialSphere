import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getNotifications, markNotificationsRead, getUnreadCount } from "../api/notification.api";
import { getSocket } from "../api/socket.api";
import "./NotificationMenu.css";

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    
    const socket = getSocket();
    if (socket) {
      socket.on("newNotification", (notification) => {
        setUnreadCount((prev) => prev + 1);
        setNotifications((prev) => [notification, ...prev]);
        
        // Show a small audio cue or browser notification if needed
        console.log("Real-time notification received:", notification);
      });
    }

    return () => {
      if (socket) socket.off("newNotification");
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      handleMarkRead();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkRead = async () => {
    try {
      await markNotificationsRead();
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking read:", error);
    }
  };

  const getNotificationText = (n) => {
    switch (n.type) {
      case "like": return "liked your post";
      case "comment": return "commented on your post";
      case "reply": return "replied to your comment";
      case "follow": return "started following you";
      default: return "interacted with you";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like": return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      );
      case "comment":
      case "reply": return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      );
      case "follow": return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      );
      default: return null;
    }
  };

  return (
    <div className="notification-menu-container" ref={menuRef}>
      <button className="notification-trigger" onClick={() => setIsOpen(!isOpen)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown glass">
          <div className="notification-header">
            <h3>Notifications</h3>
          </div>
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <Link 
                  key={n._id} 
                  to={n.post ? `/profile/${n.sender.username}` : `/profile/${n.sender.username}`}
                  className={`notification-item ${n.isRead ? '' : 'unread'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="notification-avatar">
                    {n.sender.avatar ? (
                      <img src={n.sender.avatar} alt={n.sender.username} />
                    ) : (
                      <span>{n.sender.username.charAt(0).toUpperCase()}</span>
                    )}
                    <div className={`notification-type-icon ${n.type}`}>
                      {getNotificationIcon(n.type)}
                    </div>
                  </div>
                  <div className="notification-content">
                    <p>
                      <strong>{n.sender.fullName}</strong> {getNotificationText(n)}
                    </p>
                    <span className="notification-time">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="notification-empty">
                No notifications yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
