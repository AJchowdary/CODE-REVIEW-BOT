import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/api/review", async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile", // ✅ Model must match Groq's accepted models
        messages: [
          {
            role: "system",
            content:
              "You are a code review assistant. Provide feedback on code quality, readability, and improvements.",
          },
          {
            role: "user",
            content: `Please review the following code:\n\n${code}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`, // ✅ Must use Bearer token
        },
      }
    );

    const feedback = response.data.choices[0].message?.content || "No feedback returned.";
    res.json({ feedback });
  } catch (error: any) {
    console.error("Groq error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Error from Groq API" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


