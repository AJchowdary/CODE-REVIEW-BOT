import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROQ_API_URL = "https://api.groq.com/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY; // Make sure this exists in your .env

export const reviewCode = async (code: string): Promise<string> => {
  const prompt = `      
You are an experienced senior software engineer.
Review the following code and provide:
- Code issues or bugs
- Suggestions for improvements
- Code readability tips
- Security or performance issues (if any)

Code:
${code}
`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-2-7b-chat", // Use smaller, faster model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500, // Limit tokens for faster response
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    return response.data.choices[0].message?.content || "No feedback available.";
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      return "Request timed out. Please try again.";
    }
    console.error("Groq API error:", error.message || error);
    return "Failed to fetch review due to server error.";
  }
};




