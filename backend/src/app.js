// Express 앱 정의만 담당

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const dreamRoutes = require("./routes/dreamRoutes");
const tagRoutes = require("./routes/tagRoutes");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Dream Log API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dreams", dreamRoutes);
app.use("/api/tags", tagRoutes);

app.get("/api/protected-test", authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: {
      message: "Protected route works",
      user: req.user,
    },
  });
});

module.exports = app;