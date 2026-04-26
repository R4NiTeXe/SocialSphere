import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../api/user.api";
import "./SearchBar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await searchUsers(query);
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (username) => {
    setQuery("");
    setShowResults(false);
    navigate(`/profile/${username}`);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowResults(true)}
        />
        {loading && <div className="search-spinner"></div>}
      </div>

      {showResults && results.length > 0 && (
        <div className="search-results glass">
          {results.map((user) => (
            <div key={user.username} className="search-item" onClick={() => handleUserClick(user.username)}>
              <div className="search-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <span>{user.username.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="search-info">
                <p className="search-name">{user.fullName}</p>
                <p className="search-username">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && query.trim() && results.length === 0 && !loading && (
        <div className="search-results glass">
          <div className="search-empty">No results found for "{query}"</div>
        </div>
      )}
    </div>
  );
}
