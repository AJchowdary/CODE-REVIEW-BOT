// App.tsx

import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleReview = async () => {
    const res = await fetch("http://localhost:4000/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    setFeedback(data.feedback);
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
