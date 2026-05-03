// This file handles connection

require("dotenv").config();

const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not set");
}

let cachedConnection = global.mongooseConnection;

if (!cachedConnection) {
  cachedConnection = global.mongooseConnection = { conn: null, promise: null };
}

// server to db connect
async function connectDB() {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose
      .connect(mongoUri)
      .then((client) => client);
  }

  cachedConnection.conn = await cachedConnection.promise;
  console.log("Database connected successfully");

  return cachedConnection.conn;
}

module.exports = connectDB;
