import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { createDream } from "../api/dreamApi";  // ← 추가
import Modal from "../components/Modal";
import { useEffect } from "react";
import { getTags } from "../api/tagApi";


export default function DreamCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    dream_date: "",
    tags: [],
  });


  const [modal, setModal] = useState({ open: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagToggle = (tag) => {
    if (form.tags.includes(tag)) {
      setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
    } else {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDream(form);
      setModal({ open: true, type: "success", message: "Dream saved! 🌙" });
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message: err?.response?.data?.message || "Failed to save dream.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleModalClose = () => {
    setModal((prev) => ({ ...prev, open: false }));
    if (modal.type === "success") navigate("/dreams");
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
        </div>
      </nav>

      {/* Main */}
      <main className="dream-create-main">
        <div className="dream-create-card">
          <h2 className="dream-create-title">New Dream</h2>
          <p className="dream-create-subtitle">Record what you dreamed tonight</p>

          <form onSubmit={handleSubmit} className="dream-create-form">

            {/* Title + Date 한 줄 */}
            <div className="field-row">
              <div className="field-group" style={{ flex: 2 }}>
                <label className="field-label">TITLE</label>
                <input
                  className="field-input"
                  name="title"
                  placeholder="Give your dream a title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-group" style={{ flex: 1 }}>
                <label className="field-label">DATE</label>
                <input
                  className="field-input field-input-date"
                  type="date"
                  name="dream_date"
                  value={form.dream_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Content */}
            <div className="field-group">
              <label className="field-label">CONTENT</label>
              <textarea
                className="field-input dream-textarea"
                name="content"
                placeholder="Describe your dream in detail..."
                value={form.content}
                onChange={handleChange}
                required
                rows={7}
              />
            </div>

            {/* Tags */}
            <div className="field-group">
              <label className="field-label">TAGS</label>
              <div className="tag-selector">
                {availableTags.map((tag) => (
                  <button
                    type="button"
                    key={tag.tag_id}
                    className={`tag-btn ${form.tags.includes(tag.tag_id) ? "tag-btn-active" : ""}`}
                    onClick={() => handleTagToggle(tag.tag_id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Dream ✦"}
            </button>

          </form>
        </div>
        <Modal
          open={modal.open}
          type={modal.type}
          message={modal.message}
          onClose={handleModalClose}
        />
      </main>
    </div>
  );
}
