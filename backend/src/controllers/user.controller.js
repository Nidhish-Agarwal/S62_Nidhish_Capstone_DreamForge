const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      // maxAge: 40 * 1000,
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
      user: newUser,
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
      // maxAge: 40 * 1000,
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

module.exports = { registerUser, loginUser, fetchAllUsers, handleLogout };
