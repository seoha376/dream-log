import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const YEARS = Array.from({ length: 10 }, (_, i) => 2020 + i);

// 꿈이 기록된 날짜 예시 데이터
const DREAM_DATES = { "2025-8-9": true, "2025-8-13": true, "2025-8-20": true };

const recentDreams = [
  { id: 1, title: "Dream 1", date: "2025.08.13", preview: "I was flying over a misty city..." },
  { id: 2, title: "Dream 2", date: "2025.08.09", preview: "A vast ocean with glowing waves..." },
  { id: 3, title: "Dream 3", date: "2025.08.01", preview: "Running through an endless forest..." },
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
  const daysInPrevMonth = getDaysInMonth(selectedYear, selectedMonth - 1);

  // 캘린더 셀 배열 생성
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: daysInPrevMonth - firstDay + 1 + i, current: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, current: true });
  }
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, current: false });
  }

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };

  const isToday = (day) =>
    day === today.getDate() &&
    selectedMonth === today.getMonth() &&
    selectedYear === today.getFullYear();

  const hasDream = (day) => DREAM_DATES[`${selectedYear}-${selectedMonth}-${day}`];

  return (
    <div className="root">
      {/* Starfield */}
      <div className="starfield" aria-hidden="true">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="star" style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: Math.random() * 2.5 + 0.5, height: Math.random() * 2.5 + 0.5,
            animationDelay: `${Math.random() * 4}s`, animationDuration: `${Math.random() * 3 + 2}s`,
          }} />
        ))}
      </div>
      <div className="aurora" aria-hidden="true" />

      {/* Navbar */}
      <nav className="nav">
        <div className="nav-logo">
          <img src={logo} alt="Dream Log" className="nav-logo-img" />
        </div>
        <div className="nav-actions">
          <span className="nav-greeting">Welcome</span>
          <button className="btn-ghost" onClick={() => navigate("/")}>Logout</button>
        </div>
      </nav>

      {/* Dashboard Body */}
      <div className="dash-body">

        {/* Left: Calendar */}
        <div className="dash-left">
          <div className="dash-card">
            <div className="cal-header">
              <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
              <div className="cal-selects">
                <select
                  className="cal-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <select
                  className="cal-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <button className="cal-nav-btn" onClick={nextMonth}>›</button>
            </div>

            <div className="cal-grid">
              {DAY_NAMES.map(d => (
                <div key={d} className="cal-day-name">{d}</div>
              ))}
              {cells.map((cell, idx) => (
                <div
                  key={idx}
                  className={[
                    "cal-cell",
                    !cell.current ? "cal-cell-muted" : "",
                    cell.current && isToday(cell.day) ? "cal-cell-today" : "",
                    cell.current && selectedDay === cell.day && !isToday(cell.day) ? "cal-cell-selected" : "",
                    cell.current && hasDream(cell.day) ? "cal-cell-has-dream" : "",
                  ].join(" ")}
                  onClick={() => cell.current && setSelectedDay(cell.day)}
                >
                  {cell.day}
                  {cell.current && hasDream(cell.day) && (
                    <span className="dream-dot" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions + Recent Dreams */}
        <div className="dash-right">
          <button className="btn-new-dream" onClick={() => navigate("/dream/create")}>
            ✦ New Dream
          </button>
          <button className="btn-see-all" onClick={() => navigate("/dreams")}>
            See entire dreams
          </button>

          <div className="recent-label">Recent Dreams</div>

          <div className="recent-list">
            {recentDreams.map((dream) => (
              <div
                key={dream.id}
                className="dream-item"
                onClick={() => navigate(`/dream/${dream.id}`)}
              >
                <div className="dream-item-top">
                  <span className="dream-item-title">{dream.title}</span>
                  <span className="dream-item-date">{dream.date}</span>
                </div>
                <p className="dream-item-preview">{dream.preview}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
