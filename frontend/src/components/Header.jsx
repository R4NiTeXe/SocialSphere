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
        <NotificationMenu />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
