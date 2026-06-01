const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const dreamController = require("../controllers/dreamController");

router.use(authMiddleware);

router.get("/", dreamController.getDreams);
router.get("/:id", dreamController.getDream);
router.post("/", dreamController.createDream);
router.patch("/:id", dreamController.updateDream);
router.delete("/:id", dreamController.deleteDream);
router.patch("/:id/favorite", dreamController.toggleFavorite);

module.exports = router;