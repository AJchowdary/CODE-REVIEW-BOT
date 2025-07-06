import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleReview = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setFeedback(data.feedback);
    } catch (error) {
      setFeedback("Failed to fetch feedback. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>AI Code Review Bot</h1>
      <textarea
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button onClick={handleReview}>Review Code</button>
      {feedback && (
        <pre>
          <strong>Feedback:</strong>
          <br />
          {feedback}
        </pre>
      )}
    </div>
  );
}

export default App;

      
