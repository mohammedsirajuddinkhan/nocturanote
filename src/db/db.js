// This file handles connection

const mongoose = require("mongoose");

// server to db connect
async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://notes:FXMO2xI1BxawQUnX@notes-backend.r2kcp9b.mongodb.net/notes",
  );
  console.log("Database connected successfully");
}

module.exports = connectDB;
