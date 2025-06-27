const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user.route.js");
const tokenRouter = require("./routes/token.route.js");
const dreamRouter = require("./routes/dream.route.js");
const communityRouter = require("./routes/post.route.js");
const authRouter = require("./routes/auth.route.js");
const corsOptions = require("./config/corsOptions.js");
const credentials = require("./middlewares/credentials.js");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(credentials);
// app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Welcome to DreamForge API");
});

app.use("/user", userRouter);
app.use("/refresh", tokenRouter);
app.use("/dream", dreamRouter);
app.use("/community", communityRouter);
app.use("/auth", authRouter);

module.exports = app;
