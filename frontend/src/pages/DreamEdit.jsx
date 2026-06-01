import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { dreamTags } from "../data/tags";
import { getDream, updateDream } from "../api/dreamApi";

export default function DreamEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dream, setDream] = useState(null);

  const [form, setForm] = useState({
  title: "",
  content: "",
  dream_date: "",
  tags: [],
});

const [loading, setLoading] = useState(true);
const [notFound, setNotFound] = useState(false);


useEffect(() => {
  async function loadDream() {
    try {
      const response = await getDream(id);
      const dreamData = response.data;

      setForm({
        title: dreamData.title || "",
        content: dreamData.content || "",
        dream_date: dreamData.dream_date
        ? dreamData.dream_date.slice(0, 10) 
        : "",
        tags: dreamData.tags || [],
      });
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  loadDream();
}, [id]);

  // if (!dream) {
  //   return (
  //     <div className="root">
  //       <div className="aurora" aria-hidden="true" />
  //       <nav className="nav">
  //         <Link to="/dashboard" className="nav-logo">
  //           <img src={logo} alt="Dream Log" className="nav-logo-img" />
  //         </Link>
  //       </nav>
  //       <main className="dream-detail-main">
  //         <div className="dream-detail-card">
  //           <p className="dream-detail-empty">Dream not found.</p>
  //           <button className="btn-ghost" onClick={() => navigate("/dashboard")}>← Back</button>
  //         </div>
  //       </main>
  //     </div>
  //   );
  // }

if (loading) {
  return (
    <div className="root">
      <main className="dream-detail-main">
        <div className="dream-detail-card">
          <p>Loading...</p>
        </div>
      </main>
    </div>
  );
}

if (notFound) {
  return (
    <div className="root">
      <main className="dream-detail-main">
        <div className="dream-detail-card">
          <p className="dream-detail-empty">Dream not found.</p>
          <button
            className="btn-ghost"
            onClick={() => navigate("/dashboard")}
          >
            ← Back
          </button>
        </div>
      </main>
    </div>
  );
}



  const handleTagToggle = (tag) => {
    if (form.tags.includes(tag)) {
      setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
    } else {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
  };


    const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await updateDream(id, {
      title: form.title,
      content: form.content,
      dream_date: form.dream_date,
    });

    navigate(`/dream/${id}`);
  } catch (err) {
    console.error(err);
    alert("Failed to update dream.");
  }
};

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Updated dream:", form);
  //   // TODO: API 연결 후 실제 수정 요청
  //   navigate(`/dream/${id}`);
  // };

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
          <button className="btn-ghost" onClick={() => navigate(`/dream/${id}`)}>
            ← Cancel
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="dream-create-main">
        <div className="dream-create-card">
          <h2 className="dream-create-title">Edit Dream</h2>
          <p className="dream-create-subtitle">Update your dream record</p>

          <form onSubmit={handleSubmit} className="dream-create-form">

            {/* Title + Date */}
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
                {dreamTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className={`tag-btn ${form.tags.includes(tag) ? "tag-btn-active" : ""}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="dream-edit-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate(`/dream/${id}`)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary dream-edit-save">
                Save Changes ✦
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}
