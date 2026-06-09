import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { getDreams, deleteDream } from "../api/dreamApi";
import { getTags } from "../api/tagApi";
import Modal from "../components/Modal";

export default function DreamList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, dreamId: null });
  const [availableTags, setAvailableTags] = useState([]);

  const loadDreams = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await getDreams();
      const data = Array.isArray(res.data) ? res.data : res.data?.data?.dreams || res.data?.dreams || [];
      setDreams(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load dreams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDreams();
    const loadTags = async () => {
      try {
        const res = await getTags();
        setAvailableTags(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadTags();
  }, []);

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const filtered = dreams.filter((dream) => {
    const matchSearch =
      search === "" ||
      dream.title?.toLowerCase().includes(search.toLowerCase()) ||
      dream.content?.toLowerCase().includes(search.toLowerCase());
    const matchTags =
      selectedTags.length === 0 ||
      selectedTags.every((tagId) => dream.tags?.includes(tagId));
    return matchSearch && matchTags;
  });

  const handleDelete = (dreamId) => setDeleteModal({ open: true, dreamId });

  const confirmDelete = async () => {
    try {
      await deleteDream(deleteModal.dreamId);
      setDeleteModal({ open: false, dreamId: null });
      loadDreams();
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
          <button className="btn-orange" onClick={() => navigate("/dream/create")}>+ New Dream</button>
        </div>
      </nav>

      <main className="dreamlist-main">
        <div className="dreamlist-card">
          <div className="dreamlist-header">
            <div>
              <h2 className="dreamlist-title">All Dreams</h2>
              <p className="dreamlist-subtitle">
                {loading ? "Loading..." : `${filtered.length} dream${filtered.length !== 1 ? "s" : ""} found`}
              </p>
            </div>
            <div className="dreamlist-search-wrap">
              <input className="dreamlist-search" type="text" placeholder="Search dreams..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
              <span className="dreamlist-search-icon">🔍</span>
            </div>
          </div>

          <div className="dreamlist-filter-row">
            <button
              className={`dreamlist-filter-btn ${showTagFilter ? "active" : ""}`}
              onClick={() => setShowTagFilter(!showTagFilter)}
            >
              🏷️ Filter by tag {selectedTags.length > 0 && `(${selectedTags.length})`}
            </button>
            {selectedTags.length > 0 && (
              <button className="dreamlist-clear-btn" onClick={() => setSelectedTags([])}>Clear filters</button>
            )}
          </div>

          {showTagFilter && (
            <div className="dreamlist-tag-panel">
              {availableTags.map((tag) => (
                <button
                  key={tag.tag_id}
                  className={`tag-btn ${selectedTags.includes(tag.tag_id) ? "tag-btn-active" : ""}`}
                  onClick={() => handleTagToggle(tag.tag_id)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}

          {selectedTags.length > 0 && (
            <div className="dreamlist-active-tags">
              {selectedTags.map((tagId) => {
                const tag = availableTags.find((t) => t.tag_id === tagId);
                return (
                  <span key={tagId} className="dreamlist-active-tag" onClick={() => handleTagToggle(tagId)}>
                    #{tag?.name} ✕
                  </span>
                );
              })}
            </div>
          )}

          <div className="dreamlist-divider" />

          {loading ? (
            <div className="dreamlist-empty"><p>Loading dreams...</p></div>
          ) : errorMsg ? (
            <div className="dreamlist-empty">
              <p>{errorMsg}</p>
              <button className="btn-primary" style={{ width: "auto", marginTop: 16 }} onClick={loadDreams}>Try again</button>
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
                      {(dream.is_favorite === 1 || dream.is_favorite === true) && <span className="dreamlist-item-fav">★</span>}
                    </div>
                    <p className="dreamlist-item-summary">
                      {dream.ai_summary || (dream.content?.slice(0, 60) + "...")}
                    </p>
                    <div className="dreamlist-item-tags">
                      {dream.tags?.map((tagId) => {
                        const tag = availableTags.find((t) => t.tag_id === tagId);
                        return (
                          <span key={tagId} className="dream-detail-tag">#{tag?.name || tagId}</span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="dreamlist-item-date">{dream.dream_date}</div>
                  <div className="dreamlist-item-actions">
                    <button className="dreamlist-action-btn" onClick={() => navigate(`/dream/${dream.dream_id}`)}>Read</button>
                    <span className="dreamlist-action-sep">/</span>
                    <button className="dreamlist-action-btn" onClick={() => navigate(`/dream/${dream.dream_id}/edit`)}>Update</button>
                    <span className="dreamlist-action-sep">/</span>
                    <button className="dreamlist-action-btn dreamlist-action-delete" onClick={() => handleDelete(dream.dream_id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          open={deleteModal.open}
          type="confirm"
          message="Are you sure you want to delete this dream?"
          onClose={() => setDeleteModal({ open: false, dreamId: null })}
          onConfirm={confirmDelete}
        />
      </main>
    </div>
  );
}
