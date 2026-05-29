import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { loginUser } from "../api/authApi";
import Modal from "../components/Modal";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "" });
  const [modal, setModal] = useState({ open: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.id || !form.password) {
      setModal({ open: true, type: "error", message: "Please enter your ID and password." });
      return;
    }
    setLoading(true);
    try {
      await loginUser({ id: form.id, password: form.password });
      setModal({ open: true, type: "success", message: "Login successful! Welcome back 🌙" });
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message: err?.response?.data?.message || "Incorrect ID or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModal((prev) => ({ ...prev, open: false }));
    if (modal.type === "success") navigate("/dashboard");
  };

  return (
    <div className="auth-root">
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
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Dream Log" className="nav-logo-img" />
        </Link>
      </nav>

      <main className="auth-main">
        <div className="auth-card">
          <h2 className="auth-title">Log In</h2>
          <p className="auth-subtitle">Welcome back to your dream world</p>

          <div className="auth-fields">
            <div className="field-group">
              <label className="field-label">ID</label>
              <input
                className="field-input"
                type="text"
                name="id"
                placeholder="Enter your ID"
                value={form.id}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <div className="field-group">
              <label className="field-label">PASSWORD</label>
              <input
                className="field-input"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Next"}
          </button>

          <p className="auth-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </main>

      <Modal
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={handleModalClose}
      />
    </div>
  );
}