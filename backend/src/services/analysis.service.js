const { model } = require("mongoose");
const openai = require("../config/ai.config.js");
const ProcessedDream = require("../models/processedDream.model.js");
const RawDream = require("../models/rawDream.model.js");

const createAnalysisPrompt = (dream) => ({
  input: {
    Title: dream.title,
    Description: dream.description,
    Emotions_felt: dream.emotions.join(", "),
    Dream_Type: dream.dream_type,
  },
  instructions: {
    output_format: {
      title: "same_as_input_title",
      date: "current_date_in_DDth_MMM_YYYY_format",
      description: "same_as_input_description",
      interpretation: "interpret_the_dream_based_on_its_content_and_emotions",
      keywords:
        "extract_keywords_from_the_dream_description_and_emotions_in_an_array_format",
      image_prompt: "generate_a_dall_e_prompt_for_an_image_based_on_the_dream",
      sentiment: {
        positive:
          "percentage_of_positive_sentiment_as_a_plain_number_without_any_symbols",
        negative:
          "percentage_of_negative_sentiment_as_a_plain_number_without_any_symbols",
        neutral:
          "percentage_of_neutral_sentiment_as_a_plain_number_without_any_symbols",
      },
    },
    image_prompt_instructions:
      "Create a detailed and vivid prompt for generating an image that visually represents the dream. Include key elements, emotions, and atmosphere described in the dream.",
  },
});

const processDreamAnalysis = async (dreamId) => {
  try {
    const rawDream = await RawDream.findById(dreamId);
    if (!rawDream) throw new Error("Dream not found");

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a dream analysis assistant. Your task is to analyze dreams, provide interpretations, and generate outputs in a structured format.",
        },
        {
          role: "user",
          content: JSON.stringify(createAnalysisPrompt(rawDream)),
        },
      ],
      model: "deepseek/deepseek-chat:free",
      response_format: { type: "json_object" },
    });

    const rawResponse = completion.choices[0].message.content;

    // Clean up response
    const cleanedResponse = rawResponse
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    const analysis = JSON.parse(cleanedResponse);

    console.log(analysis);

    return await ProcessedDream.create({
      dream_id: dreamId,
      ...analysis,
      analysis_version: "v1.2",
    });
  } catch (error) {
    console.error(`Analysis failed for dream ${dreamId}:`, error);

    // Return structured error instead of throwing
    return {
      error: true,
      message: error.message || "Failed to analyze dream",
    };
  }
};

module.exports = processDreamAnalysis;
