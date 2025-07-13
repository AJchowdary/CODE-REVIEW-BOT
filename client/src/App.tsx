import React, { useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lightOn, setLightOn] = useState(false);
  const [dragY, setDragY] = useState(0);
  const leverRef = useRef<HTMLDivElement>(null);

  // Handle lever drag (mouse/touch)
  const handleLeverDrag = (clientY: number) => {
    const leverTop = leverRef.current?.getBoundingClientRect().top || 0;
    const diff = clientY - leverTop;
    setDragY(diff > 0 && diff < 100 ? diff : 0);
    if (diff > 80) {
      setLightOn(true);
      setDragY(0);
    }
  };

  // Mouse events
  const onMouseDown = () => {
    const move = (ev: MouseEvent) => handleLeverDrag(ev.clientY);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      setDragY(0);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // Touch events
  const onTouchMove = (e: React.TouchEvent) => {
    handleLeverDrag(e.touches[0].clientY);
  };
  const onTouchEnd = () => setDragY(0);

  // Review handler
  const handleReview = async () => {
    setLoading(true);
    setFeedback("");
    setError("");
    try {
      const res = await fetch("https://code-review-bot-3yq7.onrender.com/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.feedback) setFeedback(data.feedback);
      else setError("No feedback returned.");
    } catch {
      setError("Failed to get feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setFeedback("");
    setError("");
  };

  // Layout control
  const showSplit = loading || feedback;

  return (
    <div className={`crb-root ${lightOn ? "light-on" : ""}`}>
      {/* Light Pull Lever */}
      {!lightOn && (
        <div className="crb-lever-area">
          <div
            className="crb-lever"
            ref={leverRef}
            style={{ transform: `translateY(${dragY}px)` }}
            onMouseDown={onMouseDown}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            tabIndex={0}
            role="button"
            aria-label="Pull down to turn on light"
          >
            <div className="crb-lever-knob" />
            <div className="crb-lever-string" />
            <span className="crb-lever-label">Pull to turn on light</span>
          </div>
        </div>
      )}

      {/* Main App UI */}
      {lightOn && (
        <main className={`crb-main ${showSplit ? "split" : ""}`}>
          <section className={`crb-code-block ${showSplit ? "left" : ""}`}>
            <h1 className="crb-title">🌈 AI Code Review Bot</h1>
            <form
              className="crb-review-form"
              onSubmit={e => {
                e.preventDefault();
                handleReview();
              }}
              aria-label="Code review form"
            >
              <label htmlFor="crb-code-input" className="crb-visually-hidden">
                Paste your code here
              </label>
              <textarea
                id="crb-code-input"
                name="code"
                placeholder="Paste your code here..."
                value={code}
                onChange={e => setCode(e.target.value)}
                disabled={loading}
                aria-label="Code input"
                aria-required="true"
              />
              <div className="crb-button-group">
                <button
                  type="submit"
                  disabled={loading || !code}
                  aria-busy={loading}
                  aria-label="Review code"
                >
                  {loading ? "Reviewing..." : "Review Code"}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading && !code}
                  aria-label="Clear code and feedback"
                  className="crb-btn--secondary"
                >
                  Clear
                </button>
              </div>
            </form>
            {error && (
              <pre className="crb-error" role="alert" tabIndex={0}>
                <strong>Error:</strong>
                <br />
                {error}
              </pre>
            )}
          </section>
          {showSplit && (
            <section className="crb-review-block">
              {feedback && (
                <pre className="crb-feedback" aria-live="polite" tabIndex={0}>
                  <strong>Feedback:</strong>
                  <br />
                  {feedback}
                </pre>
              )}
              {loading && (
                <div className="crb-feedback crb-loading">
                  <span>Reviewing your code...</span>
                </div>
              )}
            </section>
          )}
        </main>
      )}
    </div>
  );
}







      
