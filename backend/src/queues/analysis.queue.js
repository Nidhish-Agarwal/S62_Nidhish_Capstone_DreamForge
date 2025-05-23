const RawDream = require("../models/rawDream.model.js");
const processDreamAnalysis = require("../services/analysis.service.js");
const { emitDreamUpdate } = require("../utils/socketHelper.js");
const { addImageJob } = require("./image.queue.js");

let PQueue;
let analysisQueue;

// Delay function
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Function to process a dream analysis job
const processJob = async (dreamId, userId, attempt = 1, isManual = false) => {
  try {
    // Update dream status to processing
    const update = {
      $set: { analysis_status: "processing", analysis_is_retrying: true },
    };

    if (isManual) {
      update.$inc = { retry_count: 1 };
    }

    await RawDream.findByIdAndUpdate(dreamId, update);

    const rawDream = await RawDream.findById(dreamId).lean();

    try {
      emitDreamUpdate(userId, dreamId, {
        ...rawDream,
        analysis_status: "processing",
        analysis_is_retrying: true,
        analysis: null,
      });
    } catch (er) {
      console.error("failed to emit dream update", er.message);
    }

    // Process analysis
    const analysis = await processDreamAnalysis(dreamId);

    if (analysis.error) {
      throw new Error(analysis.message);
    }

    // Update successful status
    await RawDream.findByIdAndUpdate(dreamId, {
      analysis_status: "completed",
      analysis_is_retrying: false,
      $push: {
        analysis_attempts: { status: "success", timestamp: new Date() },
      },
    });

    try {
      emitDreamUpdate(userId, dreamId, {
        ...rawDream,
        analysis_status: "completed",
        analysis_is_retrying: false,
        analysis: analysis
          ? {
              ...analysis,
              image_retry_count: 0,
              image_status: "pending",
            }
          : null,
      });
    } catch (er) {
      console.error("failed to emit dream update", er.message);
    }
    // ⏩ Trigger image generation if prompt exists
    if (analysis?.image_prompt) {
      addImageJob(analysis._id, analysis.image_prompt, userId);
    }

    console.log(`Job completed for dream ${dreamId}`);
  } catch (error) {
    console.error(`Job failed for dream ${dreamId}:`, error.message);

    // Update failed status without crashing
    await RawDream.findByIdAndUpdate(dreamId, {
      analysis_status: "failed",
      $push: {
        analysis_attempts: {
          status: "failed",
          error: error.message,
          timestamp: new Date(),
        },
      },
    });
    try {
      emitDreamUpdate(userId, dreamId, {
        analysis_status: "failed",
        error: error.message,
      });
    } catch (er) {
      console.error("failed to emit dream update", er.message);
    }

    // ✅ Retry up to 2 more times (total 3)
    if (attempt < 3) {
      console.log(`Retrying dream ${dreamId} in 10s (attempt ${attempt + 1})`);
      await delay(10000); // 10 second delay
      analysisQueue.add(() => processJob(dreamId, userId, attempt + 1, false));
    } else {
      await RawDream.findByIdAndUpdate(dreamId, {
        $set: {
          analysis_status: "failed",
          analysis_is_retrying: false,
        },
      });

      try {
        emitDreamUpdate(userId, dreamId, {
          analysis_status: "failed",
          analysis_is_retrying: false,
          analysis: null,
        });
      } catch (er) {
        console.error("failed to emit dream update", er.message);
      }
    }
  }
};

// Function to add a new job
const addAnalysisJob = async (dreamId, userId) => {
  if (!analysisQueue) {
    console.error("Queue is not initialized yet.");
    return;
  }
  analysisQueue.add(() => processJob(dreamId, userId, 1, true));
};

// Initialize queue
(async () => {
  const { default: PQueueModule } = await import("p-queue");
  PQueue = PQueueModule;
  analysisQueue = new PQueue({ concurrency: 1 });
})();

module.exports = { addAnalysisJob };
