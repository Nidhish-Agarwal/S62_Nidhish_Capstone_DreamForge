const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer.js");
require("dotenv").config();

// Password validation function
const validatePassword = (password) => {
  // Length validation
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters",
    };
  }

  if (password.length > 16) {
    return {
      isValid: false,
      message: "Password can be at most 16 characters",
    };
  }

  // Uppercase letter validation
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Must include at least one uppercase letter",
    };
  }

  // Lowercase letter validation
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Must include at least one lowercase letter",
    };
  }

  // Number validation
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Must include at least one number",
    };
  }

  // Special character validation
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Must include at least one special character",
    };
  }

  return {
    isValid: true,
    message: "Password is valid",
  };
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Comprehensive password validation
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    // Check if new password is the same as current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Find user in database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has a password (for social login users)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "Password change not available for social login accounts. Please contact support.",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await User.findByIdAndUpdate(
      userId,
      {
        password: hashedNewPassword,
      },
      { new: true }
    );

    // Success response
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);

    // Handle specific database errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    if (error.name === "MongoError" || error.name === "MongoServerError") {
      return res.status(500).json({
        success: false,
        message: "Database error occurred. Please try again later.",
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Valid email required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.provider !== "local") {
      return res.status(200).json({
        success: true,
        message: "If the email exists, reset instructions have been sent.",
      });
    }

    const issuedAt = new Date();
    user.resetPasswordIssuedAt = issuedAt;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, issuedAt: issuedAt.toISOString() },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "15m" }
    );

    const link = `${process.env.FRONTEND_URL_LOCAL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"DreamForge Support" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h2>Reset Password</h2>
        <p>Click below to reset:</p>
        <a href="${link}">Reset Now</a>
        <p>Expires in 15 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "If the email exists, reset instructions have been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || typeof token !== "string" || !newPassword) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validation.message });
    }

    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const { userId, issuedAt } = decoded;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.provider !== "local") {
      return res.status(400).json({
        success: false,
        message: "Social login accounts can't reset password this way",
      });
    }

    // Check token has not already been used
    if (
      !user.resetPasswordIssuedAt ||
      new Date(user.resetPasswordIssuedAt).toISOString() !== issuedAt
    ) {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired or was already used",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // Invalidate token after use
    user.resetPasswordIssuedAt = null;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired. Please request a new one.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }
    console.error("Reset password error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = {
  changePassword,
  forgotPassword,
  resetPassword,
};
