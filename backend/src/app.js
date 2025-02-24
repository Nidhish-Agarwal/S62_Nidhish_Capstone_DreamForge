const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user.route.js");
const tokenRouter = require("./routes/token.route.js");
const corsOptions = require("./config/corsOptions.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors(corsOptions));

app.use("/user", userRouter);
app.use("/refresh", tokenRouter);

module.exports = app;
