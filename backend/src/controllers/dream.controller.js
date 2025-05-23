const RawDream = require("../models/rawDream.model.js"); // Adjust the path as necessary
const User = require("../models/user.model.js"); // Import User model
const mongoose = require("mongoose");
const { addAnalysisJob } = require("../queues/analysis.queue.js");
const ProcessedDream = require("../models/processedDream.model.js");
const { addImageJob } = require("../queues/image.queue.js");
const { z } = require("zod");

const moodLabels = ["Terrified", "Sad", "Neutral", "Happy", "Euphoric"];

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  date: z.string().min(1, "Date is required."),
  mood: z.enum(moodLabels),
  intensity: z.number().min(0).max(100),
  symbols: z.array(z.string()).optional(),
  themes: z.array(z.string()).optional(),
  characters: z.array(z.string()).optional(),
  setting: z.array(z.string()).optional(),
  notes_to_ai: z.string().optional(),
  real_life_link: z.string().optional(),
});

const addRawDream = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    // Validate the incoming body using Zod schema
    const parsedData = schema.safeParse(req.body);
    if (!parsedData.success) {
      // Extract all error messages from zod error
      const errorMessages = parsedData.error.errors
        .map((e) => e.message)
        .join(", ");
      return res
        .status(400)
        .json({ error: `Validation failed: ${errorMessages}` });
    }

    // Parse and validate date separately as Date object
    const parsedDate = new Date(parsedData.data.date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    // Build the new dream object to save
    const newDreamData = {
      user_id: userId,
      title: parsedData.data.title,
      description: parsedData.data.description,
      date: parsedDate,
      mood: parsedData.data.mood,
      intensity: parsedData.data.intensity,
      symbols: parsedData.data.symbols || [],
      themes: parsedData.data.themes || [],
      characters: parsedData.data.characters || [],
      setting: parsedData.data.setting || [],
      notes_to_ai: parsedData.data.notes_to_ai || "",
      real_life_link: parsedData.data.real_life_link || "",
    };

    const newDream = new RawDream(newDreamData);
    const savedDream = await newDream.save();

    // Adding To queue for AI processing
    await addAnalysisJob(savedDream._id, userId);

    return res.status(201).json({
      ...savedDream.toObject(),
      analysis_status: "processing",
    });
  } catch (error) {
    console.error("Error saving dream:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

// Retry Analysis Controller
const retryAnalysis = async (req, res) => {
  try {
    const dream = await RawDream.findById(req.params.id);

    if (!dream) return res.status(404).json({ error: "Dream not found" });
    if (dream.retry_count >= 3) {
      return res.status(400).json({ error: "Max retries exceeded" });
    }

    dream.analysis_status = "pending";
    await dream.save();

    await addAnalysisJob(dream._id, req.userId);

    res.json({ message: "Retry initiated" });
  } catch (error) {
    res.status(500).json({ error: "Retry failed" });
  }
};

const retryImageGeneration = async (req, res) => {
  try {
    const dream = await ProcessedDream.findById(req.params.id);
    if (!dream) return res.status(404).json({ error: "Dream not found" });

    // Optional: Retry limit (can also track image_retry_count separately)
    if (dream.image_retry_count >= 3) {
      return res.status(400).json({ error: "Max image retries exceeded" });
    }

    // Reset image status and increment retry count
    dream.image_status = "pending";
    // dream.image_retry_count = (dream.image_retry_count || 0) + 1;
    await dream.save();

    // Add image generation job
    await addImageJob(dream._id, dream.image_prompt, req.userId);

    res.json({ message: "Image generation retry initiated." });
  } catch (err) {
    console.error("Image retry failed:", err);
    res.status(500).json({ error: "Image retry failed" });
  }
};

// Get All Dreams Controller
const getAllDreams = async (req, res) => {
  try {
    // Ensure userId is available
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }
    const search = req.query.search?.trim() || "";
    const sortOption = req.query.sort || "newest";
    const likedOnly = req.query.likedOnly === "true";
    const mood = req.query.mood ? req.query.mood.split(",") : [];
    const dream_personality_type = req.query.dream_personality_type
      ? req.query.dream_personality_type.split(",")
      : [];
    const status = req.query.status ? req.query.status.split(",") : [];
    const from = req.query.from || "";
    const to = req.query.to || "";

    const filter = {
      user_id: req.userId,
    };

    if (likedOnly) {
      filter.isLiked = true;
    }

    if (mood.length > 0) {
      filter.mood = { $in: mood };
    }

    if (status.length > 0) {
      filter.analysis_status = { $in: status };
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    if (search) {
      // Enhanced search - look in both title and description
      filter.$or = [
        { title: { $regex: search, $options: "i" } }, // case-insensitive search on title
        { description: { $regex: search, $options: "i" } }, // also search in description
      ];
    }

    const processedFilter = {};
    if (dream_personality_type.length > 0) {
      processedFilter["dream_personality_type.type"] = {
        $in: dream_personality_type,
      };
    }

    let matchingDreamIds = null;
    if (Object.keys(processedFilter).length > 0) {
      const matchedProcessed = await ProcessedDream.find(processedFilter)
        .select("dream_id")
        .lean();
      matchingDreamIds = matchedProcessed.map((d) => d.dream_id.toString());

      // If no matching dreams from processed side, early return
      if (matchingDreamIds.length === 0) {
        return res.json({
          dreams: [],
          totalPages: 0,
          currentPage: 1,
          totalItems: 0,
        });
      }

      // Add to raw filter
      filter._id = { $in: matchingDreamIds };
    }

    let sort = { createdAt: -1 };
    switch (sortOption) {
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "liked":
        sort = { isLiked: -1, createdAt: -1 };
        break;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Fetch paginated raw dreams for the user
    const rawDreamsResult = await RawDream.paginate(filter, {
      page,
      limit,
      sort,
      select: "-__v -createdAt -updatedAt",
      lean: true,
    });

    // If no dreams found, return an empty response
    if (!rawDreamsResult.docs.length) {
      return res.json({
        dreams: [],
        totalPages: rawDreamsResult.totalPages,
        currentPage: rawDreamsResult.page,
        message: "No dreams found for this user",
      });
    }

    // Extract raw dream IDs
    const rawDreamIds = rawDreamsResult.docs.map((doc) => doc._id);

    // Find corresponding processed dreams
    const processedDreams = await ProcessedDream.find({
      dream_id: { $in: rawDreamIds },
    })
      .select("-__v -createdAt -updatedAt")
      .lean();

    // Create a map for quick lookup
    const processedMap = processedDreams.reduce((acc, curr) => {
      acc[curr.dream_id.toString()] = curr;
      return acc;
    }, {});

    // Merge raw dreams with their processed data
    const mergedDreams = rawDreamsResult.docs.map((rawDream) => {
      const processed = processedMap[rawDream._id.toString()] || null;

      return {
        ...rawDream,
        analysis: processed ? processed : null,
      };
    });

    res.json({
      dreams: mergedDreams,
      totalPages: rawDreamsResult.totalPages,
      currentPage: rawDreamsResult.page,
      totalItems: rawDreamsResult.totalDocs,
    });
  } catch (error) {
    console.error("Error fetching dreams:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch dreams. Please try again later." });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // dream id
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const dream = await RawDream.findById(id);
    if (!dream) {
      return res.status(404).json({ error: "Dream not found" });
    }
    const newLikeStatus = !dream.isLiked;
    dream.isLiked = newLikeStatus;
    await dream.save();
    res.json({ success: true, isLiked: newLikeStatus });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to update like status" });
  }
};

module.exports = {
  addRawDream,
  retryAnalysis,
  getAllDreams,
  toggleLike,
  retryImageGeneration,
};
