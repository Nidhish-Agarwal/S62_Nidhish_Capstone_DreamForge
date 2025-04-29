const RawDream = require("../models/rawDream.model.js"); // Adjust the path as necessary
const User = require("../models/user.model.js"); // Import User model
const mongoose = require("mongoose");
const { addAnalysisJob } = require("../queues/analysis.queue.js");
const ProcessedDream = require("../models/processedDream.model.js");

const addRawDream = async (req, res) => {
  try {
    const { title, description, emotions, dream_type, date } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!userId || !description || !date) {
      return res
        .status(400)
        .json({ error: "User ID, description, and date are required." });
    }

    // Ensure user_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    // Validate emotions as an array
    if (emotions && !Array.isArray(emotions)) {
      return res.status(400).json({ error: "Emotions should be an array." });
    }

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    // Create and save the dream entry
    const newDream = new RawDream({
      user_id: userId,
      title,
      description,
      emotions,
      dream_type,
      date: parsedDate,
    });

    const savedDream = await newDream.save();

    // Start async processing
    // Add to processing queue
    await addAnalysisJob(savedDream._id);
    // processDreamAnalysis(savedDream._id);

    res.status(201).json({
      ...savedDream.toObject(),
      analysis_status: "processing",
    });
  } catch (error) {
    console.error("Error saving dream:", error);
    res.status(500).json({
      error: "Internal Server Error.",
    });
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

    // Reset retry count for manual retries
    dream.retry_count = 0;
    dream.analysis_status = "pending";
    await dream.save();

    await addAnalysisJob(dream._id);

    res.json({ message: "Retry initiated" });
  } catch (error) {
    res.status(500).json({ error: "Retry failed" });
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

    const filter = {
      user_id: req.userId,
    };

    if (search) {
      // Enhanced search - look in both title and description
      filter.$or = [
        { title: { $regex: search, $options: "i" } }, // case-insensitive search on title
        { description: { $regex: search, $options: "i" } }, // also search in description
      ];
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Fetch paginated raw dreams for the user
    const rawDreamsResult = await RawDream.paginate(filter, {
      page,
      limit,
      sort: { date: -1 },
      select: "-__v -createdAt -updatedAt",
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
    }).select("-__v -createdAt -updatedAt");

    // Create a map for quick lookup
    const processedMap = processedDreams.reduce((acc, curr) => {
      acc[curr.dream_id.toString()] = curr;
      return acc;
    }, {});

    // Merge raw dreams with their processed data
    const mergedDreams = rawDreamsResult.docs.map((rawDream) => {
      const processed = processedMap[rawDream._id.toString()] || null;

      return {
        ...rawDream.toObject(),
        analysis_status: rawDream.analysis_status,
        analysis: processed
          ? {
              sentiment: processed.sentiment,
              keywords: processed.keywords,
              interpretation: processed.interpretation,
              image_prompt: processed.image_prompt,
              processed_at: processed.processed_at,
            }
          : null,
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

module.exports = { addRawDream, retryAnalysis, getAllDreams, toggleLike };
