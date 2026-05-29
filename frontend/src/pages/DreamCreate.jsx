import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dreamTags } from "../data/tags";

export default function DreamCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    dream_date: "",
    tags: [],
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    navigate("/dreams");
  };

  return (
    <div>
      <h1>New Dream</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            name="dream_date"
            value={form.dream_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tags</label>
          <div>
            {dreamTags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagToggle(tag)}
                style={{
                  margin: "4px",
                  background: form.tags.includes(tag) ? "#6c63ff" : "#eee",
                  color: form.tags.includes(tag) ? "#fff" : "#333",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <button type="submit">Save Dream</button>
      </form>
    </div>
  );
}