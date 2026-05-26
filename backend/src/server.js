const express = require("express");
const cors = require("cors");
const db = require("./db/database");
const initDb = require("./db/initDb");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

initDb();

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Dream Log API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});