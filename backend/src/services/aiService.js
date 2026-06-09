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


  const apiKey = process.env.GEMINI_API_KEY?.trim();

  console.log("GEMINI KEY:", apiKey);
  console.log("GEMINI KEY FIRST CHAR CODE:", apiKey?.charCodeAt(0));

//   if (!process.env.GEMINI_API_KEY) {
//     return fallbackSummary(content);
//   }

  if (!apiKey) {
      return fallbackSummary(content);
    }

  try {
    const ai = new GoogleGenAI({
    //   apiKey: process.env.GEMINI_API_KEY
        apiKey
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Summarize the following dream in 1-2 concise sentences.
Keep the tone natural and reflective.
Do not add information that is not in the dream.

Dream:
${content}
`
            }
          ]
        }
      ]
    });

    const summary = response.text?.trim();

    if (!summary) {
      return fallbackSummary(content);
    }

    return summary;
  } catch (err) {
      console.error("GEMINI SUMMARY ERROR FULL:");
      console.error(err);
      return fallbackSummary(content);
    }
};

module.exports = {
  generateDreamSummary
};