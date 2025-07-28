import { useState, useEffect, useRef } from "react";
import "./App.css";

const clickSoundUrl =
  "https://assets.mixkit.co/sfx/preview/mixkit-light-switch-on-2585.mp3";

export default function App() {
  const [isLightOn, setIsLightOn] = useState(false); // intro toggle state
  const [showIntro, setShowIntro] = useState(true); // show/hide intro screen
  const [opacity, setOpacity] = useState(1); // flicker opacity for intro
  const flickerCountRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  // Your existing states and handlers for code review bot
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Flicker and fade out intro when toggled ON
  useEffect(() => {
    if (isLightOn) {
      if (clickSoundRef.current) {
        clickSoundRef.current.play();
      }
      flickerCountRef.current = 0;
      intervalRef.current = window.setInterval(() => {
        flickerCountRef.current++;
        setOpacity(flickerCountRef.current % 2 === 0 ? 1 : 0.1);
        if (flickerCountRef.current > 4 && intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          setOpacity(0);
          setTimeout(() => {
            setShowIntro(false);
            document.body.style.backgroundColor = "#f5f5f5";
            document.body.style.overflow = "auto";
          }, 800);
        }
      }, 150);
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLightOn]);

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

      if (res.status === 204) {
        setError("No feedback returned. Server responded with 204 No Content.");
        return;
      }

      if (!res.ok) {
        const errMsg = `Request failed with status ${res.status}`;
        console.error(errMsg);
        throw new Error(errMsg);
      }

      const data = await res.json();

      if (data.feedback) {
        setFeedback(data.feedback);
      } else {
        setError("Feedback was empty or not in expected format.");
      }
    } catch (err) {
      console.error("Review failed:", err);
      setError("Failed to get feedback. Please try again later.");
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
    <>
      {/* Intro Screen with toggle switch */}
      {showIntro && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "linear-gradient(145deg, #0f0f1f, #1a1a2e)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#f5f5f5",
            textAlign: "center",
            zIndex: 1000,
            opacity,
            transition: "opacity 0.15s ease",
          }}
        >
          <h2>It's dark in here...</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>💡 Turn On the Light</span>
            <label
              style={{
                position: "relative",
                display: "inline-block",
                width: 70,
                height: 34,
              }}
            >
              <input
                type="checkbox"
                checked={isLightOn}
                onChange={() => setIsLightOn(!isLightOn)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isLightOn ? "#ffd700" : "#444",
                  borderRadius: 34,
                  transition: "background-color 0.5s ease, box-shadow 0.5s ease",
                  boxShadow: isLightOn ? "0 0 20px #ffd700" : "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    height: 26,
                    width: 26,
                    left: isLightOn ? 36 : 4,
                    bottom: 4,
                    backgroundColor: isLightOn ? "#fff7d1" : "white",
                    transition: "transform 0.5s ease, background-color 0.3s",
                    borderRadius: "50%",
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.6)",
                  }}
                />
              </span>
            </label>
          </div>

          <audio ref={clickSoundRef} src={clickSoundUrl} preload="auto" />
        </div>
      )}

      {/* Main content only shows after intro is hidden */}
{!showIntro && (
  <div
    className={`bulb-app-root bulb-on centered-ui`}
  >
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
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
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
            style={{ flex: 1, minHeight: 0, maxHeight: "100%" }}
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
  </div>
)}






















      
