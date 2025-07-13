import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      if (data.feedback) {
        setFeedback(data.feedback);
      } else {
        setError("No feedback returned.");
      }
    } catch (err) {
      setError("Failed to get feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // FIXED handleClear function
  const handleClear = () => {
    setCode("");
    setFeedback("");
    setError("");
  };

  return (
    <div>
      <h1>AI Code Review Bot</h1>
      <textarea
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={loading}
      />
      <br />
      <button onClick={handleReview} disabled={loading || !code}>
        {loading ? "Reviewing..." : "Review Code"}
      </button>
      <button onClick={handleClear} disabled={loading && !code} style={{ marginLeft: "1rem" }}>
        Clear
      </button>
      {error && (
        <pre className="error">
          <strong>Error:</strong>
          <br />
          {error}
        </pre>
      )}
      {feedback && (
        <pre className="feedback">
          <strong>Feedback:</strong>
          <br />
          {feedback}
        </pre>
      )}
    </div>
  );
}

export default App;

      
