import { useState } from "react";
import Light from "./Light";
import "./App.css";

export default function App() {
  // Bulb state
  const [isOn, setIsOn] = useState(true);

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
    <div className={`bulb-app-root${isOn ? " bulb-on" : ""}`}>
      {/* Bulb effect with pull-cord */}
      <Light isOn={isOn} setIsOn={setIsOn} />

      {/* Code Review UI appears only when bulb is ON */}
      {isOn && (
        <main className={`crb-main${feedback || loading ? " split" : ""}`}>
          <section className={`crb-code-block${feedback || loading ? " left" : ""}`}>
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












      
