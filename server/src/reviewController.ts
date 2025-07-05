import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
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

  const response = await axios.post(
    GROQ_API_URL,
    {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message?.content || "No feedback available.";
};



