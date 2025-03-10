const { uploadProfilePicture } = require("../utils/multerConfig.js");
const cloudinary = require("../config/cloudinary.js");

const handleProfilePictureUpload = (req, res, next) => {
  uploadProfilePicture.single("profileImage")(req, res, async (err) => {
    try {
      if (err) {
        throw new Error(err.message || "File upload failed");
      }

      if (!req.file) {
        return next(); // Move to the next middleware without error
      }

      // Upload buffer to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profile_images",
            public_id: `user_${req.userId}_${Date.now()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      req.cloudinaryResult = uploadResult;

      next();
    } catch (error) {
      console.error("Upload middleware error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "File upload failed",
      });
    }
  });
};

module.exports = { handleProfilePictureUpload };
