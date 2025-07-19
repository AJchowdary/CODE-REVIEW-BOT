import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { reviewCode } from "./reviewController";
dotenv.config();
const app = express();

// 🔑 Middleware order
app.use(express.json());

app.use(
  cors({
    origin: "https://code-review-bot-rho.vercel.app",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// ✅ Health check route (optional but recommended)
app.get("/", (req, res) => {
  res.send("✅ Code Review Bot Backend is live.");
});

// ✅ Main API route
app.post("/api/review", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const feedback = await reviewCode(code);
    res.json({ feedback });
  } catch (err) {
    console.error("Groq API error:", err);
    res.status(500).json({ error: "Failed to fetch review" });
  }
});

// ✅ Required for Render
const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0"; // 👈 this is essential

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
});




