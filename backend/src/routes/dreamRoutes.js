const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getDreams, getDream, createDream,
  updateDream, deleteDream, toggleFavorite, generateSummary
} = require("../controllers/dreamController");

router.get("/", auth, getDreams);
router.post("/", auth, createDream);
router.get("/:id", auth, getDream);
router.patch("/:id", auth, updateDream);
router.delete("/:id", auth, deleteDream);
router.patch("/:id/favorite", auth, toggleFavorite);
router.post("/:id/summary", auth, generateSummary);

module.exports = router;