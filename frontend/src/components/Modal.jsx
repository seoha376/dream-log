export default function Modal({ open, type, message, onClose }) {
  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-box ${isSuccess ? "modal-success" : "modal-error"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon">
          {isSuccess ? (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="rgba(167,139,250,0.15)" />
              <path d="M12 20.5l5.5 5.5 10.5-11" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="rgba(248,113,113,0.15)" />
              <path d="M14 14l12 12M26 14L14 26" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        <h3 className="modal-heading">{isSuccess ? "성공!" : "오류 발생"}</h3>
        <p className="modal-message">{message}</p>

        <button
          className={`modal-btn ${isSuccess ? "modal-btn-success" : "modal-btn-error"}`}
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}