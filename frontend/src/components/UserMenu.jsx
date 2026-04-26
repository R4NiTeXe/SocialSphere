import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./UserMenu.css";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button className="user-menu-trigger" onClick={() => setIsOpen(!isOpen)}>
        <div className="user-avatar-small">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            <span>{user?.username?.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <span className="user-name-header">{user?.fullName?.split(" ")[0]}</span>
        <span className={`chevron ${isOpen ? "open" : ""}`}>▾</span>
      </button>

      {isOpen && (
        <div className="user-dropdown glass">
          <div className="dropdown-header">
            <p className="dropdown-name">{user?.fullName}</p>
            <p className="dropdown-username">@{user?.username}</p>
          </div>
          <div className="dropdown-divider"></div>
          <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
            <span className="icon">👤</span> My Profile
          </Link>
          <Link to="/settings" className="dropdown-item" onClick={() => setIsOpen(false)}>
            <span className="icon">⚙️</span> Settings
          </Link>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item logout-btn" onClick={handleLogout}>
            <span className="icon">🚪</span> Log out
          </button>
        </div>
      )}
    </div>
  );
}
