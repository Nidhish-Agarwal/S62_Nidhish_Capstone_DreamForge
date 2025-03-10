const multer = require("multer");
const path = require("path");

// Configure file filter

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

// Configure storage
const storage = multer.memoryStorage(); // Keep files in memory for Cloudinary upload

// Create configured Multer instances
const uploadProfilePicture = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Single file
  },
});

module.exports = { uploadProfilePicture };
