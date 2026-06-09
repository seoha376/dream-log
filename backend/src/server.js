require("dotenv").config();

const express = require("express");
const cors = require("cors");      
const db = require("./db/database");
const initDb = require("./db/initDb");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const dreamRoutes = require("./routes/dreamRoutes");  

app.use(cors({ origin: "http://localhost:5173" })); 
app.use(express.json());


app.use("/api/dreams", dreamRoutes); 


app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Dream Log API is running",
  });
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);

app.get("/api/protected-test", authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      message: "Protected route works",
      user: req.user
    }
  });
});

const PORT = process.env.PORT || 5000;

initDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
