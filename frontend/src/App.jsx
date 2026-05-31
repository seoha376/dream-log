import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DreamDetail from "./pages/DreamDetail";
import DreamCreate from "./pages/DreamCreate";
import DreamEdit from "./pages/DreamEdit";
import DreamList from "./pages/DreamList";



const stars = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));

function Home() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState("");
  const placeholder = "I was flying over a misty city when suddenly...";

  useEffect(() => {
    setMounted(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i <= placeholder.length) {
        setInputText(placeholder.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="root">
      <div className="starfield" aria-hidden="true">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="aurora" aria-hidden="true" />

      <nav className="nav">
        <div className="nav-logo">
          <img src={logo} alt="Dream Log" className="nav-logo-img" />
        </div>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => navigate("/login")}>Log In</button>
          <button className="btn-orange" onClick={() => navigate("/register")}>Sign Up</button>
        </div>
      </nav>

      <main className={`hero ${mounted ? "mounted" : ""}`}>
        <p className="eyebrow">✦ Your subconscious, archived</p>
        <h1 className="headline">
          Don't let your<br />
          <span className="headline-accent">dreams fade.</span>
        </h1>
        <p className="subline">
          The smartest way to capture, explore, and understand<br />
          the hidden patterns of your sleeping mind.
        </p>
          <img src={logo} alt="Dream Log"  />

        <div className="card">
          <div className="card-header">
            <span className="card-dot red" />
            <span className="card-dot yellow" />
            <span className="card-label">Tonight's dream</span>
          </div>
          <textarea
            className="textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
          />
          <div className="card-footer">
            <span className="char-count">{inputText.length} characters</span>
            <button className="btn-save">Save Dream ✦</button>
          </div>
        </div>

        <div className="pills">
          {["🔍 AI Analysis", "📅 Dream Calendar", "🏷️ Tag & Search", "📊 Pattern Reports"].map((f) => (
            <span key={f} className="pill">{f}</span>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dream/:id" element={<DreamDetail />} />
        <Route path="/dream/create" element={<DreamCreate />} />
        <Route path="/dream/:id/edit" element={<DreamEdit />} />        
        <Route path="/dreams" element={<DreamList />} />
        
      </Routes>
    </BrowserRouter>
  );
}