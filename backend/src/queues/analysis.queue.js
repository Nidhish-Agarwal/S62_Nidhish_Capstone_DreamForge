const RawDream = require("../models/rawDream.model.js");
const processDreamAnalysis = require("../services/analysis.service.js");
const { emitDreamUpdate } = require("../utils/socketHelper.js");

let PQueue;
let analysisQueue;

// Function to process a dream analysis job
const processJob = async (dreamId) => {
  try {
    // Update dream status to processing
    await RawDream.findByIdAndUpdate(dreamId, {
      analysis_status: "processing",
      $inc: { retry_count: 1 },
    });

    const rawDream = await RawDream.findById(dreamId).lean();

    emitDreamUpdate(dreamId, {
      ...rawDream,
      analysis_status: "processing",
      analysis: null,
    });

    // Process analysis
    const analysis = await processDreamAnalysis(dreamId);

    if (analysis.error) {
      throw new Error(analysis.message);
    }

    // Update successful status
    await RawDream.findByIdAndUpdate(dreamId, {
      analysis_status: "completed",
      $push: {
        analysis_attempts: { status: "success", timestamp: new Date() },
      },
    });

    emitDreamUpdate(dreamId, {
      ...rawDream,
      analysis_status: "completed",
      analysis: analysis
        ? {
            sentiment: analysis.sentiment,
            keywords: analysis.keywords,
            interpretation: analysis.interpretation,
            image_prompt: analysis.image_prompt,
          }
        : null,
    });

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

    emitDreamUpdate(dreamId, {
      analysis_status: "failed",
      error: error.message,
    });
  }
};

// Function to add a new job
const addAnalysisJob = async (dreamId) => {
  if (!analysisQueue) {
    console.error("Queue is not initialized yet.");
    return;
  }
  analysisQueue.add(() => processJob(dreamId));
};

// Initialize queue
(async () => {
  const { default: PQueueModule } = await import("p-queue");
  PQueue = PQueueModule;
  analysisQueue = new PQueue({ concurrency: 1 });
})();

module.exports = { addAnalysisJob };
