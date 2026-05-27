import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { registerUser } from "../api/authApi";
import Modal from "../components/Modal";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", id: "", password: "", confirm: "" });
  const [modal, setModal] = useState({ open: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name || !form.email || !form.id || !form.password || !form.confirm) {
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
      await registerUser({ name: form.name, email: form.email, id: form.id, password: form.password });
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

//   const handleGoogleLogin = () => {
//     window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
//   };

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
                <label className="field-label">NAME</label>
                <input
                  className="field-input"
                  type="text"
                  name="name"
                  placeholder="Your name"
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

            <div className="field-group">
              <label className="field-label">ID</label>
              <input
                className="field-input"
                type="text"
                name="id"
                placeholder="Choose an ID"
                value={form.id}
                onChange={handleChange}
              />
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

          <div className="auth-divider"><span>or</span></div>
{/* 
          <button className="btn-google" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button> */}

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