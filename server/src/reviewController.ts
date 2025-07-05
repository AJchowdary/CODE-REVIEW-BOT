import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  return response.data.choices[0].message?.content || "No feedback available.";
};


