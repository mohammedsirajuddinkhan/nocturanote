// This file handles Server Starting

const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
