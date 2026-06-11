import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

import { getDream, toggleFavorite, generateSummary } from "../api/dreamApi";
import { getTags } from "../api/tagApi";

export default function DreamDetail() {
  const { id } = useParams(); // id 추출
  const navigate = useNavigate();
  const [dream, setDream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [favLoading, setFavLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    const loadDream = async () => {
      try {
        const res = await getDream(id);
        setDream(res.data);
        const tagsRes = await getTags();
        setAvailableTags(Array.isArray(tagsRes.data) ? tagsRes.data : tagsRes.data.data || []);
      } catch (err) {
        console.error(err);
        setDream(null);
      } finally {
        setLoading(false);
      }
    };
    loadDream();
  }, [id]);

  const handleToggleFavorite = async () => {
    setFavLoading(true);
    try {
      const res = await toggleFavorite(id);
      const is_favorite = res.data?.is_favorite ?? !dream.is_favorite;
      setDream((prev) => ({ ...prev, is_favorite }));
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await generateSummary(id);
      const ai_summary = res.data?.ai_summary;
      setDream((prev) => ({ ...prev, ai_summary }));
    } catch (err) {
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) {
    return <div className="root"><div className="aurora" /><main className="dream-detail-main"><div className="dream-detail-card"><p>Loading...</p></div></main></div>;
  }

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
      <div className="starfield" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="star" style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: Math.random() * 2.5 + 0.5, height: Math.random() * 2.5 + 0.5,
            animationDelay: `${Math.random() * 4}s`, animationDuration: `${Math.random() * 3 + 2}s`,
          }} />
        ))}
      </div>
      <div className="aurora" aria-hidden="true" />

      <nav className="nav">
        <Link to="/dashboard" className="nav-logo">
          <img src={logo} alt="Dream Log" className="nav-logo-img" />
        </Link>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/dreams")}>← Back</button>
          <button className="btn-orange" onClick={() => navigate(`/dream/${id}/edit`)}>Edit</button>
        </div>
      </nav>

      <main className="dream-detail-main">
        <div className="dream-detail-card">

          <div className="dream-detail-header">
            <div>
              <h1 className="dream-detail-title">{dream.title}</h1>
              <span className="dream-detail-date">📅 {dream.dream_date}</span>
            </div>
            <button
              className={`dream-detail-fav ${dream.is_favorite ? "fav-active" : ""}`}
              onClick={handleToggleFavorite}
              disabled={favLoading}
              style={{
                cursor: "pointer", background: "none",
                border: `1px solid ${dream.is_favorite ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.25)"}`,
                borderRadius: "20px", padding: "6px 12px",
                color: dream.is_favorite ? "#fbbf24" : "#e8e4f8", font: "inherit",
              }}
            >
              {dream.is_favorite ? "★ Favorited" : "☆ Add to favorites"}
            </button>
          </div>

          {dream.tags?.length > 0 && (
            <div className="dream-detail-tags">
              {dream.tags?.map((tagId) => {
                const tag = availableTags.find((t) => t.tag_id === tagId);

                return (
                  <span key={tagId} className="dream-detail-tag">
                    #{tag?.name || tagId}
                    </span>
                );
              })}
            </div>
          )}

          <div className="dream-detail-divider" />

          <div className="field-group">
            <label className="field-label">DREAM CONTENT</label>
            <p className="dream-detail-content">{dream.content}</p>
          </div>

          {dream.ai_summary ? (
            <div className="dream-detail-summary">
              <div className="dream-detail-summary-label">✦ AI Summary</div>
              <p className="dream-detail-summary-text">{dream.ai_summary}</p>
              <button
                className="dreamlist-action-btn"
                onClick={handleSummary}
                disabled={summaryLoading}
                style={{ marginTop: 12 }}
              >
                {summaryLoading ? "Regenerating..." : "↺ Regenerate"}
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={handleSummary} disabled={summaryLoading}>
              {summaryLoading ? "Generating..." : "✦ Generate AI Summary"}
            </button>
          )}

        </div>
      </main>
    </div>
  );
}
