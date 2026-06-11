import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { getDreams, toggleFavorite } from "../api/dreamApi";
import { getTags } from "../api/tagApi";

export default function Favorites() { // 즐겨찾기 페이지
  const navigate = useNavigate();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [dreamsRes, tagsRes] = await Promise.all([
          getDreams({ favorite: 1 }), // 즐겨찾기된 꿈만 보여주기
          getTags(),
        ]);
        const data = Array.isArray(dreamsRes.data) ? dreamsRes.data : dreamsRes.data?.dreams || [];
        // favorite 1인 꿈만 보이게 하거나,
        const favDreams = data.filter((d) => d.is_favorite === 1 || d.is_favorite === true);
        setDreams(favDreams);
        setAvailableTags(Array.isArray(tagsRes.data) ? tagsRes.data : tagsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUnfavorite = async (id) => {
    try {
      await toggleFavorite(id); // favorite 여부 변경하는 api 호출
      setDreams((prev) => prev.filter((d) => d.dream_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

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
          <button className="btn-ghost" onClick={() => navigate("/dashboard")}>← Back</button>
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
              <button className="btn-primary" style={{ width: "auto", marginTop: 16 }} onClick={() => navigate("/dreams")}>
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
                      {dream.tags?.map((tagId) => {
                        const tag = availableTags.find((t) => t.tag_id === tagId);
                        return <span key={tagId} className="dream-detail-tag">#{tag?.name || tagId}</span>;
                      })}
                    </div>
                  </div>
                  <div className="dreamlist-item-date">{dream.dream_date}</div>
                  <div className="dreamlist-item-actions">
                    <button className="dreamlist-action-btn" onClick={() => navigate(`/dream/${dream.dream_id}`)}>Read</button>
                    <span className="dreamlist-action-sep">/</span>
                    <button className="dreamlist-action-btn" onClick={() => navigate(`/dream/${dream.dream_id}/edit`)}>Update</button>
                    <span className="dreamlist-action-sep">/</span>
                    <button className="dreamlist-action-btn dreamlist-action-delete" onClick={() => handleUnfavorite(dream.dream_id)}>★ Remove</button>
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
