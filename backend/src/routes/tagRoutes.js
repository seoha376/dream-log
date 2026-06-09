const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const tagController = require("../controllers/tagController");

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     description: Returns the list of available dream tags.
 *     tags:
 *       - Tags
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tags fetched successfully
 *       401:
 *         description: Authorization token is required
 *       500:
 *         description: Failed to fetch tags
 */

router.get("/", tagController.getTags);

module.exports = router;