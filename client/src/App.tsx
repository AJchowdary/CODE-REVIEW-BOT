import React, { useState } from "react";
import "./App.css";

export default function App() {
  // Bulb state
  const [lightOn, setLightOn] = useState(false);

  // Code review states
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle review
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

  return (
    <div className={`bulb-demo-root ${lightOn ? "light-on" : ""}`}>
      <div className="bulb-interaction-area">
        {/* Realistic Bulb */}
        <div className={`bulb-outer ${lightOn ? "on" : ""}`}>
          <svg
            className="bulb-svg"
            viewBox="0 0 120 220"
            width="120"
            height="220"
            aria-hidden="true"
          >
            {/* Bulb Outline */}
            <ellipse
              cx="60"
              cy="100"
              rx="50"
              ry="80"
              fill={lightOn ? "#fffde4" : "#f4f4f4"}
              stroke="#e0e0e0"
              strokeWidth="5"
              filter={lightOn ? "url(#bulbGlow)" : ""}
            />
            {/* Filament */}
            <path
              d="M50 120 Q60 110 70 120"
              stroke={lightOn ? "#ffd700" : "#888"}
              strokeWidth="3"
              fill="none"
            />
            {/* Bulb Base */}
            <rect
              x="45"
              y="180"
              width="30"
              height="25"
              rx="8"
              fill="#bbb"
              stroke="#888"
              strokeWidth="3"
            />
            {/* Glow filter */}
            <defs>
              <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="16" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Filament Glow */}
            {lightOn && (
              <ellipse
                cx="60"
                cy="120"
                rx="18"
                ry="10"
                fill="#ffe066"
                opacity="0.7"
                filter="url(#bulbGlow)"
              />
            )}
          </svg>
          {/* Animated Glow */}
          <div className={`bulb-glow ${lightOn ? "on" : ""}`} />
        </div>
        {/* Bulb Switch Button */}
        <button
          className="bulb-switch"
          onClick={() => setLightOn((on) => !on)}
          aria-label={lightOn ? "Turn off bulb" : "Turn on bulb"}
        >
          {lightOn ? "💡 Turn Off" : "💡 Turn On"}
        </button>
      </div>

      {/* Show code review UI only when bulb is ON */}
      {lightOn && (
        <main className={`crb-main ${feedback || loading ? "split" : ""}`}>
          <section className={`crb-code-block ${feedback || loading ? "left" : ""}`}>
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
          {(feedback || loading) && (
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










      
