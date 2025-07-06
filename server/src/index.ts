import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { reviewCode } from "./reviewController";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://code-review-bot-rho.vercel.app", // ✅ Your frontend Vercel domain
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});



