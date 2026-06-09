import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { getDreams, toggleFavorite } from "../api/dreamApi";
 
export default function Favorites() {
  const navigate = useNavigate();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    getDreams({ favorite: true })
      .then((res) => setDreams(res.data.data.dreams))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
 
  const handleUnfavorite = async (id) => {
    try {
      await toggleFavorite(id);
      setDreams((prev) => prev.filter((d) => d.dream_id !== id));
    } catch (err) {
      console.error(err);
    }
  };
 
  return (
    <div className="root">
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
 
      <nav className="nav">
        <Link to="/dashboard" className="nav-logo">
          <img src={logo} alt="Dream Log" className="nav-logo-img" />
        </Link>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
        </div>
      </nav>
 
      <main className="dreamlist-main">
        <div className="dreamlist-card">
 
          <div className="dreamlist-header">
            <div>
              <h2 className="dreamlist-title">★ Favorites</h2>
              <p className="dreamlist-subtitle">
                {loading ? "Loading..." : `${dreams.length} dream${dreams.length !== 1 ? "s" : ""} favorited`}
              </p>
            </div>
          </div>
 
          <div className="dreamlist-divider" />
 
          {loading ? (
            <div className="dreamlist-empty"><p>Loading...</p></div>
          ) : dreams.length === 0 ? (
            <div className="dreamlist-empty">
              <p>No favorite dreams yet.</p>
              <button
                className="btn-primary"
                style={{ width: "auto", marginTop: 16 }}
                onClick={() => navigate("/dreams")}
              >
                Browse dreams
              </button>
            </div>
          ) : (
            <div className="dreamlist-items">
              {dreams.map((dream) => (
                <div key={dream.dream_id} className="dreamlist-item">
                  <div className="dreamlist-item-left">
                    <div className="dreamlist-item-top">
                      <span className="dreamlist-item-title">{dream.title}</span>
                      <span className="dreamlist-item-fav">★</span>
                    </div>
                    <p className="dreamlist-item-summary">
                      {dream.ai_summary || (dream.content?.slice(0, 60) + "...")}
                    </p>
                    <div className="dreamlist-item-tags">
                      {dream.tags?.map((tag) => (
                        <span key={tag} className="dream-detail-tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
 
                  <div className="dreamlist-item-date">{dream.dream_date}</div>
 
                  <div className="dreamlist-item-actions">
                    <button
                      className="dreamlist-action-btn"
                      onClick={() => navigate(`/dream/${dream.dream_id}`)}
                    >
                      Read
                    </button>
                    <span className="dreamlist-action-sep">/</span>
                    <button
                      className="dreamlist-action-btn"
                      onClick={() => navigate(`/dream/${dream.dream_id}/edit`)}
                    >
                      Update
                    </button>
                    <span className="dreamlist-action-sep">/</span>
                    <button
                      className="dreamlist-action-btn dreamlist-action-delete"
                      onClick={() => handleUnfavorite(dream.dream_id)}
                    >
                      ★ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
 
        </div>
      </main>
    </div>
  );
}