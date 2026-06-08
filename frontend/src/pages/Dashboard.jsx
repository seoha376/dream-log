import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { getDreams } from "../api/dreamApi";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const YEARS = Array.from({ length: 10 }, (_, i) => 2020 + i);


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
  const [recentDreams, setRecentDreams] = useState([]);
  const [dreamDates, setDreamDates] = useState({});

  useEffect(() => {
    const loadDreams = async () => {
      try {
        const res = await getDreams();
        const dreams = res.data;
        setRecentDreams(dreams.slice(0, 3));
        const dates = {};
        dreams.forEach((d) => {
          const [year, month, day] = d.dream_date.split("-");
          dates[`${year}-${Number(month) - 1}-${Number(day)}`] = true;
        });
        setDreamDates(dates);
      } catch (err) {
        console.error(err);
      }
    };
    loadDreams();
  }, []);

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

  const hasDream = (day) => dreamDates[`${selectedYear}-${selectedMonth}-${day}`];

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
                key={dream.dream_id}
                className="dream-item"
                onClick={() => navigate(`/dream/${dream.dream_id}`)}
              >
                <div className="dream-item-top">
                  <span className="dream-item-title">{dream.title}</span>
                  <span className="dream-item-date">{dream.dream_date}</span>
                </div>
                <p className="dream-item-preview">{dream.ai_summary || dream.content?.slice(0, 50)}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
