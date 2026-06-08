import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { getDreams, deleteDream } from "../api/dreamApi";
import { dreamTags } from "../data/tags";

export default function DreamList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(false);


  const loadDreams = async () => {
    setLoading(true);
    try {
      const res = await getDreams();
      setDreams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDreams();
  }, []);

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filtered = dreams.filter((dream) => {
    const matchSearch =
      search === "" ||
      dream.title.toLowerCase().includes(search.toLowerCase()) ||
      dream.content.toLowerCase().includes(search.toLowerCase());

    const matchTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => dream.tags?.includes(tag));

    return matchSearch && matchTags;
  });

  const handleDelete = async (dreamId) => {
    try {
      await deleteDream(dreamId);
      alert("Deleted dream successfully");

      const res = await getDreams();
      setDreams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
          <button className="btn-ghost" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <button className="btn-orange" onClick={() => navigate("/dream/create")}>
            + New Dream
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="dreamlist-main">
        <div className="dreamlist-card">

          {/* Header */}
          <div className="dreamlist-header">
            <div>
              <h2 className="dreamlist-title">All Dreams</h2>
              <p className="dreamlist-subtitle">{filtered.length} dream{filtered.length !== 1 ? "s" : ""} found</p>
            </div>

            {/* Search bar */}
            <div className="dreamlist-search-wrap">
              <input
                className="dreamlist-search"
                type="text"
                placeholder="Search dreams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="dreamlist-search-icon">🔍</span>
            </div>
          </div>

          {/* Tag filter toggle */}
          <div className="dreamlist-filter-row">
            <button
              className={`dreamlist-filter-btn ${showTagFilter ? "active" : ""}`}
              onClick={() => setShowTagFilter(!showTagFilter)}
            >
              🏷️ Filter by tag {selectedTags.length > 0 && `(${selectedTags.length})`}
            </button>
            {selectedTags.length > 0 && (
              <button
                className="dreamlist-clear-btn"
                onClick={() => setSelectedTags([])}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Tag filter panel */}
          {showTagFilter && (
            <div className="dreamlist-tag-panel">
              {dreamTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-btn ${selectedTags.includes(tag) ? "tag-btn-active" : ""}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Active tag pills */}
          {selectedTags.length > 0 && (
            <div className="dreamlist-active-tags">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="dreamlist-active-tag"
                  onClick={() => handleTagToggle(tag)}
                >
                  #{tag} ✕
                </span>
              ))}
            </div>
          )}

          <div className="dreamlist-divider" />

          {/* Dream list */}
          {loading ? (
            <div className="dreamlist-empty">
              <p>Loading dreams...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="dreamlist-empty">
              <p>No dreams found.</p>
              <button className="btn-primary" style={{ width: "auto", marginTop: 16 }} onClick={() => navigate("/dream/create")}>
                Record a dream
              </button>
            </div>
          ) : (
            <div className="dreamlist-items">
              {filtered.map((dream) => (
                <div key={dream.dream_id} className="dreamlist-item">
                  <div className="dreamlist-item-left">
                    <div className="dreamlist-item-top">
                      <span className="dreamlist-item-title">{dream.title}</span>
                      {dream.is_favorite && <span className="dreamlist-item-fav">★</span>}
                    </div>
                    <p className="dreamlist-item-summary">
                      {dream.ai_summary || dream.content?.slice(0, 60) + "..."}
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
                      onClick={() => handleDelete(dream.dream_id)}
                    >
                      Delete
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
