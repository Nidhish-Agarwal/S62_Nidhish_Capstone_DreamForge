const path = require("path");

require("dotenv").config();

const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`Database is Sucessfully connected: ${data.connection.host}`);
    })
    .catch((er) => {
      console.log(`Database connection failed: ${er.message}`);
    });
};

module.exports = connectDatabase;
