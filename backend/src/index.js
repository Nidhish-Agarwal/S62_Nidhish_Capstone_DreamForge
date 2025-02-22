if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config();
}

const connectDatabase = require("./DB/database.js");
const PORT = process.env.PORT;

const app = require("./app.js");

const server = app.listen(PORT, async () => {
  connectDatabase();
  console.log(
    `The server is running on Port:${PORT} URL: http://localhost:${PORT}`
  );
});
