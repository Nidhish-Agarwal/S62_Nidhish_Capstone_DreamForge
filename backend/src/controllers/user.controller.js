const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getCurrentStreak } = require("./dream.controller.js");
const RawDream = require("../models/rawDream.model.js");
const transporter = require("../utils/mailer.js");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to DB
    await newUser.save();

    // Generate Access Token
    const accessToken = jwt.sign(
      { userId: newUser._id, roles: newUser.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Generating Refresh Token
    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Storing Refresh Token in DB
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Storing refreshToken in httpOnly Cookie
    // This is done to verify and get a new access token upon it's expiration

    // Secure won't work in thunderclient

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    // For Testing purposes
    // res.cookie("jwt", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    //   sameSite: "None",
    // });

    return res.status(201).json({
      message: "User registered successfully",
      roles: newUser.roles,
      _id: newUser._id,
      accessToken,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate Access Token
    const accessToken = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Generating Refresh Token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Storing Refresh Token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Storing refreshToken in httpOnly Cookie
    // This is done to verify and get a new access token upon it's expiration

    // Secure won't work in thunderclient

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    // For Testing purposes
    // res.cookie("jwt", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    //   sameSite: "None",
    // });

    // Send response
    return res.status(200).json({
      message: "Login successful",
      roles: user.roles,
      _id: user._id,
      accessToken,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res
      .status(200)
      .send({ message: "Successfully fetched the users", data: users });
  } catch (er) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logging out the user by deleting their refresh token
const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  // If there is no cookie just send a status
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  // Checking the refresh token in DB
  const foundUser = await User.findOne({ refreshToken: refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }

  // Delete refreshToken in DB
  foundUser.refreshToken = "";
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  return res.sendStatus(204);
};

const fetchUserData = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const foundUser = await User.findById(userId).lean(); // Optimize with `.lean()`

    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const rawDreamData = await RawDream.find({ user_id: userId }, "date");

    // Extract Dream dates to calculate streak
    const dreamDates = rawDreamData.map((dream) => dream.date);

    const { streak } = getCurrentStreak(dreamDates);

    return res.status(200).json({ user: foundUser, currentStreak: streak });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, bio } = req.body;

    const updateData = {
      username: username?.trim(),
      bio: bio?.trim(),
      profileImage: req.cloudinaryResult?.secure_url || req.body.profileImage,
    };

    // Handle profile picture deletion
    if (req.body.profileImage === "") {
      updateData.profileImage = "";
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const sendFeedback = async (req, res) => {
  try {
    const { feedbackType, message } = req.body;

    if (!message || !feedbackType) {
      return res
        .status(400)
        .json({ error: "Feedback type and message are required." });
    }

    // Get user info from DB
    const user = await User.findById(req.userId).select("username email");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Emoji and title map
    const emojiMap = {
      bug: "🐞 Bug Report",
      idea: "💡 Idea Suggestion",
      love: "💖 Love Note",
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background-color: #f9f9f9; border-radius: 10px; color: #333;">
        <h2>${emojiMap[feedbackType] || "📝 Feedback"}</h2>
        <p><strong>From:</strong> ${user.username} (${user.email})</p>
        <p><strong>Type:</strong> ${feedbackType.toUpperCase()}</p>
        <hr style="margin: 16px 0;" />
        <p style="white-space: pre-line;">${message}</p>
      </div>
    `;

    const mailOptions = {
      from: `"${user.name}" <${user.email}>`,
      to: process.env.FEEDBACK_RECEIVER,
      subject: `${emojiMap[feedbackType] || "New Feedback"} from ${user.name}`,
      html,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Feedback sent successfully!" });
  } catch (error) {
    console.error("Feedback send error:", error);
    res.status(500).json({ error: "Failed to send feedback." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  fetchAllUsers,
  handleLogout,
  fetchUserData,
  updateUserProfile,
  sendFeedback,
};
