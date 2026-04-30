// This file handles Server Starting

const app = require("./src/app");
const connectDB = require("./src/db/db")

connectDB()

app.listen(3000, () => {
  console.log("server listening at http://localhost:3000");
});
