import "./LoadingSpinner.css";

export default function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={`spinner-container ${fullPage ? 'full-page' : ''}`}>
      <div className="spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-text">SocialSphere</div>
      </div>
    </div>
  );
}
