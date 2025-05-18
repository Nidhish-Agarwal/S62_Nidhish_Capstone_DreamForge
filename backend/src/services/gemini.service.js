const { GoogleGenAI, Modality } = require("@google/genai");

async function generateGeminiImage(prompt) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts;

    if (!parts || !Array.isArray(parts)) {
      throw new Error("Invalid response format: parts missing or not an array");
    }

    const imagePart = parts.find((p) =>
      p.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart || !imagePart.inlineData?.data) {
      throw new Error("No image data found in response");
    }

    const base64Image = imagePart.inlineData.data;
    return base64Image;
  } catch (error) {
    console.error("Error generating Gemini image:", error);
    throw error;
  }
}

module.exports = { generateGeminiImage };
