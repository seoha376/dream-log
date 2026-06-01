import { useParams, useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { mockDreams } from "../data/mockDreams";

export default function DreamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dream = mockDreams.find((d) => d.dream_id === Number(id));

  if (!dream) {
    return (
      <div className="root">
        <div className="aurora" aria-hidden="true" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-logo">
            <img src={logo} alt="Dream Log" className="nav-logo-img" />
          </Link>
        </nav>
        <main className="dream-detail-main">
          <div className="dream-detail-card">
            <p className="dream-detail-empty">Dream not found.</p>
            <button className="btn-ghost" onClick={() => navigate("/dashboard")}>← Back</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="root">
      {/* Starfield */}
      <div className="starfield" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2.5 + 0.5,
              height: Math.random() * 2.5 + 0.5,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
      <div className="aurora" aria-hidden="true" />

      {/* Navbar */}
      <nav className="nav">
        <Link to="/dashboard" className="nav-logo">
          <img src={logo} alt="Dream Log" className="nav-logo-img" />
        </Link>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate(-1)}>← Back</button>
          <button className="btn-orange" onClick={() => navigate(`/dream/${id}/edit`)}>Edit</button>
        </div>
      </nav>

      {/* Main */}
      <main className="dream-detail-main">
        <div className="dream-detail-card">

          {/* Header */}
          <div className="dream-detail-header">
            <div>
              <h1 className="dream-detail-title">{dream.title}</h1>
              <span className="dream-detail-date">📅 {dream.dream_date}</span>
            </div>
            <span className={`dream-detail-fav ${dream.is_favorite ? "fav-active" : ""}`}>
              {dream.is_favorite ? "★ Favorited" : "☆ Not favorited"}
            </span>
          </div>

          {/* Tags */}
          {dream.tags?.length > 0 && (
            <div className="dream-detail-tags">
              {dream.tags.map((tag) => (
                <span key={tag} className="dream-detail-tag">#{tag}</span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="dream-detail-divider" />

          {/* Content */}
          <div className="field-group">
            <label className="field-label">DREAM CONTENT</label>
            <p className="dream-detail-content">{dream.content}</p>
          </div>

          {/* AI Summary */}
          {dream.ai_summary && (
            <div className="dream-detail-summary">
              <div className="dream-detail-summary-label">✦ AI Summary</div>
              <p className="dream-detail-summary-text">{dream.ai_summary}</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
