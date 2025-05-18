const { generateGeminiImage } = require("./gemini.service.js");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload.js");

const generateGeminiImageAndUpload = async (prompt, dreamId) => {
  try {
    // Generate image buffer from Gemini
    const base64Image = await generateGeminiImage(prompt);
    if (!base64Image) throw new Error("Failed to generate image from Gemini.");

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(base64Image, {
      folder: "dream_images",
      public_id: `dream_${dreamId}_${Date.now()}`,
    });

    return {
      success: true,
      imageUrl: uploadResult,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

module.exports = { generateGeminiImageAndUpload };
