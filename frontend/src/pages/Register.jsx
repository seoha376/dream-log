import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { registerUser } from "../api/authApi";
import Modal from "../components/Modal";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [modal, setModal] = useState({ open: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return "Please fill in all fields.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Please enter a valid email address.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (form.password !== form.confirm) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      setModal({ open: true, type: "error", message: error });
      return;
    }
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password });
      setModal({ open: true, type: "success", message: "Registration complete! You're ready to log your dreams ✨" });
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        message: err?.response?.data?.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModal((prev) => ({ ...prev, open: false }));
    if (modal.type === "success") navigate("/login");
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
          <h2 className="auth-title">Sign Up</h2>
          <p className="auth-subtitle">Keep your dreams with Dream Log</p>

          <div className="auth-fields">
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">USERNAME</label>
                <input
                  className="field-input"
                  type="text"
                  name="name"
                  placeholder="Choose a username"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group">
                <label className="field-label">EMAIL</label>
                <input
                  className="field-input"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">PASSWORD</label>
                <input
                  className="field-input"
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group">
                <label className="field-label">CONFIRM</label>
                <input
                  className="field-input"
                  type="password"
                  name="confirm"
                  placeholder="Confirm password"
                  value={form.confirm}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "Next"}
          </button>

          <p className="auth-link">
            Already have an account? <Link to="/login">Log in</Link>
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