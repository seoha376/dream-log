// backend/src/services/aiService.js

const { GoogleGenAI } = require("@google/genai");

const fallbackSummary = (content) => {
  if (!content) return "";

  const trimmedContent = content.trim();

  if (trimmedContent.length <= 120) {
    return trimmedContent;
  }

  return `${trimmedContent.slice(0, 120)}...`;
};

const generateDreamSummary = async (content) => {
  if (!content) return "";

  if (!process.env.GEMINI_API_KEY) {
    return fallbackSummary(content);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `
Summarize the following dream in 1-2 concise sentences.
Keep the tone natural and reflective.
Do not add information that is not in the dream.

Dream:
${content}
`
    });

    const summary = response.text?.trim();

    if (!summary) {
      return fallbackSummary(content);
    }

    return summary;
  } catch (err) {
    console.error("GEMINI SUMMARY ERROR:", err.message);
    return fallbackSummary(content);
  }
};

module.exports = {
  generateDreamSummary
};