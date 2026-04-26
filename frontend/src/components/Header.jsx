import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";
import NotificationMenu from "./NotificationMenu";

export default function Header() {
  return (
    <header className="app-header glass">
      <div className="header-left">
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
      </div>

      <div className="header-center">
        <SearchBar />
      </div>

      <div className="header-actions">
        <Link to="/messages" className="header-icon-link" title="Messages">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </Link>
        <NotificationMenu />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
